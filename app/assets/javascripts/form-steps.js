var form_steps = {
  '#trip_start_point': {
    notify_text: '點擊地圖選擇啟始點',
    click_on_map: true,
    validation: '',
  },
  '#trip_end_point': {
    notify_text: '點擊地圖選擇結束點',
    click_on_map: true,
  },
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

    // get the notify text from current action
    var notify_text = current_action.notify_text
    current_form_element.notify(notify_text)

    return true
  }

  updateStepHint()

  action_button.on('click submit', function(event){
    event.preventDefault()


    current_step++
    if ( updateStepHint() ){
      current_marker = null
    } else {
      console.log('submit form')
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

  })
}