package com.lineupgenerator.model;

import java.util.List;

public record Lineup(
    String formationId,
    List<LineupPlayer> players,
    LineupSettings settings
) {}
