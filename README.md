How to use

## Install the Package

```batch
npm install nodejs-youtube-player
```
## Example:

```javascript
const youtube = require("nodejs-youtube-player");

const AudioPlayer = new youtube.AudioPlayer();

(async () => {
      await AudioPlayer.playDownload("Porter Robinson Everything Goes On");
})();
```

-----------------

## Usage:

```javascript
const youtube = require("nodejs-youtube-player");

const AudioPlayer = new youtube.AudioPlayer();

(async () => {
      //We need to use await or else it will crash
      await AudioPlayer.stream("MUSIC NAME HERE"); //Method 1
      await AudioPlayer.playDownload("MUSIC NAME HERE"); //Method 2 //RECOMMENDED
      
      AudioPlayer.SilentMode = true; //Disables all the console.log output
      AudioPlayer.pause(); //Pause the audio
      AudioPlayer.resume(); //Resume the paused audio
      AudioPlayer.stop(); //Stop the audio
})();
```



-----------------


## Detailed Usage:


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

Disabling all the Console.log(); output
```javascript
AudioPlayer.SilentMode = true; //false by default
```
