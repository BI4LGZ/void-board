#!/bin/bash

# 模式选择（默认开发模式）
MODE=${1:-development}

# 激活虚拟环境
source venv/bin/activate

case $MODE in
    prod)
        echo "🚀 启动生产服务器..."
        gunicorn --bind 0.0.0.0:5001 --workers 4 admin_app:app
        ;;
    dev)
        echo "🔧 启动开发服务器..."
        python admin_app.py
        ;;
    *)
        echo "用法: ./run.sh [production|development]"
        exit 1
        ;;
esac