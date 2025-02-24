package com.example.aidsspring.controller;

import com.example.aidsspring.entity.ChatData;
import com.example.aidsspring.service.NbAPIService;
import com.example.aidsspring.service.NbAPIService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final NbAPIService apiService;

    public ChatController(NbAPIService apiService) {
        this.apiService = apiService;
    }
    @PostMapping("/data")
    public ResponseEntity<String> handleRequest(@RequestBody Map<String, String> requestBody) {
        String id = requestBody.get("id");
        String msgFree = requestBody.get("msgFree");
        String response = apiService.processRequest(id, msgFree);
        return ResponseEntity.ok(response);
    }
}
