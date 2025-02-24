document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";

    // 从 localStorage 获取 userId
    const userId = localStorage.getItem('userId') || 'A10001'; // 设置默认值
    console.log('用户 ID:', userId); // 打印用户 ID
});

const sendBtn = document.getElementById('send-btn');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const diagnosisModal = document.getElementById('diagnosis-modal');

sendBtn.addEventListener('click', sendMessage);

async function sendMessage() {
    const inputValue = chatInput.value.trim();
    if (inputValue !== '') {
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = inputValue;
        chatMessages.appendChild(userBubble);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
        // 从 localStorage 获取 userId
        const userId = localStorage.getItem('userId');
        // 发送请求到API获取AI的回复
        try {
            // 发送 POST 请求到后端 API
            fetch("http://localhost:3333/api/data", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: userId, // 用户id
                    msgFree: inputValue // 字段名
                })
            })
                .then(response => response.json()) // 获取响应 JSON
                .then(data => {
                    console.log("接收到的数据:", data);

                    // 根据需要处理响应数据
                    let aiReply = "";

                    // 假设后端返回的数据中包含 type 和 content 字段
                    if (data.type === 'llm') {
                        aiReply = data.content;
                    } else if (data.type === 'source') {
                        aiReply = data.content;
                    } else if (data.type === 'time') {
                        aiReply = data.content;
                    } else if (data.type === 'end') {
                        let content = data.content;

                        // 定义正则表达式，分别提取初筛结果、诊疗建议、筛查医院和日期
                        const screeningResultRegex = /初筛结果：([\s\S]+?)\n/;
                        const diagnosisSuggestionRegex = /诊疗建议：([\s\S]+?)\n/;
                        const screeningHospitalRegex = /筛查医院：([\s\S]+?)\n/;
                        const dateRegex = /日期：([\s\S]+?)\n/;

                        // 使用正则表达式从文本中提取所需字段
                        const screeningResult = content.match(screeningResultRegex)?.[1]?.trim() || "未找到初筛结果";
                        const diagnosisSuggestion = content.match(diagnosisSuggestionRegex)?.[1]?.trim() || "未找到诊疗建议";
                        const screeningHospital = content.match(screeningHospitalRegex)?.[1]?.trim() || "未找到筛查医院";
                        const date = content.match(dateRegex)?.[1]?.trim() || "未找到日期";

                        // 将提取到的内容组合成 aiReply
                        aiReply = `
            初筛结果：${screeningResult}<br><br>
            诊疗建议：${diagnosisSuggestion}<br><br>
            筛查医院：${screeningHospital}<br><br>
            日期：${date}
            `;
                    }

                    // 将回复显示到聊天界面
                    const aiBubble = document.createElement('div');
                    aiBubble.className = 'chat-bubble ai';
                    aiBubble.innerHTML = aiReply;
                    chatMessages.appendChild(aiBubble);
                    chatMessages.scrollTop = chatMessages.scrollHeight;

                })
                .catch(error => {
                    console.error("请求错误:", error);
                });

        } catch (error) {
            console.error('Error calling the API:', error);
        }
    }
}
