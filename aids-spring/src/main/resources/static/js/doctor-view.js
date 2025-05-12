// js/doctor-view.js
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = '1';

    const sidebar = document.querySelector('.sidebar');
    const toggleSidebarBtn = document.querySelector('.toggle-sidebar-btn');
    const expandSidebarBtn = document.querySelector('.expand-sidebar-btn');
    const dateToggles = document.querySelectorAll('.date-toggle');
    const patientItems = document.querySelectorAll('.patient-item');

    const diagnosisInfoSection = document.getElementById('diagnosis-info-section');
    const historyInfoSection = document.getElementById('history-info-section');
    const preDiagnosisSection = document.getElementById('pre-diagnosis-section');
    const doctorDiagnosisSection = document.getElementById('doctor-diagnosis-section');
    const saveDoctorInfoBtn = document.getElementById('save-doctor-info-btn');
    const doctorDiagnosisInput = document.getElementById('doctor-diagnosis-input');

    // 收窄与展开功能
    toggleSidebarBtn.addEventListener('click', () => {
        sidebar.classList.add('collapsed');
    });

    expandSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('collapsed');
    });

    // 日期展开/收起逻辑
    dateToggles.forEach((dt) => {
        dt.addEventListener('click', () => {
            const parent = dt.parentElement; // .date-item
            const patientList = parent.querySelector('.patient-list');
            const arrowSpan = dt.querySelector('.arrow');

            if (patientList.style.display === 'none') {
                patientList.style.display = 'block';
                // 改为下箭头
                arrowSpan.textContent = '↓';
            } else {
                patientList.style.display = 'none';
                // 恢复为右箭头
                arrowSpan.textContent = '⟶';
            }
        });
    });

    // 选中患者并更新右侧信息（示例逻辑）
    patientItems.forEach((pi) => {
        pi.addEventListener('click', () => {
            patientItems.forEach(item => item.classList.remove('selected'));
            pi.classList.add('selected');

            const date = pi.getAttribute('data-date');
            const patientId = pi.getAttribute('data-patient');

            // 模拟更新右侧信息
            diagnosisInfoSection.querySelector('p:nth-of-type(1)').textContent = `日期：${date}`;
            diagnosisInfoSection.querySelector('p:nth-of-type(2)').textContent = `姓名：${patientId}-姓名`;
            diagnosisInfoSection.querySelector('p:nth-of-type(3)').textContent = `性别：男`;
            diagnosisInfoSection.querySelector('p:nth-of-type(4)').textContent = `年龄：30`;

            historyInfoSection.querySelector('p').textContent = `无重大病史。患者：${patientId}`;
            
            preDiagnosisSection.querySelectorAll('p')[0].textContent = `症状表现：头痛（${patientId}）`;
            preDiagnosisSection.querySelectorAll('p')[1].textContent = `可能病因：压力过大`;
            
            // 清空医生诊断结果输入框
            doctorDiagnosisInput.value = '';
        });
    });

    // 保存医生输入信息
    saveDoctorInfoBtn.addEventListener('click', () => {
        const diagnosisText = doctorDiagnosisInput.value.trim();
        if (!diagnosisText) {
            alert('请填写医生诊断建议后再保存。');
            return;
        }
        // 模拟保存操作
        alert('诊断信息已保存：' + diagnosisText);
    });
});
