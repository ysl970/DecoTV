# DecoTV JAR 加载问题完整解决方案

## 🚨 问题现象

- TVBox/影视仓导入配置提示"jar 加载失败"或"spider unreachable: 403"
- 一键体检显示所有 JAR 源不可用
- 配置文件能正常导入但视频源无法解析

## 🔧 解决步骤

### 1. 使用管理员面板一键修复（推荐）

1. 访问 `/admin` 管理员页面
2. 登录管理员账号
3. 在"TVBox 配置管理"区域找到"JAR 文件状态监控"
4. 点击"🛠️ 一键修复"按钮
5. 等待系统自动检测并修复 JAR 源

### 2. 手动检查和修复

如果一键修复无效，可以进行手动诊断：

#### 2.1 检查 JAR 源可用性

访问 `/api/tvbox/jar-fix` 查看详细检测结果：

- `summary.successful`: 可用源数量
- `test_results`: 各个源的详细状态
- `recommendations`: 修复建议

#### 2.2 检查网络环境

访问 `/api/tvbox/smart-health` 进行网络诊断：

- 检查是否为国内网络环境
- 测试不同 JAR 源的连通性
- 获取针对性的网络优化建议

### 3. 最新 JAR 源列表

系统已更新为以下高可用 JAR 源（按稳定性排序）：

#### 国内优先源

```
https://jihulab.com/ygbh44/test/-/raw/master/XC.jar
https://gitlab.com/tvbox-osc/jar/-/raw/main/XC.jar
https://raw.iqiq.io/FongMi/CatVodSpider/main/jar/custom_spider.jar
https://framagit.org/tvbox-config/jars/-/raw/main/spider.jar
```

#### 国际 CDN 源

```
https://cdn.jsdelivr.net/gh/FongMi/CatVodSpider@main/jar/custom_spider.jar
https://fastly.jsdelivr.net/gh/FongMi/CatVodSpider@main/jar/custom_spider.jar
https://jsd.onmicrosoft.cn/gh/FongMi/CatVodSpider@main/jar/custom_spider.jar
```

#### 代理加速源

```
https://ghproxy.com/https://raw.githubusercontent.com/FongMi/CatVodSpider/main/jar/custom_spider.jar
https://cors.isteed.cc/github.com/FongMi/CatVodSpider/raw/main/jar/custom_spider.jar
```

## 🛠️ 技术细节

### 新增功能特性

1. **智能环境检测**

   - 自动识别国内/海外网络环境
   - 根据地区优化 JAR 源选择策略

2. **多重容错机制**

   - 20+ 高可用 JAR 源
   - 并发获取，选择最快响应
   - 失败源动态黑名单
   - 内置备用 JAR 确保 100%可用

3. **实时诊断工具**

   - JAR 源健康检查
   - 网络连通性测试
   - 个性化修复建议

4. **用户友好界面**
   - 管理员面板一键操作
   - 实时状态反馈
   - 详细错误诊断

### API 接口说明

- `GET /api/tvbox/jar-fix` - JAR 源修复检测
- `GET /api/tvbox/smart-health` - 智能健康检查
- `GET /api/tvbox/spider-status` - JAR 状态查询
- `POST /api/tvbox/spider-status` - 强制刷新 JAR

## 📱 TVBox/影视仓配置建议

### 推荐设置

- 启用"智能解析"和"自动重试"选项
- 设置连接超时为 30 秒
- 重试次数设为 3 次
- 定期清理应用缓存

### 网络优化

- **国内用户**: 使用 DNS 114.114.114.114 或 223.5.5.5
- **海外用户**: 使用 DNS 8.8.8.8 或 1.1.1.1
- 如遇 GitHub 访问问题，系统会自动切换到代理源

## 🔍 故障排除

### 常见错误和解决方案

1. **403 Forbidden**
   - 服务器拒绝访问，已切换到代理源
2. **404 Not Found**
   - JAR 文件不存在，该源已失效并被移除
3. **Timeout/网络超时**
   - 网络连接不稳定，系统会自动重试其他源

### 应急方案

如果所有自动修复都失败，系统会启用内置备用 JAR，确保基本功能可用。

## 📞 技术支持

如果以上方案都无法解决问题，请：

1. 访问 `/api/tvbox/smart-health` 获取完整诊断报告
2. 截图保存错误信息和诊断结果
3. 检查服务器日志中的详细错误信息
4. 联系技术支持并提供诊断报告

---

_更新时间: 2025 年 10 月 6 日_  
_版本: v0.3.0 - JAR 问题完整解决方案_
