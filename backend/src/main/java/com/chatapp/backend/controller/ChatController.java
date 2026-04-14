package com.chatapp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.chatapp.backend.model.Message;
import com.chatapp.backend.service.ChatService;

import java.util.List;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin("*") // IMPORTANT for frontend
public class ChatController {

    @Autowired
    private ChatService chatService;

    @GetMapping("/{user1}/{user2}")
    public List<Message> getChat(
            @PathVariable String user1,
            @PathVariable String user2) {

        return chatService.getChat(user1, user2);
    }
}