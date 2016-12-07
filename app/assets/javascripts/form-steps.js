var form_steps = {
  '#trip_start_point': {
    notify_text: '點擊地圖選擇啟始點',
  },
  '#trip_end_point': {
    notify_text: '點擊地圖選擇結束點',
  },
}

function initFormSteps(map, form_steps) {
  var current_marker
  var current_step = 0
  var action_button = $('#action-button')
  var setp_keys = Object.keys(form_steps)
  var current_form_element

  function updateStepHint(){
    if(current_form_element){
      $('.notifyjs-wrapper').trigger('notify-hide')
    }
    current_form_element = $(setp_keys[current_step])
    var notify_text = form_steps[setp_keys[current_step]].notify_text
    current_form_element.notify(notify_text)
  }

  updateStepHint()

  action_button.on('click submit', function(event){
    event.preventDefault()

    current_step++
    updateStepHint()
    current_marker = null
  })

  google.maps.event.addListener(map, 'click', function(event) {
    // remove last marker
    if (current_marker){
      current_marker.setMap(null)
    }
    current_marker = new google.maps.Marker({position: event.latLng, map: map});
    // debugger

    var form_value = event.latLng.toJSON()
    form_value = JSON.stringify(form_value)
    current_form_element.val(form_value)
  })
}