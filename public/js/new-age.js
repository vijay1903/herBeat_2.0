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
  $('#v-pills-info-tab').click();
})
$('#view_activities').on('click', function(){
  $('#v-pills-info-tab').click();
})
$('#view_response').on('click', function(){
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