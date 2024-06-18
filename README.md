How to use

Install all the library in the require section

```batch
npm install axios
npm install ytdl-core
npm install fluent-ffmpeg
npm install speaker
npm install youtube-scrapper
```

Usage:

```javascript
const youtube = require("./youtube");

const AudioPlayer = new youtube.AudioPlayer();

(async () =>
      //We need to use await or else it will crash
      await AudioPlayer.stream("MUSIC NAME HERE"); //Method 1
      await AudioPlayer.playDownload("MUSIC NAME HERE"); //Method 2 //Use this one if you are having problem with the 1st method
      
      AudioPlayer.pause(); //Pause the audio
      AudioPlayer.resume(); //Resume the paused audio
      AudioPlayer.stop(); //Stop the audio
})();
```



Example:

```javascript
const youtube = require("./youtube");

const AudioPlayer = new youtube.AudioPlayer();

(async () =>
      await AudioPlayer.playDownload("Porter Robinson Everything Goes On");
})();
```





Detailed Usage:


Playing an Audio (Via streaming)
```javascript
AudioPlayer.stream("MUSIC NAME HERE");
```

Playing an Audio (Downloading it first and then playing it)
```javascript
AudioPlayer.playDownload("MUSIC NAME HERE");
```

Pausing the Audio
```javascript
AudioPlayer.pause();
```

Resuming the Audio
```javascript
AudioPlayer.resume();
```

Stopping the Audio
```javascript
AudioPlayer.stop();
```
