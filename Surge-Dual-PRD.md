# Surge 双端配置优化项目 PRD (产品需求文档)

**版本**: v1.0
**日期**: 2025-12-30
**状态**: 已交付

---

## 1. 项目背景
本项目旨在为用户定制一套适用于 Mac 和 iOS 双端的 Surge 配置文件。核心目标是解决当前配置不稳定、语音通话断连、GitHub 上传卡顿以及界面交互不友好的问题，同时实现节点自动化筛选与分流。

## 2. 核心需求汇总

| 序号 | 需求描述 | 痛点分析 | 解决方案 | 状态 |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **双端兼容性** | iOS 费电，Mac 性能未跑满 | iOS 开启 `wifi-assist`，Mac 适配增强模式，关闭 IPv6 | ✅ 完成 |
| 2 | **语音通话防断连** | Telegram/Zoom 自动切节点导致断线 | 移除 `url-test` 自动选择，强制手动锁定节点；开启 UDP 优先 | ✅ 完成 |
| 3 | **UDP 协议保障** | 节点不支持 UDP 导致通话失败 | 配置 `udp-policy-not-supported-behaviour = DIRECT` 自动回退直连 | ✅ 完成 |
| 4 | **办公场景分流** | 公司 NAS/Zoom 误走代理或直连卡顿 | 建立 `💬 群晖办公` 和 `📹 Zoom会议` 独立策略组，精准匹配域名 | ✅ 完成 |
| 5 | **AI 服务专用** | ChatGPT/Claude 封锁香港节点 | 建立 `🤖 人工智能` 策略组，优先推荐美/新/日节点 | ✅ 完成 |
| 6 | **开发体验优化** | GitHub 上传慢，AI 编译器卡顿 | 建立 `🐱 GitHub` 策略组，配合本地终端代理配置 | ✅ 完成 |
| 7 | **UI/UX 体验升级** | 英文 DIRECT 难懂，Emoji 图标简陋 | 汉化 DIRECT 为 `🎯 全局直连`，全量替换为高清彩色图标 | ✅ 完成 |

---

## 3. 功能模块详解

### 3.1 策略组架构 (Proxy Group)

本配置共设计了 **10 个策略组**，涵盖所有日常与工作场景：

1.  **🚀 节点选择**: 主流量入口，统筹全局。
2.  **♻️ 自动选择**: 仅用于网页浏览等非实时连接，每 600s 测速一次。
3.  **地区智能分组**: `🇭🇰 香港` / `🇸🇬 新加坡` / `🇯🇵 日本` / `🇺🇸 美国` / `🇨🇳 台湾` (正则自动筛选节点)。
4.  **📲 电报消息**: **(手动)** 专为 Telegram 设计，移除自动选择，防断连。
5.  **📹 Zoom会议**: **(手动)** 支持直连与代理切换，优先直连。
6.  **💬 群晖办公**: **(手动)** 包含 `DIRECT`，专为公司内网/DDNS 优化。
7.  **🤖 人工智能**: 聚合 OpenAI, Claude, Gemini，避开香港节点。
8.  **🐱 GitHub**: 专为代码托管优化，加速 git push/clone。
9.  **🎬 国际媒体**: 聚合 Netflix, YouTube, Disney+ 等流媒体。
10. **🎯 全局直连**: `DIRECT` 的中文别名，提升可读性。

### 3.2 规则体系 (Rule System)

采用 `blackmatrix7` 维护的 RuleSet，确保规则实时更新：

*   **隐私与广告**: `Privacy`, `Advertising`
*   **开发工具**: `GitHub`
*   **AI 服务**: `OpenAI`, `Claude`, `Gemini`, `Copilot`
*   **办公应用**: `Zoom`, `Synology` (包含 `iytena.com` 域名匹配)
*   **社交媒体**: `Telegram`, `Twitter`, `Facebook`, `Instagram`
*   **流媒体**: `YouTube`, `Netflix`, `Disney+`, `Spotify`
*   **国内直连**: `ChinaMax` (包含国内常见域名及 IP)

### 3.3 协议优化 (Protocol Tuning)

针对实时语音 (VoIP) 和游戏场景进行了底层优化：

```ini
[General]
# 1. 优先转发 UDP 数据包，减少语音延迟
udp-priority = true

# 2. 如果代理节点不支持 UDP，立即回退到直连，防止通话彻底失败
udp-policy-not-supported-behaviour = DIRECT
```

---

## 4. 交互与体验 (UI/UX)

### 4.1 汉化处理
*   **痛点**: 面板显示 `DIRECT` 对于非技术用户不够直观。
*   **方案**: 创建别名策略组 `🎯 全局直连`，在视觉上完全替代 `DIRECT`。

### 4.2 图标美化
*   **痛点**: 原生 Emoji 图标在不同设备上显示不一致，且缺乏质感。
*   **方案**: 引入 `Koolson` 和 `Semporia` 高清彩色图标库 (`icon-url`)。
    *   🚀 小火箭、🇭🇰 区旗、🐱 章鱼猫、🤖 机器人等，视觉识别度极高。

---

## 5. 部署与维护

### 5.1 托管地址
配置已推送到您的 GitHub 仓库：
`https://raw.githubusercontent.com/cheeseher/MyProxy/main/Surge-Dual.conf`

### 5.2 终端代理建议 (Mac 必做)
为了让终端工具 (Git, Curl) 也能享受代理加速，建议在 `~/.zshrc` 中添加：

```bash
# 端口请根据 Surge Mac 实际设置调整 (默认 6152)
export https_proxy=http://127.0.0.1:6152 http_proxy=http://127.0.0.1:6152 all_proxy=socks5://127.0.0.1:6153
```

---

**文档结束**
