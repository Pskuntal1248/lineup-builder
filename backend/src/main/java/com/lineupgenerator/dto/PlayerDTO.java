package com.lineupgenerator.dto;

import com.lineupgenerator.model.Player;
import java.util.List;

public record PlayerDTO(
    String id,
    String name,
    String displayName,
    List<String> positions,
    String club,
    String nationality,
    String league,
    String photoUrl,
    Integer number
) {
    public static PlayerDTO from(Player player) {
        return new PlayerDTO(
            player.id(),
            player.name(),
            player.displayName(),
            player.positions(),
            player.club(),
            player.nationality(),
            player.league(),
            player.photoUrl(),
            player.number()
        );
    }
}
