'use strict';

const fs = require('fs');
const path = require('path');

// Get plugin config
const config = hexo.config.he_calendar || {};

// If plugin is disabled, do nothing
if (config.enable === false) {
  return;
}

// Default options
const options = Object.assign({
  route: 'he-calendar/',
  width: '100%',
  height: '600px',
  border_radius: '12px'
}, config);

// Ensure route ends with a slash
let routePath = options.route;
if (!routePath.endsWith('/')) {
  routePath += '/';
}

// 1. Register generator to serve static files
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
        // routePath is like "he-calendar/"
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

// 2. Register tag helper
// Usage: {% he_calendar %} or {% he_calendar 100% 600px %}
hexo.extend.tag.register('he_calendar', function(args) {
  const width = args[0] || options.width;
  const height = args[1] || options.height;
  const borderRadius = options.border_radius;
  
  // Make sure to load the iframe with absolute path based on hexo root
  const root = hexo.config.root || '/';
  const iframeSrc = (root + '/' + routePath + 'index.html').replace(/\/{2,}/g, '/');

  return `
    <div class="he-calendar-wrapper" style="width: ${width}; height: ${height}; overflow: hidden; border-radius: ${borderRadius}; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <iframe src="${iframeSrc}" style="width: 100%; height: 100%; border: none; border-radius: ${borderRadius}; background: transparent;" frameborder="0" scrolling="no"></iframe>
    </div>
  `;
});
