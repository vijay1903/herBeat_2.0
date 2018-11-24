function setCookie(cname,cvalue,exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires=" + d.toGMTString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
          c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
      }
  }
  return "";
}

if(getCookie("active_pill") != ""){
  var active_one = "#"+getCookie("active_pill");
  $(active_one).click();
}

var dock_list = document.querySelectorAll(".dock-link");
dock_list.forEach(pill => {
  pill.addEventListener('click',function(){
    setCookie("active_pill",this.id,1);
  })
});

var pill_list = document.querySelectorAll(".nav-link");
pill_list.forEach(pill => {
  pill.addEventListener('click',function(){
    setCookie("active_pill",this.id,1);
  })
});

var check = function() {
  if (document.getElementById('password1').value == document.getElementById('password2').value) {
      document.getElementById('confirm_message').style.color = 'green';
      document.getElementById('password2').style.borderColor = 'green';
      document.getElementById('confirm_message').innerHTML = '<i class="fa fa-check"></i>Passwords match.';
  } else {
  document.getElementById('confirm_message').style.color = 'red';
  document.getElementById('password2').style.borderColor = 'red';
  document.getElementById('confirm_message').innerHTML = '<i class="fa fa-times"></i>Passwords do not match!!';
  }
}

$(document).on("click",".new_user",function(){
  $('#loginModal').modal('hide');
  $('#signupModal').modal('show');
});

$(document).on("click","#flip2",function(){
    $('#panel').slideUp('slow');
  });


$(document).on("click","#flip1",function(){
    $('#panel').slideUp('slow');
  });




var favicon_images = [],
    image_counter = 0; // To keep track of the current image

for(var i = 1; i <= 125; i++ ){
  favicon_images[i-1] = '../img/favicon_frames/heartbeat'+i+'.png';
}



// setInterval(function() {
//     $("link[rel='icon']").remove();
//     $("link[rel='shortcut icon']").remove();
//     $("head").append('<link rel="icon" href="../img/' + favicon_images[image_counter] + '" type="image/gif">');
    
// 	// If last image then goto first image
// 	// Else go to next image    
// 	if(image_counter == favicon_images.length -1)
//         image_counter = 0;
//     else
//         image_counter++;
// }, 20);


$('#loginModal').on('shown.bs.modal', function() {
    $(this).find('input:first').focus();
});

$('#signupModal').on('shown.bs.modal', function() {
    $(this).find('input:first').focus();
});

$('userBtn').on('click',function(){
  $(this).toggle('aria-expanded:true');
});

$('#view_goals').on('click', function(){
  $('#v-pills-tasks-tab').click();
})
$('#view_activities').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#view_response').on('click', function(){
  $('#v-pills-responses-tab').click();
})
$('#view_response_1').on('click', function(){
  $('#v-pills-responses-tab').click();
})
$('#view_messages').on('click', function(){
  $('#v-pills-messages-tab').click();
})
$('#view_heart').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#view_radar').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#view_goals_1').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#view_goals_2').on('click', function(){
  $('#v-pills-info-tab').click();
})


// date range picker start
// $(function() {
// $("#e1").daterangepicker({
//   presetRanges: [{
//       text: 'Today',
//       dateStart: function() { return moment().set({hour:0,minute:0,second:0,millisecond:0}) },
//       dateEnd: function() { return moment().set({hour:0,minute:0,second:0,millisecond:0}) }
//   }, {
//       text: 'Yesterday',
//       dateStart: function() { return moment().subtract(1, 'days').set({hour:0,minute:0,second:0,millisecond:0}) },
//       dateEnd: function() { return moment().subtract(1, 'days').set({hour:0,minute:0,second:0,millisecond:0}) }
//   }, {
//       text: 'Last 7 Days',
//       dateStart: function() { return moment().subtract(6, 'days').set({hour:0,minute:0,second:0,millisecond:0}) },
//       dateEnd: function() { return moment().set({hour:0,minute:0,second:0,millisecond:0}) }
//   },
//   {
//     text: 'This Month',
//     dateStart: function() { return moment().startOf('month').set({hour:0,minute:0,second:0,millisecond:0}) },
//     dateEnd: function() { return moment().set({hour:0,minute:0,second:0,millisecond:0}) }
//   }, {
//       text: 'Last Month',
//       dateStart: function() { return moment().subtract(1, 'months').startOf('month').set({hour:0,minute:0,second:0,millisecond:0}) },
//       dateEnd: function() { return moment().subtract(1, 'months').endOf('month').set({hour:0,minute:0,second:0,millisecond:0}) }
//   }],
//   applyOnMenuSelect: false,
//   datepickerOptions: {
//       minDate: null,
//       maxDate: 0
//   }
// });
// });
// date range picker end


// chart colors
// window.chartColors = {
// 	red: 'rgb(255, 99, 132)',
// 	orange: 'rgb(255, 159, 64)',
// 	yellow: 'rgb(255, 205, 86)',
// 	green: 'rgb(75, 192, 192)',
// 	blue: 'rgb(54, 162, 235)',
// 	purple: 'rgb(153, 102, 255)',
// 	grey: 'rgb(201, 203, 207)'
// };
// var color = Chart.helpers.color;
// window.onload = function() {
//   var ctx = document.getElementById('bar').getContext('2d');
//   window.myBar = new Chart(ctx, {
//     type: 'bar',
//     data: {datasets: [{
//       backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
//       borderColor: window.chartColors.red,
//       borderWidth: 1}]}
//   });

// };

//adding a loader

var myVar;

function myFunction() {
    // document.getElementById("overlay").style.display = "block";
    myVar = setTimeout(showPage, 50);
}

function showPage() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("loader").style.display = "none";
  document.getElementById("dashboard").style.display = "initial";
}

// $(document).ready(function(){
//   $('#myChat').animate({
//       scrollTop: $('#myChat')[0].scrollHeight}, 1000);
// });

// $('#collapse_toggle').on('click',function() {
//   $('#dashboard').scrollTop(0);
// });


// var range_start, range_end;

// $(function() {

//   var start = moment().hour(0).minute(0).second(0);
//   var end = moment();
  
//   function cb(start, end) {
//       $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
//       // range_start = start;
//       // range_end = end;
//       console.log('data : ', start._d, end._d);
//   }
//   // console.log(range_start, range_end);
//   $('#reportrange').daterangepicker({
//       startDate: start,
//       endDate: end,
//       minDate: moment('2018-04-02').format('YYYY-MM-DD'),
//       maxDate: moment(),
//       ranges: {
//          'Today': [moment(), moment()],
//          'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
//          'Last 7 Days': [moment().subtract(6, 'days'), moment()],
//          'Last 30 Days': [moment().subtract(29, 'days'), moment()],
//          'This Month': [moment().startOf('month'), moment().endOf('month')],
//          'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
//       }
//   }, cb);

//   cb(start, end);

// });

function toggle_navbar() {
  if(window.innerWidth < 900){
    if(document.getElementById('navbarSupportedContent').style.height == '100vh'){
      document.getElementById('navbarSupportedContent').style.height = '0px';
    } else {
      document.getElementById('navbarSupportedContent').style.height = '100vh';
    }
  } else {
    if(document.getElementById('navbarSupportedContent').style.width == '200px'){
      document.getElementById('navbarSupportedContent').style.width = '60px';
    } else {
      document.getElementById('navbarSupportedContent').style.width = '200px';
    }
  }
}

$('#v-pills-tasks-tab-2').on('click', function(){
  $('#v-pills-tasks-tab').click();
})
$('#v-pills-dash-tab-2').on('click', function(){
  $('#v-pills-dash-tab').click();
})
$('#v-pills-responses-tab-2').on('click', function(){
  $('#v-pills-responses-tab').click();
})
$('#v-pills-messages-tab-2').on('click', function(){
  $('#v-pills-messages-tab').click();
})
$('#v-pills-info-tab-2').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#v-pills-issue-tab-2').on('click', function(){
  $('#v-pills-issue-tab').click();
})
$('#notificationBell').on('click', function(){
  $('#notificationBell').removeClass('notification');
  // console.log("Bell clicked");
  $('#v-pills-issue-tab').click();
})
$('#v-pills-issue-tab').on('click',function(){
  $('#notificationBell').removeClass("notification");
});

function plusSlides(x){
  var pos = document.getElementById('dock-list').scrollLeft;
  var w = (screen.width)/4;
  document.getElementById('dock-list').scrollLeft = pos+(w*x);
}
if(window.screen.width < 1000){
  if(document.getElementById('chat_message')){
    document.getElementById('chat_message').onfocus = function(){
      document.getElementById('dock').style.display = 'none';
    };

    document.getElementById('chat_message').onfocusout = function(){
      document.getElementById('dock').style.display = 'initial';
    };
  }
}

function activate(name){
  var parent = document.getElementById(name).parentElement;
  var children = parent.children;
  for (let i = 0; i < children.length; i++) {
      const element = children[i];
      if(element.getAttribute('id') == name){
          element.classList.add('active-crousel');
      } else {
          element.classList.remove('active-crousel');
      }
  }
}

function showGoals(){
  var e = document.getElementById('goal_select');
  var number =  e.options[e.selectedIndex].value;
  var canvases = document.querySelector('#fullscreenGoalsModalBody div').children;
  for (let i = 0; i < canvases.length; i++) {
    const c = canvases[i];
    var id = '#fullscreenGoals'+i;
    if(i == number){
      document.querySelector(id).style.display = 'initial';
    } else {
      document.querySelector(id).style.display = 'none';
    }
  }

}