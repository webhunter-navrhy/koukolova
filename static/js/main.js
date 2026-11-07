// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu bude zpráva doručena na e-mail firmy.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, zpráva byla odeslána.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();

// Ukázkový výběr termínu (demo: termíny jsou jen ilustrační, ostré napojíme na kalendář klientky).
(function () {
  var dny = document.getElementById('dny'), casy = document.getElementById('casy'), inp = document.getElementById('termin');
  if (!dny) return;
  var nazvy = ['ne', 'po', 'út', 'st', 'čt', 'pá', 'so'], hodiny = ['9:00', '10:30', '13:00', '15:30'];
  var d = new Date(), n = 0, vybranyDen = '';
  while (n < 6) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0 || d.getDay() === 6) continue;
    (function (dt) {
      var b = document.createElement('button'); b.type = 'button'; b.setAttribute('aria-pressed', 'false');
      b.textContent = nazvy[dt.getDay()] + ' ' + dt.getDate() + '. ' + (dt.getMonth() + 1) + '.';
      b.onclick = function () {
        dny.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); });
        b.setAttribute('aria-pressed', 'true'); vybranyDen = b.textContent; inp.value = vybranyDen; casy.innerHTML = '';
        hodiny.forEach(function (h) {
          var c = document.createElement('button'); c.type = 'button'; c.setAttribute('aria-pressed', 'false'); c.textContent = h;
          c.onclick = function () { casy.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', 'false'); }); c.setAttribute('aria-pressed', 'true'); inp.value = vybranyDen + ' v ' + h; };
          casy.appendChild(c);
        });
      };
      dny.appendChild(b);
    })(new Date(d)); n++;
  }
})();
