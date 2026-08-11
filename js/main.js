(() => {
  const WA_NUMBER = "529851120095";
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

  document.body.classList.add("loading");

  const loader = $("#loader");
  let loaderScheduled = false;
  const hideLoader = () => {
    if (!loader || loaderScheduled) return;
    loaderScheduled = true;
    window.setTimeout(() => {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
      window.setTimeout(() => loader.classList.add("is-gone"), 900);
    }, 1850);
  };

  if (document.readyState !== "loading") {
    hideLoader();
  } else {
    document.addEventListener("DOMContentLoaded", hideLoader, { once: true });
    window.addEventListener("load", hideLoader, { once: true });
  }

  window.setTimeout(hideLoader, 2400);

  window.addEventListener("pageshow", (event) => {
    if (event.persisted && loader) {
      loader.classList.add("is-hidden");
      document.body.classList.remove("loading");
    }
  });

  const navbar = $("#navbar");
  const updateNav = () => {
    navbar?.classList.toggle("nav-scrolled", window.scrollY > 28);
  };
  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });

  const menuButtons = $$("#hamburger, #mobile-hamburger");
  const mobMenu = $("#mob-menu");
  const setMenuExpanded = (isOpen) => {
    menuButtons.forEach((button) => button.setAttribute("aria-expanded", String(Boolean(isOpen))));
  };

  menuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const isOpen = mobMenu?.classList.toggle("is-open");
      setMenuExpanded(isOpen);
    });
  });

  $$("#mob-menu a").forEach((link) => {
    link.addEventListener("click", () => {
      mobMenu?.classList.remove("is-open");
      setMenuExpanded(false);
    });
  });

  const marquee = $("#marquee");
  if (marquee) {
    const words = [
      "Terrenos en Temozón",
      "Ranchos",
      "Parcelas",
      "Casas",
      "Asesoría personalizada",
      "Proceso transparente",
      "Colonia San Juan",
      "Yucatán"
    ];
    marquee.innerHTML = [...words, ...words, ...words, ...words]
      .map((word) => `<span>${word}</span>`)
      .join("");
  }

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: "0px 0px -60px 0px" });

  $$(".reveal").forEach((el) => revealObserver.observe(el));

  const stats = $$(".stat-num");
  const countStat = (node) => {
    const end = Number(node.dataset.count || "0");
    const suffix = node.dataset.suffix || "";
    const duration = 1350;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(end * eased);
      node.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        $$(".stat-num", entry.target).forEach(countStat);
        statObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.35 });

  const statsGrid = $(".stats-grid");
  if (statsGrid && stats.length) statObserver.observe(statsGrid);

  const waForm = $("#wa-form");
  waForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const name = $("#f-name")?.value.trim();
    const interest = $("#f-interest")?.value.trim();
    const message = $("#f-msg")?.value.trim();

    if (!name || !message) {
      waForm.reportValidity();
      return;
    }

    const text = [
      "Hola, soy " + name + ".",
      "Visité la página de EK BALAM y quiero información.",
      "Tipo de propiedad: " + interest + ".",
      "Mensaje: " + message
    ].join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
  });

  $("#year") && ($("#year").textContent = new Date().getFullYear());

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reducedMotion) return;

  const createParticleSystem = (canvas, options = {}) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let particles = [];
    let raf = 0;

    const pointer = {
      x: -9999,
      y: -9999
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      const baseCount = options.count || Math.floor(width / 22);
      const count = Math.min(options.max || 76, Math.max(options.min || 24, baseCount));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (options.speed || 0.34),
        vy: (Math.random() - 0.5) * (options.speed || 0.34),
        size: Math.random() * (options.size || 2.2) + 0.7,
        alpha: Math.random() * 0.45 + 0.16
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, index) => {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 110) {
          p.vx += dx / 9000;
          p.vy += dy / 9000;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 179, 0, ${p.alpha})`;
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        for (let j = index + 1; j < particles.length; j += 1) {
          const other = particles[j];
          const lx = p.x - other.x;
          const ly = p.y - other.y;
          const lineDistance = Math.sqrt(lx * lx + ly * ly);
          const maxDistance = options.linkDistance || 110;
          if (lineDistance < maxDistance) {
            ctx.strokeStyle = `rgba(245, 245, 240, ${(1 - lineDistance / maxDistance) * 0.18})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      raf = requestAnimationFrame(draw);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = event.clientX - rect.left;
      pointer.y = event.clientY - rect.top;
    };

    const onPointerLeave = () => {
      pointer.x = -9999;
      pointer.y = -9999;
    };

    resize();
    draw();

    window.addEventListener("resize", resize, { passive: true });
    canvas.closest("section")?.addEventListener("pointermove", onPointerMove, { passive: true });
    canvas.closest("section")?.addEventListener("pointerleave", onPointerLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  };

  const heroCanvas = $("#hero-canvas");
  if (heroCanvas) {
    createParticleSystem(heroCanvas, {
      min: 40,
      max: 95,
      speed: 0.42,
      size: 2.4,
      linkDistance: 120
    });
  }

  $$("[data-particles]").forEach((canvas) => {
    createParticleSystem(canvas, {
      min: 18,
      max: 44,
      speed: 0.22,
      size: 1.8,
      linkDistance: 90
    });
  });
})();
