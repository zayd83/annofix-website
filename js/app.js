(function () {
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && window.innerWidth < 900) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---- Taalwisseling (NL/EN) ----
  var dict = window.ANNOFIX_I18N || { nl: {}, en: {} };
  var LANG_KEY = 'annofix-lang';
  var langToggle = document.getElementById('langToggle');
  var currentLang = 'nl';

  function t(key) {
    return (dict[currentLang] && dict[currentLang][key]) || key;
  }

  function applyLang(lang) {
    currentLang = dict[lang] ? lang : 'nl';
    document.documentElement.lang = currentLang;

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[currentLang][key] !== undefined) {
        el.textContent = dict[currentLang][key];
      }
    });

    document.querySelectorAll('[data-i18n-aria-label]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-aria-label');
      if (dict[currentLang][key] !== undefined) {
        el.setAttribute('aria-label', dict[currentLang][key]);
      }
    });

    document.querySelectorAll('[data-i18n-content]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-content');
      if (dict[currentLang][key] !== undefined) {
        el.setAttribute('content', dict[currentLang][key]);
      }
    });

    if (langToggle) {
      langToggle.textContent = currentLang === 'nl' ? 'EN' : 'NL';
    }

    try {
      localStorage.setItem(LANG_KEY, currentLang);
    } catch (err) {
      /* localStorage kan geblokkeerd zijn; taalkeuze werkt dan alleen voor dit bezoek */
    }
  }

  var savedLang = 'nl';
  try {
    savedLang = localStorage.getItem(LANG_KEY) || 'nl';
  } catch (err) {
    savedLang = 'nl';
  }
  applyLang(savedLang);

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      applyLang(currentLang === 'nl' ? 'en' : 'nl');
    });
  }

  // ---- Scroll-reveal animaties ----
  var revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  // ---- Offerteformulier ----
  var form = document.querySelector('.offerte-form');
  var status = form && form.querySelector('.offerte-form__status');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      if (form._honey.value) {
        return;
      }

      var submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      if (status) {
        status.textContent = t('form.sending');
        status.classList.remove('is-error');
      }

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Versturen mislukt');
          }
          form.reset();
          if (status) {
            status.textContent = t('form.success');
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = t('form.error');
            status.classList.add('is-error');
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
