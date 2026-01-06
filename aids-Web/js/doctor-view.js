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

  // 跟踪当前选中的患者
  let currentPatient = null;

  // 收窄与展开功能
  toggleSidebarBtn.addEventListener('click', () => {
    sidebar.classList.add('collapsed');
  });

  expandSidebarBtn.addEventListener('click', () => {
    sidebar.classList.remove('collapsed');
  });

  // --- 新增：从后端获取数据并动态渲染 ---
  async function loadPatients() {
    try {
      const response = await fetch(`${window.BASE_URL || ''}/AddPatients/all`);
      if (!response.ok) throw new Error('获取数据失败');
      const data = await response.ok ? await response.json() : [];
      renderSidebar(data);
    } catch (error) {
      console.error('加载患者数据出错:', error);
      // 降级处理：尝试直接读取本地生成的 JSON (仅供调试或离线使用)
      try {
        const localResp = await fetch('../../data/diagnosis_data.json');
        const localData = await localResp.json();
        renderSidebar(localData);
      } catch (e) {
        console.error('本地加载也失败:', e);
      }
    }
  }

  function renderSidebar(patients) {
    // 按照日期分组，新的日期在上方
    // 过滤掉没有日期的患者
    const validPatients = patients.filter(p => p.diagnosisDate || p.问诊日期);

    const groups = {};
    validPatients.forEach(p => {
      const date = p.diagnosisDate || p.问诊日期;
      if (!groups[date]) groups[date] = [];
      groups[date].push(p);
    });

    const sortedDates = Object.keys(groups).sort((a, b) => b.localeCompare(a));

    sidebar.querySelectorAll('.date-item').forEach(el => el.remove());

    sortedDates.forEach(date => {
      const dateItem = document.createElement('div');
      dateItem.className = 'date-item';

      const dateToggle = document.createElement('div');
      dateToggle.className = 'record-item date-toggle';
      dateToggle.innerHTML = `<span>${date}</span><span class="arrow">⟶</span>`;

      const patientList = document.createElement('div');
      patientList.className = 'patient-list';
      patientList.style.display = 'none';

      groups[date].forEach(p => {
        const name = p.name || p.姓名;
        const pItem = document.createElement('div');
        pItem.className = 'patient-item';
        pItem.textContent = name;
        pItem.addEventListener('click', () => {
          document.querySelectorAll('.patient-item').forEach(i => i.classList.remove('selected'));
          pItem.classList.add('selected');
          currentPatient = p; // 保存当前选中的患者
          updateContent(p, date);
        });
        patientList.appendChild(pItem);
      });

      dateToggle.addEventListener('click', () => {
        const isHidden = patientList.style.display === 'none';
        patientList.style.display = isHidden ? 'block' : 'none';
        dateToggle.querySelector('.arrow').textContent = isHidden ? '↓' : '⟶';
      });

      dateItem.appendChild(dateToggle);
      dateItem.appendChild(patientList);
      sidebar.appendChild(dateItem);
    });
  }

  function updateContent(p, date) {
    const name = p.name || p.姓名;
    const gender = p.gender || p["性别"] || p[" 性别"];
    const age = p.age || p["年龄"] || p[" 年龄"];
    const address = p.address || p["居住地址"] || p[" 居住地址"] || '-';
    const symptoms = p.info || '-';  // 患者症状简介
    const aiDiagnosis = p.aiDiagnosis || p["诊断"] || '-';  // AI 诊断结果

    diagnosisInfoSection.querySelector('p:nth-of-type(1)').textContent = `日期：${date}`;
    diagnosisInfoSection.querySelector('p:nth-of-type(2)').textContent = `姓名：${name}`;
    diagnosisInfoSection.querySelector('p:nth-of-type(3)').textContent = `性别：${gender}`;
    diagnosisInfoSection.querySelector('p:nth-of-type(4)').textContent = `年龄：${age}`;
    document.getElementById('info-address').textContent = `地址：${address}`;

    // 病史采集显示患者填写的症状简介
    historyInfoSection.querySelector('p').textContent = symptoms;

    // 预诊结果显示 AI 诊断结果，格式化显示
    const preDiagnosisContainer = preDiagnosisSection;
    // 清空现有内容
    const existingParagraphs = preDiagnosisContainer.querySelectorAll('p');
    existingParagraphs.forEach(p => p.remove());

    if (aiDiagnosis && aiDiagnosis !== '-') {
      // 按行分割，每个以 - 开头的行作为一个段落
      const lines = aiDiagnosis.split('\n').filter(line => line.trim() !== '');

      lines.forEach(line => {
        const p = document.createElement('p');
        // 如果是以 - 开头的行，去掉 - 并显示
        if (line.trim().startsWith('-')) {
          p.textContent = line.trim().substring(1).trim();
        } else {
          p.textContent = line.trim();
        }
        p.style.marginBottom = '8px';
        preDiagnosisContainer.appendChild(p);
      });
    } else {
      const p = document.createElement('p');
      p.textContent = '-';
      preDiagnosisContainer.appendChild(p);
    }

    // 加载已保存的医生诊断（如果有）
    doctorDiagnosisInput.value = p.doctorDiagnosis || '';
  }

  loadPatients();
  // --- 动态渲染代码结束 ---

  // 保存医生输入信息
  saveDoctorInfoBtn.addEventListener('click', async () => {
    const diagnosisText = doctorDiagnosisInput.value.trim();
    if (!diagnosisText) {
      alert('请填写医生诊断建议后再保存。');
      return;
    }

    if (!currentPatient || !currentPatient.id) {
      alert('请先选择一个患者');
      return;
    }

    try {
      // 更新患者的 doctorDiagnosis 字段存储医生诊断
      const updatedPatient = {
        ...currentPatient,
        doctorDiagnosis: diagnosisText // 使用 doctorDiagnosis 字段存储医生诊断
      };

      const response = await fetch(`${window.BASE_URL || ''}/AddPatients/${currentPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedPatient)
      });

      if (response.ok) {
        alert('诊断信息已成功保存！');
        // 更新本地患者数据
        currentPatient.doctorDiagnosis = diagnosisText;
      } else {
        alert('保存失败，请重试');
      }
    } catch (error) {
      console.error('保存诊断信息出错:', error);
      alert('保存失败：' + error.message);
    }
  });

  /* ===== 新增：上传弹窗与上传逻辑（最小追加） ===== */
  const openBtn = document.querySelector('.upload-open-btn');
  const modal = document.getElementById('upload-modal');
  const mask = document.getElementById('upload-mask');
  const closeBtn = document.getElementById('upload-close-btn');

  function openModal() { modal?.classList.add('show'); mask?.classList.add('show'); }
  function closeModal() { modal?.classList.remove('show'); mask?.classList.remove('show'); }

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  mask?.addEventListener('click', closeModal);

  // 简单上传：选择/拖拽/进度
  const fileInput = document.getElementById('model-file');
  const uploadBtn = document.getElementById('upload-btn');
  const dropzone = document.getElementById('dropzone');
  const list = document.getElementById('upload-list');

  let filesToUpload = [];
  let uploadedFiles = [];

  function renderList() {
    if (!list) return;
    list.innerHTML = '';
    filesToUpload.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'upload-item';
      item.innerHTML = `
          <div class="name">${f.name}</div>
          <div class="meta">${(f.size / 1024 / 1024).toFixed(2)} MB</div>
          <div class="progress-wrap"><div class="progress-bar" id="pb-${idx}"></div></div>
          <div class="status" id="st-${idx}"></div>`;
      list.appendChild(item);
    });
    uploadedFiles.forEach(f => {
      const item = document.createElement('div');
      item.className = 'upload-item';
      item.innerHTML = `
          <div class="name">${f.name}</div>
          <div class="meta">${(f.size / 1024 / 1024).toFixed(2)} MB</div>
          <div class="${f.status === 'ok' ? 'upload-ok' : 'upload-fail'}">${f.status === 'ok' ? '已上传' : '失败'}</div>`;
      list.appendChild(item);
    });
  }

  fileInput?.addEventListener('change', e => {
    filesToUpload = Array.from(e.target.files || []);
    renderList();
  });

  ['dragenter', 'dragover'].forEach(evt => dropzone?.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation(); dropzone.classList.add('dragover');
  }));
  ['dragleave', 'drop'].forEach(evt => dropzone?.addEventListener(evt, e => {
    e.preventDefault(); e.stopPropagation(); dropzone.classList.remove('dragover');
  }));
  dropzone?.addEventListener('drop', e => {
    filesToUpload = filesToUpload.concat(Array.from(e.dataTransfer.files || []));
    renderList();
  });

  uploadBtn?.addEventListener('click', async () => {
    if (!filesToUpload.length) { alert('请先选择文件'); return; }
    for (const f of filesToUpload) { await uploadOne(f); }
    filesToUpload = []; renderList();
  });

  function uploadOne(file) {
    return new Promise((resolve) => {
      const idx = filesToUpload.indexOf(file);
      const pb = document.getElementById(`pb-${idx}`);
      const st = document.getElementById(`st-${idx}`);

      const form = new FormData(); form.append('file', file);
      const xhr = new XMLHttpRequest();
      // 若后端不同源/端口，请改为完整地址，如：http://localhost:3001/api/upload/model
      xhr.open('POST', '/api/upload/model', true);

      xhr.upload.onprogress = e => {
        if (e.lengthComputable && pb) { pb.style.width = (e.loaded / e.total * 100).toFixed(0) + '%'; }
      };
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const ok = xhr.status >= 200 && xhr.status < 300;
          st && (st.innerHTML = ok ? '<span class="upload-ok">上传成功</span>' : `<span class="upload-fail">上传失败：${xhr.status}</span>`);
          uploadedFiles.unshift({ name: file.name, size: file.size, status: ok ? 'ok' : 'fail' });
          resolve();
        }
      };
      xhr.onerror = () => { st && (st.innerHTML = '<span class="upload-fail">网络错误</span>'); uploadedFiles.unshift({ name: file.name, size: file.size, status: 'fail' }); resolve(); };
      xhr.send(form);
    });
  }
});
