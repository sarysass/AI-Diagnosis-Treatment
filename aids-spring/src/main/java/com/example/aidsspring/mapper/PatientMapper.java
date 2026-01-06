package com.example.aidsspring.mapper;

import com.example.aidsspring.entity.PatientData;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.util.List;

@Mapper
public interface PatientMapper {
    @Insert("INSERT INTO patient(name, age, gender, tel, diagnosisid, info, address, diagnosisDate, aiDiagnosis, doctorDiagnosis) " +
            "VALUES(#{name}, #{age}, #{gender}, #{tel}, #{diagnosisid}, #{info}, #{address}, #{diagnosisDate}, #{aiDiagnosis}, #{doctorDiagnosis})")
    @Options(useGeneratedKeys = true, keyProperty = "id") // 使能自增id返回
    void insertPatient(PatientData patient);

    @Select("SELECT * FROM patient ORDER BY diagnosisDate DESC, id DESC")
    List<PatientData> selectAllPatients();

    @Update("UPDATE patient SET name=#{name}, age=#{age}, gender=#{gender}, " +
            "tel=#{tel}, diagnosisid=#{diagnosisid}, info=#{info}, address=#{address}, diagnosisDate=#{diagnosisDate}, " +
            "aiDiagnosis=#{aiDiagnosis}, doctorDiagnosis=#{doctorDiagnosis} WHERE id=#{id}")
    void updatePatient(PatientData patient);

    @Update("UPDATE patient SET aiDiagnosis=#{aiDiagnosis} WHERE id=#{id}")
    void updateAiDiagnosis(@org.apache.ibatis.annotations.Param("id") Integer id, @org.apache.ibatis.annotations.Param("aiDiagnosis") String aiDiagnosis);
}