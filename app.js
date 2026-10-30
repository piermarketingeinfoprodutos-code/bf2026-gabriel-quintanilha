/* Lotes automáticos por data + contador. Teste com ?agora=2026-11-12T10:00:00-03:00 */
(function () {
  var C = window.CAMPANHA;
  if (!C) return;
  var q = new URLSearchParams(location.search).get("agora");
  var offset = q ? new Date(q) - Date.now() : 0;
  function now() { return new Date(Date.now() + offset); }
  function d(s) { return s ? new Date(s) : null; }

  function estado(l, t) {
    if (l.inicio && t < d(l.inicio)) return "lock";
    var fim = l.fim ? d(l.fim) : d(C.aula);
    if (t > fim) return "off";
    return "on";
  }
  function vigente(t) {
    for (var i = 0; i < C.lotes.length; i++) if (estado(C.lotes[i], t) === "on") return i;
    return -1;
  }
  function fimDe(i) { var l = C.lotes[i]; return l.fim ? d(l.fim) : d(C.aula); }
  function abre(l) { return l.inicio ? "Abre em " + l.inicio.slice(8, 10) + "/" + l.inicio.slice(5, 7) : ""; }

  function renderLotes() {
    var t = now(), v = vigente(t);
    document.querySelectorAll("[data-lotes]").forEach(function (box) {
      box.innerHTML = C.lotes.map(function (l, i) {
        var e = estado(l, t);
        var bt = e === "on" ? "Garantir no " + l.nome.replace(" (último)", "") : e === "lock" ? abre(l) : "Encerrado";
        var tag = e === "on" ? "a" : "div";
        var href = e === "on" ? ' href="' + l.checkout + '"' : "";
        return "<" + tag + ' class="lote ' + e + '"' + href + '><img class="cad" alt="" src="assets/cadeado-' + (e === "on" ? "aberto" : "fechado") + '.webp" width="220" height="220"><b class="n">' + l.nome + " · " + l.periodo +
          '</b><span class="pv">' + l.preco + '</span><span class="pc">' + l.parcela + '</span><span class="bt">' + bt + "</span></" + tag + ">";
      }).join("");
    });
    document.querySelectorAll("[data-cta]").forEach(function (a) {
      if (v < 0) { a.removeAttribute("href"); a.textContent = "Ingressos encerrados"; return; }
      a.href = C.lotes[v].checkout;
      var base = a.getAttribute("data-cta");
      a.textContent = base ? base + " · " + C.lotes[v].nome.replace(" (último)", "") + " " + C.lotes[v].preco : "Garantir meu ingresso";
    });
    document.querySelectorAll("[data-lote-atual]").forEach(function (el) {
      el.textContent = v < 0 ? "Encerrado" : C.lotes[v].nome.replace(" (último)", "") + " " + C.lotes[v].preco;
    });
    var lv = C.lotes[v] || C.lotes[C.lotes.length - 1];
    document.querySelectorAll("[data-lote-nome]").forEach(function (el) { el.textContent = lv.nome.replace(" (último)", ""); });
    document.querySelectorAll("[data-lote-preco]").forEach(function (el) { el.textContent = lv.preco; });
    document.querySelectorAll("[data-lote-parcela]").forEach(function (el) { el.textContent = lv.parcela; });
    document.querySelectorAll("[data-lote-periodo]").forEach(function (el) { el.textContent = lv.periodo; });
    document.querySelectorAll("[data-proximo]").forEach(function (el) {
      var p = C.lotes[v + 1];
      el.textContent = p ? "Depois, o ingresso sobe para " + p.preco + " e não volta." : "Último lote: as vendas encerram no início da aula.";
    });
    return v;
  }

  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var v = renderLotesCache;
    if (v < 0) return;
    var ms = Math.max(0, fimDe(v) - now());
    var dd = Math.floor(ms / 864e5), hh = Math.floor(ms / 36e5) % 24, mm = Math.floor(ms / 6e4) % 60, ss = Math.floor(ms / 1e3) % 60;
    document.querySelectorAll("[data-timer]").forEach(function (el) {
      el.innerHTML = "<div><b>" + pad(dd) + "</b><small>dias</small></div><div><b>" + pad(hh) + "</b><small>horas</small></div><div><b>" +
        pad(mm) + "</b><small>min</small></div><div><b>" + pad(ss) + "</b><small>seg</small></div>";
    });
    document.querySelectorAll("[data-timer-txt]").forEach(function (el) {
      el.textContent = dd + "d " + pad(hh) + "h " + pad(mm) + "min";
    });
    if (ms === 0) renderLotesCache = renderLotes();
  }
  var renderLotesCache = renderLotes();
  tick();
  setInterval(tick, 1000);

  // rota do mapa: desenha quando entra na tela
  var rota = document.querySelector("[data-rota]");
  if (rota && "IntersectionObserver" in window) {
    new IntersectionObserver(function (es, ob) {
      es.forEach(function (e) { if (e.isIntersecting) { rota.classList.add("on"); ob.disconnect(); } });
    }, { threshold: 0.35 }).observe(rota);
  } else if (rota) rota.classList.add("on");

  // CTA fixo no celular depois da primeira dobra
  var mcta = document.querySelector(".mcta"), hero = document.querySelector(".hero"), ing = document.getElementById("ingressos");
  if (mcta && hero) {
    var upd = function () {
      var r = hero.getBoundingClientRect(), ri = ing ? ing.getBoundingClientRect() : null;
      var noIngresso = ri && ri.top < innerHeight && ri.bottom > 0;
      mcta.classList.toggle("show", r.bottom < 0 && !noIngresso);
    };
    addEventListener("scroll", upd, { passive: true }); upd();
  }

  document.querySelectorAll("[data-grupo]").forEach(function (a) { a.href = C.grupoWhatsApp; });
})();
