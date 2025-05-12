package com.example.aidsspring.service;

import com.alibaba.dashscope.app.Application;
import com.alibaba.dashscope.app.ApplicationParam;
import com.alibaba.dashscope.app.ApplicationResult;
import com.alibaba.dashscope.exception.ApiException;
import com.alibaba.dashscope.exception.InputRequiredException;
import com.alibaba.dashscope.exception.NoApiKeyException;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class NbAPIService {

//    private static final Logger logger = LoggerFactory.getLogger(NbAPIService.class);

    // 你的阿里百炼应用ID
    private static final String APP_ID = "a3617ab00d80454bada45a88ccf13a35";

    // 你的API Key，建议从环境变量读取
    private static final String API_KEY = "sk-8f645201fae149e088c76b28e46008cb";

    private final Application application = new Application();

    // 使用线程安全的ConcurrentHashMap存储每个用户的sessionId
    private final ConcurrentMap<String, String> sessionMap = new ConcurrentHashMap<>();

    /**
     * 处理用户请求，实现多用户多轮对话
     * @param userId 用户唯一标识，比如用户ID或token
     * @param prompt 用户输入文本
     * @return 智能体回复文本
     */
    public String processRequest(String userId, String prompt) {
        try {
            // 获取该用户当前的sessionId，首次调用时为null
            String sessionId = sessionMap.get(userId);

            ApplicationParam param = ApplicationParam.builder()
                    .apiKey(API_KEY)
                    .appId(APP_ID)
                    .prompt(prompt)
                    .sessionId(sessionId)
                    .build();

            ApplicationResult result = application.call(param);

            // 更新该用户的sessionId，保证多轮对话
            sessionMap.put(userId, result.getOutput().getSessionId());

            return result.getOutput().getText();

        } catch (ApiException | NoApiKeyException | InputRequiredException e) {

            throw new RuntimeException("调用阿里百炼API异常", e);
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
