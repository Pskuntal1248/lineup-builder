package com.lineupgenerator.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.lineupgenerator.dto.PlayerSearchRequest;
import com.lineupgenerator.dto.SearchResultDTO;
import com.lineupgenerator.dto.PlayerDTO;
import com.lineupgenerator.model.Player;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import jakarta.annotation.PostConstruct;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class PlayerService {
    
    private static final Logger logger = LoggerFactory.getLogger(PlayerService.class);
    
    private final List<Player> players = new ArrayList<>();
    private final ObjectMapper objectMapper = new ObjectMapper();
    
    @Value("${scraper.output.dir:../scraper/output}")
    private String scraperOutputDir;
    
    @PostConstruct
    public void initializePlayers() {
        loadPlayersFromScraperOutput();
    }
    
    private void loadPlayersFromScraperOutput() {
        try {
            Path outputPath = Paths.get(scraperOutputDir).toAbsolutePath();
            logger.info("Looking for scraped data in: {}", outputPath);
            
            if (!Files.exists(outputPath)) {
                logger.warn("Scraper output directory not found: {}", outputPath);
                logger.info("No scraped data available. Run the scraper first: cd ../scraper && python3 main.py");
                return;
            }
            
            // First try to load all-players.json (combined file)
            Path combinedFile = outputPath.resolve("all-players.json");
            if (Files.exists(combinedFile)) {
                loadFromJsonFile(combinedFile.toFile());
                return;
            }
            
            // Otherwise load individual league files
            try (Stream<Path> files = Files.list(outputPath)) {
                files.filter(p -> p.toString().endsWith(".json"))
                     .forEach(p -> {
                         try {
                             loadFromJsonFile(p.toFile());
                         } catch (Exception e) {
                             logger.warn("Failed to load {}: {}", p.getFileName(), e.getMessage());
                         }
                     });
            }
            
            logger.info("Loaded {} players from scraped data", players.size());
            
        } catch (Exception e) {
            logger.error("Failed to load players from scraper output: {}", e.getMessage());
            logger.info("No player data available. Run the scraper: cd ../scraper && python3 main.py");
        }
    }
    
    private void loadFromJsonFile(File file) throws IOException {
        JsonNode root = objectMapper.readTree(file);
        JsonNode playersNode = root.get("players");
        
        if (playersNode != null && playersNode.isArray()) {
            int count = 0;
            for (JsonNode playerNode : playersNode) {
                Player player = parsePlayer(playerNode);
                if (player != null) {
                    players.add(player);
                    count++;
                }
            }
            logger.info("Loaded {} players from {}", count, file.getName());
        }
    }
    
    private Player parsePlayer(JsonNode node) {
        try {
            String id = node.has("id") ? node.get("id").asText() : null;
            String name = node.get("name").asText();
            String shortName = node.has("shortName") ? node.get("shortName").asText() : null;
            
            List<String> positions = new ArrayList<>();
            if (node.has("primaryPosition")) {
                positions.add(node.get("primaryPosition").asText());
            }
            if (node.has("secondaryPositions") && node.get("secondaryPositions").isArray()) {
                for (JsonNode pos : node.get("secondaryPositions")) {
                    positions.add(pos.asText());
                }
            }
            
            String club = node.has("club") ? node.get("club").asText() : null;
            String nationality = node.has("nationality") ? node.get("nationality").asText() : null;
            String league = node.has("league") ? node.get("league").asText() : null;
            String photoUrl = node.has("photoUrl") && !node.get("photoUrl").isNull() 
                ? node.get("photoUrl").asText() : null;
            Integer number = node.has("number") && !node.get("number").isNull() 
                ? node.get("number").asInt() : null;
            
            return new Player(id, name, shortName, positions, club, nationality, league, photoUrl, number);
            
        } catch (Exception e) {
            logger.warn("Failed to parse player: {}", e.getMessage());
            return null;
        }
    }
    
    @Cacheable(value = "players", key = "#request.hashCode()")
    public SearchResultDTO<PlayerDTO> searchPlayers(PlayerSearchRequest request) {
        List<Player> filtered = players.stream()
            .filter(p -> matchesQuery(p, request.query()))
            .filter(p -> matchesClub(p, request.club()))
            .filter(p -> matchesNationality(p, request.nationality()))
            .filter(p -> matchesLeague(p, request.league()))
            .filter(p -> matchesPosition(p, request.position()))
            .collect(Collectors.toList());
        
        long total = filtered.size();
        int start = request.page() * request.size();
        int end = Math.min(start + request.size(), filtered.size());
        
        List<PlayerDTO> pageItems = start < filtered.size() 
            ? filtered.subList(start, end).stream().map(PlayerDTO::from).toList()
            : List.of();
        
        return SearchResultDTO.of(pageItems, request.page(), request.size(), total);
    }
    
    private boolean matchesQuery(Player player, String query) {
        if (query == null || query.isBlank()) return true;
        String q = query.toLowerCase();
        return player.name().toLowerCase().contains(q) ||
               (player.displayName() != null && player.displayName().toLowerCase().contains(q)) ||
               (player.club() != null && player.club().toLowerCase().contains(q)) ||
               (player.nationality() != null && player.nationality().toLowerCase().contains(q));
    }
    
    private boolean matchesClub(Player player, String club) {
        if (club == null || club.isBlank()) return true;
        return player.club() != null && player.club().toLowerCase().contains(club.toLowerCase());
    }
    
    private boolean matchesNationality(Player player, String nationality) {
        if (nationality == null || nationality.isBlank()) return true;
        return player.nationality() != null && 
               player.nationality().toLowerCase().contains(nationality.toLowerCase());
    }
    
    private boolean matchesLeague(Player player, String league) {
        if (league == null || league.isBlank()) return true;
        return player.league() != null && 
               player.league().toLowerCase().contains(league.toLowerCase());
    }
    
    private boolean matchesPosition(Player player, String position) {
        if (position == null || position.isBlank()) return true;
        return player.positions().stream()
            .anyMatch(p -> p.toLowerCase().contains(position.toLowerCase()));
    }
    
    public Optional<Player> getPlayer(String id) {
        return players.stream().filter(p -> p.id().equals(id)).findFirst();
    }
    
    public List<String> getClubs() {
        return players.stream()
            .map(Player::club)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .toList();
    }
    
    public List<String> getNationalities() {
        return players.stream()
            .map(Player::nationality)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .toList();
    }
    
    public List<String> getLeagues() {
        return players.stream()
            .map(Player::league)
            .filter(Objects::nonNull)
            .distinct()
            .sorted()
            .toList();
    }
}
