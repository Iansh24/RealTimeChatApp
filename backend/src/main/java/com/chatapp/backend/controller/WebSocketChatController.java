package com.chatapp.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.chatapp.backend.model.Message;
import com.chatapp.backend.repository.MessageRepository;

import java.time.LocalDateTime;

@Controller
public class WebSocketChatController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/private-message")
    public void sendPrivateMessage(Message message) {

        message.setTimestamp(LocalDateTime.now());

        Message savedMessage = messageRepository.save(message);

        // send to receiver
        messagingTemplate.convertAndSendToUser(
                message.getReceiver(),
                "/queue/messages",
                savedMessage
        );

        // send back to sender
        messagingTemplate.convertAndSendToUser(
                message.getSender(),
                "/queue/messages",
                savedMessage
        );

        System.out.println("MESSAGE SENT FROM: " +
                message.getSender() + " TO: " + message.getReceiver());
    }
}