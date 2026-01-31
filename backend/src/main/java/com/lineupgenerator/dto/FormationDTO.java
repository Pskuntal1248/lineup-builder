package com.lineupgenerator.dto;

import com.lineupgenerator.model.Formation;
import com.lineupgenerator.model.Position;
import java.util.List;

public record FormationDTO(
    String id,
    String name,
    String displayName,
    List<PositionDTO> positions,
    String category
) {
    public static FormationDTO from(Formation formation) {
        return new FormationDTO(
            formation.id(),
            formation.name(),
            formation.displayName(),
            formation.positions().stream().map(PositionDTO::from).toList(),
            formation.category()
        );
    }
    
    public record PositionDTO(
        String id,
        String label,
        double x,
        double y,
        String role
    ) {
        public static PositionDTO from(Position position) {
            return new PositionDTO(
                position.id(),
                position.label(),
                position.x(),
                position.y(),
                position.role()
            );
        }
    }
}
