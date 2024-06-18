const axios = require('axios'); //Get packet dri youtube
const ytdl = require('ytdl-core'); //Buat ambil Format dari audio
const ffmpeg = require('fluent-ffmpeg'); //Convert audio data ke Raw-PCM Data
const Speaker = require('speaker'); //Stream Raw-PCM Data ke Speaker
const scrapper = require("youtube-scrapper"); //Scrapping (Ngambil Data kaya judul,thumbnail,link dari youtube)
const fs = require('fs'); //Buat ngotak ngatik directory/Folder
const path = require('path'); //Buat ngecek/ngotak ngatik Path directory
const { PassThrough } = require('stream'); //Buat passtrough data biar bisa di handle lebih enak

//Function to get Youtube Video Url
async function getYoutubeData(name)
{
    const result = await scrapper.search(name);
    const imageUrl = result.videos[0].thumbnails[0].url;
    const titleName = result.videos[0].title;
    const videoUrl = result.videos[0].url;
    return{
        image: imageUrl,
        title: titleName,
        url: videoUrl
    };
}

// Function to get audio stream URL using ytdl-core
async function getAudioStreamUrl(videoUrl) {
  const info = await ytdl.getInfo(videoUrl);
  const format = ytdl.chooseFormat(info.formats, { quality: 'highestaudio', filter: 'audioonly' });
  return format.url;
}


class AudioPlayer {
  constructor() {
    this.speaker = new Speaker({
      channels: 2,         // 2 channels (stereo) //Intinya kanan sama kiri headset
      bitDepth: 16,        // 16-bit samples
      sampleRate: 44100    // 44,100 Hz
    });

    this.audioStream = new PassThrough();
    this.playing = false;
    this.videoUrl = '';
    this.audioUrl = null;
    this.response = null;

    this.ytData = null;
    this.url = null;
    this.audioFilePath = '';
    this.info = null;
    this.options = null;

    this.ffmpegProcess = null;
  }
  
  stream(music_name) {
    if (this.playing) {
      console.log('Already playing');
      return;
    }

    this.playing = true;
    
   (async () =>{
    if(music_name.includes("watch?v=")){
      this.videoUrl = music_name;
    }else{
      this.videoUrl = (await getYoutubeData(music_name)).url;
    }
      this.audioUrl = await getAudioStreamUrl(this.videoUrl);
      this.response = await axios({
        method: 'get',
        url: this.audioUrl,
        responseType: 'stream'
      });
      
      // Pipe the audio stream through ffmpeg to decode it and then to the speaker
      this.ffmpegProcess = ffmpeg(this.response.data)
        .audioCodec('pcm_s16le')
        .format('wav')
        .audioFrequency(44100) // Set audio frequency to match the speaker's sample rate
        .on('error', (err) => {
          console.error('Error processing audio:', err);
        })
        .pipe(this.audioStream)
        .on('end', () => {
          console.log('Audio playback completed');
        });
        this.audioStream.pipe(this.speaker);

    this.speaker.on('close', () => {
      this.playing = false;
    });
  })();
  }

  playDownload(music_name){
    if (this.playing) {
      console.log('Already playing');
      return;
    }

    this.playing = true;

    //Use the Async lambda so we can use await
    (async () =>{
      //Get the data of the url, image and title from Youtube-Scrapper
      this.ytData = await getYoutubeData(music_name);
      this.url = this.ytData.url;
      //this.audioFilePath = path.resolve(__dirname, `download/${this.ytData.title.replace(/[^\w\s]/gi, '')}`);
      this.audioFilePath = path.resolve(__dirname, `download/${this.ytData.title.replace(/[^\w\s]/gi, '')}.flac`);
     

      //Kenapa Pake REGEX(Regular Expression)? Kalo gk pake regex malah error gara gara kalo judulnya ada simbolnya
      this.info = await ytdl.getInfo(this.url);
      this.options = {
          quality: 'highestaudio',
          filter: 'audioonly',
          format: 'flac'
      };
      //quality: 'highestaudio', filter: 'audioonly'
      ytdl(this.url, this.options)
      .pipe(fs.createWriteStream(this.audioFilePath))
      .on("finish", () =>{
          console.log("Downloading finished");
          // Use ffmpeg to convert the FLAC file to PCM format and play through speaker
          this.ffmpegProcess = ffmpeg(this.audioFilePath)
            .audioCodec('pcm_s16le')
            .format('s16le')
            .audioBitrate(256)
            .audioFrequency(44100)
            .on('start', () => {
              console.log('ffmpeg started');
            })
            .pipe(this.audioStream)
            .on('end', () => {
              console.log('Audio playback ended.');
              this.audioStream.end();
              fs.unlinkSync(this.audioFilePath); // Delete the temporary audio file
            })
            .on('error', (err) => {
              console.error('Error during audio playback:', err.message);
              this.audioStream.end();
              fs.unlinkSync(this.audioFilePath); // Delete the temporary audio file
            })
            this.audioStream.pipe(this.speaker);

            this.speaker.on('close', () => {
              this.playing = false;
            });
     })

     
            
    })();
  }

  pause() {
    if (!this.playing) {
      console.log('Nothing is playing');
      return;
    }

    this.audioStream.unpipe(this.speaker);
    console.log('Audio playback paused');
  }

  resume() {
    /*if (this.playing) {
      console.log('Already playing');
      return;
    }*/

    this.audioStream.pipe(this.speaker);
    console.log('Audio playback resumed');
  }

  stop() {
    if (!this.playing) {
      console.log('Nothing is playing');
      return;
    }

    this.audioStream.unpipe(this.speaker);
    this.audioStream.end();
    this.speaker.end();
    this.playing = false;
    console.log('Audio playback stopped');
  }
}


module.exports = {AudioPlayer, getYoutubeData};
