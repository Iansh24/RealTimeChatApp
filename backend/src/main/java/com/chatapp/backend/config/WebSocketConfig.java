package com.chatapp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple broker (queue for private messages)
        config.enableSimpleBroker("/queue");

        // Prefix for sending messages from client
        config.setApplicationDestinationPrefixes("/app");

        // For user-specific messages
        config.setUserDestinationPrefix("/user");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {

        registry.addEndpoint("/chat")   // MUST MATCH frontend
                .setAllowedOriginPatterns("*")
                .withSockJS();         // REQUIRED for SockJS
    }
}