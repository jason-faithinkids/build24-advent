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
          podcast: p.podcast.endsWith('mp4') ? '' : p.podcast,
          video: p.podcast.endsWith('mp4') ? p.podcast : '',
          thumbnail: p.thumbnail,
          picture: p.picture,
          nativity_figure: p.nativity_figure,
          day: p.day,
          colour: p.colour ||'red',
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

const randomColour = () => Math.floor(Math.random()*16777215).toString(16);

const podcastIsMp4 = (url) => url.endsWith('mp4')


// process WordPress posts
module.exports = async function() {
  // fetch all pages of posts
  return wpPosts();
};

