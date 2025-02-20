// js/personal-info.js
document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";
    const formContainer = document.getElementById("form-container");
    formContainer.style.opacity = "1";

    const infoForm = document.getElementById('info-form');
    infoForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // 获取表单值
        const name = document.getElementById('name').value.trim();
        const age = document.getElementById('age').value.trim();
        const gender = document.getElementById('gender').value;
        const contact = document.getElementById('contact').value.trim();
        // 症状简介不作必填要求
        // const symptoms = document.getElementById('symptoms').value.trim();

        // 验证逻辑
        // 1. 姓名必填
        if (!name) {
            alert('姓名为必填项！');
            return;
        }

        // 2. 年龄必填且为大于0的整数
        if (!age || !/^\d+$/.test(age) || parseInt(age, 10) <= 0) {
            alert('请输入正确的年龄（大于0的整数）！');
            return;
        }

        // 3. 性别必选，不能为默认选项
        if (!gender) {
            alert('请选择性别！');
            return;
        }

        // 4. 联系方式必填且为11位数字
        if (!contact || !/^\d{11}$/.test(contact)) {
            alert('请输入正确的11位数字联系方式！');
            return;
        }

        // 若通过所有验证则页面淡出并跳转
        document.body.style.opacity = "0";
        setTimeout(() => {
            window.location.href = "chat.html";
        }, 1000);
    });
});
