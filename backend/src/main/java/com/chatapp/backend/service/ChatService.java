package com.chatapp.backend.service;

import com.chatapp.backend.model.Message;
import com.chatapp.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ChatService {

    @Autowired
    private MessageRepository messageRepository;

    public Message saveMessage(Message message) {
        message.setTimestamp(LocalDateTime.now());
        return messageRepository.save(message);
    }

    public List<Message> getChat(String user1, String user2) {
        return messageRepository
                .findBySenderAndReceiverOrReceiverAndSender(
                        user1, user2,
                        user1, user2
                );
    }
}