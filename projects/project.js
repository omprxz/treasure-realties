/* ===== PROJECT PAGES — SHARED JS ===== */
/* Requires jQuery */

$(document).ready(function () {

  /* ── Header Scroll ── */
  $(window).on('scroll', function () {
    if ($(this).scrollTop() > 60) {
      $('.proj-header').addClass('scrolled');
    } else {
      $('.proj-header').removeClass('scrolled');
    }
  });

  /* Animate hero BG on load */
  setTimeout(function () { $('.proj-hero-bg').addClass('loaded'); }, 100);

  /* ── Mobile Nav ── */
  $('.proj-hamburger').on('click', function () {
    $('.proj-mobile-nav, .proj-mobile-overlay').addClass('open');
    $('body').css('overflow', 'hidden');
  });
  $(document).on('click', '.proj-mobile-overlay, .proj-mobile-nav a', function () {
    $('.proj-mobile-nav, .proj-mobile-overlay').removeClass('open');
    $('body').css('overflow', '');
  });

  /* ── Multi-Row Gallery Carousel ── */
  (function () {
    var $track = $('.gallery-track');
    if (!$track.length) return;

    var $slides = $track.children('.gallery-slide');
    var total = $slides.length;
    var current = 0;
    var interval;

    /* Slides-per-view based on viewport */
    function getSPV() {
      var w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 640)  return 2;
      return 1;
    }

    /* Max navigable index */
    function maxIdx() { return Math.max(0, total - getSPV()); }

    /* Build dots (one per navigable position) */
    var $dotsWrap = $('.gallery-dots');
    function buildDots() {
      var count = maxIdx() + 1;
      $dotsWrap.empty();
      for (var i = 0; i < count; i++) {
        $dotsWrap.append('<button class="gallery-dot' + (i === 0 ? ' active' : '') + '" aria-label="Go to slide ' + (i + 1) + '"></button>');
      }
    }

    function goTo(idx) {
      var spv = getSPV();
      current = Math.max(0, Math.min(idx, maxIdx()));
      /* Each slide is (100 / spv)% wide, so offset = current * (100/spv) % of track width */
      var pct = current * (100 / spv);
      $track.css('transform', 'translateX(-' + pct + '%)');
      /* Update dots */
      $('.gallery-dot').removeClass('active').eq(current).addClass('active');
    }

    function startAuto() {
      interval = setInterval(function () { goTo(current + 1 > maxIdx() ? 0 : current + 1); }, 3800);
    }
    function resetAuto() { clearInterval(interval); startAuto(); }

    buildDots();
    goTo(0);
    startAuto();

    /* Dot click */
    $dotsWrap.on('click', '.gallery-dot', function () {
      clearInterval(interval);
      goTo($(this).index());
      startAuto();
    });

    /* Nav buttons (prev/next injected in nav) */
    $(document).on('click', '.gallery-nav-btn.prev', function () { resetAuto(); goTo(current - 1); });
    $(document).on('click', '.gallery-nav-btn.next', function () { resetAuto(); goTo(current + 1 > maxIdx() ? 0 : current + 1); });

    /* Rebuild on resize */
    var resizeTimer;
    $(window).on('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        buildDots();
        goTo(Math.min(current, maxIdx()));
      }, 200);
    });

    /* Build lightbox images list from slides */
    function getAllImgs() {
      var imgs = [];
      $slides.each(function () { imgs.push($(this).find('img').attr('src')); });
      return imgs;
    }

    /* Click any slide → lightbox */
    $track.on('click', '.gallery-slide', function () {
      var src = $(this).find('img').attr('src');
      openLightbox(src, getAllImgs());
    });
  })();

  /* ── Lightbox Slider logic ── */
  var $lb = $('.lightbox-overlay');
  var lbImages = [];
  var lbIdx = 0;

  function buildLightboxDOM() {
    /* Reconstruct internal structure for slider if not already done */
    if (!$lb.find('.lightbox-slider').length) {
      $lb.html(`
        <button class="lightbox-close">&times;</button>
        <button class="lightbox-prev"><i class="fa fa-chevron-left"></i></button>
        <div class="lightbox-img-wrap">
          <div class="lightbox-slider"></div>
        </div>
        <button class="lightbox-next"><i class="fa fa-chevron-right"></i></button>
      `);
    }
  }

  function openLightbox(src, images) {
    buildLightboxDOM();
    lbImages = images || [src];
    lbIdx = images ? Math.max(0, images.indexOf(src)) : 0;

    var $slider = $('.lightbox-slider');
    $slider.empty();

    lbImages.forEach(function(imgSrc) {
      $slider.append(`<div class="lightbox-slide"><img src="${imgSrc}" alt="" /></div>`);
    });

    /* Disable transitions temporarily when opening to jump to correct slide */
    $slider.css('transition', 'none');
    updateLightboxPos();
    
    $lb.addClass('open');
    $('body').css('overflow', 'hidden');
    
    /* Re-enable transitions */
    setTimeout(function() {
      $slider.css('transition', '');
    }, 50);
  }

  function updateLightboxPos() {
    var $slider = $('.lightbox-slider');
    $slider.css('transform', `translateX(-${lbIdx * 100}%)`);
  }

  function closeLightbox() {
    $lb.removeClass('open');
    $('body').css('overflow', '');
  }

  /* Improved lightbox events */
  $(document).on('click', '.lightbox-close', closeLightbox);
  $(document).on('click', '.lightbox-overlay', function (e) { 
    /* Close on background click only */
    if ($(e.target).is('.lightbox-overlay, .lightbox-slide')) closeLightbox(); 
  });

  $(document).on('click', '.lightbox-prev', function (e) {
    e.stopPropagation();
    lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length;
    updateLightboxPos();
  });

  $(document).on('click', '.lightbox-next', function (e) {
    e.stopPropagation();
    lbIdx = (lbIdx + 1) % lbImages.length;
    updateLightboxPos();
  });

  /* ── Touch Swipe for Lightbox ── */
  var touchStartX = 0;
  var touchEndX = 0;

  $(document).on('touchstart', '.lightbox-slider', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  $(document).on('touchend', '.lightbox-slider', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});

  function handleSwipe() {
    var threshold = 50;
    if (touchEndX < touchStartX - threshold) {
      /* Swipe Left -> Next */
      lbIdx = (lbIdx + 1) % lbImages.length;
      updateLightboxPos();
    }
    if (touchEndX > touchStartX + threshold) {
      /* Swipe Right -> Prev */
      lbIdx = (lbIdx - 1 + lbImages.length) % lbImages.length;
      updateLightboxPos();
    }
  }

  /* Masterplan lightbox — bind to card but skip button/link clicks */
  $(document).on('click', '.masterplan-card', function (e) {
    /* If the click target is a button or anchor (or inside one), open brochure modal instead */
    if ($(e.target).is('button, a, .btn-gold, .open-brochure-btn') ||
        $(e.target).closest('button, a, .btn-gold, .open-brochure-btn').length) {
      return;
    }
    var $img = $(this).find('img');
    if (!$img.length) return; /* empty placeholder cards — do nothing */
    var src = $img.attr('src');
    var all = [];
    $('.masterplan-card img').each(function () { all.push($(this).attr('src')); });
    openLightbox(src, all);
  });

  $(document).on('keydown', function (e) {
    if ($lb.hasClass('open')) {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') $('.lightbox-prev').click();
      if (e.key === 'ArrowRight') $('.lightbox-next').click();
    }
    if ($('.brochure-modal-overlay').hasClass('open') && e.key === 'Escape') {
      $('.brochure-modal-overlay').removeClass('open');
      $('body').css('overflow', '');
    }
  });

  /* ── Brochure Modal ── */
  $(document).on('click', '.open-brochure-btn', function (e) {
    e.preventDefault();
    $('.brochure-modal-overlay').addClass('open');
    $('body').css('overflow', 'hidden');
  });
  $(document).on('click', '.brochure-modal-close', function () {
    $('.brochure-modal-overlay').removeClass('open');
    $('body').css('overflow', '');
  });
  $(document).on('click', '.brochure-modal-overlay', function (e) {
    if ($(e.target).is('.brochure-modal-overlay')) {
      $('.brochure-modal-overlay').removeClass('open');
      $('body').css('overflow', '');
    }
  });

  $(document).on('submit', '#brochureForm', function (e) {
    e.preventDefault();
    var $btn = $(this).find('.bm-submit');
    var orig = $btn.html();
    $btn.html('<i class="fa fa-spinner fa-spin"></i> Sending\u2026').prop('disabled', true);
    setTimeout(function () {
      $btn.html('<i class="fa fa-check"></i> Brochure Sent!').css('background', '#2e7d32');
      setTimeout(function () {
        $btn.html(orig).prop('disabled', false).css('background', '');
        $('.brochure-modal-overlay').removeClass('open');
        $('body').css('overflow', '');
        $('#brochureForm')[0].reset();
      }, 2800);
    }, 1200);
  });

});
