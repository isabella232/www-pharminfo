(function() {
  document.addEventListener('DOMContentLoaded', function() {
    /* scrollReveal for on-scroll elements animation */
    var reveals = {};
    var page_list = ['index', 'news', 'subscribe'];
    for (let index = 0; index < page_list.length; index++) {
      reveals[page_list[index]] = {}
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
          less[index].style.display = 'none';
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
    var fireResizeEvent = function () {
      var event = document.createEvent("HTMLEvents");
      event.initEvent('resize', true, false);
      window.dispatchEvent(event);
    };
    fireResizeEvent();

    /* Arrow back to the top */
    var arrow = document.createElement('span');
    arrow.className = 'back-to-top';
    document.body.insertBefore(arrow, null);
    arrow.addEventListener('click', function() {
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
    });

    /* Used for detecting scroll direction */
    var scrollTop = 0;
    var ctc = document.querySelector('.click-to-call');
    ctc.addEventListener('click', function() {
      if (!ctc.classList.contains('from-right')) {
        ctc.classList.remove('from-left');
        ctc.classList.add('from-right');
      }
    });
    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight) {
        if (!arrow.classList.contains('fade')) { arrow.classList.add('fade'); }
        /* Down */
        if (scrollTop < window.scrollY) {
          if (ctc.classList.contains('fade')) { ctc.classList.remove('fade'); }
        }
        /* Up */
        else {
          if (!ctc.classList.contains('fade')) { ctc.classList.add('fade'); }
        }
        scrollTop = window.scrollY;
      }
      else {
        arrow.classList.remove('fade');
        if (!ctc.classList.contains('fade')) { ctc.classList.add('fade'); }
      }
    });
    /* Show/hide ctc */
    window.addEventListener('click', function(e) {
      let ctc_display = ctc.classList.contains('from-right');
      if (!ctc_display) {
        return
      }
      let el = e.target;
      if (el.classList.contains('click-to-call')) {
        return
      }

      get_parent = function(el) {
        return el.parentElement
      }

      while (get_parent(el).tagName !== 'BODY') {
        parent = get_parent(el);
        if (parent.classList.contains('click-to-call')) {
          return
        }
        el = parent;
      }
      ctc.classList.remove('from-right');
      ctc.classList.add('from-left');
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

    /* Newsletter  */
    if (document.body.querySelector('.newsletter-subscribe')) {
      var newsletter_link = (
        document.body.querySelector('.newsletter-subscribe'));
      newsletter_link.addEventListener('click', function() {
        if (!document.body.querySelector('.popup')) {
          var popup = document.createElement('div');
          popup.classList.add('static-popup')
          popup.classList.add('popup');
          popup.innerHTML = (
            '<span class="close-popup"></span>' +
            '<p>Veuillez renseigner votre adresse mail pour vous inscrire</p>' +
            '<form class="newsletter-form" method="POST">' +
            '<input name="newsletter-email" type="email" placeholder="Email" '+
            'required /><input type ="submit" value="Valider"/>' +
            '</form>'
          );
          document.body.querySelector('#contact').appendChild(popup);

          var close = popup.querySelector('.close-popup');
          close.addEventListener('click', function() {
            popup.classList.add('hide-popup');
          });

          window.addEventListener('keyup', function(e) {
            if (e.keyCode === 27 && !popup.classList.contains('hide-popup')) {
              popup.classList.add('hide-popup');
            }
          });

          var form = document.body.querySelector('.newsletter-form');
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            var request = new XMLHttpRequest();
            request.open('post', '/newsletter', true);
            request.onload = function() {
              if (request.status >= 200 && request.status < 400) {
                var success = document.createElement('p');
                success.innerHTML = 'inscription réussie';
                popup.insertBefore(success, null);
              } else {
                popup.innerHTML = (
                  '<p>une erreur sʼest produite, ' +
                  'essayer de recharger la page</p>');
              }
              setTimeout(
                function(el) {
                  el.classList.add('hide-popup');
                }, 1000, popup);
            };
            request.setRequestHeader(
              'content-type',
              'application/x-www-form-urlencoded; charset=utf-8');
            request.send(
              'newsletter-email=' + form.querySelector('input').value);
          });
        }
        else {
          var popup = document.body.querySelector('.popup');
          popup.classList.remove('hide-popup');
        }
      });
    }

    /* Contact AJAX post */
    if (document.body.querySelector('.contact-form')) {
      let contact_forms = document.body.querySelectorAll('.contact-form');
      for (let index = 0; index < contact_forms.length; index++) {
        let contact_form = contact_forms[index];
        contact_form.addEventListener('submit', function(e) {
          e.preventDefault();
          var request = new XMLHttpRequest();
          let post_popup = document.createElement('div');
          post_popup.classList.add('popup');
          request.open('post', '/contact', true);
          request.onload = function() {
            if (request.status >= 200 && request.status < 400) {
              var success = document.createElement('p');
              success.innerHTML = (
                'Merci de nous avoir contacté, nos équipes vous ' +
                'recontacteront dans les plus brefs délais.');
              post_popup.appendChild(success);
            } else {
              var error = document.createElement('p');
              error.innerHTML = (
                '<p>une erreur sʼest produite, ' +
                'essayer de recharger la page</p>');
              post_popup.appendChild(error);
            }
            document.body.querySelector('#contact').appendChild(post_popup);
            setTimeout(
              function(el) {
                el.parentElement.removeChild(el);
              }, 2500, post_popup);
          };
          request.setRequestHeader(
            'content-type',
            'application/x-www-form-urlencoded; charset=utf-8');
          data = []
          inputs = contact_form.querySelectorAll(
            'textarea, input:not([type="submit"])');
          for (let input_index = 0; input_index < inputs.length; input_index++) {
            let input = inputs[input_index];
            data.push(input.getAttribute('name') + '=' + input.value)
          }
          request.send(data.join('&'));
        });
      }
    }

    /* Add class to remove popup */
    hide_popup = function(el) {
      el.classList.add('hide-popup');
    };
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
  clients.insertBefore(testimonials_map_div, clients.querySelector('h2'))
  var contact_map_div = document.createElement('div');
  var contact = document.body.querySelector('#contact')
  contact_map_div.setAttribute('id', 'contact-map');
  var contact = document.body.querySelector('#contact')
  contact.insertBefore(contact_map_div, contact.querySelector('h2'))
  var testimonials_map = new google.maps.Map(
    document.getElementById('testimonials-map'), {
      center: {lat: 46.227638, lng: 2.213749},
      zoom: 7,
      styles: map_style
    }
  );
  var contact_map = new google.maps.Map(
    document.getElementById('contact-map'), {
      center: {lat: 45.776999, lng: 4.859773},
      zoom: 15,
      styles: map_style
    }
  );
  add_client_marker = function(position, map, title, icon, url) {
    if (position instanceof Array) {
      var latlng = new google.maps.LatLng(position[0], position[1]);
    }
    else {
      var latlng = new google.maps.LatLng(position.lat, position.lng);
    }
    let client_marker = new google.maps.Marker({
      position: latlng, map: map, title: title, icon: icon
    });
  };
  add_client_marker(
    [45.776999, 4.859773], contact_map, 'Pharminfo - Kozea',
    '/static/images/map-cursor/mark-platform.png', null);
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
          client[0], testimonials_map, client[1], icon, client[3]);
      }
    }
  };
  request.send();
}
