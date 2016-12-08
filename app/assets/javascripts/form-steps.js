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

var youtube_link_validation = function(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
  var match = url.match(regExp)
  if ( match && match[7].length == 11 ){
    return match[7];
  }else{
    console.log('not a valid youtube link')
      // alert("Could not extract video ID.");
    return false
  }
}

var form_steps = {
  '#trip_video_link': {
    notify_text: '驗證距離的影片',
    validation: youtube_link_validation,
    not_valid_message: '這不是一個youtube連結!'
  },
  '#trip_start_point': {
    notify_text: '點擊地圖選擇啟始點',
    click_on_map: true,
    validation: lating_validation,
    not_valid_message: '請點擊地圖選擇啟始點!'
  },
  '#trip_end_point': {
    notify_text: '點擊地圖選擇結束點',
    click_on_map: true,
    validation: lating_validation,
    not_valid_message: '請點擊地圖選擇結束點!'
  },
  '#trip_distance': {
    notify_text: '未來會有自動計算功能',
  },
  '#trip_road_type': {
    notify_text: '選擇行駛的道路類型',
  },
  '#trip_numbers_of_people': {
    notify_text: '包含自己的乘客數量，建議不要三貼',
    validation: number_of_passenger_validation
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

  function updateStepHint(){
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
    current_form_element.notify(notify_text)

    return true
  }

  updateStepHint()

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


    // if last step, updateStepHint will return false
    if ( updateStepHint() ){
      current_marker = null
      event.preventDefault()
      return
    }

  })

  google.maps.event.addListener(map, 'click', function(event) {
    // remove last marker
    if (current_marker){
      current_marker.setMap(null)
    }

    if (current_action.click_on_map) {
      current_marker = new google.maps.Marker({position: event.latLng, map: map});
      let form_value = event.latLng.toJSON()
      form_value = JSON.stringify(form_value)
      current_form_element.val(form_value)
    }

  });

  // listen on youtube link input change
  (function(){
    var debounce
    $('#trip_video_link').bind('input change paste keyup', function(event){
      if(debounce){
        clearTimeout(debounce)
      }

      debounce = setTimeout(function(){
        console.log(event.type)
        action_button.submit()
        // load_youtube_player(event.target.value)
      }, 200)
    })
  })()

}