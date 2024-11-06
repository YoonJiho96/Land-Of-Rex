package com.landofrex.exception;

public class UsernameDuplicateException extends RuntimeException {
    public UsernameDuplicateException(String username) {
        super("Username already exists: " + username);
    }
}