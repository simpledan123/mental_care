package com.mentalcare.service;

import com.mentalcare.domain.AnomalyResult;
import com.mentalcare.domain.Diary;
import com.mentalcare.mapper.DiaryMapper;
import lombok.RequiredArgsConstructor;
import org.apache.commons.math3.stat.descriptive.DescriptiveStatistics;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AnomalyService {

    private static final int WINDOW = 7;          // 비교 기준: 최근 7일
    private static final double Z_THRESHOLD = 2.0; // Z-score 임계값

    private final DiaryMapper diaryMapper;

    public AnomalyResult analyze(LocalDate targetDate) {
        List<Diary> recent = diaryMapper.findRecent(WINDOW + 1);

        // 오늘 기록 분리
        Diary today = recent.stream()
                .filter(d -> d.getRecordDate().equals(targetDate))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("해당 날짜의 기록이 없습니다: " + targetDate));

        // 오늘을 제외한 과거 데이터
        List<Diary> history = recent.stream()
                .filter(d -> !d.getRecordDate().equals(targetDate))
                .toList();

        if (history.size() < 3) {
            return AnomalyResult.builder()
                    .recordDate(targetDate)
                    .anomaly(false)
                    .anomalyType("NONE")
                    .zScore(0.0)
                    .message("기록이 충분하지 않아 분석할 수 없습니다. 최소 3일 이상 기록해 주세요.")
                    .build();
        }

        // 기분 점수 Z-score
        double moodZ = calcZScore(
                history.stream().mapToDouble(Diary::getMoodScore).toArray(),
                today.getMoodScore()
        );

        // 기상 시간 Z-score (분 단위로 변환)
        double wakeZ = calcZScore(
                history.stream().mapToDouble(d -> d.getWakeTime().getHour() * 60.0 + d.getWakeTime().getMinute()).toArray(),
                today.getWakeTime().getHour() * 60.0 + today.getWakeTime().getMinute()
        );

        // 수면 시간 Z-score
        double sleepZ = calcZScore(
                history.stream().mapToDouble(Diary::getSleepDuration).toArray(),
                today.getSleepDuration()
        );

        // 가장 이상한 항목 선택
        String anomalyType = "NONE";
        double maxZ = 0.0;

        if (Math.abs(moodZ) > Z_THRESHOLD && Math.abs(moodZ) > maxZ) {
            maxZ = Math.abs(moodZ);
            anomalyType = "MOOD";
        }
        if (Math.abs(wakeZ) > Z_THRESHOLD && Math.abs(wakeZ) > maxZ) {
            maxZ = Math.abs(wakeZ);
            anomalyType = "WAKE_TIME";
        }
        if (Math.abs(sleepZ) > Z_THRESHOLD && Math.abs(sleepZ) > maxZ) {
            maxZ = Math.abs(sleepZ);
            anomalyType = "SLEEP_DURATION";
        }

        boolean isAnomaly = !anomalyType.equals("NONE");

        return AnomalyResult.builder()
                .recordDate(targetDate)
                .anomaly(isAnomaly)
                .anomalyType(anomalyType)
                .zScore(maxZ)
                .message(buildMessage(anomalyType, today))
                .build();
    }

    private double calcZScore(double[] values, double target) {
        DescriptiveStatistics stats = new DescriptiveStatistics(values);
        double mean = stats.getMean();
        double std  = stats.getStandardDeviation();
        if (std == 0) return 0.0;
        return (target - mean) / std;
    }

    private String buildMessage(String anomalyType, Diary today) {
        return switch (anomalyType) {
            case "MOOD" -> "최근 기분 점수(" + today.getMoodScore() + "점)가 평소보다 크게 낮아졌습니다. 오늘 하루 스스로를 돌아보는 시간을 가져보세요.";
            case "WAKE_TIME" -> "오늘 기상 시간이 평소와 많이 달라졌습니다. 규칙적인 기상 패턴을 유지하는 것이 루틴 안정에 도움이 됩니다.";
            case "SLEEP_DURATION" -> "수면 시간(" + today.getSleepDuration() + "시간)이 평소와 차이가 있습니다. 충분한 수면은 하루의 컨디션을 좌우합니다.";
            default -> "오늘 루틴은 안정적입니다.";
        };
    }
}
