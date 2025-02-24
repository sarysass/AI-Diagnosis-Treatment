package com.example.aidsspring.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;

@Service
public class NbAPIService {

    private static final Logger logger = LoggerFactory.getLogger(NbAPIService.class);
    private final RestTemplate restTemplate;

    public NbAPIService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public String processRequest(String id, String msgFree) {
        String url = "https://www.windyword.com/J9T4pR8KzAwQ/apimedical";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String requestBody = String.format("{\"id\":\"%s\", \"msg_free\":\"%s\"}", id, msgFree);

        try {
            String response = restTemplate.postForObject(url, new HttpEntity<>(requestBody, headers), String.class);
//            logger.info("API 返回的数据: {}", response);

            // 提取以 "data: " 开头的 JSON 数据
            List<String> dataLines = new ArrayList<>();
            for (String line : response.split("\n")) {
                if (line.startsWith("data: ")) {
                    dataLines.add(line.substring("data: ".length()));
                }
            }

            // 处理提取的数据
            if (!dataLines.isEmpty()) {
                // 只处理第一个数据行
                return dataLines.get(0); // 返回有效的 JSON 数据
            }
        } catch (HttpServerErrorException e) {
            logger.error("服务器错误: {}", e.getResponseBodyAsString());
            throw e;
        } catch (Exception e) {
            logger.error("处理响应时出错: {}", e.getMessage());
            throw e;
        }
        return null; // 如果没有有效数据，返回 null
    }
}