package com.lineupgenerator.model;

public record Position(
    String id,
    String label,
    double x,
    double y,
    String role
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
