/* ===== TREASURE REALTIES — script.js ===== */
/* Requires: jQuery */

$(document).ready(function () {

  /* ── Active nav link ── */
  var currentPage = window.location.pathname.split('/').pop() || '/';
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

  /* ── SweetAlert2 Toast Configuration ── */
  const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 4000,
    timerProgressBar: true,
    customClass: {
      container: 'swal2-topmost'
    },
    didOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer);
      toast.addEventListener('mouseleave', Swal.resumeTimer);
    }
  });

  /* ── Combined Form Handler function ── */
  function handleFormSubmit($form, formLabel, successMsg) {
    var $btn = $form.find('button[type="submit"]');
    var origHTML = $btn.html();
    
    /* Change button state */
    $btn.html('Sending\u2026 <i class="fa fa-spinner fa-spin" style="margin-left:8px;"></i>').prop('disabled', true);

    /* Gather data */
    var formData = new FormData($form[0]);
    formData.append('form_label', formLabel);

    /* AJAX request */
    $.ajax({
      url: '/api/sendmail.php',
      method: 'POST',
      data: formData,
      processData: false,
      contentType: false,
      success: function(response) {
        Toast.fire({
          icon: 'success',
          title: response.message || 'Sent successfully!'
        });
        $form[0].reset();
        if ($form.attr('id') === 'modalContactForm') closeModal();
      },
      error: function(xhr) {
        var err = xhr.responseJSON ? xhr.responseJSON.message : 'Oops! Something went wrong.';
        Toast.fire({
          icon: 'error',
          title: err
        });
      },
      complete: function() {
        $btn.html(origHTML).prop('disabled', false);
      }
    });
  }

  /* ── Page-specific form bindings ── */
  $('#contactForm').on('submit', function (e) {
    e.preventDefault();
    handleFormSubmit($(this), 'Contact Page Form', 'Message Sent!');
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
    handleFormSubmit($(this), 'Modal Quick Enquiry', 'Enquiry Sent!');
  });

  /* ── Hero Slide Enquiry Forms ── */
  $(document).on('submit', '.slide-enquiry-form', function (e) {
    e.preventDefault();
    handleFormSubmit($(this), 'Hero Slide Form', 'Thank You!');
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
