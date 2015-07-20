(function() {
  'use strict';

  $(document).ready(function(){
    $('.logo-carousel').slick({
        slidesToShow: 4,
        infinite: true,
        arrows: true,
        responsive: [
		    {
		      breakpoint: 520,
		      settings: {
		        slidesToShow: 3,
		      }
		    },
		  ]
    });
  });

  $(function() {
    $('a[href*=#]:not([href=#])').click(function() {
      if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
        var target = $(this.hash);
        target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top
          }, 1000);
          return false;
        }
      }
    });

   $('.menu-btn').on('click', function(e) {
      $('.page-wrap').toggleClass("descended");
      $('.menu-btn').toggleClass("full");
      e.preventDefault();
    })

   $('.submenu-btn-plus').on('click', function(e) {
      $('.mobile-submenu').toggleClass("descended");
      $('.submenu-btn-plus').hide();
      $('.submenu-btn-minus').show();
      e.preventDefault();
    });

   $('.submenu-btn-minus').on('click', function(e) {
      $('.mobile-submenu').toggleClass("descended");
      $('.submenu-btn-minus').hide();
      $('.submenu-btn-plus').show();
      e.preventDefault();
    });

  });


})();

