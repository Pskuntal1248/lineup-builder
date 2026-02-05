package com.lineupgenerator.controller;

import com.lineupgenerator.dto.ExportRequest;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/lineup")
public class ExportController {
    
    @PostMapping("/export")
    public ResponseEntity<ExportResponse> prepareExport(@RequestBody ExportRequest request) {
        if (request.players() == null || request.players().isEmpty()) {
            return ResponseEntity.badRequest()
                .body(new ExportResponse(false, "No players in lineup", null));
        }

        int width = request.width();
        int height = request.height();
        
        if (request.settings() != null && request.settings().aspectRatio() != null) {
            switch (request.settings().aspectRatio()) {
                case "square" -> height = width;
                case "portrait" -> height = (int) (width * 1.25);
                case "landscape" -> height = (int) (width * 0.75);
            }
        }
        
        return ResponseEntity.ok(new ExportResponse(
            true,
            "Ready for export",
            new ExportMetadata(width, height, request.format())
        ));
    }
    @PostMapping("/export/svg")
    public ResponseEntity<String> exportSvg(@RequestBody ExportRequest request) {
        String svg = generateSvg(request);
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.valueOf("image/svg+xml"));
        headers.setContentDispositionFormData("attachment", "lineup.svg");
        
        return ResponseEntity.ok()
            .headers(headers)
            .body(svg);
    }
    
    private String generateSvg(ExportRequest request) {
        int width = request.width();
        int height = request.height();
        String pitchStyle = request.settings() != null ? request.settings().pitchStyle() : "grass";
        
        StringBuilder svg = new StringBuilder();
        svg.append(String.format(
            "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 %d %d\" width=\"%d\" height=\"%d\">",
            width, height, width, height
        ));
        
        String bgColor = switch (pitchStyle) {
            case "dark" -> "#1a472a";
            case "light" -> "#4a8f4a";
            case "minimal" -> "#2d5a2d";
            default -> "#2e7d32";
        };
        svg.append(String.format("<rect width=\"%d\" height=\"%d\" fill=\"%s\"/>", width, height, bgColor));
        svg.append(generatePitchMarkings(width, height));
        if (request.players() != null) {
            for (var player : request.players()) {
                double x = player.customX() != null ? player.customX() : 50;
                double y = player.customY() != null ? player.customY() : 50;
                
                int px = (int) (x * width / 100);
                int py = (int) (y * height / 100);
                
                String color = player.jerseyColor() != null ? player.jerseyColor() : 
                    (request.settings() != null ? request.settings().jerseyColor() : "#ff0000");
                
                svg.append(String.format(
                    "<circle cx=\"%d\" cy=\"%d\" r=\"25\" fill=\"%s\" stroke=\"white\" stroke-width=\"2\"/>",
                    px, py, color
                ));
                
                if (request.settings() == null || request.settings().showNames()) {
                    String name = player.displayName() != null ? player.displayName() : 
                        (player.name() != null ? player.name() : "");
                    svg.append(String.format(
                        "<text x=\"%d\" y=\"%d\" text-anchor=\"middle\" fill=\"white\" font-size=\"12\" font-family=\"Arial\">%s</text>",
                        px, py + 40, escapeXml(name)
                    ));
                }
            }
        }
        
        svg.append("</svg>");
        return svg.toString();
    }
    
    private String generatePitchMarkings(int width, int height) {
        StringBuilder markings = new StringBuilder();
        String strokeColor = "rgba(255,255,255,0.6)";
        int strokeWidth = 2;
        int padding = 20;
        markings.append(String.format(
            "<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"none\" stroke=\"%s\" stroke-width=\"%d\"/>",
            padding, padding, width - 2 * padding, height - 2 * padding, strokeColor, strokeWidth
        ));
        int centerY = height / 2;
        markings.append(String.format(
            "<line x1=\"%d\" y1=\"%d\" x2=\"%d\" y2=\"%d\" stroke=\"%s\" stroke-width=\"%d\"/>",
            padding, centerY, width - padding, centerY, strokeColor, strokeWidth
        ));
        int circleRadius = Math.min(width, height) / 8;
        markings.append(String.format(
            "<circle cx=\"%d\" cy=\"%d\" r=\"%d\" fill=\"none\" stroke=\"%s\" stroke-width=\"%d\"/>",
            width / 2, centerY, circleRadius, strokeColor, strokeWidth
        ));
        markings.append(String.format(
            "<circle cx=\"%d\" cy=\"%d\" r=\"4\" fill=\"%s\"/>",
            width / 2, centerY, strokeColor
        ));
        int penaltyWidth = width / 3;
        int penaltyHeight = height / 6;
        markings.append(String.format(
            "<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"none\" stroke=\"%s\" stroke-width=\"%d\"/>",
            (width - penaltyWidth) / 2, padding, penaltyWidth, penaltyHeight, strokeColor, strokeWidth
        ));
        markings.append(String.format(
            "<rect x=\"%d\" y=\"%d\" width=\"%d\" height=\"%d\" fill=\"none\" stroke=\"%s\" stroke-width=\"%d\"/>",
            (width - penaltyWidth) / 2, height - padding - penaltyHeight, penaltyWidth, penaltyHeight, strokeColor, strokeWidth
        ));
        
        return markings.toString();
    }
    
    private String escapeXml(String text) {
        if (text == null) return "";
        return text.replace("&", "&amp;")
                   .replace("<", "&lt;")
                   .replace(">", "&gt;")
                   .replace("\"", "&quot;");
    }
    
    public record ExportResponse(boolean success, String message, ExportMetadata metadata) {}
    public record ExportMetadata(int width, int height, String format) {}
}
