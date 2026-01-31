package com.lineupgenerator.controller;

import com.lineupgenerator.dto.PlayerDTO;
import com.lineupgenerator.dto.PlayerSearchRequest;
import com.lineupgenerator.dto.SearchResultDTO;
import com.lineupgenerator.service.PlayerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/players")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class PlayerController {
    
    private final PlayerService playerService;
    
    public PlayerController(PlayerService playerService) {
        this.playerService = playerService;
    }
    
    @GetMapping("/search")
    public ResponseEntity<SearchResultDTO<PlayerDTO>> searchPlayers(
            @RequestParam(required = false) String query,
            @RequestParam(required = false) String club,
            @RequestParam(required = false) String nationality,
            @RequestParam(required = false) String league,
            @RequestParam(required = false) String position,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        PlayerSearchRequest request = new PlayerSearchRequest(
            query, club, nationality, league, position, page, size
        );
        return ResponseEntity.ok(playerService.searchPlayers(request));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<PlayerDTO> getPlayer(@PathVariable String id) {
        return playerService.getPlayer(id)
            .map(PlayerDTO::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/clubs")
    public ResponseEntity<List<String>> getClubs() {
        return ResponseEntity.ok(playerService.getClubs());
    }
    
    @GetMapping("/nationalities")
    public ResponseEntity<List<String>> getNationalities() {
        return ResponseEntity.ok(playerService.getNationalities());
    }
    
    @GetMapping("/leagues")
    public ResponseEntity<List<String>> getLeagues() {
        return ResponseEntity.ok(playerService.getLeagues());
    }
}
