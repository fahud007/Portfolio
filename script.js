// ===== Theme =====
const themeBtn = document.getElementById("themeBtn");
const themeIcon = document.getElementById("themeIcon");

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  themeIcon.textContent = (mode === "light") ? "☾" : "☀";
}
const saved = localStorage.getItem("theme");
setTheme(saved || "dark");

themeBtn.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// ===== Mobile Drawer =====
const burger = document.getElementById("burger");
const drawer = document.getElementById("drawer");
const closeDrawer = document.getElementById("closeDrawer");

function openDrawer() {
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
}
function hideDrawer() {
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
}
burger.addEventListener("click", openDrawer);
closeDrawer.addEventListener("click", hideDrawer);
drawer.addEventListener("click", (e) => {
  if (e.target === drawer) hideDrawer();
});
drawer.querySelectorAll("a").forEach(a => a.addEventListener("click", hideDrawer));

// ===== Cursor glow =====
const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (e) => {
  glow.style.left = e.clientX + "px";
  glow.style.top = e.clientY + "px";
});

// ===== Reveal on scroll =====
const reveals = document.querySelectorAll(".reveal");
const io = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      io.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

reveals.forEach(el => io.observe(el));

// ===== Typewriter =====
const typeEl = document.getElementById("typeText");
const phrases = [
  "AI/ML Research & Development Enthusiast",
  "Python • PHP • ML• SQL",
  "Ready for Internships & Trainee Roles"
];

let p = 0, i = 0, deleting = false;

function tick() {
  const text = phrases[p];
  if (!deleting) {
    i++;
    typeEl.textContent = text.slice(0, i);
    if (i === text.length) {
      deleting = true;
      setTimeout(tick, 950);
      return;
    }
  } else {
    i--;
    typeEl.textContent = text.slice(0, i);
    if (i === 0) {
      deleting = false;
      p = (p + 1) % phrases.length;
    }
  }
  setTimeout(tick, deleting ? 38 : 58);
}
tick();

// ===== Copy buttons + Toast =====
const toast = document.getElementById("toast");
function showToast(text = "Copied!") {
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 1200);
}

document.querySelectorAll("[data-copy]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const val = btn.getAttribute("data-copy");
    try {
      await navigator.clipboard.writeText(val);
      showToast("Copied ✅");
    } catch {
      showToast("Copy failed");
    }
  });
});

/// ===== Contact form (EmailJS) - works without mail app =====
(function () {
  // 1) Create free account at https://www.emailjs.com/
  // 2) Add Email Service (Gmail) + Create Email Template
  // 3) Replace these 3 values below:
  const EMAILJS_PUBLIC_KEY = "7uG2L1iT_CWZc6iYt";
  const EMAILJS_SERVICE_ID = "service_kooc86l";
  const EMAILJS_TEMPLATE_ID = "template_gkh6qi5";

  const form = document.getElementById("contactForm");
  const sendBtn = document.getElementById("sendBtn");
  const note = document.getElementById("formNote");

  if (!form) return;

  emailjs.init(EMAILJS_PUBLIC_KEY);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const subject = document.getElementById("subject").value.trim();
    const message = document.getElementById("message").value.trim();
    
    const now = new Date().toLocaleString();

    if (!name || !email || !subject || !message) {
      note.textContent = "Please fill all fields.";
      return;
    }

    sendBtn.disabled = true;
    sendBtn.style.opacity = "0.75";
    note.textContent = "⏳ Sending message...";

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        subject: subject,
        message: message,
        time: now,
        to_name: "Fahud Ahmmed"
      });

      note.textContent = "✅ Message sent successfully!";
      form.reset();
    } catch (err) {
      console.error(err);
      note.textContent = "❌ Failed to send. Try again or email directly: fahudahmmed@gmail.com";
    } finally {
      sendBtn.disabled = false;
      sendBtn.style.opacity = "1";
    }
  });
})();

// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Skills progress animation (runs when #skills enters viewport) =====
const skillsSection = document.getElementById("skills");
const skillCards = document.querySelectorAll(".skill-card[data-skill]");

function animateSkillCard(card) {
  const target = Math.max(0, Math.min(100, Number(card.dataset.skill || 0)));
  const fill = card.querySelector(".skill-fill");
  const val = card.querySelector(".skill-meter-val");
  if (!fill || !val) return;

  fill.style.width = "0%";
  val.textContent = "0%";
  card.classList.remove("filled");

  const duration = 1100; // ms
  const start = performance.now();

  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
    const current = Math.round(eased * target);

    fill.style.width = current + "%";
    val.textContent = current + "%";

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      card.classList.add("filled");
    }
  }
  requestAnimationFrame(step);
}

let skillsAnimatedOnce = false;

const skillsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !skillsAnimatedOnce) {
      skillsAnimatedOnce = true;

      // animate each card with a small stagger
      skillCards.forEach((card, idx) => {
        setTimeout(() => animateSkillCard(card), idx * 120);
      });

      // animate the main Learning Progress meter when Skills shows
      const meterFill = document.getElementById("meterFill");
      const meterVal = document.getElementById("meterVal");
      if (meterFill && meterVal) {
        const target = 78; // change to what you want
        let current = 0;

        const timer = setInterval(() => {
          current += 1;
          meterFill.style.width = current + "%";
          meterVal.textContent = current + "%";
          if (current >= target) clearInterval(timer);
        }, 14);
      }

      skillsObserver.disconnect();
    }
  });
}, { threshold: 0.22 });

if (skillsSection) skillsObserver.observe(skillsSection);
// Certificate modal
function openCert(src) {
  const modal = document.getElementById("certModal");
  const img = document.getElementById("certPreview");

  img.src = src;
  modal.classList.add("show");
}

function closeCert() {
  document.getElementById("certModal").classList.remove("show");
}