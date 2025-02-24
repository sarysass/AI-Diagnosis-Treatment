package com.example.aidsspring.mapper;

import com.example.aidsspring.entity.PatientData;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;

@Mapper
public interface PatientMapper {
    @Insert("INSERT INTO patient(name, age, gender, tel, diagnosisid, info) VALUES(#{name}, #{age}, #{gender}, #{tel}, #{diagnosisid}, #{info})")
    @Options(useGeneratedKeys = true, keyProperty = "id") // 使能自增id返回
    void insertPatient(PatientData patient);
}