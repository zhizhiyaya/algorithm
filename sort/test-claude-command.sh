#!/bin/bash

# 测试 Claude 命令是否在新终端中可用

echo "🧪 测试 Claude 命令可用性..."

# 模拟新终端环境
echo "🔄 模拟新终端环境..."
unset claude
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"

# 重新加载配置文件
echo "📝 重新加载配置文件..."
if [ -f "$HOME/.bash_profile" ]; then
    source "$HOME/.bash_profile"
    echo "✅ 已加载 .bash_profile"
fi

if [ -f "$HOME/.zshrc" ]; then
    source "$HOME/.zshrc"
    echo "✅ 已加载 .zshrc"
fi

# 测试 claude 命令
echo "🧪 测试 claude 命令..."
if command -v claude > /dev/null 2>&1; then
    echo "✅ 成功！Claude 命令可用"
    echo "📍 Claude 路径: $(which claude)"
    echo "📊 测试命令: claude --help"
    
    # 测试实际命令
    if claude --help > /dev/null 2>&1; then
        echo "✅ Claude 命令执行正常"
    else
        echo "⚠️  Claude 命令存在但执行有问题"
    fi
else
    echo "❌ 失败！Claude 命令不可用"
    echo "当前 PATH: $PATH"
fi

echo ""
echo "🎯 解决方案："
echo "1. 完全关闭所有终端窗口"
echo "2. 重新打开终端"
echo "3. 测试: claude --version"
echo "4. 如果还是不行，运行: source ~/.bash_profile"