package com.example.aidsspring.entity;

public class ApiResponse {
    private int status;
    private String text;

    public ApiResponse(int status, String text) {
        this.status = status;
        this.text = text;
    }

    public int getStatus() {
        return status;
    }

    public String getText() {
        return text;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public void setText(String text) {
        this.text = text;
    }
}

