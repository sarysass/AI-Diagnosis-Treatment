document.addEventListener("DOMContentLoaded", () => {
    document.body.style.opacity = "1";
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

        // 发送请求到API获取AI的回复
        try {
            // 发送 POST 请求
            fetch("https://www.windyword.com/J9T4pR8KzAwQ/apimedical", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    id: 'A10005', // 根据需要修改参数
                    msg_free: inputValue
                })
            })
                .then(response => response.text()) // 获取响应文本
                .then(responseText => {
                    // 分割每一行
                    const lines = responseText.split('\n');
                    // 提取以 'data: ' 开头的行
                    const dataLines = lines.filter(line => line.startsWith('data: '));
                    // 逐个处理每一行数据
                    dataLines.forEach(dataLine => {
                        // 去掉 'data: ' 前缀
                        const dataJson = dataLine.substring('data: '.length);
                        try {
                            const data = JSON.parse(dataJson);
                            console.log("接收到的数据:", data);

                            // 根据 data.type 判断回复类型
                            let aiReply = "";
                            if (data.type === 'llm') {
                                // LLM类型的回复;
                                aiReply = data.content;
                            } else if (data.type === 'source') {
                                // source类型的回复;
                                aiReply = data.content;
                            } else if (data.type === 'time') {
                                // time类型的回复;
                                aiReply = data.content;
                            } else if(data.type ==='end'){
                                //问答结束时 给出结果
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
                                // 输出结束的 aiReply
                                //console.log(aiReply);
                            }

                            // 将回复显示到聊天界面
                            const aiBubble = document.createElement('div');
                            aiBubble.className = 'chat-bubble ai';
                            aiBubble.innerHTML = aiReply;
                            chatMessages.appendChild(aiBubble);
                            chatMessages.scrollTop = chatMessages.scrollHeight;

                            // // 弹出诊断对话框
                            // setTimeout(() => {
                            //     diagnosisModal.style.display = 'block';
                            // }, 1000);

                        } catch (error) {
                            console.error("JSON解析错误:", error);
                        }
                    });
                })
                .catch(error => {
                    console.error("请求错误:", error);
                });

        } catch (error) {
            console.error('Error calling the API:', error);
        }
    }
}
