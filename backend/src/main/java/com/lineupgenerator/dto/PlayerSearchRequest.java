package com.lineupgenerator.dto;

public record PlayerSearchRequest(
    String query,
    String club,
    String nationality,
    String league,
    String position,
    int page,
    int size
) {
    public PlayerSearchRequest {
        if (page < 0) page = 0;
        if (size <= 0 || size > 50) size = 20;
    }
}
