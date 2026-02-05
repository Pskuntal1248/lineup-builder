package com.lineupgenerator.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lineupgenerator.dto.PlayerDTO;
import com.lineupgenerator.dto.PlayerSearchRequest;
import com.lineupgenerator.dto.SearchResultDTO;
import com.lineupgenerator.service.PlayerService;

@RestController
@RequestMapping("/api/players")
public class PlayerController {
    
    private static final Logger log = LoggerFactory.getLogger(PlayerController.class);
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
        log.info("Player search request - query: {}, club: {}, nationality: {}, league: {}, position: {}, page: {}, size: {}",
                query, club, nationality, league, position, page, size);
        
        PlayerSearchRequest request = new PlayerSearchRequest(
            query, club, nationality, league, position, page, size
        );
        SearchResultDTO<PlayerDTO> result = playerService.searchPlayers(request);
        
        log.info("Player search completed - found {} results out of {} total", 
                result.items().size(), result.total());
        
        return ResponseEntity.ok(result);
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
    
    @GetMapping("/count")
    public ResponseEntity<Integer> getPlayerCount() {
        return ResponseEntity.ok(playerService.getPlayerCount());
    }
    
    @PostMapping("/reload")
    public ResponseEntity<Integer> reloadPlayers() {
        log.info("Player reload requested");
        int count = playerService.reloadPlayers();
        log.info("Player reload completed - loaded {} players", count);
        return ResponseEntity.ok(count);
    }
}
