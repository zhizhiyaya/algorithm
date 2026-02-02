# Claude Code 设置配置指南

## 设置文件位置

### 1. 全局用户设置
- **位置**: `~/.claude/settings.json`
- **作用**: 影响所有项目的默认行为
- **示例**: `example-global-settings.json`

### 2. 项目共享设置
- **位置**: `.claude/settings.json`
- **作用**: 团队共享的项目配置，会提交到版本控制
- **示例**: `example-project-settings.json`

### 3. 项目本地设置
- **位置**: `.claude/settings.local.json`
- **作用**: 个人偏好设置，不会提交到版本控制
- **示例**: `example-project-local-settings.json`

## 优先级顺序
1. 企业策略设置（最高优先级）
2. 命令行参数
3. 项目本地设置 (`.claude/settings.local.json`)
4. 项目共享设置 (`.claude/settings.json`)
5. 全局用户设置 (`~/.claude/settings.json`)

## 主要配置选项

### 环境变量 (`env`)
```json
{
  "env": {
    "NODE_ENV": "development",
    "DEBUG": "1",
    "PROJECT_NAME": "my-project",
    "HTTP_PROXY": "http://proxy.company.com:8080",
    "HTTPS_PROXY": "http://proxy.company.com:8080",
    "NO_PROXY": "localhost,127.0.0.1,.local"
  }
}
```

### 权限控制 (`permissions`)
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "Bash(git *)"],
    "deny": ["Bash(rm -rf *)", "Bash(curl *)"]
  }
}
```

### 钩子函数 (`hooks`)
```json
{
  "hooks": {
    "beforeBash": "echo 'Running: $CLAUDE_COMMAND'",
    "afterEdit": "npm run format",
    "beforeEdit": "npm run lint:check"
  }
}
```

### 其他选项
- `includeCoAuthoredBy`: 是否在提交中包含 "Co-authored by Claude"
- `cleanupPeriodDays`: 聊天记录保留天数
- `model`: 覆盖默认模型
- `apiKeyHelper`: 自定义认证脚本

## 使用建议

1. **全局设置**: 配置通用的安全权限和环境变量
2. **项目设置**: 配置项目特定的构建命令和工具链
3. **本地设置**: 配置个人偏好，如编辑器选择、调试选项等

## 代理配置

### 基本代理设置
在需要通过代理访问网络的环境中，可以配置以下环境变量：

```json
{
  "env": {
    "HTTP_PROXY": "http://proxy.company.com:8080",
    "HTTPS_PROXY": "http://proxy.company.com:8080",
    "NO_PROXY": "localhost,127.0.0.1,.local,.company.com"
  }
}
```

### NPM 代理配置
如果项目使用 npm，还需要配置 npm 专用代理设置：

```json
{
  "env": {
    "npm_config_proxy": "http://proxy.company.com:8080",
    "npm_config_https_proxy": "http://proxy.company.com:8080",
    "npm_config_registry": "https://registry.npmjs.org/"
  }
}
```

### 代理配置示例
参考 `example-proxy-settings.json` 获得完整的代理配置示例。

## 安全最佳实践

- 使用 `permissions.deny` 阻止危险命令
- 在项目设置中限制允许的命令范围
- 敏感信息使用环境变量而非硬编码
- 代理服务器地址建议使用环境变量引用，避免硬编码