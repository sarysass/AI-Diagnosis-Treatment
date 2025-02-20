智能问诊系统前端项目说明

简介
本项目为智能问诊系统的前端部分，实现了以下功能：
欢迎页 (welcome)：通过动画和淡入淡出效果引导用户进入个人信息录入页面。
个人信息录入页 (personal-info)：用户可填写姓名、年龄、性别、联系方式、症状简介等信息，并进行输入验证。
聊天页 (chat)：用户与 AI 医生进行对话，AI 根据用户输入给出相应反馈，完成预诊对话流程并跳转到诊断结果页面。
预诊结果查看页 (diagnosis)：展示用户的预诊信息，包括基本诊断、病史采集和预诊结果；可滚动查看较多信息。
医生端登录页 (doctor-login)：医生可通过用户名和密码登录系统。
医生端查看页 (doctor-view)：医生可查看不同日期下的患者预诊数据，展开/收起患者列表，选中患者查看详细信息；可收缩左侧栏，右侧信息区域可滚动查看较多的诊断内容，同时可为患者填写医生诊断并保存。


项目结构
project/
│
├─ pages/
│  ├─ welcome.html
│  ├─ personal-info.html
│  ├─ chat.html
│  ├─ diagnosis.html
│  ├─ doctor-login.html
│  └─ doctor-view.html
│
├─ css/
│  ├─ global.css          # 全局通用样式
│  ├─ welcome.css         # welcome页面特有样式
│  ├─ personal-info.css   # personal-info页面特有样式
│  ├─ chat.css            # chat页面特有样式
│  ├─ diagnosis.css       # diagnosis页面特有样式
│  ├─ doctor-login.css    # doctor-login页面特有样式
│  └─ doctor-view.css     # doctor-view页面特有样式
│
├─ js/
│  ├─ global.js           # 全局通用脚本（淡入淡出动画等）
│  ├─ welcome.js
│  ├─ personal-info.js
│  ├─ chat.js
│  ├─ diagnosis.js
│  ├─ doctor-login.js
│  └─ doctor-view.js
│
└─ assets/
   ├─ images/             # 存放所有图片资源
   │  ├─ doctor-gesture.jpg
   │  ├─ personal-info.jpg
   │  ├─ chat.jpg
   │  ├─ diagnosis-bg.jpg
   │  ├─ ...
   └─ ... 其它静态资源


功能特性与说明
全局样式与脚本：
global.css 中包含全局字体、过渡动画等样式；global.js 中包含全局事件（如页面淡入淡出动画）。

页面淡入淡出效果：
利用 CSS transition 和 JS 动态设置 opacity 属性实现页面从全透明到不透明的渐入效果，以及在跳转前的渐出效果。

表单验证（personal-info页面）：
在提交前验证必填项、性别选择、年龄合法性以及联系方式格式（11位数字），确保用户输入有效信息。

聊天功能（chat页面）：
用户输入后生成用户气泡和AI回复气泡。诊断结束后弹出对话框，进入结果查看页。

诊断结果查看（diagnosis页面）：
可以上下滚动查看较多的诊断信息。

医生端功能（doctor-login、doctor-view页面）：
医生可登录查看患者信息列表，日期可展开/收起以显示对应患者列表。选中患者后右侧显示对应诊断信息。医生端可收缩左侧栏至最小宽度，以查看更多的右侧信息。右侧信息区有滚动条可查看大量数据。
在收窄侧边栏后，只有恢复按钮显示，其他内容隐藏。日期展开后箭头符号从右箭头切换为下箭头以示状态变化。


使用说明
将 project 目录作为静态资源目录部署在任意静态服务器上（如使用VS Code的Live Server插件或Nginx）。
访问 pages/welcome.html 即可进入欢迎界面，并按照页面指引浏览后续功能。
若有实际数据对接需求，可在对应 JS 文件内加入AJAX/Fetch请求逻辑。
开发与维护建议
所有样式变量或公用参数可提取至 global.css 中进行统一管理。
如需修改特定页面布局或动画，只需要在对应的 CSS 或 JS 文件中调整。

保持命名规范与一致性，方便多人协作开发与维护。