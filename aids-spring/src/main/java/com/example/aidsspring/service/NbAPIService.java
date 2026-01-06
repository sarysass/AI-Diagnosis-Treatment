package com.example.aidsspring.service;

import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;

import com.example.aidsspring.entity.ApiResponse;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class NbAPIService {

//    private static final Logger logger = LoggerFactory.getLogger(NbAPIService.class);

    // 你的阿里百炼应用ID
    private static final String APP_ID = "0be01e06487d4071b9312dff372cfe83";

    // 从环境变量读取API Key，如果没有则使用默认值（仅用于本地开发）
    private static final String API_KEY = System.getenv("DASHSCOPE_API_KEY") != null 
        ? System.getenv("DASHSCOPE_API_KEY") 
        : "sk-8f645201fae149e088c76b28e46008cb";

    private final Application application = new Application();

    // 使用线程安全的ConcurrentHashMap存储每个用户的sessionId
    private final ConcurrentMap<String, String> sessionMap = new ConcurrentHashMap<>();

    /**
     * 解析形如 "(1) 你好，有什么可以帮你的。" 格式的文本，提取状态码和文本
     */
    public static class ParsedResponse {
        private final int status;
        private final String text;

        public ParsedResponse(int status, String text) {
            this.status = status;
            this.text = text;
        }

        public int getStatus() {
            return status;
        }

        public String getText() {
            return text;
        }
    }

    /**
     * 处理用户请求，实现多用户多轮对话
     * @param userId 用户唯一标识，比如用户ID或token
     * @param prompt 用户输入文本
     * @return 只返回解析后的纯文本回复（不带状态码）
     */
    public ApiResponse processRequest(String userId, String prompt) {
        try {
            String sessionId = sessionMap.get(userId);

            ApplicationParam param = ApplicationParam.builder()
                    .apiKey(API_KEY)
                    .appId(APP_ID)
                    .prompt(prompt)
                    .sessionId(sessionId)
                    .build();

            ApplicationResult result = application.call(param);
            sessionMap.put(userId, result.getOutput().getSessionId());

            String rawText = result.getOutput().getText();
            ParsedResponse parsed = parseResponse(rawText);
            return new ApiResponse(parsed.getStatus(), parsed.getText());

        } catch (ApiException | NoApiKeyException | InputRequiredException e) {
            throw new RuntimeException("调用阿里百炼API异常", e);
        }
    }

    /**
     * 解析形如 "(1) 你好，有什么可以帮你的。" 格式的文本，提取状态码和文本
     * @param rawText 原始返回文本
     * @return 包含状态码和纯文本的ParsedResponse对象
     */
    private ParsedResponse parseResponse(String rawText) {
        if (rawText == null || rawText.trim().isEmpty()) {
            return new ParsedResponse(1, "");
        }

        // 使用更灵活的正则：
        // 1. 允许开头有任意非数字字符（如星号、空格等）
        // 2. 匹配括在括号中的数字 (1) 或 (2)
        // 3. 捕获之后的所有内容
        java.util.regex.Pattern pattern = java.util.regex.Pattern.compile(".*?\\((\\d+)\\)\\s*(.*)", java.util.regex.Pattern.DOTALL);
        java.util.regex.Matcher matcher = pattern.matcher(rawText);

        if (matcher.find()) {
            int status = Integer.parseInt(matcher.group(1));
            String text = matcher.group(2).trim();
            
            // 进一步清理：如果文本末尾有 Markdown 的闭合符号（如单个星号），尝试清理
            if (rawText.contains("*") && text.endsWith("*")) {
                text = text.replaceAll("\\*+$", "").trim();
            }
            
            return new ParsedResponse(status, text);
        } else {
            // 如果完全没匹配到 (数字)，默认作为普通问询(1)解析，保证用户体验
            return new ParsedResponse(1, rawText.trim());
        }
    }

    /**
     * 重置某个用户的会话状态
     * @param userId 用户唯一标识
     */
    public void resetSession(String userId) {
        sessionMap.remove(userId);
        System.out.println("清除会话");
    }
}
