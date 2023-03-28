const config = require('config')
const { exec } = require("child_process");
const util = require('util');

module.exports = {
  extractTVShowInfo: (input) => {
    const regex = /(.+) -e S(\d{1,2})(?:E(\d{1,2}))? ?(-q [1-4])?/;
    const match = input.match(regex);
  
    if (match) {
      const name = match[1];
      const season = match[2];
      const episode = match[3] || '';
      const quality = match[4] || '';
      
      return {
        name: name,
        season: season,
        episode: episode,
        quality: quality.replace(/-q /, '').trim()
      };
    } else {
      return null;
    }
  },
  
  extractMovieInfo: (input) => {
    const regex = /(.+) -y (\d{4}) ?(-q [1-4])?/;
    const match = input.match(regex);
  
    if (match) {
      const name = match[1];
      const year = match[2];
      const quality = match[3] || '';
      
      return {
        name: name,
        year: year,
        quality: quality.replace(/-q /, '').trim()
      };
    } else {
      return null;
    }
  },
  
  extractQuality: (input) => {
    const regex = /-q ([1-4])/;
    const match = input.match(regex);
  
    if (match) {
      const quality = match[1];
  
      return {
        quality: quality.replace(/-q /, '').trim()
      };
    } else {
      return {
        quality: ''
      };
    }
  },
  
  // Search for a torrent
  searchTorrents: async (query, type) => {
    try {
      let cat = 2000
      if (type === 2) {
        cat = 5000
      }

      const res = await fetch(`http://localhost:9117/api/v2.0/indexers/all/results?apikey=${config.jackett_api}&Query=${query}&Category=${cat}}`)
      const json = await res.json()
      return json
    } catch (err) {
      console.error(err)
    }
  },
  
  // Create an array of torrents with only name, size, link and year
  // Find year with regex in torrent name
  // Sort the array by size in descending order
  createTorrentsArray: (torrents, mediaInfos) => {
    const torrentsArray = torrents.map(torrent => {
      if (mediaInfos.torrentType === 'movie') {
        let cleanYear = torrent.Title.match( /[\[\(]?(19|20)\d{2}[\)\]]?/)
        // Remove () and [] from the year
        if (cleanYear) {
          cleanYear[0] = cleanYear[0].replace(/[\[\(]/, '')
          cleanYear[0] = cleanYear[0].replace(/[\]\)]/, '')
        }
        return {
          name: torrent.Title,
          size: torrent.Size,
          link: torrent.Link,
          year: cleanYear ? cleanYear[0] : null
        }
      } else if (mediaInfos.torrentType === 'tv') {
        return {
          name: torrent.Title,
          size: torrent.Size,
          link: torrent.Link,
        }
      }
    })
    // If the user has choosen a year, filter the torrents by year
    if (mediaInfos.torrentYear && mediaInfos.torrentType === 'movie') {
      return torrentsArray.filter(torrent => torrent.year === mediaInfos.torrentYear).sort((a, b) => b.size - a.size)
    }
    return torrentsArray.sort((a, b) => b.size - a.size)
  },

   // Download torrent
  downloadTorrent: async (torrent) => {
    const execPromise = util.promisify(exec)
    // If torrents.name contain '/' remove it
    torrent.name = torrent.name.replace(/\//g, '')
    try {
      await execPromise(`curl "${torrent.link}" --output "${torrent.name}.torrent"`)
      await execPromise(`curl -i --location --form "json=1" --form "torrent_file=@${torrent.name}.torrent" --form "label=curl" -H "Authorization: Basic ${config.rutorrent}" https://torrent.hadri1.fr/php/addtorrent.php`)
      await execPromise(`rm "${torrent.name}.torrent"`)
    } catch (err) {
      console.error(err)
    }
  },
}