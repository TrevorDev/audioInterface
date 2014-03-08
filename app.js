var fs = require('fs')
var stream = fs.createWriteStream('myFile.txt', {flags: 'r+'});

var alsa = require('alsa'),
  // The following variables represent the defaults for the Playback and Capture constructors.
  device = 'default',                   // ALSA default device
  channels = 1,                         // Stereo
  rate = 192000,                         // Sample rate
  format = alsa.FORMAT_S16_LE,          // PCM format (signed 16 bit LE int)
  access = alsa.ACCESS_RW_INTERLEAVED,  // Access mode
  latency = 0;                        // Desired latency in milliseconds

// The Capture class is a stream.Readable subclass.
var capture = new alsa.Capture(device, channels, rate, format, access, latency);
capture.on('data', function(chunk) {
	var buckets = []
	var sections = 64;
	for(var i = 0;i<sections;i++){
		buckets[i]={count: 0, range: (32768/sections)*(i+1)};
	}

	for(var i=0;i<chunk.length/2;i+=2){
		var val = Math.abs(chunk.readInt16LE(2));
		for(var j = 0;j<buckets.length;j++){
			if(val<buckets[j].range){
				buckets[j].count++;
				break;
			}
		}
	}

	var max = 0;
	var win = 0;
	for(var i = 0;i<buckets.length;i++){
		if(buckets[i].count>max){
			max = buckets[i].count;
			win = i;
		}
	}
	//console.log(win);
	if(win>50){
		console.log("hit")
	}
	var out = "";
	for(var i =0;i<win;i++){
		out+="||"
	}
	console.log(out+" "+win)
})