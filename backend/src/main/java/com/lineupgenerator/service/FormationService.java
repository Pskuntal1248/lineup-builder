package com.lineupgenerator.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.lineupgenerator.model.Formation;
import com.lineupgenerator.model.Position;

@Service
public class FormationService{
    
    private final Map<String, Formation> formations = new LinkedHashMap<>();
    
    public FormationService() {
        initializeFormations();
    }
    
    private void initializeFormations() {
       
        formations.put("4-3-3", new Formation(
            "4-3-3", "4-3-3", "4-3-3",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lb", "LB", 15, 75),
                new Position("lcb", "CB", 35, 78),
                new Position("rcb", "CB", 65, 78),
                new Position("rb", "RB", 85, 75),
                new Position("lcm", "CM", 30, 55),
                new Position("cm", "CM", 50, 50),
                new Position("rcm", "CM", 70, 55),
                new Position("lw", "LW", 15, 25),
                new Position("st", "ST", 50, 18),
                new Position("rw", "RW", 85, 25)
            ),
            "attacking"
        ));
        
        // 4-2-3-1
        formations.put("4-2-3-1", new Formation(
            "4-2-3-1", "4-2-3-1", "4-2-3-1",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lb", "LB", 15, 75),
                new Position("lcb", "CB", 35, 78),
                new Position("rcb", "CB", 65, 78),
                new Position("rb", "RB", 85, 75),
                new Position("ldm", "CDM", 35, 58),
                new Position("rdm", "CDM", 65, 58),
                new Position("lam", "LAM", 20, 38),
                new Position("cam", "CAM", 50, 35),
                new Position("ram", "RAM", 80, 38),
                new Position("st", "ST", 50, 18)
            ),
            "balanced"
        ));
        
        // 4-4-2
        formations.put("4-4-2", new Formation(
            "4-4-2", "4-4-2", "4-4-2",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lb", "LB", 15, 75),
                new Position("lcb", "CB", 35, 78),
                new Position("rcb", "CB", 65, 78),
                new Position("rb", "RB", 85, 75),
                new Position("lm", "LM", 15, 50),
                new Position("lcm", "CM", 35, 52),
                new Position("rcm", "CM", 65, 52),
                new Position("rm", "RM", 85, 50),
                new Position("lst", "ST", 35, 20),
                new Position("rst", "ST", 65, 20)
            ),
            "balanced"
        ));
        formations.put("3-5-2", new Formation(
            "3-5-2", "3-5-2", "3-5-2",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lcb", "CB", 25, 78),
                new Position("cb", "CB", 50, 80),
                new Position("rcb", "CB", 75, 78),
                new Position("lwb", "LWB", 10, 55),
                new Position("lcm", "CM", 30, 52),
                new Position("cdm", "CDM", 50, 58),
                new Position("rcm", "CM", 70, 52),
                new Position("rwb", "RWB", 90, 55),
                new Position("lst", "ST", 35, 20),
                new Position("rst", "ST", 65, 20)
            ),
            "balanced"
        ));
        formations.put("4-1-4-1", new Formation(
            "4-1-4-1", "4-1-4-1", "4-1-4-1",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lb", "LB", 15, 75),
                new Position("lcb", "CB", 35, 78),
                new Position("rcb", "CB", 65, 78),
                new Position("rb", "RB", 85, 75),
                new Position("cdm", "CDM", 50, 60),
                new Position("lm", "LM", 15, 42),
                new Position("lcm", "CM", 35, 45),
                new Position("rcm", "CM", 65, 45),
                new Position("rm", "RM", 85, 42),
                new Position("st", "ST", 50, 18)
            ),
            "defensive"
        ));
        formations.put("5-3-2", new Formation(
            "5-3-2", "5-3-2", "5-3-2",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lwb", "LWB", 10, 68),
                new Position("lcb", "CB", 28, 78),
                new Position("cb", "CB", 50, 80),
                new Position("rcb", "CB", 72, 78),
                new Position("rwb", "RWB", 90, 68),
                new Position("lcm", "CM", 30, 50),
                new Position("cm", "CM", 50, 48),
                new Position("rcm", "CM", 70, 50),
                new Position("lst", "ST", 35, 20),
                new Position("rst", "ST", 65, 20)
            ),
            "defensive"
        ));
        formations.put("4-3-1-2", new Formation(
            "4-3-1-2", "4-3-1-2", "4-3-1-2",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lb", "LB", 15, 75),
                new Position("lcb", "CB", 35, 78),
                new Position("rcb", "CB", 65, 78),
                new Position("rb", "RB", 85, 75),
                new Position("lcm", "CM", 30, 55),
                new Position("cdm", "CDM", 50, 60),
                new Position("rcm", "CM", 70, 55),
                new Position("cam", "CAM", 50, 38),
                new Position("lst", "ST", 35, 20),
                new Position("rst", "ST", 65, 20)
            ),
            "attacking"
        ));
        formations.put("3-4-3", new Formation(
            "3-4-3", "3-4-3", "3-4-3",
            List.of(
                new Position("gk", "GK", 50, 92),
                new Position("lcb", "CB", 25, 78),
                new Position("cb", "CB", 50, 80),
                new Position("rcb", "CB", 75, 78),
                new Position("lm", "LM", 15, 50),
                new Position("lcm", "CM", 38, 52),
                new Position("rcm", "CM", 62, 52),
                new Position("rm", "RM", 85, 50),
                new Position("lw", "LW", 20, 25),
                new Position("st", "ST", 50, 18),
                new Position("rw", "RW", 80, 25)
            ),
            "attacking"
        ));
    }
    @Cacheable("formations")
    public List<Formation> getAllFormations() {
        return new ArrayList<>(formations.values());
    }
    public Optional<Formation> getFormation(String id) {
        return Optional.ofNullable(formations.get(id));
    }
    public Optional<Formation> getFormation(String id, boolean flipH, boolean flipV) {
        return getFormation(id).map(f -> {
            Formation result = f;
            if (flipH) result = result.flipHorizontal();
            if (flipV) result = result.flipVertical();
            return result;
        });
    }   
    public List<Formation> getByCategory(String category) {
        return formations.values().stream()
            .filter(f -> f.category().equalsIgnoreCase(category))
            .toList();
    }
}
