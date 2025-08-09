// js/global.js

// 页面载入淡入
document.addEventListener('DOMContentLoaded', () => {
    document.body.style.opacity = '1';
});
// 统一的后端接口基础地址配置
const BASE_URL = "https://aids.sheepblack.cn:3333";
// BASE_URL 挂载到 window 全局对象
window.BASE_URL = BASE_URL;
console.log("global.js: window.BASE_URL is set to:", window.BASE_URL);