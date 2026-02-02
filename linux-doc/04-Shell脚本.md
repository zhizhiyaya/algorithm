# Shell 脚本编程

## 目录
- [Shell脚本基础](#shell脚本基础)
- [变量和数据类型](#变量和数据类型)
- [流程控制](#流程控制)
- [函数](#函数)
- [数组](#数组)
- [字符串处理](#字符串处理)
- [文件操作](#文件操作)
- [实用脚本示例](#实用脚本示例)

---

## Shell脚本基础

### 1. 第一个Shell脚本

```bash
#!/bin/bash
# hello.sh - 我的第一个Shell脚本

echo "Hello, World!"
echo "当前用户: $USER"
echo "当前目录: $PWD"
echo "主目录: $HOME"
```

```bash
# 使脚本可执行
chmod +x hello.sh

# 运行脚本
./hello.sh
```

输出：
```
Hello, World!
当前用户: john
当前目录: /home/john/scripts
主目录: /home/john
```

### 2. Shebang 说明

```bash
#!/bin/bash              # 使用bash解释器
#!/bin/sh                # 使用sh解释器
#!/usr/bin/env bash      # 推荐方式，自动查找bash路径
#!/usr/bin/env python3   # Python脚本
```

### 3. 注释

```bash
# 这是单行注释

: '
这是多行注释
可以写多行
'

: <<'COMMENT'
这也是多行注释的方式
COMMENT
```

### 4. 脚本执行方式

```bash
# 方式1：直接执行（需要执行权限）
./script.sh

# 方式2：使用bash执行（不需要执行权限）
bash script.sh

# 方式3：使用source或.执行（在当前shell中执行）
source script.sh
. script.sh
```

---

## 变量和数据类型

### 1. 变量定义和使用

```bash
#!/bin/bash
# variables.sh

# 定义变量（注意：等号两边不能有空格）
name="John Doe"
age=30
city="New York"

# 使用变量
echo "Name: $name"
echo "Age: $age"
echo "City: ${city}"        # 推荐使用花括号

# 只读变量
readonly PI=3.14159
# PI=3.14                   # 错误：只读变量不能修改

# 删除变量
unset age
echo "Age after unset: $age"  # 输出空
```

### 2. 特殊变量

```bash
#!/bin/bash
# special-vars.sh

echo "脚本名称: $0"
echo "第1个参数: $1"
echo "第2个参数: $2"
echo "所有参数: $@"
echo "参数个数: $#"
echo "上一个命令的退出状态: $?"
echo "当前Shell的PID: $$"
echo "最后一个后台进程的PID: $!"
```

运行示例：
```bash
$ ./special-vars.sh arg1 arg2 arg3
脚本名称: ./special-vars.sh
第1个参数: arg1
第2个参数: arg2
所有参数: arg1 arg2 arg3
参数个数: 3
上一个命令的退出状态: 0
当前Shell的PID: 12345
```

### 3. 命令替换

```bash
#!/bin/bash

# 方式1：反引号（不推荐）
current_date=`date`
echo "当前日期: $current_date"

# 方式2：$() 语法（推荐）
current_date=$(date)
echo "当前日期: $current_date"

# 获取系统信息
kernel_version=$(uname -r)
hostname=$(hostname)
user_count=$(who | wc -l)

echo "内核版本: $kernel_version"
echo "主机名: $hostname"
echo "登录用户数: $user_count"

# 嵌套命令替换
home_size=$(du -sh $(echo $HOME) | awk '{print $1}')
echo "主目录大小: $home_size"
```

### 4. 算术运算

```bash
#!/bin/bash
# arithmetic.sh

# 方式1：使用 $(())
num1=10
num2=5

sum=$((num1 + num2))
diff=$((num1 - num2))
product=$((num1 * num2))
quotient=$((num1 / num2))
remainder=$((num1 % num2))

echo "加: $sum"
echo "减: $diff"
echo "乘: $product"
echo "除: $quotient"
echo "余: $remainder"

# 自增自减
counter=0
((counter++))
echo "counter: $counter"  # 1

((counter += 5))
echo "counter: $counter"  # 6

# 方式2：使用 expr
result=$(expr 10 + 5)
echo "10 + 5 = $result"

# 方式3：使用 bc（支持浮点数）
result=$(echo "scale=2; 10 / 3" | bc)
echo "10 / 3 = $result"  # 3.33
```

### 5. 环境变量

```bash
#!/bin/bash

# 查看环境变量
echo "PATH: $PATH"
echo "HOME: $HOME"
echo "USER: $USER"
echo "SHELL: $SHELL"

# 设置环境变量
export MY_VAR="Hello"

# 在子进程中可以访问
bash -c 'echo "MY_VAR in subshell: $MY_VAR"'

# 临时修改PATH
export PATH="/usr/local/bin:$PATH"
```

---

## 流程控制

### 1. if条件判断

```bash
#!/bin/bash
# if-example.sh

age=18

# 基本if
if [ $age -ge 18 ]; then
    echo "成年人"
fi

# if-else
if [ $age -ge 18 ]; then
    echo "成年人"
else
    echo "未成年人"
fi

# if-elif-else
score=85

if [ $score -ge 90 ]; then
    echo "优秀"
elif [ $score -ge 80 ]; then
    echo "良好"
elif [ $score -ge 60 ]; then
    echo "及格"
else
    echo "不及格"
fi

# 多条件判断
username="admin"
password="123456"

if [ "$username" = "admin" ] && [ "$password" = "123456" ]; then
    echo "登录成功"
else
    echo "登录失败"
fi

# 或条件
day="Saturday"

if [ "$day" = "Saturday" ] || [ "$day" = "Sunday" ]; then
    echo "周末"
else
    echo "工作日"
fi
```

### 2. test命令和条件表达式

```bash
#!/bin/bash
# test-operators.sh

# 数值比较
# -eq: 等于
# -ne: 不等于
# -gt: 大于
# -ge: 大于等于
# -lt: 小于
# -le: 小于等于

num1=10
num2=20

if [ $num1 -lt $num2 ]; then
    echo "$num1 小于 $num2"
fi

# 字符串比较
# =: 等于
# !=: 不等于
# -z: 字符串为空
# -n: 字符串不为空

str1="hello"
str2="world"

if [ "$str1" != "$str2" ]; then
    echo "字符串不相等"
fi

if [ -n "$str1" ]; then
    echo "str1 不为空"
fi

# 文件测试
# -e: 文件存在
# -f: 是普通文件
# -d: 是目录
# -r: 可读
# -w: 可写
# -x: 可执行
# -s: 文件大小大于0

file="/etc/passwd"

if [ -f "$file" ]; then
    echo "$file 是一个文件"
fi

if [ -r "$file" ]; then
    echo "$file 可读"
fi

dir="/home"

if [ -d "$dir" ]; then
    echo "$dir 是一个目录"
fi

# [[ ]] 增强测试（推荐）
# 支持正则表达式和模式匹配

string="hello123"

if [[ $string =~ ^[a-z]+[0-9]+$ ]]; then
    echo "匹配模式：字母+数字"
fi

if [[ $string == hello* ]]; then
    echo "以hello开头"
fi
```

### 3. case语句

```bash
#!/bin/bash
# case-example.sh

echo "请选择操作："
echo "1. 启动服务"
echo "2. 停止服务"
echo "3. 重启服务"
echo "4. 查看状态"
read -p "输入选项 [1-4]: " choice

case $choice in
    1)
        echo "启动服务..."
        # systemctl start myservice
        ;;
    2)
        echo "停止服务..."
        # systemctl stop myservice
        ;;
    3)
        echo "重启服务..."
        # systemctl restart myservice
        ;;
    4)
        echo "查看状态..."
        # systemctl status myservice
        ;;
    *)
        echo "无效选项"
        exit 1
        ;;
esac

# 多模式匹配
read -p "输入文件名: " filename

case $filename in
    *.txt)
        echo "文本文件"
        ;;
    *.jpg|*.png|*.gif)
        echo "图片文件"
        ;;
    *.sh)
        echo "Shell脚本"
        ;;
    *)
        echo "未知文件类型"
        ;;
esac
```

### 4. for循环

```bash
#!/bin/bash
# for-loop.sh

# 方式1：遍历列表
echo "=== 遍历列表 ==="
for fruit in apple banana orange grape; do
    echo "水果: $fruit"
done

# 方式2：遍历数字范围
echo -e "\n=== 数字范围 ==="
for i in {1..5}; do
    echo "数字: $i"
done

# 方式3：C风格for循环
echo -e "\n=== C风格循环 ==="
for ((i=1; i<=5; i++)); do
    echo "计数: $i"
done

# 方式4：遍历数组
echo -e "\n=== 遍历数组 ==="
colors=("red" "green" "blue" "yellow")
for color in "${colors[@]}"; do
    echo "颜色: $color"
done

# 方式5：遍历文件
echo -e "\n=== 遍历文件 ==="
for file in /etc/*.conf; do
    if [ -f "$file" ]; then
        echo "配置文件: $(basename $file)"
    fi
done

# 方式6：遍历命令输出
echo -e "\n=== 遍历命令输出 ==="
for user in $(cat /etc/passwd | cut -d: -f1 | head -5); do
    echo "用户: $user"
done

# 带步长的循环
echo -e "\n=== 步长为2 ==="
for i in {0..10..2}; do
    echo "数字: $i"
done
```

### 5. while循环

```bash
#!/bin/bash
# while-loop.sh

# 基本while循环
echo "=== 基本while循环 ==="
counter=1
while [ $counter -le 5 ]; do
    echo "计数: $counter"
    ((counter++))
done

# 读取文件行
echo -e "\n=== 读取文件 ==="
while IFS= read -r line; do
    echo "行内容: $line"
done < /etc/hostname

# 无限循环
echo -e "\n=== 监控循环（按Ctrl+C退出） ==="
count=0
while true; do
    echo "运行中... $count"
    ((count++))
    sleep 1

    # 设置退出条件
    if [ $count -ge 5 ]; then
        echo "达到限制，退出"
        break
    fi
done

# 使用continue跳过
echo -e "\n=== 使用continue ==="
num=0
while [ $num -lt 10 ]; do
    ((num++))

    # 跳过偶数
    if [ $((num % 2)) -eq 0 ]; then
        continue
    fi

    echo "奇数: $num"
done
```

### 6. until循环

```bash
#!/bin/bash
# until-loop.sh

# until循环（条件为假时执行）
counter=1
until [ $counter -gt 5 ]; do
    echo "计数: $counter"
    ((counter++))
done

# 等待服务启动
echo "等待服务启动..."
until systemctl is-active --quiet nginx; do
    echo "服务未启动，等待中..."
    sleep 2
done
echo "服务已启动！"
```

---

## 函数

### 1. 函数定义和调用

```bash
#!/bin/bash
# functions.sh

# 方式1：定义函数
function greet() {
    echo "Hello, $1!"
}

# 方式2：定义函数（更常用）
say_goodbye() {
    echo "Goodbye, $1!"
}

# 调用函数
greet "John"
say_goodbye "Alice"

# 带返回值的函数
add_numbers() {
    local num1=$1
    local num2=$2
    local sum=$((num1 + num2))
    echo $sum        # 通过echo返回值
}

result=$(add_numbers 10 20)
echo "10 + 20 = $result"

# 使用return返回状态码（0-255）
is_positive() {
    if [ $1 -gt 0 ]; then
        return 0    # 成功
    else
        return 1    # 失败
    fi
}

if is_positive 5; then
    echo "5是正数"
fi

if ! is_positive -3; then
    echo "-3不是正数"
fi
```

### 2. 局部变量和全局变量

```bash
#!/bin/bash

# 全局变量
global_var="I am global"

my_function() {
    # 局部变量（使用local）
    local local_var="I am local"

    echo "函数内部："
    echo "  全局变量: $global_var"
    echo "  局部变量: $local_var"

    # 修改全局变量
    global_var="Modified in function"
}

echo "函数调用前："
echo "  全局变量: $global_var"

my_function

echo "函数调用后："
echo "  全局变量: $global_var"
echo "  局部变量: $local_var"  # 输出空，局部变量在函数外不可见
```

### 3. 函数参数

```bash
#!/bin/bash
# function-params.sh

print_params() {
    echo "函数名: $0"
    echo "参数个数: $#"
    echo "所有参数: $@"
    echo "所有参数: $*"

    echo "参数列表："
    for arg in "$@"; do
        echo "  - $arg"
    done
}

print_params one two three "four five"

# 参数默认值
greet_user() {
    local name=${1:-"Guest"}    # 如果$1为空，使用"Guest"
    local greeting=${2:-"Hello"}
    echo "$greeting, $name!"
}

greet_user                      # Hello, Guest!
greet_user "John"               # Hello, John!
greet_user "Alice" "Hi"         # Hi, Alice!
```

### 4. 实用函数示例

```bash
#!/bin/bash
# utility-functions.sh

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 打印彩色输出
print_success() {
    echo -e "\033[0;32m[SUCCESS]\033[0m $1"
}

print_error() {
    echo -e "\033[0;31m[ERROR]\033[0m $1" >&2
}

print_info() {
    echo -e "\033[0;34m[INFO]\033[0m $1"
}

print_warning() {
    echo -e "\033[0;33m[WARNING]\033[0m $1"
}

# 确认提示
confirm() {
    read -p "$1 [y/N]: " response
    case $response in
        [yY][eE][sS]|[yY])
            return 0
            ;;
        *)
            return 1
            ;;
    esac
}

# 使用示例
if command_exists docker; then
    print_success "Docker已安装"
else
    print_error "Docker未安装"
fi

print_info "开始执行任务..."
print_warning "请谨慎操作！"

if confirm "确定要继续吗？"; then
    print_success "用户确认继续"
else
    print_info "用户取消操作"
    exit 0
fi
```

---

## 数组

### 1. 数组基础

```bash
#!/bin/bash
# arrays.sh

# 定义数组
fruits=("apple" "banana" "orange" "grape")

# 访问元素
echo "第一个元素: ${fruits[0]}"
echo "第二个元素: ${fruits[1]}"

# 所有元素
echo "所有元素: ${fruits[@]}"
echo "所有元素: ${fruits[*]}"

# 数组长度
echo "数组长度: ${#fruits[@]}"

# 某个元素的长度
echo "第一个元素长度: ${#fruits[0]}"

# 添加元素
fruits+=("mango")
echo "添加后: ${fruits[@]}"

# 修改元素
fruits[1]="strawberry"
echo "修改后: ${fruits[@]}"

# 删除元素
unset fruits[2]
echo "删除后: ${fruits[@]}"

# 数组切片
numbers=(1 2 3 4 5 6 7 8 9 10)
echo "原数组: ${numbers[@]}"
echo "切片[2:5]: ${numbers[@]:2:3}"  # 从索引2开始，取3个元素
```

### 2. 遍历数组

```bash
#!/bin/bash

colors=("red" "green" "blue" "yellow")

# 方式1：遍历值
echo "=== 遍历值 ==="
for color in "${colors[@]}"; do
    echo "颜色: $color"
done

# 方式2：遍历索引
echo -e "\n=== 遍历索引 ==="
for i in "${!colors[@]}"; do
    echo "索引$i: ${colors[$i]}"
done

# 方式3：while循环
echo -e "\n=== while循环 ==="
i=0
while [ $i -lt ${#colors[@]} ]; do
    echo "颜色$i: ${colors[$i]}"
    ((i++))
done
```

### 3. 关联数组（字典）

```bash
#!/bin/bash
# associative-array.sh

# 声明关联数组
declare -A person

# 赋值
person[name]="John Doe"
person[age]=30
person[city]="New York"
person[job]="Developer"

# 访问
echo "姓名: ${person[name]}"
echo "年龄: ${person[age]}"
echo "城市: ${person[city]}"

# 所有键
echo "所有键: ${!person[@]}"

# 所有值
echo "所有值: ${person[@]}"

# 遍历
echo -e "\n=== 遍历关联数组 ==="
for key in "${!person[@]}"; do
    echo "$key: ${person[$key]}"
done

# 检查键是否存在
if [[ -v person[name] ]]; then
    echo "name键存在"
fi
```

---

## 字符串处理

### 1. 字符串操作

```bash
#!/bin/bash
# string-operations.sh

str="Hello, World!"

# 字符串长度
echo "长度: ${#str}"

# 子字符串提取
echo "子串[0:5]: ${str:0:5}"      # Hello
echo "子串[7:]: ${str:7}"         # World!

# 字符串替换
echo "替换第一个: ${str/o/O}"     # HellO, World!
echo "替换所有: ${str//o/O}"      # HellO, WOrld!

# 删除前缀/后缀
filename="document.txt.bak"
echo "删除最短后缀: ${filename%.*}"      # document.txt
echo "删除最长后缀: ${filename%%.*}"     # document
echo "删除最短前缀: ${filename#*.}"      # txt.bak
echo "删除最长前缀: ${filename##*.}"     # bak

# 大小写转换
text="Hello World"
echo "转大写: ${text^^}"          # HELLO WORLD
echo "转小写: ${text,,}"          # hello world
echo "首字母大写: ${text^}"       # Hello World

# 字符串连接
first_name="John"
last_name="Doe"
full_name="$first_name $last_name"
echo "全名: $full_name"

# 分割字符串
IFS=',' read -ra parts <<< "apple,banana,orange"
for part in "${parts[@]}"; do
    echo "部分: $part"
done
```

### 2. 字符串检查

```bash
#!/bin/bash

str="Hello World"

# 检查是否包含子串
if [[ $str == *"World"* ]]; then
    echo "包含World"
fi

# 检查开头
if [[ $str == Hello* ]]; then
    echo "以Hello开头"
fi

# 检查结尾
if [[ $str == *World ]]; then
    echo "以World结尾"
fi

# 字符串比较
str1="abc"
str2="abc"

if [ "$str1" = "$str2" ]; then
    echo "字符串相等"
fi

# 正则表达式匹配
email="user@example.com"
if [[ $email =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
    echo "有效的邮箱地址"
fi
```

---

## 文件操作

### 1. 读取文件

```bash
#!/bin/bash
# read-file.sh

file="/etc/os-release"

# 方式1：逐行读取
echo "=== 方式1：while循环 ==="
while IFS= read -r line; do
    echo "$line"
done < "$file"

# 方式2：将文件读入数组
echo -e "\n=== 方式2：读入数组 ==="
mapfile -t lines < "$file"
for line in "${lines[@]}"; do
    echo "$line"
done

# 方式3：cat命令
echo -e "\n=== 方式3：cat命令 ==="
content=$(cat "$file")
echo "$content"

# 处理CSV文件
echo -e "\n=== 处理CSV ==="
cat > data.csv << EOF
Name,Age,City
John,30,New York
Alice,25,Los Angeles
Bob,35,Chicago
EOF

while IFS=',' read -r name age city; do
    echo "姓名:$name, 年龄:$age, 城市:$city"
done < data.csv
```

### 2. 写入文件

```bash
#!/bin/bash
# write-file.sh

output_file="output.txt"

# 覆盖写入
echo "第一行" > "$output_file"

# 追加写入
echo "第二行" >> "$output_file"
echo "第三行" >> "$output_file"

# 多行写入
cat > "$output_file" << EOF
这是第一行
这是第二行
这是第三行
EOF

# 使用tee命令（同时输出到屏幕和文件）
echo "同时输出" | tee -a "$output_file"

# 写入带变量的内容
name="John"
age=30
cat > user.txt << EOF
用户信息:
姓名: $name
年龄: $age
日期: $(date)
EOF
```

### 3. 文件测试

```bash
#!/bin/bash
# file-tests.sh

file="/etc/passwd"

# 检查文件是否存在
if [ -e "$file" ]; then
    echo "$file 存在"
fi

# 检查是否是普通文件
if [ -f "$file" ]; then
    echo "$file 是普通文件"
fi

# 检查是否是目录
if [ -d "/home" ]; then
    echo "/home 是目录"
fi

# 检查文件权限
if [ -r "$file" ]; then
    echo "$file 可读"
fi

if [ -w "$file" ]; then
    echo "$file 可写"
fi

if [ -x "/bin/bash" ]; then
    echo "/bin/bash 可执行"
fi

# 检查文件是否非空
if [ -s "$file" ]; then
    echo "$file 非空"
fi

# 比较文件时间
file1="file1.txt"
file2="file2.txt"

touch "$file1"
sleep 1
touch "$file2"

if [ "$file1" -ot "$file2" ]; then
    echo "$file1 比 $file2 旧"
fi
```

---

## 实用脚本示例

### 1. 系统备份脚本

```bash
#!/bin/bash
# backup.sh - 系统备份脚本

# 配置
BACKUP_SOURCE="/var/www"
BACKUP_DEST="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="backup_${DATE}.tar.gz"
LOG_FILE="/var/log/backup.log"
RETENTION_DAYS=7

# 日志函数
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# 检查备份目录
if [ ! -d "$BACKUP_DEST" ]; then
    log "创建备份目录: $BACKUP_DEST"
    mkdir -p "$BACKUP_DEST"
fi

# 开始备份
log "开始备份: $BACKUP_SOURCE"
tar -czf "$BACKUP_DEST/$BACKUP_NAME" "$BACKUP_SOURCE" 2>&1 | tee -a "$LOG_FILE"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    log "备份成功: $BACKUP_NAME"

    # 计算备份大小
    size=$(du -h "$BACKUP_DEST/$BACKUP_NAME" | cut -f1)
    log "备份大小: $size"
else
    log "错误: 备份失败"
    exit 1
fi

# 删除旧备份
log "清理 $RETENTION_DAYS 天前的备份"
find "$BACKUP_DEST" -name "backup_*.tar.gz" -mtime +$RETENTION_DAYS -delete

log "备份完成"
```

### 2. 服务监控脚本

```bash
#!/bin/bash
# monitor-service.sh - 服务监控和自动重启

SERVICES=("nginx" "mysql" "redis")
LOG_FILE="/var/log/service-monitor.log"
EMAIL="admin@example.com"

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

send_alert() {
    local service=$1
    local status=$2
    echo "服务: $service, 状态: $status" | mail -s "服务告警" "$EMAIL"
}

check_service() {
    local service=$1

    if systemctl is-active --quiet "$service"; then
        log "✓ $service 运行正常"
        return 0
    else
        log "✗ $service 已停止，尝试重启..."

        systemctl start "$service"
        sleep 2

        if systemctl is-active --quiet "$service"; then
            log "✓ $service 重启成功"
            send_alert "$service" "已重启"
            return 0
        else
            log "✗ $service 重启失败"
            send_alert "$service" "重启失败"
            return 1
        fi
    fi
}

log "========== 开始服务检查 =========="

for service in "${SERVICES[@]}"; do
    check_service "$service"
done

log "========== 检查完成 ==========\n"
```

### 3. 日志分析脚本

```bash
#!/bin/bash
# analyze-logs.sh - 分析Nginx访问日志

LOG_FILE="/var/log/nginx/access.log"
REPORT_FILE="log_report_$(date +%Y%m%d).txt"

{
    echo "========================================="
    echo "Nginx日志分析报告"
    echo "生成时间: $(date)"
    echo "========================================="
    echo

    echo "1. 总请求数"
    total_requests=$(wc -l < "$LOG_FILE")
    echo "   总计: $total_requests"
    echo

    echo "2. 访问最多的IP (Top 10)"
    awk '{print $1}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
    echo

    echo "3. 访问最多的URL (Top 10)"
    awk '{print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
    echo

    echo "4. HTTP状态码统计"
    awk '{print $9}' "$LOG_FILE" | sort | uniq -c | sort -rn
    echo

    echo "5. 请求方法统计"
    awk '{print $6}' "$LOG_FILE" | sed 's/"//g' | sort | uniq -c
    echo

    echo "6. 每小时请求分布"
    awk '{print $4}' "$LOG_FILE" | cut -d: -f2 | sort | uniq -c
    echo

    echo "7. 404错误的URL"
    awk '$9==404 {print $7}' "$LOG_FILE" | sort | uniq -c | sort -rn | head -10
    echo

    echo "8. 响应时间最慢的请求 (Top 10)"
    awk '{print $NF, $7}' "$LOG_FILE" | sort -rn | head -10
    echo

} > "$REPORT_FILE"

echo "报告已生成: $REPORT_FILE"
cat "$REPORT_FILE"
```

### 4. 批量处理脚本

```bash
#!/bin/bash
# batch-resize-images.sh - 批量调整图片大小

SOURCE_DIR="./images"
OUTPUT_DIR="./resized"
WIDTH=800
QUALITY=85

# 检查ImageMagick
if ! command -v convert &> /dev/null; then
    echo "错误: 需要安装ImageMagick"
    echo "Ubuntu: sudo apt install imagemagick"
    echo "CentOS: sudo yum install ImageMagick"
    exit 1
fi

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 处理图片
count=0
total=$(find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" \) | wc -l)

echo "找到 $total 个图片文件"
echo "开始处理..."

find "$SOURCE_DIR" -type f \( -iname "*.jpg" -o -iname "*.png" \) | while read -r file; do
    filename=$(basename "$file")
    output="$OUTPUT_DIR/$filename"

    ((count++))
    echo -n "[$count/$total] 处理: $filename ... "

    convert "$file" -resize "${WIDTH}x" -quality "$QUALITY" "$output"

    if [ $? -eq 0 ]; then
        original_size=$(du -h "$file" | cut -f1)
        new_size=$(du -h "$output" | cut -f1)
        echo "完成 ($original_size -> $new_size)"
    else
        echo "失败"
    fi
done

echo "全部完成！"
```

### 5. 系统信息收集脚本

```bash
#!/bin/bash
# system-info.sh - 收集系统信息

OUTPUT_FILE="system_info_$(date +%Y%m%d_%H%M%S).txt"

{
    echo "========================================="
    echo "系统信息报告"
    echo "生成时间: $(date)"
    echo "========================================="
    echo

    echo "1. 系统基本信息"
    echo "   主机名: $(hostname)"
    echo "   内核版本: $(uname -r)"
    echo "   操作系统: $(cat /etc/os-release | grep PRETTY_NAME | cut -d'"' -f2)"
    echo "   系统架构: $(uname -m)"
    echo "   运行时间: $(uptime -p)"
    echo

    echo "2. CPU信息"
    echo "   型号: $(grep "model name" /proc/cpuinfo | head -1 | cut -d: -f2 | xargs)"
    echo "   核心数: $(nproc)"
    echo "   负载: $(uptime | awk -F'load average:' '{print $2}')"
    echo

    echo "3. 内存信息"
    free -h
    echo

    echo "4. 磁盘使用情况"
    df -h
    echo

    echo "5. 网络接口"
    ip -br addr
    echo

    echo "6. 监听端口"
    ss -tuln
    echo

    echo "7. 系统进程 (Top 10)"
    ps aux --sort=-%mem | head -11
    echo

    echo "8. 最近登录用户"
    last -n 10
    echo

    echo "9. 系统服务状态"
    systemctl list-units --type=service --state=running | head -20
    echo

} > "$OUTPUT_FILE"

echo "系统信息已保存到: $OUTPUT_FILE"
cat "$OUTPUT_FILE"
```

---

## 调试技巧

### 1. 调试模式

```bash
#!/bin/bash

# 开启调试模式
set -x                  # 显示执行的命令
set -e                  # 遇到错误立即退出
set -u                  # 使用未定义变量时报错
set -o pipefail         # 管道命令失败时返回失败

# 或者组合使用
set -euxo pipefail

# 示例
echo "开始执行"
result=$(ls /nonexistent 2>&1)  # 会触发set -e
echo "不会执行到这里"
```

### 2. 错误处理

```bash
#!/bin/bash
# error-handling.sh

# 方式1：检查退出状态
command_that_might_fail
if [ $? -ne 0 ]; then
    echo "命令失败"
    exit 1
fi

# 方式2：使用||
command_that_might_fail || {
    echo "命令失败"
    exit 1
}

# 方式3：trap错误
trap 'echo "错误发生在第 $LINENO 行"' ERR

# 方式4：自定义错误处理函数
error_exit() {
    echo "错误: $1" >&2
    exit 1
}

[ -f "/etc/passwd" ] || error_exit "文件不存在"
```

---

## 最佳实践

1. **始终使用 `#!/bin/bash` shebang**
2. **使用 `set -e` 和 `set -u`**
3. **引用所有变量：`"$var"` 而不是 `$var`**
4. **使用 `[[ ]]` 而不是 `[ ]`**
5. **函数内使用 `local` 声明变量**
6. **检查命令是否存在：`command -v cmd`**
7. **使用有意义的变量名**
8. **添加注释说明复杂逻辑**
9. **处理错误和边界情况**
10. **使用 shellcheck 检查脚本**

```bash
# 安装shellcheck
sudo apt install shellcheck  # Ubuntu
sudo yum install shellcheck  # CentOS

# 检查脚本
shellcheck script.sh
```

---

## 下一步

返回主页：[README.md](./README.md)

系统管理：[03-系统管理.md](./03-系统管理.md)
