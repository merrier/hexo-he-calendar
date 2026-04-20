# hexo-he-calendar

> 有温度的中国风日历🍵 - Hexo 插件版

[English](README.md)

基于 [he-calendar](https://github.com/scutken/he-calendar) 封装的 Hexo 插件，支持简单配置后即可快速在你的 Hexo 博客中插入精美的中国风日历。

## ✨ 核心特色

- **🎨 24节气智能主题** ：根据当前节气自动切换配色，每个节气都有独特的中国传统色彩
- **📅 农历与黄历** ：完整的农历信息、节气、传统节日和黄历宜忌
- **🌈 多样主题风格** ：内置多种主题，自动适配系统深色/浅色模式
- **⚡ 零样式冲突** ：采用 iframe 隔离渲染，完美兼容任意 Hexo 主题

## 📦 安装

在你的 Hexo 博客根目录下运行：

```bash
npm install hexo-he-calendar --save
# 或者
yarn add hexo-he-calendar
```

## ⚙️ 配置

在 Hexo 的 `_config.yml` 中添加如下配置（可选）：

```yaml
he_calendar:
  enable: true            # 是否启用
  route: he-calendar/     # 日历页面的路由路径
  width: 100%             # 默认宽度
  height: 600px           # 默认高度 (周视图默认为 180px)
  view: month             # 视图模式：'month' (月视图) 或 'week' (周视图，适合较窄的侧边栏)
  defaultTheme: auto      # 默认主题：'auto' (智能动态), 'default' (素雅), 'ink' (水墨), 'red' (朱红), 'gold' (鎏金), 'cyan' (黛蓝)
  hideHeader: false       # 是否隐藏顶部栏（包含年月选择、主题切换等）
  border_radius: 12px     # 边框圆角
```

## 🚀 使用方法

在任意 Markdown 文章或页面中，使用 `{% he_calendar %}` 标签即可插入日历：

```markdown
# 我的日历页面

欢迎查看日历！

{% he_calendar %}
```

你也可以在标签中临时覆盖部分设置：

```markdown
# 临时指定为 800px 宽度，500px 高度
{% he_calendar 800px 500px %}

# 仅显示当前一周（适用于侧边栏）
{% he_calendar view=week %}

# 隐藏顶部工具栏
{% he_calendar hideHeader=true %}

# 默认使用朱红主题
{% he_calendar defaultTheme=red %}

# 组合配置
{% he_calendar width=300px height=200px view=week hideHeader=true defaultTheme=ink %}
```

## 💡 技术实现

本插件会在 Hexo 生成阶段自动将 `he-calendar` 的静态资源输出到 `public/he-calendar/`，并通过 iframe 优雅地无缝嵌入页面，确保原汁原味的体验与 0% 的样式污染。

## 📜 开源协议

MIT
