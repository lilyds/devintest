// Scroll progress bar + active section highlighting for the readout nav.
(function () {
  var progress = document.getElementById("progress");
  var navLinks = Array.prototype.slice.call(
    document.querySelectorAll(".top-nav a")
  );
  var sections = navLinks
    .map(function (a) {
      return document.querySelector(a.getAttribute("href"));
    })
    .filter(Boolean);

  function onScroll() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    var pct = max > 0 ? (window.scrollY / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";

    var mid = window.scrollY + window.innerHeight * 0.3;
    var activeIndex = -1;
    for (var i = 0; i < sections.length; i++) {
      if (sections[i].offsetTop <= mid) activeIndex = i;
    }
    navLinks.forEach(function (link, i) {
      link.classList.toggle("active", i === activeIndex);
    });
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
})();
