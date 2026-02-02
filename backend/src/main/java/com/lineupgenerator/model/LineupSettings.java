package com.lineupgenerator.model;

public record LineupSettings(
    String pitchStyle,     
    String jerseyColor,    
    boolean showPhotos,
    boolean showNames,
    boolean showNumbers,
    boolean showBranding,
    String aspectRatio,   
    boolean flippedHorizontal,
    boolean flippedVertical
) {
    public static LineupSettings defaults() {
        return new LineupSettings(
            "grass",
            "#FF0000",
            true,
            true,
            true,
            false,
            "portrait",
            false,
            false
        );
    }
}
