# Surge 托管配置同步指南

本文档将指导您如何利用 GitHub 实现 Surge 配置的云端托管与多端同步。

## 1. 核心原理
我们将 GitHub 作为配置文件的“远程服务器”。
*   **电脑端 (Cursor/Trae)**: 修改配置 -> 推送 (Push) 到 GitHub。
*   **手机端 (Surge iOS)**: 通过 URL 订阅 -> 拉取 (Pull) 最新配置。

---

## 2. 最佳实践：分离式配置 (Detached Profile)

为了既能**自动同步云端规则** (如 TikTok 修复)，又能**保护您的私有订阅** (且不被更新覆盖)，我们强烈建议使用 **"本地引用云端" (`#!include`)** 的方式。

### 核心原理
*   **云端 (By-Shane.conf)**: 包含规则、脚本、MITM 逻辑 (由 Shane 维护更新)。
*   **本地 (Local Profile)**: 您的私人配置，只包含 `#!include` 引用于订阅链接。

---

## 3. iOS/Mac 设置步骤

### 第一步：准备配置模板 (只需一次)

1.  打开 **Surge** -> **创建新配置** -> **创建文本配置 (Create Text Profile)**。
2.  清空编辑器中的所有内容。
3.  复制并粘贴以下模板代码：

```ini
#!name=Shane 托管配置 (Auto)
#!desc=自动同步云端规则 + 本地私有订阅
#!author=Shane

[General]
# ⬇️ 核心：引用云端主配置 (保持最新)
#!include = https://raw.githubusercontent.com/cheeseher/MyProxy/main/By-Shane.conf

[Proxy Group]
# ⬇️ 覆盖：填入您的机场订阅链接 (不会被云端更新覆盖)
我的订阅 = select, policy-path=在此处粘贴您的机场订阅链接, update-interval=43200, no-alert=0, hidden=0, include-all-proxies=0
```

### 第二步：填入订阅
1.  找到代码中的 `policy-path=...` 部分。
2.  将 `在此处粘贴您的机场订阅链接` 替换为您购买的机场订阅 URL (通常是类似 `https://api.v1.club/...` 的链接)。
3.  点击 **"完成" (Done)** 保存。

### 第三步：验证与自动更新
*   **验证**: 切换到该配置并启动 Surge。在 "策略组" 页面，应该能看到 "我的订阅" 已经加载了节点，且 "TikTok" 等规则组也已出现。
*   **更新**: 未来当 Shane 更新了云端规则 (如修复 TikTok)，您的 Surge 会在后台自动静默更新 `#!include` 的内容，您**无需任何操作**。
*   如果您想强制更新，只需在 Surge 首页长按该配置 -> **"立即更新外部资源"**。

---

## 🎵 5. TikTok 专用使用指南 (必读)

TikTok 的风控极其严格，仅靠分流规则是不够的，必须配合 **"MITM 解密"** 和 **"URL 重写模块"** 才能使用。

### 核心三步法

1.  **彻底卸载**: 如果您之前安装过 TikTok (无论是否能看)，请先将其**删除**。这是为了清除旧的运营商代码缓存。
2.  **安装模块**:
    *   在 Surge 首页点击 **"模块"** -> **"安装新模块"**。
    *   粘贴链接: `https://raw.githubusercontent.com/cheeseher/MyProxy/main/Modules/TikTokUnlock.sgmodule` (GitHub Raw 源，稳)
    *   确保模块开关已 **开启**。
3.  **重装与登录**:
    *   确保 Surge 处于 **开启** 状态，且 MITM 开关打开（证书已信任）。
    *   去 App Store 下载 TikTok。
    *   打开 App，此时应该能正常刷出视频。

### 进阶：如何换区？
默认配置为 **美国 (US)** 区。如果您想看日本小姐姐：
1.  在 Surge 模块列表中，点击 `TikTok Unlock` -> **编辑**。
2.  找到 `[URL Rewrite]` 区域。
3.  将 `(?<=_region=)CN(?=&) US 307` 中的 `US` 改为 `JP` (日本)、`KR` (韩国) 或 `TW` (台湾)。
4.  保存，**重启 TikTok** (杀后台) 即可生效。

---

## ❓ 6. 常见问题 (Q&A)

**Q: 为什么我点击更新显示“下载失败”？**
A: 请检查手机是否开启了全局代理导致无法访问 GitHub，或者检查仓库是否被设为了 Private。

**Q: 我修改了配置，手机上更新后没变化？**
A: 请确认您在电脑上执行了 `git push` 操作，并且 GitHub 网页上已经能看到最新的文件内容。GitHub 的 Raw 缓存通常有 1-5 分钟的延迟，稍等片刻再更新即可。

**Q: 里面的节点订阅链接需要更新吗？**
A: 不需要。`By-Shane.conf` 里只是引用了您的机场订阅地址（`policy-path`）。只要机场不跑路，节点列表会自动通过 Surge 的后台策略更新机制刷新，与这个配置文件本身的更新是分开的。

**Q: 为什么 TikTok 还是黑屏或无法使用？**
A: **TikTok 必须安装模块！** 主配置只负责分流。请在 Surge 首页点击 **"模块"** -> **"安装新模块"** -> 粘贴 `Modules/TikTokUnlock.sgmodule` 的 GitHub Raw 链接 (详见 README)。
