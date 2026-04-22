package com.mentalcare.domain;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Data
public class Diary {
    private Long id;
    private LocalDate recordDate;
    private LocalTime wakeTime;
    private Double sleepDuration;     // 수면 시간 (단위: 시간)
    private String appliedCompany;    // 오늘 지원한 회사
    private Integer moodScore;        // 1 ~ 5
    private String memo;
    private LocalDateTime createdAt;
}
