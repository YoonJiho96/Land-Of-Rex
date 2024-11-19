package com.landofrex.util;

public class EntityIdUtil {
    public static String encodeId(Long id) {
        return String.valueOf(id);
    }
    public static Long decodeId(String id) {
        return Long.valueOf(id);
    }
}
