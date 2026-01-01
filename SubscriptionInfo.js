/*
 * Surge Script: Subscription Info
 * 
 * 参数 (Argument): 这里填入你的订阅链接 (URL)
 * 作用: 显示机场订阅的流量使用情况和过期时间 (Displays traffic usage and expiration date)
 */

(async () => {
    let url = $argument.trim();

    if (!url) {
        $done({
            title: "订阅信息 (需配置)",
            content: "请长按此面板 -> 编辑模块 -> 在 [参数] 中填入订阅链接",
            icon: "exclamationmark.triangle",
            "icon-color": "#FF9500"
        });
        return;
    }

    let headers = {
        "User-Agent": "Surge/5.0"
    };

    $httpClient.head({ url: url, headers: headers }, function (error, response, data) {
        if (error) {
            $done({
                title: "订阅信息",
                content: "请求失败，请检查网络或链接",
                icon: "xmark.circle",
                "icon-color": "#FF2D55"
            });
            return;
        }

        let info = response.headers["subscription-userinfo"] || response.headers["Subscription-Userinfo"];

        if (!info) {
            $done({
                title: "订阅信息",
                content: "未找到流量信息 (No Info Header)",
                icon: "questionmark.circle",
                "icon-color": "#8E8E93"
            });
            return;
        }

        // Parse info: upload=123; download=456; total=789; expire=123456789
        let stats = {};
        info.split(";").forEach(item => {
            let parts = item.split("=");
            if (parts.length === 2) {
                stats[parts[0].trim()] = parseInt(parts[1].trim());
            }
        });

        let used = (stats.upload + stats.download);
        let total = stats.total;
        let usedGB = (used / 1024 / 1024 / 1024).toFixed(2);
        let totalGB = (total / 1024 / 1024 / 1024).toFixed(2);
        let percent = ((used / total) * 100).toFixed(1);

        let content = `已用: ${usedGB} GB / ${totalGB} GB (${percent}%)`;

        if (stats.expire) {
            let date = new Date(stats.expire * 1000);
            let dateStr = date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' });
            content += `\n过期: ${dateStr}`;
        } else {
            content += `\n过期: 无限期`;
        }

        $done({
            title: "订阅信息",
            content: content,
            icon: "antenna.radiowaves.left.and.right",
            "icon-color": "#007AFF"
        });
    });

})();
