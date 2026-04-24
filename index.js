'use strict';

const fs = require('fs');
const path = require('path');

const config = hexo.config.he_calendar || {};

if (config.enable === false) {
  return;
}
// Default options
const options = Object.assign({
  route: 'he-calendar/',
  width: '100%',
  height: '600px',
  view: 'month',
  defaultTheme: 'auto',
  colorMode: 'auto',
  hideHeader: false,
  border_radius: '12px'
}, config);

let routePath = options.route;
if (!routePath.endsWith('/')) {
  routePath += '/';
}

hexo.extend.generator.register('he-calendar', function(locals) {
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    return [];
  }

  function getFiles(dir, baseDir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat && stat.isDirectory()) {
        results = results.concat(getFiles(filePath, baseDir));
      } else {
        const relPath = path.relative(baseDir, filePath).replace(/\\/g, '/');
        results.push({
          path: routePath + relPath,
          data: function() {
            return fs.createReadStream(filePath);
          }
        });
      }
    });
    return results;
  }

  return getFiles(distDir, distDir);
});

// Usage: {% he_calendar %} or {% he_calendar view=week hideHeader=true defaultTheme=red colorMode=light %} or {% he_calendar width=100% height=600px %}
hexo.extend.tag.register('he_calendar', function(args) {
  let width = options.width;
  let height = options.height;
  let view = options.view || 'month';
  let defaultTheme = options.defaultTheme || 'auto';
  let colorMode = options.colorMode || 'auto';
  let hideHeader = options.hideHeader || false;
  const borderRadius = options.border_radius;

  // Parse args
  args.forEach(arg => {
    if (arg.startsWith('width=')) width = arg.split('=')[1];
    else if (arg.startsWith('height=')) height = arg.split('=')[1];
    else if (arg.startsWith('view=')) view = arg.split('=')[1];
    else if (arg.startsWith('defaultTheme=')) defaultTheme = arg.split('=')[1];
    else if (arg.startsWith('colorMode=')) colorMode = arg.split('=')[1];
    else if (arg.startsWith('hideHeader=')) hideHeader = arg.split('=')[1] === 'true';
    else if (arg.includes('px') || arg.includes('%')) {
      // Legacy support for just passing width and height
      if (arg === args[0]) width = arg;
      else if (arg === args[1]) height = arg;
    }
  });
  
  if (view === 'week' && height === options.height && options.height === '600px') {
    height = '180px'; // automatically adjust default height for week view
  }

  // Make sure to load the iframe with absolute path based on hexo root
  const root = hexo.config.root || '/';
  let iframeSrc = (root + '/' + routePath + 'index.html').replace(/\/{2,}/g, '/');
  
  const params = new URLSearchParams();
  if (view === 'week') params.append('view', 'week');
  if (hideHeader) params.append('hideHeader', 'true');
  if (defaultTheme && defaultTheme !== 'auto') params.append('defaultTheme', defaultTheme);
  if (colorMode && colorMode !== 'auto') params.append('colorMode', colorMode);
  
  const queryString = params.toString();
  if (queryString) {
    iframeSrc += '?' + queryString;
  }

  const wrapperId = 'he-calendar-wrapper-' + Math.random().toString(36).substr(2, 9);

  return `
    <div id="${wrapperId}" class="he-calendar-wrapper" style="width: ${width}; height: ${height}; max-width: 100%; overflow: hidden; border-radius: ${borderRadius}; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1); display: flex; flex-direction: column; box-sizing: border-box;">
      <iframe src="${iframeSrc}" style="width: 100%; height: 100%; flex: 1; border: none; border-radius: ${borderRadius}; background: transparent; max-width: 100%; min-width: 0; min-height: 0; display: block;" frameborder="0" scrolling="no"></iframe>
      <script>
        (function() {
          var wrapper = document.getElementById('${wrapperId}');
          if (!wrapper) return;
          var iframe = wrapper.querySelector('iframe');
          if (!iframe) return;
          
          function updateTheme() {
            var isDark = false;
            var html = document.documentElement;
            var body = document.body;
            var htmlClass = html.getAttribute('class') || '';
            var bodyClass = body.getAttribute('class') || '';
            
            if (htmlClass.indexOf('dark') !== -1 || html.getAttribute('data-theme') === 'dark' || 
                bodyClass.indexOf('dark') !== -1 || body.getAttribute('data-theme') === 'dark' ||
                html.getAttribute('data-user-color-scheme') === 'dark') {
              isDark = true;
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              if (htmlClass.indexOf('light') === -1 && html.getAttribute('data-theme') !== 'light') {
                 isDark = true;
              }
            }
            if (iframe.contentWindow) {
              iframe.contentWindow.postMessage({ type: 'he-calendar-theme', theme: isDark ? 'dark' : 'light' }, '*');
            }
          }

          iframe.addEventListener('load', updateTheme);

          if (typeof MutationObserver !== 'undefined') {
            var observer = new MutationObserver(function() {
              updateTheme();
            });
            observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'data-theme', 'data-user-color-scheme'] });
            observer.observe(document.body, { attributes: true, attributeFilter: ['class', 'data-theme'] });
          }

          if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', updateTheme);
          }
        })();
      </script>
    </div>
  `;
});
