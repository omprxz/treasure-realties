/* ===== TREASURE REALTIES — script.js ===== */
/* Requires: jQuery */

$(document).ready(function () {

  /* ── Active nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || 'index.html';
  $('.nav-links a, .mobile-menu a').each(function () {
    var href = $(this).attr('href');
    if (href === currentPage) $(this).addClass('active');
  });

  /* ── Sticky header scroll effect ── */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('#header').addClass('scrolled');
    } else {
      $('#header').removeClass('scrolled');
    }
  });

  /* ── Hamburger + Mobile Menu ── */
  var menuOpen = false;

  function openMenu() {
    menuOpen = true;
    $('.hamburger').addClass('open');
    $('.mobile-menu').addClass('open');
    $('.mobile-menu-overlay').addClass('open');
    $('body').css('overflow', 'hidden');
  }

  function closeMenu() {
    menuOpen = false;
    $('.hamburger').removeClass('open');
    $('.mobile-menu').removeClass('open');
    $('.mobile-menu-overlay').removeClass('open');
    $('body').css('overflow', '');
  }

  $('.hamburger').on('click', function () {
    menuOpen ? closeMenu() : openMenu();
  });

  $('.mobile-menu-overlay').on('click', closeMenu);
  $('.mobile-menu a').on('click', closeMenu);

  /* ── Hero Slider ── */
  if ($('.hero-slider').length) {
    var currentSlide = 0;
    var slides = $('.slide');
    var dots = $('.slider-dot');
    var slideCount = slides.length;
    var autoPlay;

    function goToSlide(index) {
      slides.eq(currentSlide).removeClass('active');
      dots.eq(currentSlide).removeClass('active');
      currentSlide = (index + slideCount) % slideCount;
      slides.eq(currentSlide).addClass('active');
      dots.eq(currentSlide).addClass('active');
    }

    function startAutoPlay() {
      autoPlay = setInterval(function () {
        goToSlide(currentSlide + 1);
      }, 5500);
    }

    function resetAutoPlay() {
      clearInterval(autoPlay);
      startAutoPlay();
    }

    goToSlide(0);
    startAutoPlay();

    $('.slider-arrow.next').on('click', function () { goToSlide(currentSlide + 1); resetAutoPlay(); });
    $('.slider-arrow.prev').on('click', function () { goToSlide(currentSlide - 1); resetAutoPlay(); });
    dots.on('click', function () { goToSlide($(this).index()); resetAutoPlay(); });
  }

  /* ── FAQ Accordion ── */
  $('.faq-question').on('click', function () {
    var item = $(this).closest('.faq-item');
    var answer = item.find('.faq-answer');
    var isOpen = item.hasClass('open');

    $('.faq-item.open').each(function () {
      $(this).removeClass('open');
      $(this).find('.faq-answer').css('max-height', '');
    });

    if (!isOpen) {
      item.addClass('open');
      answer.css('max-height', answer[0].scrollHeight + 'px');
    }
  });

  /* ── Smooth number counter (stats) ── */
  function animateCounters() {
    $('.stat-number[data-target]').each(function () {
      var $el = $(this);
      var target = parseInt($el.data('target'), 10);
      var suffix = $el.data('suffix') || '';
      var duration = 1800;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var ease = 1 - Math.pow(1 - progress, 3);
        $el.text(Math.floor(ease * target) + suffix);
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  var countersRun = false;
  if ($('.stats-section').length) {
    $(window).on('scroll.stats', function () {
      var statsTop = $('.stats-section').offset().top;
      var viewBottom = $(window).scrollTop() + $(window).height();
      if (!countersRun && viewBottom > statsTop + 80) {
        countersRun = true;
        animateCounters();
        $(window).off('scroll.stats');
      }
    });
  }

  /* ── Contact page form submission ── */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    var btn = $(this).find('.form-btn');
    var origHTML = btn.html();
    btn.html('Sending… <i class="fa fa-spinner fa-spin" style="margin-left:8px;"></i>').prop('disabled', true);
    setTimeout(function () {
      btn.html('Message Sent! <i class="fa fa-check" style="margin-left:8px;"></i>');
      setTimeout(function () { btn.html(origHTML).prop('disabled', false); }, 3000);
    }, 1200);
  });

  /* ── Duplicate marquee items for seamless loop ── */
  if ($('.marquee-track').length) {
    var $track = $('.marquee-track');
    $track.html($track.html() + $track.html());
  }

  /* ── MODAL: Open / Close ── */
  function openModal() {
    $('#contactModal').fadeIn(200);
    $('body').css('overflow', 'hidden');
  }

  function closeModal() {
    $('#contactModal').fadeOut(200);
    $('body').css('overflow', '');
  }

  /* All modal triggers: nav CTA, email float, services/about enquiry CTAs, mobile hero CTA */
  $(document).on('click', '#navGetInTouch, #emailFloatBtn, .open-modal-btn', function (e) {
    e.preventDefault();
    openModal();
  });

  /* Close: X button */
  $(document).on('click', '#modalClose', function () {
    closeModal();
  });

  /* Close: click outside modal box */
  $(document).on('click', '#contactModal', function (e) {
    if ($(e.target).is('#contactModal')) {
      closeModal();
    }
  });

  /* Close: ESC key */
  $(document).on('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* Modal form submit */
  $(document).on('submit', '#modalContactForm', function (e) {
    e.preventDefault();
    var btn = $(this).find('button[type="submit"]');
    var origHTML = btn.html();
    btn.html('Sending… <i class="fa fa-spinner fa-spin" style="margin-left:8px;"></i>').prop('disabled', true);
    setTimeout(function () {
      btn.html('Enquiry Sent! <i class="fa fa-check" style="margin-left:8px;"></i>');
      setTimeout(function () {
        btn.html(origHTML).prop('disabled', false);
        closeModal();
        $('#modalContactForm')[0].reset();
      }, 2500);
    }, 1200);
  });

  /* ── Hero Slide Enquiry Forms (all 3 slides share same handler) ── */
  $(document).on('submit', '.slide-enquiry-form', function (e) {
    e.preventDefault();
    var $form = $(this);
    var btn = $form.find('.hero-form-btn');
    var origHTML = btn.html();
    btn.html('Sending… <i class="fa fa-spinner fa-spin" style="margin-left:8px;"></i>').prop('disabled', true);
    setTimeout(function () {
      btn.html('Thank You! We\'ll Call You Back <i class="fa fa-check" style="margin-left:8px;"></i>');
      setTimeout(function () {
        btn.html(origHTML).prop('disabled', false);
        $form[0].reset();
      }, 3000);
    }, 1200);
  });

  /* ── Smooth scroll to hash section (footer service deep links) ── */
  if (window.location.hash) {
    var $target = $(window.location.hash);
    if ($target.length) {
      setTimeout(function () {
        $('html, body').animate({ scrollTop: $target.offset().top - 90 }, 600);
      }, 300);
    }
  }

});
