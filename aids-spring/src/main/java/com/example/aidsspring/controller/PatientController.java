package com.example.aidsspring.controller;

import com.example.aidsspring.entity.PatientData;
import com.example.aidsspring.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @GetMapping("/all")
    public ResponseEntity<List<PatientData>> getAllPatients() {
        return ResponseEntity.ok(patientService.getAllPatients());
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updatePatient(@PathVariable Integer id, @RequestBody PatientData patient) {
        patient.setId(id);
        patientService.updatePatient(patient);
        return ResponseEntity.ok("患者信息更新成功");
    }

    @PutMapping("/{id}/aiDiagnosis")
    public ResponseEntity<String> updateAiDiagnosis(@PathVariable Integer id, @RequestBody java.util.Map<String, String> payload) {
        String aiDiagnosis = payload.get("aiDiagnosis");
        patientService.updateAiDiagnosis(id, aiDiagnosis);
        return ResponseEntity.ok("AI诊断结果已成功保存");
    }
}
