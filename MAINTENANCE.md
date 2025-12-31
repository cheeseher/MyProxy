# 项目维护指南 (Maintenance Guide)

为了保持各端配置、文档及网站的一致性，请遵循以下维护规范。

## 1. 核心原则

*   🇨🇳 **中文提交**: 所有 Git Commit Message 必须使用中文，清晰描述变更内容 (e.g., "修复: 中银香港登录问题")。
*   🔄 **同步更新**: 任何对 `By-Shane.conf` 或 Module 的功能性变更，**必须**同步更新:
    1.  `README.md` 中的 Changelog。
    2.  `website/index.html` 中的 Changelog 模块。
*   ✅ **测试为先**: 提交前请务必在本地 Surge 客户端验证语法正确性。

## 2. 工作与发布流程

1.  **修改代码**:
    *   `By-Shane.conf`: 核心规则变更。
    *   `Modules/`: 脚本或重写逻辑变更。
2.  **验证**:
    *   在 Surge iOS/Mac 本地加载测试。
    *   验证外部资源链接 (GitHub Raw) 是否可达。
3.  **更新文档**:
    *   在 `README.md` 的 Update Log 添加条目。
    *   在 `website/index.html` 的 Update Log 添加条目。
4.  **提交发布**:
    *   `git add .`
    *   `git commit -m "类型: 描述"`
    *   `git push`

## 3. 常见维护场景

### 添加新的银行白名单
1.  修改 `By-Shane.conf` -> `[General] skip-proxy`。
2.  更新 `README.md` -> Q&A -> 银行列表。
3.  更新 `website/index.html` -> Q&A -> 银行列表。

### 更新 TikTok 模块
1.  修改 `Modules/TikTokUnlock.sgmodule`。
2.  如果脚本 URL 变更，确保 GitHub Raw 链接正确。
3.  通知用户重新安装模块（如果是重大变更）。

## 4. 目录结构说明

*   `/By-Shane.conf`: **主配置文件** (托管源)。
*   `/Private_Template.conf`: 本地配置模板 (给用户 Copy 用的)。
*   `/Modules/`: 独立 Surge 模块。
*   `/website/`: 静态说明网站源码。
*   `/README.md`: GitHub 首页文档。
