package com.lineupgenerator.service;

import com.lineupgenerator.dto.PlayerSearchRequest;
import com.lineupgenerator.dto.SearchResultDTO;
import com.lineupgenerator.dto.PlayerDTO;
import com.lineupgenerator.model.Player;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class PlayerService {
    
    private final List<Player> players = new ArrayList<>();
    
    @PostConstruct
    public void initializeSamplePlayers() {
        // Sample players - in production, this would come from a database
        addSamplePlayers();
    }
    
    private void addSamplePlayers() {
        // Goalkeepers
        players.add(new Player(null, "Manuel Neuer", null, List.of("GK"), "Bayern Munich", "Germany", "Bundesliga", null, 1));
        players.add(new Player(null, "Alisson Becker", null, List.of("GK"), "Liverpool", "Brazil", "Premier League", null, 1));
        players.add(new Player(null, "Thibaut Courtois", null, List.of("GK"), "Real Madrid", "Belgium", "La Liga", null, 1));
        players.add(new Player(null, "Ederson Moraes", null, List.of("GK"), "Manchester City", "Brazil", "Premier League", null, 31));
        players.add(new Player(null, "Marc-André ter Stegen", null, List.of("GK"), "Barcelona", "Germany", "La Liga", null, 1));
        
        // Defenders
        players.add(new Player(null, "Virgil van Dijk", null, List.of("CB"), "Liverpool", "Netherlands", "Premier League", null, 4));
        players.add(new Player(null, "Rúben Dias", null, List.of("CB"), "Manchester City", "Portugal", "Premier League", null, 3));
        players.add(new Player(null, "Antonio Rüdiger", null, List.of("CB"), "Real Madrid", "Germany", "La Liga", null, 22));
        players.add(new Player(null, "Marquinhos", null, List.of("CB", "CDM"), "Paris Saint-Germain", "Brazil", "Ligue 1", null, 5));
        players.add(new Player(null, "William Saliba", null, List.of("CB"), "Arsenal", "France", "Premier League", null, 2));
        
        players.add(new Player(null, "Trent Alexander-Arnold", null, List.of("RB", "CM"), "Liverpool", "England", "Premier League", null, 66));
        players.add(new Player(null, "Kyle Walker", null, List.of("RB"), "Manchester City", "England", "Premier League", null, 2));
        players.add(new Player(null, "João Cancelo", null, List.of("RB", "LB"), "Barcelona", "Portugal", "La Liga", null, 2));
        players.add(new Player(null, "Achraf Hakimi", null, List.of("RB", "RWB"), "Paris Saint-Germain", "Morocco", "Ligue 1", null, 2));
        
        players.add(new Player(null, "Andrew Robertson", null, List.of("LB"), "Liverpool", "Scotland", "Premier League", null, 26));
        players.add(new Player(null, "Alphonso Davies", null, List.of("LB", "LW"), "Bayern Munich", "Canada", "Bundesliga", null, 19));
        players.add(new Player(null, "Theo Hernández", null, List.of("LB"), "AC Milan", "France", "Serie A", null, 19));
        
        // Midfielders
        players.add(new Player(null, "Kevin De Bruyne", null, List.of("CM", "CAM"), "Manchester City", "Belgium", "Premier League", null, 17));
        players.add(new Player(null, "Luka Modrić", null, List.of("CM"), "Real Madrid", "Croatia", "La Liga", null, 10));
        players.add(new Player(null, "Jude Bellingham", null, List.of("CM", "CAM"), "Real Madrid", "England", "La Liga", null, 5));
        players.add(new Player(null, "Pedri", null, List.of("CM", "CAM"), "Barcelona", "Spain", "La Liga", null, 8));
        players.add(new Player(null, "Rodri", null, List.of("CDM", "CM"), "Manchester City", "Spain", "Premier League", null, 16));
        players.add(new Player(null, "Declan Rice", null, List.of("CDM", "CM"), "Arsenal", "England", "Premier League", null, 41));
        players.add(new Player(null, "Federico Valverde", null, List.of("CM", "RW"), "Real Madrid", "Uruguay", "La Liga", null, 15));
        players.add(new Player(null, "Bruno Fernandes", null, List.of("CAM", "CM"), "Manchester United", "Portugal", "Premier League", null, 8));
        players.add(new Player(null, "Martin Ødegaard", null, List.of("CAM", "CM"), "Arsenal", "Norway", "Premier League", null, 8));
        players.add(new Player(null, "Frenkie de Jong", null, List.of("CM", "CDM"), "Barcelona", "Netherlands", "La Liga", null, 21));
        players.add(new Player(null, "Joshua Kimmich", null, List.of("CDM", "RB"), "Bayern Munich", "Germany", "Bundesliga", null, 6));
        players.add(new Player(null, "Aurélien Tchouaméni", null, List.of("CDM", "CM"), "Real Madrid", "France", "La Liga", null, 18));
        
        // Wingers
        players.add(new Player(null, "Vinícius Júnior", null, List.of("LW", "RW"), "Real Madrid", "Brazil", "La Liga", null, 7));
        players.add(new Player(null, "Kylian Mbappé", null, List.of("LW", "ST", "RW"), "Real Madrid", "France", "La Liga", null, 9));
        players.add(new Player(null, "Bukayo Saka", null, List.of("RW", "LW"), "Arsenal", "England", "Premier League", null, 7));
        players.add(new Player(null, "Mohamed Salah", null, List.of("RW"), "Liverpool", "Egypt", "Premier League", null, 11));
        players.add(new Player(null, "Phil Foden", null, List.of("LW", "RW", "CAM"), "Manchester City", "England", "Premier League", null, 47));
        players.add(new Player(null, "Jamal Musiala", null, List.of("CAM", "LW", "RW"), "Bayern Munich", "Germany", "Bundesliga", null, 42));
        players.add(new Player(null, "Ousmane Dembélé", null, List.of("RW", "LW"), "Paris Saint-Germain", "France", "Ligue 1", null, 10));
        players.add(new Player(null, "Rafael Leão", null, List.of("LW"), "AC Milan", "Portugal", "Serie A", null, 10));
        players.add(new Player(null, "Marcus Rashford", null, List.of("LW", "ST"), "Manchester United", "England", "Premier League", null, 10));
        
        // Forwards
        players.add(new Player(null, "Erling Haaland", null, List.of("ST"), "Manchester City", "Norway", "Premier League", null, 9));
        players.add(new Player(null, "Harry Kane", null, List.of("ST"), "Bayern Munich", "England", "Bundesliga", null, 9));
        players.add(new Player(null, "Lautaro Martínez", null, List.of("ST"), "Inter Milan", "Argentina", "Serie A", null, 10));
        players.add(new Player(null, "Victor Osimhen", null, List.of("ST"), "Napoli", "Nigeria", "Serie A", null, 9));
        players.add(new Player(null, "Robert Lewandowski", null, List.of("ST"), "Barcelona", "Poland", "La Liga", null, 9));
        players.add(new Player(null, "Darwin Núñez", null, List.of("ST", "LW"), "Liverpool", "Uruguay", "Premier League", null, 9));
        players.add(new Player(null, "Julián Álvarez", null, List.of("ST", "CAM"), "Atlético Madrid", "Argentina", "La Liga", null, 19));
        
        // Extra players for variety
        players.add(new Player(null, "Florian Wirtz", null, List.of("CAM", "LW"), "Bayer Leverkusen", "Germany", "Bundesliga", null, 10));
        players.add(new Player(null, "Xavi Simons", null, List.of("CAM", "RW"), "RB Leipzig", "Netherlands", "Bundesliga", null, 10));
        players.add(new Player(null, "Lamine Yamal", null, List.of("RW"), "Barcelona", "Spain", "La Liga", null, 19));
        players.add(new Player(null, "Alejandro Garnacho", null, List.of("LW", "RW"), "Manchester United", "Argentina", "Premier League", null, 17));
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
