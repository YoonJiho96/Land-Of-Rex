package com.landofrex.exception;

public class NicknameDuplicateException extends RuntimeException {
    public NicknameDuplicateException(String username) {
        super("Username is already taken: " + username);
    }
}
