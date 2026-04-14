package com.chatapp.backend.controller;

import com.chatapp.backend.model.User;
import com.chatapp.backend.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return authService.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {
        User u = authService.login(user.getUsername(), user.getPassword());

        if (u != null) {
            return "Login Success";
        }

        return "Invalid Credentials";
    }
}