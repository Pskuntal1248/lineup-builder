package com.lineupgenerator.model;

public record LineupPlayer(
    String playerId,
    String positionId,
    String name,
    String displayName,
    String photoUrl,
    Integer number,
    Double customX,
    Double customY,
    String jerseyColor
) {}
