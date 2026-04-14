package com.chatapp.backend.repository;

import com.chatapp.backend.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface MessageRepository extends MongoRepository<Message, String> {

    List<Message> findBySenderAndReceiver(String sender, String receiver);
    List<Message> findBySenderAndReceiverOrReceiverAndSender(
            String sender1, String receiver1,
            String sender2, String receiver2
    );
}