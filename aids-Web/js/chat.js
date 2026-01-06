document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";

    const userId = localStorage.getItem('userId') || 'A10001';
    console.log('用户 ID:', userId);

    const sendBtn = document.getElementById('send-btn');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');
    const loadingSpinner = document.getElementById('loading-spinner');
    const diagnosisModal = document.getElementById('diagnosis-modal');
    const closeModalBtn = document.getElementById('close-modal');

    // 关闭诊断弹窗
    closeModalBtn.addEventListener('click', () => {
        diagnosisModal.style.display = 'none';
    });

    // 发送消息函数
    async function sendMessage() {
        const inputValue = chatInput.value.trim();
        if (!inputValue) return;

        // 用户消息气泡
        const userBubble = document.createElement('div');
        userBubble.className = 'chat-bubble user';
        userBubble.textContent = inputValue;
        chatMessages.appendChild(userBubble);

        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // 创建 AI 加载气泡（始终显示）
        const aiLoadingBubble = document.createElement('div');
        aiLoadingBubble.className = 'chat-bubble ai loading';
        aiLoadingBubble.textContent = '...';
        chatMessages.appendChild(aiLoadingBubble);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        try {
            const response = await fetch(`${window.BASE_URL}/api/data`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: userId, msgFree: inputValue })
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const data = await response.json();

            if (data.status === 1) {
                // 普通文本回复
                aiLoadingBubble.innerHTML = data.text.replace(/\n/g, "<br>");
            } else if (data.status === 2) {
                // 诊断结果，带弹窗链接
                aiLoadingBubble.innerHTML = `<p>诊断结束，<a href="#" id="show-diagnosis">点击此处查看诊断结果</a></p>`;

                aiLoadingBubble.querySelector('#show-diagnosis').addEventListener('click', (e) => {
                    e.preventDefault();

                    const diagnosisContent = document.getElementById('diagnosis-content');
                    diagnosisContent.innerHTML = '';

                    const lines = data.text.split('\n').filter(line => line.trim() !== '');

                    lines.forEach(line => {
                        const [key, ...rest] = line.split('：');
                        const value = rest.join('：').trim();

                        const tr = document.createElement('tr');

                        const tdKey = document.createElement('td');
                        tdKey.textContent = key.trim();
                        tdKey.style.fontWeight = '600';
                        tdKey.style.padding = '8px 10px';
                        tdKey.style.width = '30%';
                        tdKey.style.verticalAlign = 'top';
                        tdKey.style.borderBottom = '1px solid #eee';

                        const tdValue = document.createElement('td');
                        tdValue.textContent = value;
                        tdValue.style.padding = '8px 10px';
                        tdValue.style.borderBottom = '1px solid #eee';

                        tr.appendChild(tdKey);
                        tr.appendChild(tdValue);

                        diagnosisContent.appendChild(tr);
                    });

                    diagnosisModal.style.display = 'block';
                });

                // 自动保存诊断结论到数据库
                saveDiagnosisToDB(userId, data.text);
            } else {
                // 其他状态也显示文本
                aiLoadingBubble.innerHTML = data.text.replace(/\n/g, "<br>");
            }

            chatMessages.scrollTop = chatMessages.scrollHeight;

        } catch (error) {
            console.error("请求错误:", error);
            aiLoadingBubble.classList.add('error');
            aiLoadingBubble.textContent = "请求失败，请稍后重试。";
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // 绑定发送按钮点击事件
    sendBtn.addEventListener('click', sendMessage);

    // 输入框回车发送消息（Shift+Enter换行）
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();  // 阻止换行
            sendMessage();
        }
    });

    /**
     * 将 AI 诊断结论自动保存到后端数据库
     * @param {string} id 用户 ID
     * @param {string} text 诊断文本
     */
    async function saveDiagnosisToDB(id, text) {
        try {
            const resp = await fetch(`${window.BASE_URL}/AddPatients/${id}/aiDiagnosis`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ aiDiagnosis: text })
            });
            if (resp.ok) {
                console.log('AI 诊断结论已自动保存至数据库');
            } else {
                console.error('自动保存诊断结论失败:', resp.status);
            }
        } catch (err) {
            console.error('自动保存诊断结论请求出错:', err);
        }
    }
});
