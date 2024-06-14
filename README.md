How to use

Install all the library in the require section

Create a new file
```javascript
const youtube = require("./youtube");

const AudioPlayer = new youtube.AudioPlayer();

(async () =>
      //We need to use await or else it will crash
      await AudioPlayer.stream("MUSIC NAME HERE"); //Method 1
      await AudioPlayer.playDownload("MUSIC NAME HERE"); //Method 2
})();
```
