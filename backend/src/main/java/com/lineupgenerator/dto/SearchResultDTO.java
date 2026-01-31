package com.lineupgenerator.dto;

import java.util.List;

public record SearchResultDTO<T>(
    List<T> items,
    int page,
    int size,
    long total,
    int totalPages
) {
    public static <T> SearchResultDTO<T> of(List<T> items, int page, int size, long total) {
        int totalPages = (int) Math.ceil((double) total / size);
        return new SearchResultDTO<>(items, page, size, total, totalPages);
    }
}
