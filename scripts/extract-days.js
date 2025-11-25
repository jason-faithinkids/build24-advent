const fs = require('fs');
const path = require('path');
const { load } = require('cheerio');

const POSTS_DIR = path.resolve(__dirname, '../../posts');
const OUTPUT = path.resolve(__dirname, '../data/days.json');
const HERO_DIR = '/img/With Copyright';
const PLACEHOLDER = '/img/stickers/stable-stickers/placeholder.png';

function heroExists(day) {
  const filePath = path.resolve(__dirname, `../public${HERO_DIR}/${day}.png`);
  return fs.existsSync(filePath);
}

function normalizeRawPath(p) {
  if (!p) return null;
  if (p.startsWith('http')) return p;
  const withoutParent = p.replace(/^\.\.\/+/, '');
  return path.posix.normalize(`/${withoutParent}`);
}

function assetPath(p) {
  const normalized = normalizeRawPath(p);
  if (!normalized) return null;
  if (normalized.includes('PLACEHOLDER')) return PLACEHOLDER;
  return normalized;
}

const dayDirs = fs
  .readdirSync(POSTS_DIR)
  .filter((dir) => /^day\d+$/.test(dir))
  .sort((a, b) => parseInt(a.replace('day', ''), 10) - parseInt(b.replace('day', ''), 10));

const days = dayDirs.map((dir) => {
  const dayNumber = parseInt(dir.replace('day', ''), 10);
  const html = fs.readFileSync(path.join(POSTS_DIR, dir, 'index.html'), 'utf8');
  const $ = load(html);

  const videoSrc = $('.advent-video').attr('src') || null;
  const pictureSrc = $('.entry-content img').first().attr('src') || null;
  const colouring = $('.thumbnail-container a').attr('href') || null;
  const podcast = $('audio source').attr('src') || null;
  const scriptureHtml = $('.scripture').html() || '';
  const scriptureRef = $('.reference').text().trim();
  const discussionHtml = $('.discussion').html() || '';
  const stickerImage = $('.sticker-circle img').attr('src') || null;

  const heroImage = heroExists(dayNumber)
    ? `${HERO_DIR}/${dayNumber}.png`
    : assetPath(pictureSrc) || PLACEHOLDER;

  return {
    day: dayNumber,
    heroImage,
    video: videoSrc,
    picture: assetPath(pictureSrc),
    colouring: assetPath(colouring),
    podcast: normalizeRawPath(podcast),
    scriptureHtml,
    scriptureRef,
    discussionHtml,
    stickerImage: assetPath(stickerImage) || PLACEHOLDER,
  };
});

fs.writeFileSync(OUTPUT, JSON.stringify(days, null, 2));
console.log(`Wrote ${days.length} days to ${OUTPUT}`);
