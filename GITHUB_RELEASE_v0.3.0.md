# 🎉 DecoTV v0.3.0 - JAR 问题完整解决方案

> **发布日期**: 2025 年 10 月 6 日

## 🚀 重大更新

### 🎯 JAR 加载问题终极解决方案

- **🛠️ 一键修复功能**: 管理员面板新增 JAR 自动修复按钮
- **🔍 智能诊断**: 实时检测 20+ JAR 源可用性和速度
- **🌐 网络适配**: 自动识别国内/海外网络环境，提供最优源选择

### 🔧 新增 API 接口

- `GET /api/tvbox/jar-fix` - JAR 源修复检测
- `GET /api/tvbox/smart-health` - 增强版智能健康检查
- 实时状态监控和详细错误诊断

## 🛠️ 技术改进

### JAR 源系统重构

- **20+ 高可用源**: 国内优先源 + 国际 CDN 源 + 代理加速源
- **并发检测**: 同时测试多个源，选择最快响应
- **动态失败转移**: 智能黑名单机制，自动切换可用源
- **内置备用 JAR**: 确保 100% 可用性

### 管理员界面优化

- JAR 状态监控面板
- 一键修复按钮 (🔍 检查状态 | 🔄 强制刷新 | 🛠️ 一键修复)
- 详细状态反馈和诊断信息

## 🐛 问题修复

**彻底解决 TVBox/影视仓 JAR 加载问题:**

- ✅ 修复 "spider unreachable: 403" 错误
- ✅ 解决 "jar 加载失败" 问题
- ✅ 修复配置导入成功但无法解析的问题
- ✅ 解决一键体检显示所有源不可用的问题

## 📱 使用指南

### 快速修复

1. 访问 `/admin` 管理员面板
2. 找到"JAR 文件状态监控"区域
3. 点击"🛠️ 一键修复"按钮
4. 等待自动检测和修复完成

### TVBox/影视仓推荐设置

- ✅ 启用"智能解析"和"自动重试"选项
- ✅ 连接超时设置为 30 秒，重试 3 次
- ✅ 定期清理应用缓存

## 📋 完整更新日志

查看 [CHANGELOG](./CHANGELOG) 了解详细的技术更新内容。

---

## 🔽 下载和部署

### Docker 部署 (推荐)

```bash
docker run -d -p 3000:3000 ghcr.io/decohererk/decotv:v0.3.0
```

### 手动部署

```bash
git clone https://github.com/Decohererk/DecoTV.git
cd DecoTV
npm install
npm run build
npm start
```

---

**感谢使用 DecoTV！** 🎉 这个版本专注于解决 JAR 加载问题，提供一键修复功能，大大提升使用体验。

如有问题请创建 [GitHub Issue](https://github.com/Decohererk/DecoTV/issues) 反馈。
