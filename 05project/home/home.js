let alarmList = [];
let alarmIncrement = 1;

function timeLoop() {
  setInterval(function () {
    var t = new Date();
    document.getElementById('time').innerHTML = t;
  }, 1000);
}

//Dynamic Content
function loadDynamicContent() {
  var image = new Image(); // image
  image.src = wakeUpImage;
  var h1Tag = document.querySelector('h1');

  h1Tag.parentNode.insertBefore(image, h1Tag.nextSibling);
  document.body.style.backgroundColor = backgroundColor; // background color
}

function loadAlarmDropdowns() {
  var formDropdown = document.getElementById('timeDropdown');
  var tt = 0,
    ap = ['AM', 'PM'];
  for (var i = 0; tt < 24 * 60; i++) {
    var hh = Math.floor(tt / 60);
    var mm = tt % 60;
    var newTime =
      ('' + (hh == 12 ? 12 : hh % 12)).slice(-2) +
      ':' +
      ('0' + mm).slice(-2) +
      ap[Math.floor(hh / 12)];
    var option = document.createElement('option');
    option.text = newTime;
    formDropdown.add(option);
    tt += alarmIncrement;
  }
}

function listenForAlarms() {
  // you can use a loop or setInterval,
  // but this function should call checkForAlarm() if the time is the first second in a minute.
  setInterval(function () {
    var d = new Date();
    if (d.getSeconds() === 0) {
      //  && d.getMinutes() % alarmIncrement === 0
      checkForAlarm();
    }
  }, 1000);
}

function checkForAlarm() {
  // use the debugger to get a good feel for everything going on here.
  var d = new Date();
  var h = d.getHours();
  var m = d.getMinutes();
  if (m < 10) {
    m = '0' + m;
  }
  var pmBool = false;
  if (h > 12) {
    pmBool = true;
    h -= 12;
  }
  var timeString = h + ':' + m;
  if (pmBool) {
    timeString += 'PM';
  } else {
    timeString += 'AM';
  }

  // check to see if the time string created above, matches the time that any given alarm is set to.
  const found = alarmList.some((el) => el.time === timeString);
  // if there is a match, call the soundAlarm() function
  if (found) {
    document.getElementById('soundAlarmHack').click();
  }
}

function toggleAlarm() {
  // play the audio from the html file
  document.getElementById('alarm').play();
  let audio = document.getElementById('alarm');
  let div = document.getElementById('alarmSounding');

  if (audio.muted) {
    // unmute it if the alarm is going off now
    audio.muted = false;
    // show/hide the div alarmSounding div
    div.style.display = 'block';
  } else {
    // mute it if the alarm is already going
    audio.muted = true;
    div.style.display = 'none';
  }
}

window.onload = function () {
  timeLoop();
  loadDynamicContent();
  loadAlarmDropdowns();
  listenForAlarms();
};

function createAlarm() {
  let newAlarm = {
    title: alarmForm.alarmTitle.value,
    time: alarmForm.alarmTime.value,
  };
  newAlarm.displayString = newAlarm.title + ': ' + newAlarm.time;

  // make sure newAlarm.title is unique
  const found = alarmList.some((el) => el.title === newAlarm.title);
  // if it is not, display an error for the user
  if (newAlarm.title === '' || found) {
    let errorElement = document.createElement('p');
    errorElement.className = 'error';
    errorElement.appendChild(
      document.createTextNode('Please enter a unique title for your alarm.')
    );
    document.getElementById('submitForm').parentNode.appendChild(errorElement);
  } else {
    // if it is unique, add it to alarmList and display that in the html
    alarmList.push(newAlarm);
    let li = document.createElement('li');
    let textNode = document.createTextNode(newAlarm.displayString);
    li.appendChild(textNode);
    document.getElementById('setAlarms').appendChild(li);
  }
}
