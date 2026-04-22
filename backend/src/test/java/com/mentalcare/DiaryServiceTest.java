package com.mentalcare;

import com.mentalcare.domain.Diary;
import com.mentalcare.mapper.DiaryMapper;
import com.mentalcare.service.DiaryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DiaryServiceTest {

    @Mock DiaryMapper diaryMapper;
    @InjectMocks DiaryService diaryService;

    private Diary diary;

    @BeforeEach
    void setUp() {
        diary = new Diary();
        diary.setRecordDate(LocalDate.now());
        diary.setWakeTime(LocalTime.of(8, 0));
        diary.setSleepDuration(7.0);
        diary.setAppliedCompany("K회사, N회사");
        diary.setMoodScore(4);
        diary.setMemo("오늘은 컨디션 좋음");
    }

    @Test
    @DisplayName("신규 기록은 insert 호출")
    void save_insert() {
        when(diaryMapper.findByDate(diary.getRecordDate())).thenReturn(Optional.empty());
        diaryService.save(diary);
        verify(diaryMapper).insert(diary);
        verify(diaryMapper, never()).update(any());
    }

    @Test
    @DisplayName("같은 날짜 기록이 이미 있으면 update 호출")
    void save_update() {
        when(diaryMapper.findByDate(diary.getRecordDate())).thenReturn(Optional.of(diary));
        diaryService.save(diary);
        verify(diaryMapper).update(diary);
        verify(diaryMapper, never()).insert(any());
    }
}
