var lating_validation = function(value){
  console.log(value)
  var is_valid = false

  try {
    value = JSON.parse(value)
  } catch(e) {
    // console.error(e)
  }


  if (typeof value.lat === 'number' && typeof value.lng === 'number') {
    is_valid = true
  }

  return is_valid
}

var number_of_passenger_validation = function(value) {
  value = parseInt(value)

  if (typeof value !== 'number'){
    return {
      is_valid: false,
      message: '乘客人數必須是一個數字'
    }
  }


  if (value < 1 || value > 3) {
    return {
      is_valid: false,
      message: '乘客人數不對，請不要四貼'
    }
  }

  return true

}
var video_duration = 0
var distance_validation = function(value){
  // assume max speed 300km/h
  value = parseFloat(value)

  if ( typeof value !== 'number'){
    return {
      is_valid: false,
      message: '您輸入的資料不是一個數字'
    }
  }

  var avg_speed_in_km_h = value / (video_duration / 3600)

  console.log('avg_speed_in_km_h', avg_speed_in_km_h)
  if ( avg_speed_in_km_h <= 0) {
    return {
      is_valid: false,
      message: '這位大大你騎太慢了吧!'
    }
  } else if ( avg_speed_in_km_h >= 300){
    return {
      is_valid: false,
      message: '您的平均速度比高鐵還快啦！！'
    }
  }

  return true
}

var load_video_player = function(video_id){
  var onPlayerReady = function(e){
    player.mute()
    video_duration = player.getDuration()

    var video_data = player.getVideoData()
    $('#trip_video_title').val(video_data.title)
    $('#trip_video_id').val(video_data.video_id)
  }

  var player = new YT.Player('video-player', {
    height: '275',
    // width: '640',
    playerVars: { 'autoplay': 1},
    videoId: video_id,
    events: {
      'onReady': onPlayerReady,
      // 'onStateChange': onPlayerStateChange
    }
  })

  console.log('loading', video_id)
}

var youtube_link_validation = function(url) {
  console.log(url)
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp)
  if ( match && match[7].length == 11 ){
    var video_id = match[7]
    load_video_player(video_id)
    // $('#trip_video_link').val(video_id)
    return video_id
  }else{
    console.log('not a valid youtube link')
      // alert("Could not extract video ID.");
    return false
  }
}
var estimated_speed_rates = {
  '平面禁行機車': 30,
  '市區高架': 50,
  '快速公路': 65,
  '高速公路': 80
}

var calculate_estimated_trip_distance = function(){
  var type = $('#trip_road_type').val()
  console.log('type', type)
  var es_speed = estimated_speed_rates[type]

  var estimated_trip_distance = es_speed * (video_duration / 3600)
  $('#trip_distance').val(estimated_trip_distance.toFixed(2))
}

var road_type_validation = function(value){
  return ( Object.keys(estimated_speed_rates).indexOf(value) !== -1)
}

var form_steps = {
  '#trip_video_link': {
    notify_text: '驗證距離的影片',
    validation: youtube_link_validation,
    not_valid_message: '這不是一個youtube連結!'
  },
  '#trip_formatted_start_point': {
    notify_text: '點擊地圖選擇啟始點',
    raw_input_id: 'trip_start_point',
    click_on_map: true,
    // validation: lating_validation,
    not_valid_message: '請點擊地圖選擇啟始點!'
  },
  '#trip_formatted_end_point': {
    notify_text: '點擊地圖選擇結束點',
    raw_input_id: 'trip_end_point',
    click_on_map: true,
    // validation: lating_validation,
    not_valid_message: '請點擊地圖選擇結束點!'
  },
  '#trip_road_type': {
    notify_text: '選擇行駛的道路類型',
    validation: road_type_validation,
    not_valid_message: '道路類型錯誤!'
  },
  '#trip_distance': {
    notify_text: '按照您的影片時間與道路類型計算的預估值',
    validation: distance_validation,
    on_focus: calculate_estimated_trip_distance
  },
  '#trip_numbers_of_people': {
    notify_text: '包含自己的乘客數量，建議不要三貼',
    validation: number_of_passenger_validation
  },
  '#trip_vehicle_name': {
    notify_text: '請填入愛車的車型',
  },
  '#trip_accident': {
    notify_text: '您是否有發生事故呢？',
  }
}

function initFormSteps(map, form_steps) {
  var current_marker
  var current_step = 0
  var current_action
  var action_button = $('#action-button')
  var setp_keys = Object.keys(form_steps)
  var current_form_element

  function goNextStep(){
    // if current form element is not null, hide the prevous element
    if(current_form_element){
      $('.notifyjs-wrapper').trigger('notify-hide')
    }

    // get the current action
    current_action = form_steps[setp_keys[current_step]]

    if(typeof current_action === 'undefined') {
      return false
    }

    // select from the JSON key
    current_form_element = $(setp_keys[current_step])
    current_form_element.focus()

    // get the notify text from current action
    var notify_text = current_action.notify_text
    // current_form_element.notify(notify_text)

    $('.input-box').notify(notify_text)

    var elements = $('form input, form select')
    elements.closest('.col').hide()
    current_form_element.closest('.col').show()
    // elements.attr('readonly', true)
    // elements.css({
    //   background: 'transparent'
    // })

    // current_form_element.attr('readonly', false)
    // current_form_element.css({
    //   background: '#eee'
    // })

    return true
  }

  goNextStep()

  var submit_form = false
  action_button.on('click submit', function(event){
    var form_validation

    if( typeof current_action.validation !== 'function') {
      form_validation = true
    } else {
      form_validation = current_action.validation(current_form_element.val())
    }

    var is_valid = form_validation
    var not_valid_message = current_action.not_valid_message


    // the return value maybe an object
    if (typeof form_validation === 'object'){
      is_valid = form_validation.is_valid
      not_valid_message = form_validation.message
    }

    if ( is_valid ){
      current_step++
    } else {
      console.log('input not valid')
      current_form_element.notify(not_valid_message, {
        className: 'error'
      })
      event.preventDefault()
      return
    }


    // if last step, goNextStep will return false
    if ( goNextStep() ){
      current_marker = null

      if (typeof current_action.on_focus === 'function'){
        current_action.on_focus()
      }

      event.preventDefault()
      return
    }

  })

  var geocoder = new google.maps.Geocoder

  google.maps.event.addListener(map, 'click', function(event) {
    // remove last marker
    if (current_marker){
      current_marker.setMap(null)
    }

    if (current_action.click_on_map) {
      current_marker = new google.maps.Marker({position: event.latLng, map: map});
      let form_value = event.latLng.toJSON()
      form_value = JSON.stringify(form_value)
      // current_form_element.val(form_value)

      $('#' + current_action.raw_input_id).val(form_value)

      geocoder.geocode({'location': event.latLng}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          current_form_element.val(results[0].formatted_address)
          // $('#'+ current_action.formatted_input_id).val(results[0].formatted_address)
        }
      })
    }

  })

  $('#trip_road_type').bind('onblur change', function(e){
    calculate_estimated_trip_distance()
  })

  // listen on youtube link input change
  var debounce
  $('#trip_video_link').bind('input paste keyup', function(event){
    if(debounce){
      clearTimeout(debounce)
    }
    debounce = setTimeout(function(){
      console.log(event.type)
      action_button.submit()
      // load_youtube_player(event.target.value)
    }, 500)
  })

}