document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";

    const userId = localStorage.getItem('userId') || 'A10001';
    console.log('用户 ID:', userId);
});

const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const inputValue = chatInput.value.trim();
    if (!inputValue) return;

    // 显示用户消息
    const userBubble = document.createElement('div');
    userBubble.className = 'chat-bubble user';
    userBubble.textContent = inputValue;
    chatMessages.appendChild(userBubble);

    chatInput.value = '';
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const userId = localStorage.getItem('userId') || 'A10001';

    try {
        console.info("userId:",userId);
        const response = await fetch("http://localhost:8888/api/data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: userId,
                msgFree: inputValue
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // 这里用 text() 解析纯文本响应
        const aiReply = await response.text();

        console.log("AI回复:", aiReply);

        // 显示 AI 回复，支持换行
        const aiBubble = document.createElement('div');
        aiBubble.className = 'chat-bubble ai';
        aiBubble.innerHTML = aiReply.replace(/\n/g, "<br>");
        chatMessages.appendChild(aiBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

    } catch (error) {
        console.error("请求错误:", error);
        const errorBubble = document.createElement('div');
        errorBubble.className = 'chat-bubble ai error';
        errorBubble.textContent = "请求失败，请稍后重试。";
        chatMessages.appendChild(errorBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
}
