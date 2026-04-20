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

// Usage: {% he_calendar %} or {% he_calendar view=week hideHeader=true %} or {% he_calendar width=100% height=600px %}
hexo.extend.tag.register('he_calendar', function(args) {
  let width = options.width;
  let height = options.height;
  let view = options.view || 'month';
  let hideHeader = options.hideHeader || false;
  const borderRadius = options.border_radius;

  // Parse args
  args.forEach(arg => {
    if (arg.startsWith('width=')) width = arg.split('=')[1];
    else if (arg.startsWith('height=')) height = arg.split('=')[1];
    else if (arg.startsWith('view=')) view = arg.split('=')[1];
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
  
  const queryString = params.toString();
  if (queryString) {
    iframeSrc += '?' + queryString;
  }

  return `
    <div class="he-calendar-wrapper" style="width: ${width}; height: ${height}; overflow: hidden; border-radius: ${borderRadius}; margin: 0 auto; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      <iframe src="${iframeSrc}" style="width: 100%; height: 100%; border: none; border-radius: ${borderRadius}; background: transparent;" frameborder="0" scrolling="no"></iframe>
    </div>
  `;
});
