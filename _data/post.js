// fetch WordPress posts
const wordpressAPI = 'https://kingdomcode.faithinkids.org/wp-json/wp/v2/nativity?per_page=100';
const fetch = require('node-fetch');


// fetch list of WordPress posts
async function wpPosts() {
  try {

    const
      res = await fetch(`${ wordpressAPI }`),
      json = await res.json();

    // return formatted data
    return json
      .map(p => {
        const day =  {
          id: p.id,
          body: p.body,
          podcast: extractPodcastSlug(p.podcast),
          scripture: p.scripture,
          scriptureRef: p.scripture_ref,
          video: p.video,
          youtubeId: p.video ? extractYouTubeId(p.video) : undefined,
          thumbnail: p.thumbnail,
          picture: p.picture,
          nativity_figure: p.nativity_figure,
          day: p.day,
          heading: `Advent Day ${p.day}` 
        };

        return day;
      });

  }
  catch (err) {
    console.log(`WordPress API call failed: ${err}`);
    return null;
  }
}

function extractPodcastSlug(url){
  const regex = /(\d+)\/episodes\/(.+)?/;

  const matches = url.match(regex);

  if (matches) {
    const showId = matches[1];
    const episodeId = matches[2] || ""; // Empty string if no episode ID
    return `${showId}/${episodeId}`;
  } else {
    return ""; 
  }
}

function extractYouTubeId(url) {
  // Regular expression to match YouTube video URLs in various formats
  const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([^#&?]*)/;

  const match = url.match(youtubeRegex);

  if (match && match[1]) {
    return match[1];
  } else {
    return null; // Or handle the case where no ID is found
  }
}

// process WordPress posts
module.exports = async function() {
  // fetch all pages of posts
  return wpPosts();
};

