package com.lineupgenerator.controller;

import com.lineupgenerator.dto.FormationDTO;
import com.lineupgenerator.service.FormationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/formations")
public class FormationController {
    
    private final FormationService formationService;
    
    public FormationController(FormationService formationService) {
        this.formationService = formationService;
    }
    
    @GetMapping
    public ResponseEntity<List<FormationDTO>> getAllFormations() {
        List<FormationDTO> formations = formationService.getAllFormations()
            .stream()
            .map(FormationDTO::from)
            .toList();
        return ResponseEntity.ok(formations);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<FormationDTO> getFormation(
            @PathVariable String id,
            @RequestParam(defaultValue = "false") boolean flipH,
            @RequestParam(defaultValue = "false") boolean flipV
    ) {
        return formationService.getFormation(id, flipH, flipV)
            .map(FormationDTO::from)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/category/{category}")
    public ResponseEntity<List<FormationDTO>> getByCategory(@PathVariable String category) {
        List<FormationDTO> formations = formationService.getByCategory(category)
            .stream()
            .map(FormationDTO::from)
            .toList();
        return ResponseEntity.ok(formations);
    }
}
