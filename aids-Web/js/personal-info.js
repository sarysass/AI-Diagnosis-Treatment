document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";
    const formContainer = document.getElementById("form-container");
    formContainer.style.opacity = "1";

    const infoForm = document.getElementById('info-form');
    infoForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        // 获取表单值
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const gender = document.getElementById('gender').value;
        const contact = document.getElementById('contact').value.trim();
        const symptoms = document.getElementById('symptoms').value.trim(); // 捕获症状

        // 验证逻辑
        if (!name) {
            alert('姓名为必填项！');
            return;
        }

        if (!age || !/^\d+$/.test(age) || parseInt(age, 10) <= 0) {
            alert('请输入正确的年龄（大于0的整数）！');
            return;
        }

        if (!gender) {
            alert('请选择性别！');
            return;
        }

        if (!contact || !/^\d{11}$/.test(contact)) {
            alert('请输入正确的11位数字联系方式！');
            return;
        }

        // 获取当前日期 (YYYY-MM-DD)
        const today = new Date().toISOString().split('T')[0];

        // 创建一个患者对象
        const patientData = {
            name: name,
            age: parseInt(age, 10),
            gender: gender,
            tel: contact,
            diagnosisid: null,
            info: symptoms, // 将症状存入 info 字段
            diagnosisDate: today // 设置问诊日期
        };

        try {
            console.log("personal-info.js: Attempting fetch with window.BASE_URL:", window.BASE_URL);
            const response = await fetch(`${window.BASE_URL}/AddPatients`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(patientData),
            });

            if (response.ok) {
                const generatedId = await response.json(); // 获取返回的自增id
                console.log('生成的患者ID:', generatedId); // 打印自增id
                // 将生成的 ID 存储到 localStorage
                localStorage.setItem('userId', generatedId);
                // 若请求成功，页面淡出并跳转
                document.body.style.opacity = "0";
                setTimeout(() => {
                    window.location.href = "chat.html"; // 替换为实际跳转地址
                }, 1000);
            } else {
                alert('保存患者数据失败，请重试！');
            }
        } catch (error) {
            console.error('发生错误:', error);
            alert('网络错误，请稍后再试！');
        }

    });
});
