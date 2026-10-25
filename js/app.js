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
        status.textContent = 'Versturen...';
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
            status.textContent = 'Bedankt! Uw aanvraag is verstuurd, we nemen snel contact op.';
          }
        })
        .catch(function () {
          if (status) {
            status.textContent = 'Versturen is helaas mislukt. Bel of WhatsApp ons gerust direct.';
            status.classList.add('is-error');
          }
        })
        .finally(function () {
          submitBtn.disabled = false;
        });
    });
  }
})();
