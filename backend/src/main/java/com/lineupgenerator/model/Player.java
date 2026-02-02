package com.lineupgenerator.model;

import java.util.List;
import java.util.UUID;

public class Player {
    private final String id;
    private final String name;
    private final String displayName;
    private final List<String> positions;
    private final String club;
    private final String nationality;
    private final String league;
    private final String photoUrl;
    private final Integer number;

    public Player(String id, String name, String displayName, List<String> positions, String club, String nationality, String league, String photoUrl, Integer number) {
        this.id = id == null ? UUID.randomUUID().toString() : id;
        this.name = name;
        this.displayName = displayName == null && name != null ? formatDisplayName(name) : displayName;
        this.positions = positions;
        this.club = club;
        this.nationality = nationality;
        this.league = league;
        this.photoUrl = photoUrl;
        this.number = number;
    }

    public String id() {
        return id;
    }

    public String name() {
        return name;
    }

    public String displayName() {
        return displayName;
    }

    public List<String> positions() {
        return positions;
    }

    public String club() {
        return club;
    }

    public String nationality() {
        return nationality;
    }

    public String league() {
        return league;
    }

    public String photoUrl() {
        return photoUrl;
    }

    public Integer number() {
        return number;
    }
    
    private static String formatDisplayName(String fullName) {
        if (fullName == null || fullName.isBlank()) return "";
        String[] parts = fullName.trim().split("\\s+");
        if (parts.length == 1) return parts[0];
        String lastName = parts[parts.length - 1];
        return lastName.length() > 12 ? lastName.substring(0, 11) + "." : lastName;
    }
}
