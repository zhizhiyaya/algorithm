#!/bin/bash

# Claude Code 设置文件配置脚本

echo "Setting up Claude Code settings..."

# 创建全局设置目录
mkdir -p ~/.claude

# 复制全局设置文件
if [ ! -f ~/.claude/settings.json ]; then
    cp example-global-settings.json ~/.claude/settings.json
    echo "✓ Global settings created at ~/.claude/settings.json"
else
    echo "! Global settings already exists at ~/.claude/settings.json"
fi

# 创建项目设置目录
mkdir -p .claude

# 复制项目设置文件
if [ ! -f .claude/settings.json ]; then
    cp example-project-settings.json .claude/settings.json
    echo "✓ Project settings created at .claude/settings.json"
else
    echo "! Project settings already exists at .claude/settings.json"
fi

# 复制项目本地设置文件
if [ ! -f .claude/settings.local.json ]; then
    cp example-project-local-settings.json .claude/settings.local.json
    echo "✓ Project local settings created at .claude/settings.local.json"
else
    echo "! Project local settings already exists at .claude/settings.local.json"
fi

# 添加到 .gitignore
if [ ! -f .gitignore ]; then
    touch .gitignore
fi

if ! grep -q ".claude/settings.local.json" .gitignore; then
    echo ".claude/settings.local.json" >> .gitignore
    echo "✓ Added .claude/settings.local.json to .gitignore"
fi

echo "Claude Code settings setup complete!"
echo ""
echo "Available configuration files:"
echo "  - ~/.claude/settings.json (global settings)"
echo "  - .claude/settings.json (project shared settings)"
echo "  - .claude/settings.local.json (project local settings)"
echo "  - example-proxy-settings.json (proxy configuration example)"
echo ""
echo "For proxy configuration, edit the HTTP_PROXY and HTTPS_PROXY values in:"
echo "  - Global: ~/.claude/settings.json"
echo "  - Project: .claude/settings.json or .claude/settings.local.json"
echo ""
echo "Edit the settings files to customize your configuration."