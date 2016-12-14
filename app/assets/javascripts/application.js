// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require_tree .
//= require switchery
//= require notifyjs_rails

var notification_defaults = {
  className: "info",
  autoHide: false,
  clickToHide: false,
  arrowSize: 10,
}

$.notify.defaults(notification_defaults)

window.onload = function() {
	var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'))

	elems.forEach(function(html) {
	  var switchery = new Switchery(html)
	})
}

function getCurrentPositionAndSet(map){
  // var infoWindow = new google.maps.InfoWindow({map: map})

  // Try HTML5 geolocation.
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      }

      console.log('Location found.', pos)
      // infoWindow.setPosition(pos);
      // infoWindow.setContent('Location found.');
      map.setCenter(pos);
    }, function() {
      // handleLocationError(true, infoWindow, map.getCenter())
    })
  } else {
    // Browser doesn't support Geolocation
    // handleLocationError(false, infoWindow, map.getCenter())
  }

  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    // infoWindow.setPosition(pos);
    // infoWindow.setContent(browserHasGeolocation ?
    //                       'Error: The Geolocation service failed.' :
    //                       'Error: Your browser doesn\'t support geolocation.');
  }
}

function initMap() {
  var styles = [
    {
      "featureType": "poi.business",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi.park",
      "elementType": "labels.text",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]

  // Create a new StyledMapType object, passing it the array of styles,
  // as well as the name to be displayed on the map type control.
  var styledMap = new google.maps.StyledMapType(styles,
    {name: "Styled Map"});

  // Create a map object, and include the MapTypeId to add
  // to the map type control.
  var mapOptions = {
    center: { lat: 25.0439892, lng: 121.5212213 },
    zoom: 11,
    // mapTypeControlOptions: {
    //   mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
    // }
  }

  var map = new google.maps.Map(document.getElementById('map'),
    mapOptions)

  //Associate the styled map with the MapTypeId and set it to display.
  map.mapTypes.set('map_style', styledMap)
  map.setMapTypeId('map_style')


  var bodyid = $('body').attr('id')
  switch(bodyid) {
    case 'list':
      listTrips(map)
      break
    case 'new':
      initFormSteps(map, form_steps)
      break
  }

  getCurrentPositionAndSet(map)
}
