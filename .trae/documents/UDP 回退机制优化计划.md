# UDP 回退机制优化计划

您担心节点可能不支持 UDP 转发，这确实是一个常见问题。如果节点不支持 UDP，开启 `udp-priority` 后可能会导致连接失败。

为了解决这个问题，我们需要在 Surge 配置中显式定义 `udp-policy-not-supported-behaviour`（当节点不支持 UDP 时的行为）。

## 1. 优化策略

*   **默认行为 (Default)**: 目前 Surge 默认可能是 `REJECT`，这意味着如果选中的节点不支持 UDP，语音通话会直接断开。
*   **优化方案**: 将其设置为 `DIRECT`。
    *   **逻辑**: 如果您选中的代理节点不支持 UDP，Surge 会自动尝试直连目标服务器。
    *   **优势**: 对于 Telegram 和 Zoom 这种具有一定穿透能力或在国内有边缘节点的应用，直连往往能“救命”，避免通话彻底失败。

## 2. 配置文件修改预览

我将修改 `Surge-Dual.conf` 的 `[General]` 部分：

*   添加 `udp-policy-not-supported-behaviour = DIRECT`

## 3. 最终效果

修改后，Surge 的处理逻辑将是：
1.  优先尝试通过您选定的代理节点发送 UDP 语音包。
2.  如果该节点握手反馈“我不支持 UDP”，Surge 立即自动切换为直连 (DIRECT) 尝试发送数据。
3.  这为您提供了双重保险。

准备就绪，请确认此计划，我将立即执行修改。
