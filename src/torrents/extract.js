const {
  extractTVShowInfo,
  extractMovieInfo,
  extractQuality,
} = require('./services')

const config = require('config')

class ExtractMediaInfos {

  constructor() {
    this.torrentName = ''
    this.torrentType = ''
    this.torrentQuality = ''
    this.torrentSeason = ''
    this.torrentEpisode = ''
    this.torrentYear = ''
  }

  // Extract infos from the message
  // When the message is a response to a prompt
  async extractResponseInfo(args) {
    if (args[1] === 'saison') {
      // get args2 and remove the S
      const season = args[2].replace('S', '');
      this.torrentSeason = season;
    } else if (args[1] === 'episode') {
      // get args2 and remove the S and E
      const season = args[2].replace('S', '').split('E')[0];
      const episode = args[2].replace('S', '').split('E')[1];
      this.torrentSeason = season;
      this.torrentEpisode = episode;
    } else if (args[1] === 'quality') {
      // get args2
      const quality = args[2];
      this.torrentQuality = quality;
    }
  }

  // Extract infos from the message
  async extractInfos(args) {
    let arg = args.slice(1).join(' ');
    // Test if the message is a movie or a tv show
    // Using user input parameters or the API if the user doesn't provide any
    if (extractTVShowInfo(arg)) {
      const { name, season, episode, quality } = extractTVShowInfo(arg);
      this.torrentName = name;
      this.torrentSeason = season;
      this.torrentEpisode = episode;
      this.torrentType = 'tv';
      this.torrentQuality = quality;
    } else if (extractMovieInfo(arg)) {
      const { name, year, quality } = extractMovieInfo(arg);
      this.torrentName = name;
      this.torrentYear = year;
      this.torrentType = 'movie';
      this.torrentQuality = quality;
    } else {
      const { quality } = extractQuality(arg);
      // remove -q and quality from the arg
      arg = arg.replace(`-q ${quality}`, '');
      const infoMedia = await fetch(`https://api.themoviedb.org/3/search/multi?api_key=${config.apiKey}&language=fr-FR&query=${arg}&page=1&include_adult=false`);
      const infoMediaJson = await infoMedia.json();
      this.torrentName = infoMediaJson.results[0]?.name || infoMediaJson.results[0]?.title;
      this.torrentType = infoMediaJson.results[0]?.media_type;
      this.torrentYear = this.torrentType === 'movie' ? infoMediaJson.results[0]?.release_date.split('-')[0] : '';
      this.torrentQuality = quality || '';
    }
  }
}

module.exports = ExtractMediaInfos