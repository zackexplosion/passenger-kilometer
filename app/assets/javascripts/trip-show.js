(function(){
	var video_id = $('#video-player').data('video-id')
	var player = new YT.Player('video-player', {
	  height: '275',
	  // width: '640',
	  playerVars: { 'autoplay': 1},
	  videoId: video_id,
	  events: {
	    // 'onReady': onPlayerReady,
	    // 'onStateChange': onPlayerStateChange
	  }
	})
})()