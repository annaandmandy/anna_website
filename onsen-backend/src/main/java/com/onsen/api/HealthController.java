package com.onsen.api;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.concurrent.TimeUnit;

@RestController
public class HealthController {
    
    private final RedisTemplate<String, Object> redisTemplate;
    
    public HealthController(RedisTemplate<String, Object> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }
    
    @GetMapping("/health")
    public String health() {
        return "ONSEN_BACKEND_OK";
    }
    
    @GetMapping("/health/redis")
    public String redisHealth() {
        try {
            // Test Redis connection
            String testKey = "health:check";
            String testValue = "OK";
            
            redisTemplate.opsForValue().set(testKey, testValue, 10, TimeUnit.SECONDS);
            String result = (String) redisTemplate.opsForValue().get(testKey);
            
            if (testValue.equals(result)) {
                return "REDIS_OK";
            } else {
                return "REDIS_ERROR: Value mismatch";
            }
        } catch (Exception e) {
            return "REDIS_ERROR: " + e.getMessage();
        }
    }
}
