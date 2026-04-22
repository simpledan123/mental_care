package com.mentalcare.service;

import com.mentalcare.domain.Diary;
import com.mentalcare.mapper.DiaryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DiaryService {

    private final DiaryMapper diaryMapper;

    public void save(Diary diary) {
        Optional<Diary> existing = diaryMapper.findByDate(diary.getRecordDate());
        if (existing.isPresent()) {
            diary.setRecordDate(existing.get().getRecordDate());
            diaryMapper.update(diary);
        } else {
            diaryMapper.insert(diary);
        }
    }

    public Optional<Diary> findByDate(LocalDate date) {
        return diaryMapper.findByDate(date);
    }

    public List<Diary> findAll() {
        return diaryMapper.findAll();
    }

    public List<Diary> findRecent(int limit) {
        return diaryMapper.findRecent(limit);
    }

    public void delete(LocalDate date) {
        diaryMapper.deleteByDate(date);
    }
}
