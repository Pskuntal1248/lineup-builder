package com.lineupgenerator.model;

import java.util.List;

public record Formation(
    String id,
    String name,
    String displayName,
    List<Position> positions,
    String category
) {
    public Formation flipHorizontal() {
        return new Formation(
            id,
            name,
            displayName,
            positions.stream().map(Position::flippedHorizontal).toList(),
            category
        );
    }
    
    public Formation flipVertical() {
        return new Formation(
            id,
            name,
            displayName,
            positions.stream().map(Position::flippedVertical).toList(),
            category
        );
    }
}
