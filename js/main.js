$(document).ready(function() {

  $('a.blog-button').click(function() {
    // If already in blog, return early without animate overlay panel again.
    if (location.hash && location.hash == "#blog") return;
    if ($('.panel-cover').hasClass('panel-cover--collapsed')) return;
    $('.main-post-list').removeClass('hidden');
    currentWidth = $('.panel-cover').width();
    if (currentWidth < 960) {
      $('.panel-cover').addClass('panel-cover--collapsed');
    } else {
      $('.panel-cover').css('max-width',currentWidth);
      $('.panel-cover').animate({'maxWidth': '30%', 'width': '30%'}, 400, swing = 'swing', function() {} );
    }
  });
  
  $('a.index-button').click(function() {
    // If already in Index, return early without animate overlay panel again.
    if (!location.hash || location.hash=="#") return;
	currentWidth = $('.panel-cover').width();
	$('.panel-cover').removeClass('panel-cover--collapsed');
	$('.panel-cover').css('maxWidth','30%');
	$('.panel-cover').animate({'maxWidth': '100%', 'width': '100%'}, 400, swing = 'swing', function() {} );
  });

  if (window.location.hash && window.location.hash == "#blog") {
    $('.panel-cover').addClass('panel-cover--collapsed');
    $('.main-post-list').removeClass('hidden');
  }

  if (window.location.pathname.substring(0, 5) == "/tag/") {
    $('.panel-cover').addClass('panel-cover--collapsed');
  }

  $('.btn-mobile-menu__icon').click(function() {
    if ($('.navigation-wrapper').css('display') == "block") {
      $('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.navigation-wrapper').toggleClass('visible animated bounceOutUp');
        $('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
      });
      $('.navigation-wrapper').toggleClass('animated bounceInDown animated bounceOutUp');

    } else {
      $('.navigation-wrapper').toggleClass('visible animated bounceInDown');
    }
    $('.btn-mobile-menu__icon').toggleClass('fa fa-list fa fa-angle-up animated fadeIn');
  });

  $('.navigation-wrapper .blog-button').click(function() {
    if ($('.navigation-wrapper').css('display') == "block") {
      $('.navigation-wrapper').on('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function() {
        $('.navigation-wrapper').off('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend');
      });

    }
    
    $('.btn-mobile-menu__icon').toggleClass('fa fa-list fa fa-angle-up animated fadeIn');
  });
});
