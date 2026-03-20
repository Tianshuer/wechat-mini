const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const icons = [
  { name: 'home', color: '#999999' },
  { name: 'home-active', color: '#8FA89B' },
  { name: 'favorite', color: '#999999' },
  { name: 'favorite-active', color: '#8FA89B' },
  { name: 'user', color: '#999999' },
  { name: 'user-active', color: '#8FA89B' },
];

const size = 81;

async function convert() {
  for (const icon of icons) {
    const svgPath = path.join(__dirname, `src/static/tabbar/${icon.name}.svg`);
    const pngPath = path.join(__dirname, `src/static/tabbar/${icon.name}.png`);

    // 读取SVG并替换颜色
    let svg = fs.readFileSync(svgPath, 'utf8');
    svg = svg.replace(/fill="[^"]*"/g, `fill="${icon.color}"`);

    await sharp(Buffer.from(svg))
      .resize(size, size)
      .png()
      .toFile(pngPath);

    console.log(`✓ Created ${icon.name}.png`);
  }
}

convert();
