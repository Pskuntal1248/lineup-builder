package com.lineupgenerator.model;

public record LineupPlayer(
    String playerId,
    String positionId,
    String name,
    String displayName,
    String photoUrl,
    Integer number,
    Double customX,  // For free-drag mode
    Double customY,  // For free-drag mode
    String jerseyColor
) {}
