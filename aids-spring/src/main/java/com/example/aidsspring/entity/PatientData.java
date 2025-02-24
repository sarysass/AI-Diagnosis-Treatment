package com.example.aidsspring.entity;

public class PatientData {

    private Integer id;

    private String name;
    private Integer age;
    private String gender;
    private String tel;
    private Integer diagnosisid;
    private String info;

    // Getters and Setters

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public String getTel() {
        return tel;
    }

    public void setTel(String tel) {
        this.tel = tel;
    }

    public Integer getDiagnosisid() {
        return diagnosisid;
    }

    public void setDiagnosisid(Integer diagnosisid) {
        this.diagnosisid = diagnosisid;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}