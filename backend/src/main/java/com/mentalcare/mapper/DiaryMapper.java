package com.mentalcare.mapper;

import com.mentalcare.domain.Diary;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Mapper
public interface DiaryMapper {
    void insert(Diary diary);
    Optional<Diary> findByDate(@Param("recordDate") LocalDate recordDate);
    List<Diary> findAll();
    List<Diary> findRecent(@Param("limit") int limit);
    void update(Diary diary);
    void deleteByDate(@Param("recordDate") LocalDate recordDate);
}
