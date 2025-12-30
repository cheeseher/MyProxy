// 核心逻辑：使用 Promise 并发请求
// 增强功能：尝试检测 ChatGPT 和 Google 的出口地区
// 美化输出：大幅增加间距，优化对齐

const TIMEOUT = 5000;

// 国旗 Emoji 映射
function getFlagEmoji(countryCode) {
    if (!countryCode) return ''; 
    const code = countryCode.toUpperCase();
    if (code === 'TW') return '🇹🇼';
    if (code === 'UK') return '🇬🇧';
    if (code === 'CN') return '🇨🇳';
    
    const OFFSET = 127397;
    try {
        return String.fromCodePoint(code.charCodeAt(0) + OFFSET, code.charCodeAt(1) + OFFSET);
    } catch (e) {
        return '';
    }
}

// 专门检测 ChatGPT 地区
function testChatGPT() {
    return new Promise((resolve) => {
        let startTime = Date.now();
        $httpClient.get({
            url: 'https://chat.openai.com/cdn-cgi/trace',
            timeout: TIMEOUT
        }, (error, response, data) => {
            let duration = Date.now() - startTime;
            if (error) {
                resolve({ name: 'ChatGPT', status: '🔴', info: '失败', duration: 0 });
                return;
            }
            let location = '';
            const match = data.match(/loc=([A-Z]+)/);
            if (match && match[1]) {
                location = getFlagEmoji(match[1]);
            }
            resolve({ name: 'ChatGPT', status: '🟢', info: location, duration: duration });
        });
    });
}

// 专门检测 Google 地区
function testGoogle() {
    return new Promise((resolve) => {
        let startTime = Date.now();
        $httpClient.get({
            url: 'https://www.google.com/ncr',
            timeout: TIMEOUT,
            headers: { 'User-Agent': 'Mozilla/5.0' }
        }, (error, response, data) => {
            let duration = Date.now() - startTime;
            if (error) {
                resolve({ name: 'Google', status: '🔴', info: '失败', duration: 0 });
                return;
            }
            resolve({ name: 'Google', status: '🟢', info: '', duration: duration });
        });
    });
}

// 通用测试
function testGeneric(url, name) {
    return new Promise((resolve) => {
        let startTime = Date.now();
        $httpClient.get({ url: url, timeout: TIMEOUT }, (error, response, data) => {
            let duration = Date.now() - startTime;
            if (error) {
                resolve({ name: name, status: '🔴', info: '失败', duration: 0 });
            } else if (response.status >= 400) {
                resolve({ name: name, status: '🔴', info: `Err${response.status}`, duration: duration });
            } else {
                resolve({ name: name, status: '🟢', info: '', duration: duration });
            }
        });
    });
}

async function getIPInfo() {
    return new Promise((resolve) => {
        $httpClient.get('http://ip-api.com/json/?fields=countryCode,country', (error, response, data) => {
            if (error || !data) {
                resolve(null);
            } else {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            }
        });
    });
}

(async () => {
    // 1. 获取当前节点 (ip-api)
    const ipInfo = await getIPInfo();
    let mainLocation = "未知";
    if (ipInfo) {
        mainLocation = `${getFlagEmoji(ipInfo.countryCode)} ${ipInfo.country}`;
    }

    // 2. 并行测试
    const results = await Promise.all([
        testChatGPT(),
        testGoogle(),
        testGeneric('https://www.netflix.com/title/80018499', 'Netflix'),
        testGeneric('https://zoom.us', 'Zoom'),
        testGeneric('https://t.me', 'Telegram')
    ]);

    // 3. 格式化输出 (大幅优化版)
    let contentLines = [];
    
    // 标题栏：增加一些装饰
    contentLines.push(`📍  出口节点:  ${mainLocation}`);
    contentLines.push(''); // 空行分隔

    results.forEach(r => {
        // 动态计算颜色
        let icon = r.status;
        if (r.status === '🟢') {
            if (r.duration > 1000) icon = '🟡';
            if (r.duration > 3000) icon = '🟠';
        }
        
        // 使用全角空格来辅助对齐，因为 iOS 系统字体对半角空格的渲染宽度不一致
        // 名称固定宽度
        let nameStr = r.name;
        // 补齐到一定长度，这里简单处理，尽量让视觉对齐
        if (nameStr.length < 8) nameStr += " ".repeat(8 - nameStr.length);

        // 时间显示优化
        let timeStr = r.duration > 0 ? `${r.duration}ms` : '';
        if (timeStr.length < 6) timeStr = " " + timeStr; // 右对齐时间

        // 组合：图标 + 名称 + 地区 + 时间
        // 增加中间的间距
        let line = `${icon}  ${nameStr}    ${r.info}    ${timeStr}`;
        
        contentLines.push(line);
        // 每一行后面都加一个空行，制造“稀疏”感，解决拥挤问题
        contentLines.push(''); 
    });

    // 移除最后多余的空行
    if (contentLines.length > 0) contentLines.pop();

    $done({
        title: "服务连通性检查",
        content: contentLines.join('\n'),
        icon: "network",
        "icon-color": "#5DADE2"
    });
})();
