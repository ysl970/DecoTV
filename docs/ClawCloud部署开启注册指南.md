# ClawCloud 部署开启注册功能指南

## 🎯 你的当前配置（已完成）

根据你的截图，你的 ClawCloud 环境变量配置如下：

```bash
✅ USERNAME=admin
✅ PASSWORD=ab143223cd
✅ NEXT_PUBLIC_STORAGE_TYPE=upstash
✅ UPSTASH_URL=https://bright-cardinal-17216.upstash.io
✅ UPSTASH_TOKEN=AUNAAAIncDI5YjQ3ZTA2OTUxNzU0YzZc2YjNmOWZINTI3NWI0ZjNmNXAy...
✅ NEXT_PUBLIC_SITE_BASE=https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com
```

**状态**：✅ 存储配置完成，只需开启注册功能！

---

## ⚡ 开启注册功能（1 分钟搞定）

### 步骤 1：添加环境变量

在 ClawCloud 控制台中添加**1 个**环境变量：

```bash
变量名: NEXT_PUBLIC_ENABLE_REGISTRATION
值: true
```

### 步骤 2：重新部署

- 点击 "Redeploy" 或 "重新部署"
- 等待 1-2 分钟部署完成

### 步骤 3：访问注册页面

```text
https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com/register
```

就这么简单！ 🎉

---

## 📋 完整环境变量清单

开启注册后，你的完整环境变量应该是：

```bash
# 管理员账号（必须）
USERNAME=admin
PASSWORD=ab143223cd

# 存储配置（必须）
NEXT_PUBLIC_STORAGE_TYPE=upstash
UPSTASH_URL=https://bright-cardinal-17216.upstash.io
UPSTASH_TOKEN=AUNAAAIncDI5YjQ3ZTA2OTUxNzU0YzZc2YjNmOWZINTI3NWI0ZjNmNXAy...

# 站点配置（必须）
NEXT_PUBLIC_SITE_BASE=https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com

# 注册功能（新增）
NEXT_PUBLIC_ENABLE_REGISTRATION=true  ← 添加这一行！
```

---

## ✅ 验证是否成功

### 测试 1：访问注册页面

打开浏览器访问：

```text
https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com/register
```

**成功标志**：看到精美的注册页面，包含用户名、密码、验证码输入框

**失败标志**：显示"注册功能未开启"或 404

### 测试 2：登录页面有注册入口

访问登录页：

```text
https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com/login
```

**成功标志**：页面底部显示"没有账号？立即注册"链接

### 测试 3：试注册一个账号

1. 填写用户名（3-20 字符）
2. 填写密码（至少 6 位）
3. 确认密码
4. 输入验证码（点击图片可刷新）
5. 点击"注册账号"

**成功标志**：显示"注册成功！正在跳转登录..."

---

## 🔒 安全建议

### 注册完成后建议关闭

如果你只是想为家人朋友创建几个账号，注册完成后建议立即关闭：

```bash
# 在 ClawCloud 环境变量中修改
NEXT_PUBLIC_ENABLE_REGISTRATION=false

# 或者直接删除这个变量
```

然后重新部署即可。

### 为什么要关闭？

- ✅ 防止陌生人注册
- ✅ 避免资源滥用
- ✅ 减少安全风险
- ✅ 符合项目私有部署定位

---

## ❓ 关于环境变量名的说明

### 问：为什么文档里写的是 UPSTASH*REDIS_REST*\* ？

**答**：那是我的笔误！😅

你的项目代码中实际使用的变量名是：

```bash
✅ 正确：UPSTASH_URL
✅ 正确：UPSTASH_TOKEN

❌ 错误：UPSTASH_REDIS_REST_URL
❌ 错误：UPSTASH_REDIS_REST_TOKEN
```

### 你的配置完全正确

你现在的环境变量 `UPSTASH_URL` 和 `UPSTASH_TOKEN` 是**完全正确**的，无需修改！

### 代码中的实际使用

```typescript
// src/lib/upstash.db.ts
const upstashUrl = process.env.UPSTASH_URL; // ← 这是你的变量名
const upstashToken = process.env.UPSTASH_TOKEN; // ← 这是你的变量名
```

---

## 🎓 常见问题

### Q1: 添加环境变量后看不到注册页面？

**解决方法**：

1. 确认变量名是 `NEXT_PUBLIC_ENABLE_REGISTRATION`（不是 `ENABLE_REGISTRATION`）
2. 确认值是 `true`（小写，不是 `True` 或 `TRUE`）
3. 确认已重新部署
4. 清除浏览器缓存，强制刷新（Ctrl+Shift+R）

### Q2: 验证码显示不出来？

**可能原因**：

- 浏览器缓存问题
- 网络连接问题

**解决方法**：

1. 刷新页面
2. 点击验证码图片位置（会触发刷新）
3. 检查浏览器控制台是否有错误

### Q3: 注册后无法登录？

**检查清单**：

1. 确认 Upstash 数据库连接正常
2. 访问 `/admin` 页面查看用户是否创建成功
3. 确认用户没有被封禁

### Q4: 想临时关闭注册怎么办？

**最快方法**：

```bash
# 方法1：修改变量值
NEXT_PUBLIC_ENABLE_REGISTRATION=false

# 方法2：删除这个变量（推荐）
直接在 ClawCloud 环境变量中删除 NEXT_PUBLIC_ENABLE_REGISTRATION

# 然后重新部署
```

---

## 📊 功能测试清单

开启注册后，建议测试以下场景：

- [ ] 访问 `/register` 能看到注册页面
- [ ] 验证码能正常显示
- [ ] 点击验证码能刷新
- [ ] 用户名太短会提示错误
- [ ] 密码太短会提示错误
- [ ] 两次密码不一致会提示
- [ ] 验证码错误会提示
- [ ] 能成功注册新用户
- [ ] 注册后能正常登录
- [ ] 登录页有"立即注册"链接
- [ ] 在 `/admin` 能看到新用户

---

## 🎉 完成后的样子

### 注册页面效果

```text
┌──────────────────────────────────────┐
│            🎬 DecoTV                 │
│         创建新账号                    │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 用户名 (3-20字符)            │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 密码 (至少6位)               │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌──────────────────────────────┐   │
│  │ 确认密码                     │   │
│  └──────────────────────────────┘   │
│                                      │
│  ┌─────────────┐ ┌──────┐ 🔄      │
│  │ 验证码      │ │K7M2  │          │
│  └─────────────┘ └──────┘          │
│                                      │
│  ┌──────────────────────────────┐   │
│  │      🎉 注册账号             │   │
│  └──────────────────────────────┘   │
│                                      │
│      已有账号？立即登录              │
└──────────────────────────────────────┘
```

### 登录页面效果

在登录页面底部会出现：

```text
┌──────────────────────────────────────┐
│                                      │
│  ┌──────────────────────────────┐   │
│  │      登录                    │   │
│  └──────────────────────────────┘   │
│                                      │
│      没有账号？立即注册   ← 新增的！  │
└──────────────────────────────────────┘
```

---

## 🚀 快速操作总结

```bash
# 1️⃣ 在 ClawCloud 添加环境变量
NEXT_PUBLIC_ENABLE_REGISTRATION=true

# 2️⃣ 点击重新部署
等待 1-2 分钟

# 3️⃣ 访问注册页面
https://ebuoahtofxen.ap-northeast-1.clawcloudrun.com/register

# 4️⃣ 开始注册用户！
填写信息 → 输入验证码 → 注册成功 → 登录使用

# 5️⃣（可选）注册完成后关闭
NEXT_PUBLIC_ENABLE_REGISTRATION=false
重新部署
```

---

## 💡 温馨提示

1. **你的 UPSTASH 配置完全正确**

   - `UPSTASH_URL` ✅
   - `UPSTASH_TOKEN` ✅
   - 无需修改任何变量名！

2. **只需添加 1 个变量**

   - `NEXT_PUBLIC_ENABLE_REGISTRATION=true`
   - 就这么简单！

3. **注册功能立即可用**

   - 无需修改代码
   - 无需重新配置数据库
   - 重新部署后立即生效

4. **安全使用**
   - 用完即关
   - 定期检查用户列表
   - 及时封禁异常账号

---

**现在去试试吧！** 🎉

有任何问题随时问我！ 😊
