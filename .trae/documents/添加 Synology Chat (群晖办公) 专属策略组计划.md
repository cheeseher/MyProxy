# 添加 Synology Chat (群晖办公) 专属策略组计划

针对您的办公需求，我将为群晖 Chat (Synology Chat) 和您的公司 NAS 域名 `iytena.com` 创建一个独立的策略组。这样可以确保办公流量的稳定性和可控性，例如强制直连（如果 NAS 在内网或国内）或通过特定节点访问。

## 1. 策略组架构调整

*   **新增 `💬 群晖办公` 策略组**
    *   **类型**: `select` (手动选择)
    *   **候选项**: `DIRECT` (直连，默认首选), `🚀 节点选择`, `🇭🇰 香港节点` 等。
    *   **设计逻辑**: 通常公司 NAS 域名在内网或通过 DDNS 在国内直连访问速度最快且最稳定。但如果您在公司外部且直连受限，也可以手动切换到代理节点。

## 2. 规则 (Rule) 添加

我们需要添加两条核心规则，确保 `iytena.com` 和群晖相关服务的流量被准确分流到新策略组。

*   **域名后缀规则 (DOMAIN-SUFFIX)**: `iytena.com` -> `💬 群晖办公`
*   **群晖服务规则集**: 引用 `blackmatrix7/Synology.list` (包含 QuickConnect 等服务)，以防您使用 QuickConnect ID 而非域名访问。

## 3. 配置文件修改预览

我将修改 `Surge-Dual.conf`：
1.  在 `[Proxy Group]` 添加 `💬 群晖办公`。
2.  在 `[Rule]` 添加 `DOMAIN-SUFFIX,iytena.com,💬 群晖办公` 及 Synology 规则集。

准备就绪，请确认此计划，我将立即执行修改。
