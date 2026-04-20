$(function () {
    const $menuBtn = $('#menuBtn');
    const $mobileNav = $('#mobileNav');
    const $links = $('a[href^="#"]');

    $menuBtn.on('click', function () {
        $mobileNav.stop(true, true).slideToggle(180);
    });

    $('.mobile-link').on('click', function () {
        $mobileNav.slideUp(160);
    });

    $links.on('click', function (event) {
        const target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').animate({
                scrollTop: target.offset().top - 78
            }, 450);
        }
    });

    let activeIndex = 0;
    const totalSlides = $('.testimonial-item').length;

    function showSlide(index) {
        activeIndex = index;
        $('#testimonialTrack').css('transform', `translateX(-${index * (100 / totalSlides)}%)`);
        $('.dot').removeClass('active-dot');
        $(`.dot[data-index="${index}"]`).addClass('active-dot');
    }

    $('.dot').on('click', function () {
        const index = Number($(this).data('index'));
        showSlide(index);
    });

    setInterval(function () {
        const next = (activeIndex + 1) % totalSlides;
        showSlide(next);
    }, 4200);

    $('#year').text(new Date().getFullYear());
});