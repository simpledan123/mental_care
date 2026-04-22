package com.mentalcare;

import com.mentalcare.domain.AnomalyResult;
import com.mentalcare.domain.Diary;
import com.mentalcare.mapper.DiaryMapper;
import com.mentalcare.service.AnomalyService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AnomalyServiceTest {

    @Mock DiaryMapper diaryMapper;
    @InjectMocks AnomalyService anomalyService;

    @Test
    @DisplayName("기분 점수가 급격히 낮아지면 MOOD 이상 감지")
    void detect_mood_anomaly() {
        LocalDate today = LocalDate.now();
        List<Diary> data = new ArrayList<>();

        // 6일치 정상 기록 (기분 4~5)
        for (int i = 6; i >= 1; i--) {
            Diary d = new Diary();
            d.setRecordDate(today.minusDays(i));
            d.setWakeTime(LocalTime.of(8, 0));
            d.setSleepDuration(7.5);
            d.setMoodScore(5);
            data.add(d);
        }

        // 오늘 기분 1점 (이상)
        Diary todayDiary = new Diary();
        todayDiary.setRecordDate(today);
        todayDiary.setWakeTime(LocalTime.of(8, 0));
        todayDiary.setSleepDuration(7.5);
        todayDiary.setMoodScore(1);
        data.add(0, todayDiary);

        when(diaryMapper.findRecent(8)).thenReturn(data);

        AnomalyResult result = anomalyService.analyze(today);

        assertThat(result.isAnomaly()).isTrue();
        assertThat(result.getAnomalyType()).isEqualTo("MOOD");
    }

    @Test
    @DisplayName("데이터가 3일 미만이면 분석 불가 메시지 반환")
    void insufficient_data() {
        LocalDate today = LocalDate.now();
        List<Diary> data = new ArrayList<>();

        Diary d1 = new Diary(); d1.setRecordDate(today.minusDays(1)); d1.setWakeTime(LocalTime.of(8,0)); d1.setSleepDuration(7.0); d1.setMoodScore(4);
        Diary d2 = new Diary(); d2.setRecordDate(today); d2.setWakeTime(LocalTime.of(8,0)); d2.setSleepDuration(7.0); d2.setMoodScore(4);
        data.add(d2); data.add(d1);

        when(diaryMapper.findRecent(8)).thenReturn(data);

        AnomalyResult result = anomalyService.analyze(today);

        assertThat(result.isAnomaly()).isFalse();
        assertThat(result.getMessage()).contains("충분하지 않아");
    }
}
