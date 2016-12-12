function listTrips (map, filter_by) {
	var player
	var load_player = function(video_id){
		console.log('video_id', video_id)

		if(player){
			player.loadVideoById(video_id)
			return false
		}

		player = new YT.Player('video-player', {
		  height: '275',
		  // width: '640',
		  playerVars: { 'autoplay': 1},
		  videoId: video_id,
		  events: {
		    // 'onReady': onPlayerReady,
		    // 'onStateChange': onPlayerStateChange
		  }
		})
	}

	var markers = []
	var filter_by = filter_by || 'start_point'

	for (var i = TRIPS.length - 1; i >= 0; i--) {
		var latLng
		try {
			latLng = JSON.parse(TRIPS[i][filter_by])
		} catch (e) {
			console.log('error', e)
			continue
		}
		var marker = new google.maps.Marker({ position: latLng, map: map })
		marker.index = i
		markers.push(marker)

    google.maps.event.addListener(marker, 'click', function() {
			// console.log()
			var trip = TRIPS[this.index]
			load_player(trip.video_id)
			var update_target = $('.info-box table')
			update_target.show()
			update_target.find('.video-title').html(trip.video_title)
			update_target.find('.start-point').html(trip.formatted_start_point)
			update_target.find('.end-point').html(trip.formatted_end_point)
			update_target.find('.road_type').html(trip.road_type)
			update_target.find('.numbers_of_people').html(trip.numbers_of_people)
			update_target.find('.passenger-kilometer').html((trip.numbers_of_people * trip.distance).toFixed(2))
			update_target.find('.created_at').html(trip.created_at)

			// map.panTo(markers[this.index].getPosition())
    })
	}
}
