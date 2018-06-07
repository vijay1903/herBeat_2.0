(function($) {
  "use strict"; // Start of use strict

  // Smooth scrolling using jQuery easing
  $('a.js-scroll-trigger[href*="#"]:not([href="#"])').click(function() {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var target = $(this.hash);
      target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
      if (target.length) {
        $('html, body').animate({
          scrollTop: (target.offset().top - 48)
        }, 1000, "easeInOutExpo");
        return false;
      }
    }
  });
  // Closes responsive menu when a scroll trigger link is clicked
  $('.js-scroll-trigger').click(function() {
    $('.navbar-collapse').collapse('hide');
  });

  // Activate scrollspy to add active class to navbar items on scroll
  $('body').scrollspy({
    target: '#mainNav',
    offset: 54
  });

  // Collapse Navbar
  var navbarCollapse = function() {
    if ($("#mainNav").offset().top > 100) {
      $("#mainNav").addClass("navbar-shrink");
    } else {
      $("#mainNav").removeClass("navbar-shrink");
    }
  };
  // Collapse now if page is not at top
  navbarCollapse();
  // Collapse the navbar when page is scrolled
  $(window).scroll(navbarCollapse);
  

})(jQuery); // End of use strict


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
