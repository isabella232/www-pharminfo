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
      /* Offers toggle slide */
      if (window.innerWidth <= 650) {
        if (!document.body.querySelector('.more')) {
          var more_ul_ids = '#ecoweb, #flexiweb, #optiweb'
          for (let offer of document.body.querySelectorAll(more_ul_ids)) {
            let more = document.createElement('span');
            more.innerHTML = 'voir plus';
            more.classList.add('more');
            offer.insertBefore(more, null);
            more.addEventListener('click', function() {
              this.parentElement.classList.add('more');
              this.parentElement.classList.remove('less');
            });

            let less = document.createElement('span');
            less.innerHTML = 'replier';
            less.classList.add('less');
            offer.insertBefore(less, null);
            less.addEventListener('click', function() {
              this.parentElement.classList.add('less');
              this.parentElement.classList.remove('more');
            });
          }
        }
        else {
          for (let more of document.body.querySelectorAll('.more')) {
            more.style.display = 'block';
          }
          for (let less of document.body.querySelectorAll('.less')) {
            less.style.display = 'none';
          }
        }
      }
      else if (document.body.querySelector('.more')) {
        for (let span of document.body.querySelectorAll('.more, .less')) {
          span.style.display = 'none';
        }
      }

      if (window.innerWidth <= 840) {
        if (!nav.querySelector('div')) {
          var div = document.createElement('div');
          for (let i = 0; i < 6; i++) {
            let span = document.createElement('span');
            div.insertBefore(span, null);
          }
          nav.insertBefore(div, nav.children[0]);
        }
        else if (nav.querySelector('div').style.display === 'none') {
          div.style.display = 'block';
        }
        if (!has_event) {
          nav.querySelector('div').addEventListener('click', click_fn);
          has_event = true;
        }
      }
      else {
        if (has_event) {
          nav.querySelector('div').removeEventListener('click', click_fn);
        }
        if (nav.querySelector('div')) {
          nav.querySelector('div').style.display = 'none';
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
        if (!arrow.classList.contains('fade')) { arrow.classList.add('fade'); }
      }
      else { arrow.classList.remove('fade'); }
    });

    arrow.addEventListener('click', function() {
      document.body.scrollTop = 0;
    });

    /* Testimonial slider */
    var testimonials = document.querySelector('#testimonials');
    var left_arrow = document.createElement('span');
    left_arrow.innerHTML = '&lt;';
    left_arrow.classList.add('left');
    document.querySelector('#clients').insertBefore(
      left_arrow, document.querySelector('#stats'));
    var right_arrow = document.createElement('span');
    right_arrow.innerHTML = '&gt;';
    right_arrow.classList.add('right');
    document.querySelector('#clients').insertBefore(
      right_arrow, document.querySelector('#stats'));

    update_active = function(current, index_active) {
      current.classList.remove('active');
      current.classList.add('hidden');
      let new_active = testimonials.querySelector(
        '[data-index="'+ index_active + '"]');
      new_active.classList.remove('hidden');
      new_active.classList.add('active');
    }

    var slide_arrows = document.querySelectorAll('.left,.right');
    for (let slide_arrow of slide_arrows) {
      slide_arrow.addEventListener('click', function() {
        let way = slide_arrow.getAttribute('class');
        let current = document.querySelector('#testimonials .active');
        if (way === 'left') {
          if (current.getAttribute('data-index') === "0") {
            update_active(current, "2");
          }
          else {
            let active_index = parseInt(current.getAttribute('data-index'));
            update_active(current, String(active_index - 1));
          }
        }
        else {
          if (current.getAttribute('data-index') === "2") {
            update_active(current, "0");
          }
          else {
            let active_index = parseInt(current.getAttribute('data-index'));
            update_active(current, String(active_index + 1));
          }
        }
      });
    }
  });
})();

/* Google maps */
function initMaps() {
  var testimonials_map_div = document.createElement('div');
  testimonials_map_div.setAttribute('id', 'testimonials-map');
  var clients = document.body.querySelector('#clients')
  clients.insertBefore(testimonials_map_div, clients.querySelector('h2'))
  var contact_map_div = document.createElement('div');
  var contact = document.body.querySelector('#contact')
  contact_map_div.setAttribute('id', 'contact-map');
  var contact = document.body.querySelector('#contact')
  contact.insertBefore(contact_map_div, contact.querySelector('h2'))
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
