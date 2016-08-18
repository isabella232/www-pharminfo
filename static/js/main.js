(function() {
  document.addEventListener('DOMContentLoaded', function() {
    /* scrollReveal for on-scroll elements animation */
    var reveals = {};
    for (let page of ['index', 'news', 'register']) {
      reveals[page] = {}
    }
    reveals.index = {
      'basic': ['#sales h2, #sales ul.links, #goals li, ' +
                '#main-offer p, #main-offer ol, #stats li'],
      'asc': ['#news article, #news .links',
              '#cloud, #payment, #ars, #security',
              '#order, #sav, #seo, #responsive',
              '#customize dt', '#customize dd'],
      'desc': ['#optiweb, #flexiweb-plus, #flexiweb, #ecoweb'],
      'left': ['#develop, #loyal, #accompaniment'],
      'right': ['#expertise, #satisfaction, #cost']}
    reveals.register = {'basic': ['#subscribe']}

    function add_sr(selectors, side) {
      animation = 'enter ' + side + ', move 150px, wait 0.5s';
      for (let selector of selectors) {
        for (let el of document.querySelectorAll(selector)) {
          el.setAttribute('data-sr', animation);
        }
      }
    };

    for (let page in reveals) {
      for (let type in reveals[page]) {
        if (type === 'basic') {
          add_sr(reveals[page][type], 'bottom');
        }
        else if (type === 'asc' || type === 'desc') {
          for (let selector of reveals[page][type]) {
            var wait;
            type === 'asc' ? wait = 0.5 : wait = 0.9;
            for (let el of document.querySelectorAll(selector)) {
              el.setAttribute(
                'data-sr', 'enter bottom, move 150px, wait ' + wait + 's');
              type === 'asc' ? wait += 0.1 : wait -= 0.1;
            }
          }
        }
        else if (type === 'left') {
          add_sr(reveals[page][type], 'left');
        }
        else if (type === 'right') {
          add_sr(reveals[page][type], 'right');
        }
      }
    }
    /* Add all animations */
    window.sr = new scrollReveal();

    /* Collapsible menu */
    var has_event = false;
    var event = new Event('resize');
    var nav = document.querySelector('nav');

    click_fn = function() {
      if (this.parentElement.classList.contains('open')) {
        this.parentElement.classList.remove('open');
        this.parentElement.classList.add('close');
      }
      else {
        this.parentElement.classList.remove('close');
        this.parentElement.classList.add('open');
      }
    }

    window.addEventListener('resize', function() {
      if (window.innerWidth <= 840) {
        if (!nav.querySelector('span')) {
          for (let i = 0; i < 3; i++) {
            let span = document.createElement('span');
            nav.insertBefore(span, nav.children[0]);
          }
        }
        else if (nav.querySelector('span').style.display === 'none') {
          for (let span of nav.querySelectorAll('span')) {
            span.style.display = 'block';
          }
        }
        if (!has_event) {
          for (let span of nav.querySelectorAll('span')) {
            span.addEventListener('click', click_fn);
          }
          has_event = true;
        }
      }
      else {
        if (has_event) {
          for (let span of nav.querySelectorAll('span')) {
            span.removeEventListener('click', click_fn);
          }
        }
        if (nav.querySelector('span')) {
          for (let span of nav.querySelectorAll('span')) {
            span.style.display = 'none';
          }
        }
      }
    });
    window.dispatchEvent(event);

    /* Arrow to the top */
    var arrow = document.createElement('span');
    arrow.className = 'back-to-top';
    document.body.insertBefore(arrow, null);


    window.addEventListener('scroll', function() {
      if (document.body.scrollTop > window.innerHeight) {
        if (!arrow.classList.contains('fade')) {
          arrow.classList.add('fade');
        }
      }
      else { arrow.classList.remove('fade'); }
    });

    arrow.addEventListener('click', function() {
      document.body.scrollTop = 0;
    });
  });
})();

/* Google maps */
function initMaps() {
  var testimonials_map = new google.maps.Map(
    document.getElementById('testimonials-map'), {
      center: {lat: 45.776999, lng: 4.859773},
      zoom: 15
    });
  var contact_map = new google.maps.Map(
    document.getElementById('contact-map'), {
      center: {lat: 45.776999, lng: 4.859773},
      zoom: 15
    });
}
