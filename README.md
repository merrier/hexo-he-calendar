# hexo-he-calendar

> A heartfelt Chinese-style calendar 🍵 — Hexo plugin edition

[中文文档](README_ZH.md)

`hexo-he-calendar` is a Hexo plugin wrapper around [he-calendar](https://github.com/scutken/he-calendar). With a simple configuration, you can embed a beautiful Chinese-style calendar (with lunar calendar and almanac) into your Hexo blog.

## Features

- **🎨 24 Solar Term themes**: Automatically adapts colors based on the current solar term
- **📅 Lunar calendar & almanac**: Lunar date, solar terms, traditional festivals, and daily auspicious/inauspicious activities
- **🌈 Multiple themes**: Built-in theme styles with auto light/dark mode support
- **⚡ Zero CSS conflicts**: Rendered inside an iframe for perfect compatibility with any Hexo theme

## Installation

Run the following in your Hexo blog root:

```bash
npm install hexo-he-calendar --save
# or
yarn add hexo-he-calendar
```

## Configuration

Add the following configuration to your Hexo `_config.yml` (optional):

```yaml
he_calendar:
  enable: true            # Enable or disable
  route: he-calendar/     # Route path for the calendar static assets
  width: 100%             # Default embed width
  height: 600px           # Default embed height (180px if view is week)
  view: month             # View mode: 'month' (default) or 'week' (sidebar mode)
  border_radius: 12px     # Border radius of the embed container
```

## Usage

Use the `{% he_calendar %}` tag in any Markdown post/page:

```markdown
# My Calendar Page

Welcome!

{% he_calendar %}
```

You can also override settings per usage:

```markdown
# Override width and height
{% he_calendar 800px 500px %}

# Only show the current week (useful for narrow sidebars)
{% he_calendar view=week %}

# Combine overrides
{% he_calendar width=300px height=200px view=week %}
```

## How it works

During the Hexo generate phase, this plugin publishes the prebuilt `he-calendar` static files to `public/he-calendar/` (configurable), and embeds the app via an iframe to ensure the calendar layout remains intact and avoids any style collisions with your Hexo theme.

## License

MIT

