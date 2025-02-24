package com.example.aidsspring.controller;

import com.example.aidsspring.entity.PatientData;
import com.example.aidsspring.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/AddPatients")
public class PatientController {
    @Autowired
    private PatientService patientService;

    @PostMapping
    public ResponseEntity<Integer> createPatient(@RequestBody PatientData patient) {
        // 保存患者数据
        patientService.savePatient(patient);

        // 返回自增的id
        return ResponseEntity.ok(patient.getId());
    }
}
