package com.mentalcare.controller;

import com.mentalcare.domain.AnomalyResult;
import com.mentalcare.service.AnomalyService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/anomaly")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AnomalyController {

    private final AnomalyService anomalyService;

    @GetMapping("/{date}")
    public ResponseEntity<AnomalyResult> analyze(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(anomalyService.analyze(date));
    }
}
