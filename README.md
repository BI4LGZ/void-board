# 🎨 虚空白板 | Void Board

![License](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.8%2B-green)
![Flask](https://img.shields.io/badge/Flask-2.0%2B-orange)

> 现代化教学辅助工具套件｜智能课表 × 电子画板 × 课堂工具｜专为教育场景设计的全功能解决方案

---

## 🌟 全新功能矩阵

### 🖥️ 核心功能

| 模块        | 特性描述                             |
| ----------- | ------------------------------------ |
| 📅 智能课表 | 动态响应式课表，自动高亮当日课程     |
| 🎨 电子画板 | 多指触控支持，三色切换，自动画布适配 |
| 🎲 随机点名 | 公平轮询算法，名单自动洗牌           |
| ⏱️ 计时器   | 支持快捷时间预设                     |

### 🛠️ 管理后台

| 功能        | 描述                           |
| ----------- | ------------------------------ |
| 📝 数据管理 | 可视化编辑课程表/名单/按钮配置 |
| ⚙️ 实时生效 | 配置修改无需重启服务           |

---

## 🏗️ 项目架构

```bash
├── admin/
│   ├── templates/
│   ├── static/
│   ├── admin_app.py
│   ├── config.py
│   └── requirements.txt
├── statics/
│   ├── data/
│   ├── css/
│   ├── js/
│   └── assets/
├── index.html
├── draw.html
├── name.html
├── README.MD
├── .gitignore
└── LICENCE
```

---

## 🚀 部署指南

### 0️⃣ 前期准备

```bash
# 安装系统依赖（Ubuntu/Debian）
sudo apt update && sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    git \
    nginx
```

### 1️⃣ 克隆代码仓库

```bash
git clone https://github.com/BI4LGZ/void-board.git
cd void-board
```

### 2️⃣ 配置管理后台

```bash
# 进入管理后台目录
cd admin

# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
source venv/bin/activate

# 安装Python依赖
python3 -m pip install -r requirements.txt

# 修改管理员凭证（重要！）
vi config.py

# 配置静态文件目录
vi admin_app.py
```

```python
# 修改以下关键配置项
SECRET_KEY = os.getenv(
    "SECRET_KEY", "your-secret-key-here"
)  # 更换随机的长密钥
ADMIN_USERNAME = os.getenv(
    "ADMIN_USERNAME", "admin"
)  # 更换用户名
ADMIN_PASSWORD = os.getenv(
    "ADMIN_PASSWORD", "admin123"
)  # 更换强密码
```

```python
app.wsgi_app = WhiteNoise(app.wsgi_app, root="YOUR_STATIC_DIR")  # 替换为静态文件目录
```

### 3️⃣ 运行后端

```bash
cd admin
```

```bash
# 以开发模式运行
run.sh dev
```

```bash
# 以生产模式运行
run.sh prod
```

### 4️⃣ 配置前端（Nginx 反向代理）

```bash
sudo vi /etc/nginx/nginx.conf
```

```nginx
server {
  listen 端口号;
  server_name IP或域名;
  root 静态文件目录;

  error_page 404 500 502 503 504 /error;

  location / {
    index index.html;
  }

  location /name/ {
    try_files $uri /name.html;
  }

  location /draw/ {
    try_files $uri /draw.html;
  }

  location /error/ {
    try_files $uri /error.html;
  }

  location /statics/ {
    alias 静态文件目录/statics/;
  }
}
```

```bash
# 测试配置并重启nginx服务
sudo nginx -t && sudo systemctl restart nginx
```

---

> 💡 提示：首次部署完成后，请立即通过`config.py`中相应字段修改凭证和`secret_key`。

---

## 🔐 管理后台使用

### 首次访问

1. 通过 `http(s)://your-domain-or-ip:5001` 访问后台
2. 使用默认凭证(或你修改后的凭证)登录：
   - 用户名: `admin`
   - 密码: `admin123`
3. **立即修改默认密码！**

### 功能导航

| 模块       | 功能点                     |
| ---------- | -------------------------- |
| 课程表管理 | 动态行列编辑               |
| 按钮配置   | 自定义动作/打开方式/样式类 |
| 学生名单   | 批量导入/软删除/序列化存储 |

---

## 📜 开源协议

本项目采用 [MIT License](LICENSE) 授权，欢迎贡献代码！

---

<div align="center">
  <sub>🛠️ 由<a href="https://github.com/BI4LGZ">BI4LGZ</a>构建 | 📆 更新于2025</sub>
</div>

---

> 📬 遇到问题？[提交 Issue](https://github.com/BI4LGZ/void-board/issues) | 💻 想贡献代码？欢迎 PR！
