const config = require('./config.json')

class FilterTorrents {

  constructor(obj = {}) {
    for (const propName in obj) {
      this[propName] = obj[propName];
    }
  }

  static filterList(torrents, mediaInfos) {
    // Define the size limit for each quality
    const sizeLimits = this.defineSizeLimit(mediaInfos)

    // Filter the torrents by size
    let sizeLimit = sizeLimits[Object.keys(sizeLimits)][parseInt(mediaInfos.torrentQuality)]
    let torrentsFiltered = torrents.filter(torrent => torrent.size < sizeLimit)

    // If no torrent found, increase the size limit by 10%
    while (torrentsFiltered.length === 0 && sizeLimit < 10000000000) {
      sizeLimit += (sizeLimit * 0.1);
      torrentsFiltered = torrents.filter(torrent => torrent.size < sizeLimit)
    }

    // Clean the list of torrents
    if (mediaInfos.torrentType === 'tv') {
      torrentsFiltered = this.removeWithoutTvPattern(torrentsFiltered)
      if (Object.keys(sizeLimits)[0] === 'full_season') {
        torrentsFiltered = this.removeWithEpisodeNumber(torrentsFiltered)
        torrentsFiltered = this.removeWithWrongSeason(torrentsFiltered, mediaInfos)
      } else if (Object.keys(sizeLimits)[0] === 'episode') {
        torrentsFiltered = this.removeWithWrongEpisode(torrentsFiltered, mediaInfos)
      }
    }

    // Filter the torrents by resolution
    torrentsFiltered = this.filterResolution(torrentsFiltered, mediaInfos)
    torrentsFiltered = this.filterQuality(torrentsFiltered, mediaInfos)

    // Return the filtered list of torrents
    return new FilterTorrents(torrentsFiltered)

  }

  // Define the size limit for each quality
  static defineSizeLimit(mediaInfos) {
    const { full_season, episode, movie } = config.limit
    if (mediaInfos.torrentType === 'tv') {
      if (mediaInfos.torrentSeason && mediaInfos.torrentEpisode) {
        const obj = {
          episode: episode,
        }
        return obj
      } else if (mediaInfos.torrentSeason) {
        const obj = {
          full_season: full_season,
        }
        return obj
      }
    } else if (mediaInfos.torrentType === 'movie') {
      const obj = {
        movie: movie,
      }
      return obj
    }
  }

  static removeWithoutTvPattern(torrents) {
    const regex = /S\d{2}/gi;
    // Remove all torrents without TV show pattern in the name SXX or sxx
    return torrents.filter(torrent => torrent.name.match(regex));
  }

  static removeWithEpisodeNumber(torrents) {
    const regex = /E\d{2}/gi;
    // Remove all torrents with episode number in the name EXX or exx
    return torrents.filter(torrent => !torrent.name.match(regex));
  }

  static removeWithWrongSeason(torrents, mediaInfos) {
    // Convert the season number to a number
    const season = parseInt(mediaInfos.torrentSeason);
    // Add a leading 0 if the season number is one digit
    const seasonString = season < 10 ? '0' + season : season.toString();
    const regex = new RegExp(`S${seasonString}`, 'gi');
    // Remove all torrents with the wrong season number
    return torrents.filter(torrent => torrent.name.match(regex));    
  }

  static removeWithWrongEpisode(torrents, mediaInfos) {
    const regex = new RegExp(mediaInfos.torrentEpisode, 'gi');
    // Remove all torrents with the wrong episode number
    return torrents.filter(torrent => torrent.name.match(regex));
  }

  // Filter the torrents by resolution
  static filterResolution(torrents, mediaInfos) {
    const { UHD, HD, SD } = config.resolution
    if (mediaInfos.torrentQuality === '1') {
      return torrents.filter(torrent => UHD.some(resolution => torrent.name.includes(resolution)));
    } else if (mediaInfos.torrentQuality === '2') {
      return torrents.filter(torrent => HD.concat(SD).some(resolution => torrent.name.includes(resolution)));
    } else if (mediaInfos.torrentQuality === '3') {
      return torrents.filter(torrent => UHD.concat(HD, SD).some(resolution => torrent.name.includes(resolution)));
    } else if (mediaInfos.torrentQuality === '4') {
      return torrents.filter(torrent => HD.concat(SD).some(resolution => torrent.name.includes(resolution)));
    }
  }

  // Filter the torrents by codec and HDR
  static filterQuality(torrents) {
    const { UHD, HD, SD, x265, HDR } = config.resolution
    const torrent = torrents.find(torrent => 
      x265.some(codec => torrent.name.includes(codec)) && HDR.some(hdr => torrent.name.includes(hdr))
    ) || torrents.find(torrent => x265.some(codec => torrent.name.includes(codec))) 
    || torrents.find(torrent => UHD.concat(HD, SD).some(resolution => torrent.name.includes(resolution))) 
    || torrents[0];
    
    return torrent;
  }
}

module.exports = FilterTorrents