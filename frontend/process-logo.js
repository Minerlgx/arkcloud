const sharp = require('sharp');
const path = require('path');

async function removeWhiteBackground() {
  const inputPath = '/tmp/logo-source.jpg';
  const outputPath = path.join(__dirname, 'public/images/logo.png');
  
  // 读取图片并移除白色背景
  await sharp(inputPath)
    .removeAlpha()  // 先移除现有alpha
    .raw()           // 获取原始像素
    .toBuffer({ resolveWithObject: true })
    .then(({ data, info }) => {
      // 遍历像素，将接近白色的设为透明
      const pixels = Buffer.alloc(data.length / 3 * 4);
      let j = 0;
      for (let i = 0; i < data.length; i += 3) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        // 如果接近白色(R,G,B都>240)，设为透明
        if (r > 240 && g > 240 && b > 240) {
          pixels[j++] = 0;     // R
          pixels[j++] = 0;     // G
          pixels[j++] = 0;     // B
          pixels[j++] = 0;     // A (透明)
        } else {
          pixels[j++] = r;
          pixels[j++] = g;
          pixels[j++] = b;
          pixels[j++] = 255;   // A (不透明)
        }
      }
      
      return sharp(pixels, {
        raw: {
          width: info.width,
          height: info.height,
          channels: 4
        }
      }).png().toFile(outputPath);
    });

  console.log('透明底 Logo 已生成!');
}

removeWhiteBackground().catch(console.error);
