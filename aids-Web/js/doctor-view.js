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

    /* ===== 新增：上传弹窗与上传逻辑（最小追加） ===== */
    const openBtn  = document.querySelector('.upload-open-btn');
    const modal    = document.getElementById('upload-modal');
    const mask     = document.getElementById('upload-mask');
    const closeBtn = document.getElementById('upload-close-btn');

    function openModal(){ modal?.classList.add('show'); mask?.classList.add('show'); }
    function closeModal(){ modal?.classList.remove('show'); mask?.classList.remove('show'); }

    openBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    mask?.addEventListener('click', closeModal);

    // 简单上传：选择/拖拽/进度
    const fileInput = document.getElementById('model-file');
    const uploadBtn = document.getElementById('upload-btn');
    const dropzone  = document.getElementById('dropzone');
    const list      = document.getElementById('upload-list');

    let filesToUpload = [];
    let uploadedFiles = [];

    function renderList(){
      if(!list) return;
      list.innerHTML = '';
      filesToUpload.forEach((f,idx)=>{
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
          <div class="name">${f.name}</div>
          <div class="meta">${(f.size/1024/1024).toFixed(2)} MB</div>
          <div class="progress-wrap"><div class="progress-bar" id="pb-${idx}"></div></div>
          <div class="status" id="st-${idx}"></div>`;
        list.appendChild(item);
      });
      uploadedFiles.forEach(f=>{
        const item = document.createElement('div');
        item.className = 'upload-item';
        item.innerHTML = `
          <div class="name">${f.name}</div>
          <div class="meta">${(f.size/1024/1024).toFixed(2)} MB</div>
          <div class="${f.status==='ok'?'upload-ok':'upload-fail'}">${f.status==='ok'?'已上传':'失败'}</div>`;
        list.appendChild(item);
      });
    }

    fileInput?.addEventListener('change', e=>{
      filesToUpload = Array.from(e.target.files||[]);
      renderList();
    });

    ['dragenter','dragover'].forEach(evt=>dropzone?.addEventListener(evt,e=>{
      e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover');
    }));
    ['dragleave','drop'].forEach(evt=>dropzone?.addEventListener(evt,e=>{
      e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover');
    }));
    dropzone?.addEventListener('drop', e=>{
      filesToUpload = filesToUpload.concat(Array.from(e.dataTransfer.files||[]));
      renderList();
    });

    uploadBtn?.addEventListener('click', async()=>{
      if(!filesToUpload.length){ alert('请先选择文件'); return; }
      for(const f of filesToUpload){ await uploadOne(f); }
      filesToUpload = []; renderList();
    });

    function uploadOne(file){
      return new Promise((resolve)=>{
        const idx = filesToUpload.indexOf(file);
        const pb  = document.getElementById(`pb-${idx}`);
        const st  = document.getElementById(`st-${idx}`);

        const form = new FormData(); form.append('file', file);
        const xhr = new XMLHttpRequest();
        // 若后端不同源/端口，请改为完整地址，如：http://localhost:3001/api/upload/model
        xhr.open('POST', '/api/upload/model', true);

        xhr.upload.onprogress = e=>{
          if(e.lengthComputable && pb){ pb.style.width = (e.loaded/e.total*100).toFixed(0)+'%'; }
        };
        xhr.onreadystatechange = ()=>{
          if(xhr.readyState===4){
            const ok = xhr.status>=200 && xhr.status<300;
            st && (st.innerHTML = ok ? '<span class="upload-ok">上传成功</span>' : `<span class="upload-fail">上传失败：${xhr.status}</span>`);
            uploadedFiles.unshift({name:file.name,size:file.size,status:ok?'ok':'fail'});
            resolve();
          }
        };
        xhr.onerror = ()=>{ st && (st.innerHTML = '<span class="upload-fail">网络错误</span>'); uploadedFiles.unshift({name:file.name,size:file.size,status:'fail'}); resolve(); };
        xhr.send(form);
      });
    }
});
