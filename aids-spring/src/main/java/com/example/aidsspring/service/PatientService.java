package com.example.aidsspring.service;

import com.example.aidsspring.entity.PatientData;
import com.example.aidsspring.mapper.PatientMapper; // 假设你有一个 PatientMapper
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PatientService {
    @Autowired
    private PatientMapper patientMapper;

    public void savePatient(PatientData patient) {
        // 插入患者数据
        patientMapper.insertPatient(patient); // 确保这个方法能返回自增的id
    }
}
