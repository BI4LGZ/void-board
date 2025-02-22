# 🎨 虚空白板 | Void Board

> 多功能教学辅助工具&现代化班级屏幕主页 | 课程表 · 电子画板 · 随机点名 · 计时器

## 🌟 功能特性

- 📅 **课程表** - JSON 数据驱动动态课表展示
- 🎨 **电子画板** - 高触屏支持的电子画板
- 🎲 **随机点名** - 公平公正的课堂提问工具
- ⏱️ **计时器** - 便捷准确的倒计时工具
- 🔍 **快捷搜索** - 集成 Bing 搜索引擎快速入口

## 📂 项目结构

```bash
├── statics/
│   ├── data/              # 个性化数据存储
│   │   ├── timetable.json    # 课程表数据
│   │   ├── buttons.json      # 快捷按钮配置
│   │   └── names.json        # 学生名单数据库
│   ├── css/               # 样式表集合
│   ├── js/                # 交互逻辑代码
│   └── assets/            # 多媒体资源
├── index.html             # 首页
├── draw.html              # 画板
└── name.html              # 随机点名
```

## 🛠️ 个性化配置

### 1. 课程表定制

编辑 `statics/data/timetable.json`。

项目文件中给出了一个示例课程表，你可以仿照其格式修改，并增减行列，页面会动态调整显示。

❗：注意，过多或过少的行列数均可能导致页面显示异常。

### 2. 快捷按钮设置

修改 `statics/data/buttons.json`。

项目文件中给出了一个示例快捷按钮设置，包含了所有项目自带功能，你可以仿照其格式添加快捷链接，或删除不需要的功能。

### 3. 学生名单管理

更新 `statics/data/names.json`。

项目文件中给出了一个示例名单设置，你可以仿照其格式修改增减名单，将你的学生名单录入其中。

## 🚀 部署指南

### 环境要求

- **推荐系统**: Ubuntu 22.04 LTS
- **Web 服务器**: Nginx 1.18+

### 分步部署

1. **安装依赖**

```bash
sudo apt update && sudo apt install nginx -y
```

2. **项目克隆**

```bash
git clone https://github.com/BI4LGZ/void-board.git
cd void-board
```

3. **Nginx 配置** ：你需要将`静态文件位置`修改为你的项目目录；将`IP或域名`修改为你的网站将会使用的 IP 或域名；将`端口号`修改为你的网站将会使用的端口号。

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

4. **权限设置**：将你的`nginx`配置文件顶部的用户名赋予权限
   比如你的用户是 www-data，像是这样：

```nginx
user www-data;
```

你可以将它改为一个拥有访问项目目录权限的用户，或像下面这样赋予权限：

```bash
sudo chown -R www-data:www-data 项目目录
sudo systemctl restart nginx
```

## 📜 许可协议

本项目采用 [MIT License](LICENSE) 开源协议

---

<div align="center">
  <sub>Created by BI4LGZ | 2025</sub>
</div>
