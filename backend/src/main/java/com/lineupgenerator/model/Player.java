package com.lineupgenerator.model;

import java.util.List;
import java.util.UUID;

public record Player(
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
    public Player {
        if (id == null) {
            id = UUID.randomUUID().toString();
        }
        if (displayName == null && name != null) {
            displayName = formatDisplayName(name);
        }
    }
    
    private static String formatDisplayName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        // Return last name for display, truncate if too long
        String lastName = parts[parts.length - 1];
        return lastName.length() > 12 ? lastName.substring(0, 11) + "." : lastName;
    }
}
