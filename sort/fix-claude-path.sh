#!/bin/bash

# Claude Code PATH 修复脚本

echo "🔧 正在修复 Claude Code 命令路径问题..."

# 检查 claude 命令是否存在
if command -v claude > /dev/null 2>&1; then
    CLAUDE_PATH=$(which claude)
    echo "✅ 找到 claude 命令: $CLAUDE_PATH"
else
    echo "❌ 未找到 claude 命令，请确保 Claude Code 已正确安装"
    exit 1
fi

# 获取 claude 所在目录
CLAUDE_DIR=$(dirname "$CLAUDE_PATH")
echo "📁 Claude 目录: $CLAUDE_DIR"

# 检查当前 shell
CURRENT_SHELL=$(basename "$SHELL")
echo "🐚 当前 shell: $CURRENT_SHELL"

# 根据 shell 类型设置配置文件
if [ "$CURRENT_SHELL" = "zsh" ]; then
    PROFILE_FILE="$HOME/.zshrc"
    echo "📝 使用 zsh 配置文件: $PROFILE_FILE"
elif [ "$CURRENT_SHELL" = "bash" ]; then
    PROFILE_FILE="$HOME/.bash_profile"
    echo "📝 使用 bash 配置文件: $PROFILE_FILE"
else
    echo "⚠️  未知的 shell: $CURRENT_SHELL"
    PROFILE_FILE="$HOME/.profile"
    echo "📝 使用通用配置文件: $PROFILE_FILE"
fi

# 检查 PATH 是否已包含 claude 目录
if echo "$PATH" | grep -q "$CLAUDE_DIR"; then
    echo "✅ PATH 中已包含 Claude 目录"
else
    echo "❌ PATH 中不包含 Claude 目录"
fi

# 检查配置文件是否已包含 PATH 设置
PATH_EXPORT="export PATH=\"$CLAUDE_DIR:\$PATH\""
if [ -f "$PROFILE_FILE" ] && grep -q "$CLAUDE_DIR" "$PROFILE_FILE"; then
    echo "✅ 配置文件中已包含 Claude 路径"
else
    echo "📝 正在添加 Claude 路径到配置文件..."
    echo "" >> "$PROFILE_FILE"
    echo "# Claude Code PATH" >> "$PROFILE_FILE"
    echo "$PATH_EXPORT" >> "$PROFILE_FILE"
    echo "✅ 已添加到 $PROFILE_FILE"
fi

# 立即生效配置
echo "🔄 正在重新加载配置文件..."
source "$PROFILE_FILE"

# 验证修复结果
echo "🧪 验证修复结果..."
if command -v claude > /dev/null 2>&1; then
    echo "✅ Claude 命令现在可用"
    echo "📍 Claude 路径: $(which claude)"
    echo "📊 Claude 版本: $(claude --version 2>/dev/null || echo '版本信息获取失败')"
else
    echo "❌ Claude 命令仍然不可用"
fi

echo ""
echo "🎉 修复完成！"
echo "💡 如果在新终端窗口中仍然无法使用 claude 命令，请："
echo "   1. 完全关闭所有终端窗口"
echo "   2. 重新打开终端"
echo "   3. 或者运行: source $PROFILE_FILE"
echo ""
echo "🔗 配置文件位置: $PROFILE_FILE"
echo "📋 添加的配置: $PATH_EXPORT"