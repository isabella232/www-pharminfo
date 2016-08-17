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

    function add_sr(selectors, animation) {
      for (let selector of selectors) {
        for (let el of document.querySelectorAll(selector)) {
          el.setAttribute('data-sr', animation);
        }
      }
    };

    for (let page in reveals) {
      for (let type in reveals[page]) {
        if (type === 'basic') {
          add_sr(reveals[page][type], 'enter bottom, move 150px, wait 0.5s');
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
          add_sr(reveals[page][type], 'enter left, move 150px, wait 0.5s');
        }
        else if (type === 'right') {
          add_sr(reveals[page][type], 'enter right, move 150px, wait 0.5s');
        }
      }
    }
    window.sr = new scrollReveal();

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
