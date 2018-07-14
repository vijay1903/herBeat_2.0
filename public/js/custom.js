// (function($) {
//   "use strict"; // Start of use strict

//   // Smooth scrolling using jQuery easing
//   $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
//     if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
//       var target = $(this.hash);
//       target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
//       if (target.length) {
//         $('html, body').animate({
//           scrollTop: (target.offset().top - 48)
//         }, 1000, "easeInOutExpo");
//         return false;
//       }
//     }
//   });
//   // Closes responsive menu when a scroll trigger link is clicked
//   $('.js-scroll-trigger').click(function() {
//     $('.navbar-collapse').collapse('hide');
//   });

//   // Activate scrollspy to add active class to navbar items on scroll
//   $('body').scrollspy({
//     target: '#mainNav',
//     offset: 54
//   });

//   // Collapse Navbar
//   var navbarCollapse = function() {
//     if ($("#mainNav").offset().top > 100) {
//       $("#mainNav").addClass("navbar-shrink");
//     } else {
//       $("#mainNav").removeClass("navbar-shrink");
//     }
//   };
//   // Collapse now if page is not at top
//   navbarCollapse();
//   // Collapse the navbar when page is scrolled
//   $(window).scroll(navbarCollapse);
  

// })(jQuery); // End of use strict


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

$('#collapse_toggle').on('click',function() {
  $('#dashboard').scrollTop(0);
});


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
