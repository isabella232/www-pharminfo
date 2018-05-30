(function() {
  document.addEventListener('DOMContentLoaded', function() {
    /* scrollReveal for on-scroll elements animation */
    var reveals = {};
    var page_list = ['index', 'news', 'subscribe'];
    for (let index = 0; index < page_list.length; index++) {
      reveals[page_list[index]] = {}
    }
    reveals.index = {
      'basic': ['#sales h2, #sales ul.links, #sales ul, #goals li, ' +
                '#main-offer p, #main-offer ol, #main-offer #innovation, #stats li'],
      'asc': ['#news article, #news .links',
              '#cloud, #payment, #ars, #security',
              '#order, #sav, #seo, #responsive',
              '#essential-offer li'],
      'desc': ['#optiweb, #flexiweb-plus, #flexiweb, #ecoweb'],
      'left': ['#develop, #loyal, #accompaniment'],
      'right': ['#expertise, #satisfaction, #cost']}
    reveals.subscribe = {'basic': ['#subscribe-form']}

    function add_sr(selectors, side) {
      animation = 'enter ' + side + ', move 150px, wait 0.5s';
      for (let index = 0; index < selectors.length; index++) {
        let elements = document.querySelectorAll(selectors[index]);
        for (let el_index = 0; el_index < elements.length; el_index++) {
          elements[el_index].setAttribute('data-sr', animation);
        }
      }
    };

    for (let page in reveals) {
      for (let type in reveals[page]) {
        if (type === 'basic') {
          add_sr(reveals[page][type], 'bottom');
        }
        else if (type === 'asc' || type === 'desc') {
          let selectors = reveals[page][type];
          for (let selector_index = 0; selector_index < selectors.length;selector_index++) {
            var wait;
            type === 'asc' ? wait = 0.5 : wait = 0.9;
            elements = document.querySelectorAll(selectors[selector_index]);
            for (let el_index = 0; el_index < elements.length; el_index++) {
              elements[el_index].setAttribute(
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

    // first add raf shim
    // http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
    // main function
    function scrollToY(scrollTargetY) {
        // scrollTargetY: the target scrollY property of the window
        // speed: time in pixels per second
        // easing: easing equation to use
        var scrollY = window.scrollY || document.documentElement.scrollTop,
            scrollTargetY = scrollTargetY || 0,
            speed = 2000,
            easing = 'easeOutSine',
            currentTime = 0;
        // min time .1, max time .8 seconds
        var time = Math.max(.1, Math.min(Math.abs(scrollY - scrollTargetY) / speed, .8));
        // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
        var easingEquations = {
                easeOutSine: function (pos) {
                    return Math.sin(pos * (Math.PI / 2));
                },
                easeInOutSine: function (pos) {
                    return (-0.5 * (Math.cos(Math.PI * pos) - 1));
                },
                easeInOutQuint: function (pos) {
                    if ((pos /= 0.5) < 1) { return 0.5 * Math.pow(pos, 5); }
                    return 0.5 * (Math.pow((pos - 2), 5) + 2);
                }
            };
        // add animation loop
        function tick() {
            currentTime += 1 / 60;
            var p = currentTime / time;
            var t = easingEquations[easing](p);
            if (p < 1) {
                requestAnimFrame(tick);
                window.scrollTo(0, scrollY + ((scrollTargetY - scrollY) * t));
            } else {
                window.scrollTo(0, scrollTargetY);
            }
        }
        // call it once to get started
        tick();
    }

    window.addEventListener('resize', function() {
      /* Offers toggle slide */
      if (window.innerWidth <= 650) {
        if (!document.body.querySelector('.more')) {
          var more_ul_ids = '#ecoweb, #optiweb';
          offers = document.body.querySelectorAll(more_ul_ids);
          for (let index = 0; index < offers.length; index++) {
            let more = document.createElement('span');
            more.innerHTML = 'voir plus';
            more.classList.add('more');
            offers[index].insertBefore(more, null);
            more.addEventListener('click', function() {
              this.parentElement.classList.add('more');
              this.parentElement.classList.remove('less');
            });
            let less = document.createElement('span');
            less.innerHTML = 'replier';
            less.classList.add('less');
            offers[index].insertBefore(less, null);
            less.addEventListener('click', function() {
              this.parentElement.classList.add('less');
              this.parentElement.classList.remove('more');
            });
          }
        }
        else {
          let more = document.body.querySelectorAll('.more');
          for (let index = 0; index < more.length; index++) {
            more[index].style.display = 'block';
          }
          let less = document.body.querySelectorAll('.less');
          for (let index = 0; index < less.length; index++) {
            less[index].style.display = 'none';
          }
        }
      }
      else if (document.body.querySelector('.more')) {
        let more_less = document.body.querySelectorAll('.more, .less');
        for (let index = 0; index < more_less.length; index++) {
          more_less[index].style.display = 'none';
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
          nav.querySelector('div').style.display = 'block';
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
    var fireResizeEvent = function () {
      var event = document.createEvent("HTMLEvents");
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    };
    fireResizeEvent();

    /* Smooth menu navigation */
    var menu = document.body.querySelector('nav');
    menu.addEventListener('click', function(e) {
      el = e.target;
      if (el.tagName === "A" & document.body.getAttribute('id') === 'index') {
        if (el.getAttribute('href').indexOf('index#') !== -1) {
          e.preventDefault();
          clean_href = el.getAttribute('href').replace('/index', '');
          scrollToY(document.querySelector(clean_href).offsetTop);
        }
      }
    });


    /* Arrow back to the top */
    var arrow = document.createElement('span');
    arrow.className = 'back-to-top';
    document.body.insertBefore(arrow, null);
    arrow.addEventListener('click', function() {
      scrollToY(0);
    });

    /* Used for detecting scroll direction */
    var scrollTop = 0;
    window.addEventListener('scroll', function() {
      var scrollY = window.scrollY || document.documentElement.scrollTop;
      if (scrollY === 0) {
        document.body.querySelector('nav').classList.remove('sticky');
      }
      else {
        document.body.querySelector('nav').classList.add('sticky');
      }
      if (scrollY > window.innerHeight) {
        if (!arrow.classList.contains('fade')) { arrow.classList.add('fade'); }
        scrollTop = scrollY;
      }
      else {
        arrow.classList.remove('fade');
      }
    });

    /* Testimonial slider */
    if (document.body.getAttribute('id') === 'index') {
      var testimonials = document.getElementById('testimonials');
      var left_arrow = document.createElement('span');
      left_arrow.classList.add('left');
      document.getElementById('clients').insertBefore(
        left_arrow, document.getElementById('stats'));
      var right_arrow = document.createElement('span');
      right_arrow.classList.add('right');
      document.getElementById('clients').insertBefore(
        right_arrow, document.getElementById('stats'));

      update_active = function(current, index_active) {
        current.classList.remove('active');
        let new_active = testimonials.querySelector(
          '[data-index="'+ index_active + '"]');
        new_active.classList.add('active');
      }

      slide_arrows = document.querySelectorAll('.left,.right');
      for (let index = 0; index < slide_arrows.length; index++) {
        let slide_arrow = slide_arrows[index];
        slide_arrow.addEventListener('click', function() {
          let way = slide_arrow.getAttribute('class');
          let current = document.querySelector('#testimonials .active');
          if (way === 'left') {
            if (current.getAttribute('data-index') === "1") {
              update_active(current, "4");
            }
            else {
              let active_index = parseInt(current.getAttribute('data-index'));
              update_active(current, String(active_index - 1));
            }
          }
          else {
            if (current.getAttribute('data-index') === "4") {
              update_active(current, "1");
            }
            else {
              let active_index = parseInt(current.getAttribute('data-index'));
              update_active(current, String(active_index + 1));
            }
          }
        });
      }
    }

    /* About tabs */
    tab_links = document.querySelectorAll('.tab-link');
    for (let index = 0; index < tab_links.length; index++) {
      let tab_link = tab_links[index];
      tab_link.addEventListener('click', function(e) {
        e.preventDefault();
        if (!this.classList.contains('active')) {
          var active = document.querySelector('.tab-link.active')
          var article_active = document.querySelector(
            '[id="' + active.getAttribute('href').substring(1) + '"]');
          active.classList.remove('active');
          article_active.classList.remove('active');
          var hidden = document.querySelector(
            '[id="' + this.getAttribute('href').substring(1) + '"]');
          hidden.classList.add('active');
          this.classList.add('active');
        }
      });
    }
  });
})();

/* Google maps */
function initMaps() {
  var map_style = [
    {"featureType": "administrative", "elementType": "labels.text.fill",
     "stylers": [{"color": "#444444"}]},
    {"featureType": "landscape", "elementType": "all", "stylers": [
      {"color": "#f2f2f2"}]},
    {"featureType": "poi", "elementType": "all", "stylers": [
      {"visibility": "off"}]},
    {"featureType": "poi.park", "elementType": "all", "stylers": [
      {"color": "#e9e9e9"}, {"visibility": "on"}]},
    {"featureType": "road", "elementType": "all", "stylers": [
      {"saturation": -100}, {"lightness": 45}]},
    {"featureType": "road.highway", "elementType": "all", "stylers": [
      {"visibility": "simplified"}]},
    {"featureType": "road.arterial", "elementType": "labels.icon", "stylers": [
      {"visibility": "off"}]},
    {"featureType": "transit", "elementType": "all", "stylers": [
      { "visibility": "off"}]},
    {"featureType": "water", "elementType": "all", "stylers": [
      {"color": "#7fcbea"}, {"visibility": "on"}]}]
  var testimonials_map_div = document.createElement('div');
  testimonials_map_div.setAttribute('id', 'testimonials-map');
  var clients = document.body.querySelector('#clients')
  clients.insertBefore(testimonials_map_div, clients.querySelector('h2'));
  var contact_map_div = document.createElement('div');
  var contact = document.body.querySelector('#contact');
  contact_map_div.setAttribute('id', 'contact-map');
  var contact = document.body.querySelector('#contact');
  contact.insertBefore(contact_map_div, contact.querySelector('h2'));
  var scroll = window.innerWidth > 780 ? true : false;
  var testimonials_map = new google.maps.Map(
    document.getElementById('testimonials-map'), {
      center: {lat: 46.227638, lng: 2.213749},
      zoom: 7,
      styles: map_style,
      scrollwheel: scroll
    }
  );
  var contact_map = new google.maps.Map(
    document.getElementById('contact-map'), {
      center: {lat: 45.776999, lng: 4.859773},
      zoom: 15,
      styles: map_style,
      scrollwheel: scroll
    }
  );

  client_info_marker = function(client) {
    let container = document.createElement('div');
    let url = client[3];
    let info = (
      '<div><strong><a href="' + url + '">' + client[1] + '</a></strong><br/>');
    if (client[2] === 'ecommerce') {
      info += (
        '<a class="patientorder-client" href="' + url + '/patientorder' +
        '">Réserver votre ordonnance en ligne.</a><br/>' +
        '<a class="ecommerce-client" href="' + url + '/catalog' +
        '">Accéder à la vente en ligne.</a>')
    }
    else if (client[2] === 'patientorder') {
      info += (
        '<a class="ecommerce-client" href="' + url + '/patientorder' +
        '">Réserver votre ordonnance en ligne.</a>')
    }
    if (client[4]) {
      info += '<br/>' + client[4];
    }
    container.innerHTML = info + '</div>';
    return container.firstChild;
  }

  open_marker = function(marker) {
    for (let index = 0; index < markers.length; index++) {
      markers[index].info.close()
    }
    marker.info.open(testimonials_map, marker);
  }

  add_client_marker = function(position, map, title, icon, info) {
    if (position instanceof Array) {
      var latlng = new google.maps.LatLng(position[0], position[1]);
    }
    else {
      var latlng = new google.maps.LatLng(position.lat, position.lng);
    }
    let client_marker = new google.maps.Marker({
      position: latlng, map: map, title: title, icon: icon
    });
    if (info) {
      client_marker.info = new google.maps.InfoWindow({content: info});

      google.maps.event.addListener(client_marker, 'click', function() {
        open_marker(this);
      });
      markers.push(client_marker);
    }
  };

  add_client_marker(
    [45.776999, 4.859773], contact_map, 'Pharminfo - Kozea',
    '/static/images/map-cursor/mark-platform.png', null);
  var markers = [];

  var request = new XMLHttpRequest();
  request.open('get', '/clients/latlng', true);
  request.onload = function() {
    if (request.status >= 200 && request.status < 400) {
      response = JSON.parse(request.responseText);
      for (let client_index = 0; client_index < response.length; client_index++ ) {
        let client = response[client_index];
        let icon = (
          '/static/images/map-cursor/mark-platform_' + client[2] + '.png');
        add_client_marker(
          client[0], testimonials_map, client[1], icon,
          client_info_marker(client));
      }
    }
  };

  window.addEventListener('resize', function() {
    var scroll = window.innerWidth > 780 ? true : false;
    contact_map.setOptions({scrollwheel: scroll});
    testimonials_map.setOptions({scrollwheel: scroll});
  });
  request.send();
}
