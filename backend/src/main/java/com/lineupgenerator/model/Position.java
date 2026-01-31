package com.lineupgenerator.model;

public record Position(
    String id,
    String label,
    double x,  // 0-100 percentage from left
    double y,  // 0-100 percentage from top (attacking direction)
    String role // Optional role label (e.g., "Inverted Winger", "False 9")
) {
    public Position(String id, String label, double x, double y) {
        this(id, label, x, y, null);
    }
    
    public Position flippedHorizontal() {
        return new Position(id, label, 100 - x, y, role);
    }
    
    public Position flippedVertical() {
        return new Position(id, label, x, 100 - y, role);
    }
    
    public Position flippedBoth() {
        return new Position(id, label, 100 - x, 100 - y, role);
    }
}
