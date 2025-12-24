package com.onsen.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Enable simple message broker for /topic
        config.enableSimpleBroker("/topic");
        // Prefix for messages from client
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        System.out.println("[WebSocket Config] Registering STOMP endpoints...");
        // WebSocket endpoint for clients to connect
        // Allow all localhost origins for development
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*") // Allow all origins for debugging
                .withSockJS()
                .setInterceptors(new org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor() {
                    @Override
                    public boolean beforeHandshake(
                            org.springframework.http.server.ServerHttpRequest request,
                            org.springframework.http.server.ServerHttpResponse response,
                            org.springframework.web.socket.WebSocketHandler wsHandler,
                            java.util.Map<String, Object> attributes) throws Exception {
                        System.out.println("[WebSocket] Handshake request from: " + request.getRemoteAddress());
                        System.out.println("[WebSocket] Request URI: " + request.getURI());
                        return super.beforeHandshake(request, response, wsHandler, attributes);
                    }
                });
        System.out.println("[WebSocket Config] STOMP endpoints registered successfully");
    }
}
