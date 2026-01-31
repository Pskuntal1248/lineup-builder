package com.lineupgenerator.dto;

import com.lineupgenerator.model.LineupPlayer;
import com.lineupgenerator.model.LineupSettings;
import java.util.List;

public record ExportRequest(
    String formationId,
    List<LineupPlayer> players,
    LineupSettings settings,
    String format, 
    int width,
    int height
) {
    public ExportRequest {
        if (format == null) format = "png";
        if (width <= 0) width = 1080;
        if (height <= 0) height = 1350; // Default portrait
        if (settings == null) settings = LineupSettings.defaults();
    }
}
