package com.example.aidsspring.controller;

import com.example.aidsspring.entity.ApiResponse;
import com.example.aidsspring.entity.ChatData;
import com.example.aidsspring.service.NbAPIService;
import com.example.aidsspring.service.NbAPIService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ChatController {

    private final NbAPIService apiService;
    @Autowired
    private NbAPIService nbAPIService;

    public ChatController(NbAPIService apiService) {
        this.apiService = apiService;
    }
    @PostMapping("/data")
    public ApiResponse chat(@RequestBody Map<String, String> payload) {
        String userId = payload.get("id");
        String msg = payload.get("msgFree");
        return nbAPIService.processRequest(userId, msg);
    }
}
