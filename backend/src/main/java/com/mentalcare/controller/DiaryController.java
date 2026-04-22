package com.mentalcare.controller;

import com.mentalcare.domain.Diary;
import com.mentalcare.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/diary")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DiaryController {

    private final DiaryService diaryService;

    @PostMapping
    public ResponseEntity<Void> save(@RequestBody Diary diary) {
        diaryService.save(diary);
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public ResponseEntity<List<Diary>> findAll() {
        return ResponseEntity.ok(diaryService.findAll());
    }

    @GetMapping("/{date}")
    public ResponseEntity<Diary> findByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return diaryService.findByDate(date)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{date}")
    public ResponseEntity<Void> delete(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        diaryService.delete(date);
        return ResponseEntity.ok().build();
    }
}
