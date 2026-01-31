package com.lineupgenerator.model;

public record LineupSettings(
    String pitchStyle,      // "light", "dark", "grass", "minimal"
    String jerseyColor,     // Hex color
    boolean showPhotos,
    boolean showNames,
    boolean showNumbers,
    boolean showBranding,
    String aspectRatio,     // "square", "portrait", "landscape"
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
