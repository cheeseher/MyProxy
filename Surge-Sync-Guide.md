# Surge 托管配置同步指南

本文档将指导您如何利用 GitHub 实现 Surge 配置的云端托管与多端同步。

## 1. 核心原理
我们将 GitHub 作为配置文件的“远程服务器”。
*   **电脑端 (Cursor/Trae)**: 修改配置 -> 推送 (Push) 到 GitHub。
*   **手机端 (Surge iOS)**: 通过 URL 订阅 -> 拉取 (Pull) 最新配置。

---

## 2. 获取托管链接 (Raw URL)

Surge 只能识别纯文本格式的配置文件。

*   **您的仓库**: `cheeseher/MyProxy`
*   **分支**: `main`
*   **文件名**: `By-Shane.conf`

**✅ 您的专属导入链接**:
```text
https://raw.githubusercontent.com/cheeseher/MyProxy/main/By-Shane.conf
```

> ⚠️ **重要提示**: 
> 1. 请确保您的 GitHub 仓库是 **Public (公开)** 的。如果是 Private (私有) 仓库，此链接将无法直接访问（返回 404）。
> 2. 如果必须使用私有仓库，您需要创建一个 GitHub Personal Access Token (PAT)，并将链接改为：`https://token@raw.githubusercontent.com/...` 格式。

---

## 3. iOS 端操作步骤

### 第一步：首次导入
1.  复制上面的 **专属导入链接**。
2.  打开 **Surge iOS**。
3.  点击左上角的 **配置名称**（例如 "Default"）进入配置列表页。
4.  点击底部的 **"从 URL 下载配置" (Download Profile from URL)**。
5.  粘贴链接，点击 **"完成"**。
6.  Surge 会自动下载并应用新配置。

### 第二步：日常同步 (更新)
当您在电脑上修改了配置并推送到 GitHub 后，手机上不会毫秒级自动变更（为了稳定性），需要您手动刷新一下：

1.  打开 **Surge iOS**。
2.  点击左上角的 **配置名称** 进入列表。
3.  找到 `By-Shane` 配置。
4.  **长按** 该配置，选择 **"立即更新" (Update Now)**。
    *   *或者：如果配置图标旁有 "更新" 按钮，直接点击即可。*
5.  等待几秒，提示 "更新成功" 即可应用最新规则。

---

## 4. Mac 端操作步骤

Mac 端同样适用此逻辑：

1.  打开 **Surge Mac** 主界面。
2.  点击左下角的 **配置列表** 图标。
3.  选择 **"安装托管配置..." (Install Managed Configuration...)**。
4.  粘贴上面的 URL。
5.  以后每次启动 Surge Mac，它都会自动检查更新。您也可以右键点击配置选择 **"立即更新"**。

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
