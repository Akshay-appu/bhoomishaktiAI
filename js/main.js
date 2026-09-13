(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner(0);


    // Initiate the wowjs
    new WOW().init();


    // Header carousel
    $(".header-carousel").owlCarousel({
        animateOut: 'fadeOut',
        items: 1,
        margin: 0,
        stagePadding: 0,
        autoplay: true,
        smartSpeed: 1000,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });


   // Service-carousel
   $(".service-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 2000,
    center: false,
    dots: false,
    loop: true,
    margin: 25,
    nav : true,
    navText : [
        '<i class="bi bi-arrow-left"></i>',
        '<i class="bi bi-arrow-right"></i>'
    ],
    responsiveClass: true,
    responsive: {
        0:{
            items:1
        },
        576:{
            items:1
        },
        768:{
            items:2
        },
        992:{
            items:2
        },
        1200:{
            items:2
        }
    }
    });


    // testimonial carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav : false,
        navText : [
            '<i class="fa fa-angle-right"></i>',
            '<i class="fa fa-angle-left"></i>'
        ],
        responsiveClass: true,
        responsive: {
            0:{
                items:1
            },
            576:{
                items:1
            },
            768:{
                items:1
            },
            992:{
                items:1
            },
            1200:{
                items:2
            }
        }
    });


   // Back to top button
   $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    /* =====================================================================
       BhoomiShakti additions below:
       dynamic sticky navigation, agriculture-themed floating leaves,
       animated stat counters, active-link highlighting, a scroll-progress
       ring on the back-to-top button, and a mobile-menu toggler animation.
       Everything here is defensive (checks .length before acting) so it
       runs safely even on pages that don't have a given element.
       ===================================================================== */

    // 1) Sticky navbar that compacts + gets a shadow once you scroll down
    var $headerTop = $('.header-top');
    function refreshNavScrollState() {
        if ($(window).scrollTop() > 40) {
            $headerTop.addClass('nav-scrolled');
        } else {
            $headerTop.removeClass('nav-scrolled');
        }
    }
    if ($headerTop.length) {
        $(window).on('scroll', refreshNavScrollState);
        refreshNavScrollState();
    }


    // 2) Dynamic "active" nav-link highlighting based on the current page,
    //    so the navbar always reflects where you actually are.
    (function highlightActiveNav() {
        var path = window.location.pathname.split('/').pop();
        if (path === '') { path = 'index.html'; }

        var $links = $('.nav-bar .navbar-nav a[href$=".html"]');
        if (!$links.length) { return; }

        $links.each(function () {
            var href = $(this).attr('href');
            $(this).toggleClass('active', href === path);
        });

        // If the active link lives inside the "Pages" dropdown, light up
        // the dropdown's own toggle too so the top-level nav stays accurate.
        var $activeInDropdown = $links.filter('.dropdown-item.active');
        if ($activeInDropdown.length) {
            $activeInDropdown.closest('.dropdown').find('> .nav-link').addClass('active');
        }
    })();


    // 3) Animated count-up for stat numbers (e.g. "25+ years of experience").
    //    Add the class "counter-value" to any element with a leading number
    //    and it will animate into view the first time it's scrolled to.
    function animateCounter($el) {
        var raw = $.trim($el.text());
        var match = raw.match(/\d+/);
        if (!match) { return; }

        var target = parseInt(match[0], 10);
        var prefix = raw.slice(0, match.index);
        var suffix = raw.slice(match.index + match[0].length);
        var duration = 1600;
        var startTime = null;

        function step(timestamp) {
            if (!startTime) { startTime = timestamp; }
            var progress = Math.min((timestamp - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.floor(eased * target);
            $el.text(prefix + current + suffix);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                $el.text(prefix + target + suffix);
            }
        }
        window.requestAnimationFrame(step);
    }

    var $counters = $('.counter-value');
    if ($counters.length) {
        var countersTriggered = new WeakMap();
        function checkCounters() {
            $counters.each(function () {
                if (countersTriggered.get(this)) { return; }
                var rect = this.getBoundingClientRect();
                if (rect.top < window.innerHeight - 40 && rect.bottom > 0) {
                    countersTriggered.set(this, true);
                    animateCounter($(this));
                }
            });
        }
        $(window).on('scroll resize', checkCounters);
        checkCounters();
    }


    // 4) Agriculture-themed floating leaves drifting up through the hero
    //    carousel and the inner-page banner (bg-breadcrumb) sections.
    function spawnLeaves(selector, count) {
        var $container = $(selector);
        if (!$container.length || $container.find('> .leaf-particles').length) { return; }

        var $wrap = $('<div class="leaf-particles" aria-hidden="true"></div>');
        for (var i = 0; i < count; i++) {
            var left = Math.random() * 100;
            var delay = (Math.random() * 12).toFixed(2);
            var duration = (12 + Math.random() * 10).toFixed(2);
            var size = (14 + Math.random() * 16).toFixed(0);
            var drift = Math.round(Math.random() * 80 - 40);
            var spin = Math.random() > 0.5 ? 360 : -360;

            $('<span class="leaf-particle"><i class="fas fa-leaf"></i></span>')
                .css({
                    left: left + '%',
                    fontSize: size + 'px',
                    animationDelay: delay + 's',
                    animationDuration: duration + 's'
                })
                .css('--drift', drift + 'px')
                .css('--spin', spin + 'deg')
                .appendTo($wrap);
        }
        $container.prepend($wrap);
    }
    spawnLeaves('.header-carousel', 16);
    spawnLeaves('.bg-breadcrumb', 10);


    // 5) Circular scroll-progress ring drawn around the back-to-top button.
    var $backToTop = $('.back-to-top');
    if ($backToTop.length) {
        function updateScrollProgress() {
            var scrollTop = $(window).scrollTop();
            var docHeight = $(document).height() - $(window).height();
            var pct = docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0;
            $backToTop.css('--progress', pct + '%');
        }
        $(window).on('scroll', updateScrollProgress);
        updateScrollProgress();
    }


    // 6) Mobile menu: animate the toggler icon and auto-close the menu
    //    after a link is tapped, so navigating feels snappier on phones.
    var $navbarToggler = $('.navbar-toggler');
    var $navbarCollapse = $('#navbarCollapse');
    if ($navbarToggler.length) {
        $navbarToggler.on('click', function () {
            $(this).find('span').toggleClass('fa-bars fa-times');
        });
    }
    if ($navbarCollapse.length) {
        $navbarCollapse.on('hidden.bs.collapse', function () {
            $navbarToggler.find('span').removeClass('fa-times').addClass('fa-bars');
        });
        $navbarCollapse.find('a.nav-link:not(.dropdown-toggle), a.dropdown-item').on('click', function () {
            if ($(window).width() < 992 && $navbarCollapse.hasClass('show')) {
                $navbarCollapse.collapse('hide');
            }
        });
    }


    /* =====================================================================
       "Software" layer: page-load progress bar + smooth page transitions,
       a persisted light/dark theme toggle, and a small toast utility so
       placeholder buttons give real feedback instead of feeling dead.
       ===================================================================== */

    // 7) Top loading bar that plays on every page load, and again as a
    //    quick "leaving" animation right before following an internal link
    //    (this is a static multi-page site, so this fakes an app-like
    //    single-page transition without touching how navigation works).
    var $progressBar = $('#bhoomi-progress-bar');
    if ($progressBar.length) {
        requestAnimationFrame(function () {
            $progressBar.css('width', '70%');
            setTimeout(function () {
                $progressBar.css('width', '100%');
                setTimeout(function () {
                    $progressBar.addClass('is-done');
                }, 250);
            }, 180);
        });
    }
    $('body').addClass('bhoomi-page-fade');

    $(document).on('click', 'a[href]', function (e) {
        var $link = $(this);
        var href = $link.attr('href');

        var skip = !href ||
            href.charAt(0) === '#' ||
            href.indexOf('mailto:') === 0 ||
            href.indexOf('tel:') === 0 ||
            $link.attr('target') === '_blank' ||
            $link.attr('data-bs-toggle') ||
            $link.hasClass('dropdown-toggle') ||
            $link.hasClass('back-to-top') ||
            $link.hasClass('theme-toggle-btn') ||
            /^https?:\/\//i.test(href) && href.indexOf(window.location.hostname) === -1;

        if (skip) { return; }

        e.preventDefault();
        $progressBar.removeClass('is-done').css('width', '35%');
        $('body').addClass('bhoomi-page-leaving');
        setTimeout(function () {
            window.location.href = href;
        }, 260);
    });


    // 8) Light / dark theme toggle, persisted across pages via localStorage.
    var THEME_KEY = 'bhoomi-theme';
    function applyTheme(theme) {
        if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
            $('.theme-toggle-btn i').removeClass('fa-sun').addClass('fa-moon');
        } else {
            document.documentElement.removeAttribute('data-theme');
            $('.theme-toggle-btn i').removeClass('fa-moon').addClass('fa-sun');
        }
    }
    var savedTheme = null;
    try { savedTheme = window.localStorage.getItem(THEME_KEY); } catch (err) { /* storage blocked, ignore */ }
    applyTheme(savedTheme === 'light' ? 'light' : 'dark');

    $('.theme-toggle-btn').on('click', function () {
        var isLight = document.documentElement.getAttribute('data-theme') === 'light';
        var next = isLight ? 'dark' : 'light';
        applyTheme(next);
        try { window.localStorage.setItem(THEME_KEY, next); } catch (err) { /* ignore */ }
    });


    // 9) Tiny toast utility, used to give real feedback on demo/placeholder
    //    controls (newsletter form, social icons, "coming soon" buttons)
    //    so nothing in the UI feels broken or dead.
    function showToast(message, icon) {
        var $container = $('#bhoomi-toast-container');
        if (!$container.length) { return; }
        var $toast = $('<div class="bhoomi-toast"><i class="fas ' + (icon || 'fa-leaf') + '"></i><span></span></div>');
        $toast.find('span').text(message);
        $container.append($toast);
        requestAnimationFrame(function () { $toast.addClass('show'); });
        setTimeout(function () {
            $toast.removeClass('show');
            setTimeout(function () { $toast.remove(); }, 400);
        }, 3200);
    }
    window.bhoomiToast = showToast;

    // Newsletter subscribe form in the footer
    $('.footer .form-control').closest('.position-relative').find('.btn').on('click', function (e) {
        e.preventDefault();
        var $input = $(this).siblings('.form-control');
        var email = $.trim($input.val());
        var validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (validEmail) {
            showToast('Thanks for subscribing! We\'ll keep you posted.', 'fa-seedling');
            $input.val('');
        } else {
            showToast('Please enter a valid email address.', 'fa-exclamation-circle');
        }
    });

    // Any placeholder "#" link that isn't a real UI control (dropdowns,
    // tabs, the mobile toggler, back-to-top, etc.) gets a friendly toast
    // instead of silently doing nothing.
    $('a[href="#"]').not('.dropdown-toggle, .back-to-top, .navbar-brand, .navbar-brand-2, [data-bs-toggle], [data-lang]').on('click', function (e) {
        e.preventDefault();
        showToast('This demo action is coming soon.', 'fa-leaf');
    });

})(jQuery);
