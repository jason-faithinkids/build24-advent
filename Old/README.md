[![Netlify Status](https://api.netlify.com/api/v1/badges/995b6ae7-e381-4615-868d-aef36f969d59/deploy-status)](https://app.netlify.com/sites/christmasbuildup/deploys)

# Christmas BuildUp
> DISCLAIMER: This was produced as part of a hackathon, and so if any of it feels hacked together, that is precisely what has happened.

## What’s inside now?
The project has been “frozen” into a plain static site. Every HTML page, image, stylesheet and script lives directly in the repository—there’s no Eleventy build step, no Node dependencies, and no WordPress requests at build time.  
All Advent day pages, the stickerbook, feeds, sitemap and assets are ready to serve as-is.

## Running locally
Any static web server will do. Two easy options:

```bash
# Python
python3 -m http.server 8080

# or use the `serve` npm package if you already have Node installed
npx serve .
```

Then browse to `http://localhost:8080`.

## Deploying
Netlify can host the site without a build command. The included `netlify.toml` now points the publish directory at the repo root, so Netlify simply uploads the files as-is. You can do the same with any static host (GitHub Pages, Cloudflare Pages, S3, etc.) by pointing it at the repository contents.

## Stickerbook
The stickerbook is pure HTML/CSS/JS (no framework). Stickers live in `img/stickers/stable-stickers/`. Replace any PNG there with another using the same filename to update the artwork; the pages already reference the local versions.
