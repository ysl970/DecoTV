# 给 OrionTV 用户的回复

感谢您的反馈！关于 OrionTV 1.3.11 显示"认证失败"的问题，我已经为您准备了详细的使用指南。

## 🎯 问题原因

DecoTV 的 API 接口需要身份认证，不能直接将服务地址复制到 OrionTV 中使用。

## ✅ 解决方案（推荐）

**使用 TVBox 配置格式（最简单）**：

1. 访问你的 DecoTV 管理后台：`https://你的域名/admin`
2. 登录后，找到 **"TVbox 配置"** 卡片
3. 复制显示的配置地址（类似：`https://你的域名/api/tvbox/config?format=json`）
4. 在 OrionTV 中：
   - 进入设置 → 订阅管理
   - 添加订阅源，粘贴上面的配置地址
   - 刷新订阅即可使用

## 📖 完整文档

我已经为您准备了详细的使用指南，包含：

- ✅ 两种配置方式（TVBox 配置 / 认证 Cookie）
- ✅ 常见问题解答
- ✅ 安全建议
- ✅ 版本兼容性说明

**查看完整文档**：[OrionTV 使用指南](https://github.com/Decohererk/DecoTV/blob/main/docs/OrionTV使用指南.md)

## 💡 快速测试

你可以先在浏览器中访问这个地址测试配置是否正常：

```text
https://你的域名/api/tvbox/config?format=json
```

如果能看到一串 JSON 配置内容（包含 sites、spider 等字段），说明配置正常，直接将这个地址添加到 OrionTV 订阅即可。

---

如果按照上述方法仍然无法使用，请提供：

1. 具体的错误提示截图
2. 你的 DecoTV 部署方式（Vercel/自托管等）
3. 是否能在浏览器中正常访问和登录 DecoTV

祝使用愉快！🎉
