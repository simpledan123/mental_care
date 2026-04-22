package com.mentalcare.domain;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class AnomalyResult {
    private LocalDate recordDate;
    private boolean anomaly;
    private String anomalyType;   // MOOD | WAKE_TIME | SLEEP_DURATION | NONE
    private Double zScore;
    private String message;
}
