const envelopeScreen = document.querySelector("#envelopeScreen");
const openButton = document.querySelector("#openInvitation");
const invitationSite = document.querySelector("#invitationSite");
const petalLayer = document.querySelector("#petalLayer");
const soundToggle = document.querySelector("#soundToggle");
const copyAddress = document.querySelector("#copyAddress");
const langButtons = document.querySelectorAll("[data-lang]");
const videos = document.querySelectorAll("video");
const bgMusic = document.querySelector("#bgMusic");

const eventDate = new Date("2026-06-23T20:00:00+03:00");
let opened = false;
let audioOn = true;
let currentLang = "ar";

const translations = {
  ar: {
    dir: "rtl",
    title: "احمد وروان",
    kicker: "الحمد لله الذي يختار للقلوب ما يليق بها ويجبر بعطائه حين تظن ان الجبر بعيد لمن يكن لقائنا صدفه بل دعاء مستجاب<br>ولأن الفرح يزداد بوجود الاحبه ندعوكم لتشاركونا حفل زفافنا",
    names: "احمد<br>&amp;<br><span>روان</span>",
    blessing: "وذلك بمشيئة الله",
    date: "يوم الثلاثاء<br>23-6-2026",
    rsvp: "تأكيد الحضور",
    countDate: "23 يونيو 2026",
    countLabel: "العد التنازلي",
    days: "يوم",
    hours: "ساعة",
    minutes: "دقيقة",
    seconds: "ثانية",
    detailsTitle: "تفاصيل يوم الفرح",
    detailsText: "يسعدنا حضوركم ومشاركتكم فرحتنا",
    venueName: "قاعة تاج الملكية",
    venueTime: "الساعة 8:00 مساءً",
    maps: "افتح في خرائط",
    copy: "نسخ العنوان",
    copied: "تم النسخ",
    closingKicker: "حضوركم يسعدنا ويتمم فرحتنا",
    confirm: "تأكيد الحضور"
  },
  en: {
    dir: "ltr",
    title: "Ahmed & Rawan",
    kicker: "All praise is due to Allah who chooses for hearts what suits them and mends with His giving when you think healing is far away. Our meeting was not a coincidence but an answered prayer.<br>Because joy grows with the presence of loved ones, we invite you to share our wedding celebration",
    names: "Ahmed<br>&amp;<br><span>Rawan</span>",
    blessing: "By the grace of Allah",
    date: "Tuesday<br>23-6-2026",
    rsvp: "Confirm attendance",
    countDate: "June 23, 2026",
    countLabel: "Countdown",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    detailsTitle: "Wedding Day Details",
    detailsText: "We would be delighted to celebrate with you",
    venueName: "Taj Al Malakiya Hall",
    venueTime: "At 8:00 PM",
    maps: "Open in Maps",
    copy: "Copy address",
    copied: "Copied",
    closingKicker: "Your presence completes our happiness",
    confirm: "Confirm attendance"
  }
};

function createPetals(count = 30) {
  petalLayer.replaceChildren();

  for (let index = 0; index < count; index += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    petal.style.setProperty("--fall", `${3.4 + Math.random() * 2.8}s`);
    petal.style.animationDelay = `${Math.random() * .8}s`;
    petal.style.opacity = `${.32 + Math.random() * .46}`;
    petal.style.transform = `rotate(${Math.random() * 180}deg)`;
    petalLayer.append(petal);
  }
}

function openInvitation() {
  if (opened) return;
  opened = true;
  envelopeScreen.classList.add("is-opening");
  createPetals();
  videos.forEach((video) => {
    video.play().catch(() => {});
  });

  // Start background music on user gesture (envelope tap)
  if (bgMusic) {
    bgMusic.currentTime = 0;
    bgMusic.play().catch(() => {});
  }

  // Sound is ON by default when opening
  audioOn = true;
  soundToggle.classList.remove("is-muted");
  soundToggle.setAttribute("aria-pressed", "true");
  videos.forEach((video) => {
    video.muted = false;
  });

  window.setTimeout(() => {
    invitationSite.hidden = false;
    document.body.classList.add("has-opened");
    window.scrollTo({ top: 0, behavior: "auto" });
  }, 880);

  window.setTimeout(() => {
    envelopeScreen.classList.add("is-gone");
  }, 1550);
}

function pad(value) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function updateCountdown() {
  const diff = Math.max(0, eventDate.getTime() - Date.now());
  const totalSeconds = Math.floor(diff / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  document.querySelector("#days").textContent = pad(days);
  document.querySelector("#hours").textContent = pad(hours);
  document.querySelector("#minutes").textContent = pad(minutes);
  document.querySelector("#seconds").textContent = pad(seconds);
}

function setLanguage(lang) {
  currentLang = lang;
  const dictionary = translations[lang];
  document.documentElement.lang = lang;
  document.documentElement.dir = dictionary.dir;
  document.title = dictionary.title;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    node.innerHTML = dictionary[key];
  });

  langButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lang === lang);
  });
}

openButton.addEventListener("click", openInvitation);

soundToggle.addEventListener("click", () => {
  audioOn = !audioOn;
  soundToggle.classList.toggle("is-muted", !audioOn);
  soundToggle.setAttribute("aria-pressed", String(audioOn));
  videos.forEach((video) => {
    video.muted = !audioOn;
  });
  if (bgMusic) {
    if (audioOn) {
      bgMusic.play().catch(() => {});
    } else {
      bgMusic.pause();
    }
  }
});

copyAddress.addEventListener("click", async () => {
  const address = currentLang === "ar" ? "قاعة تاج الملكية" : "Taj Al Malakiya Hall";
  const original = translations[currentLang].copy;
  const label = copyAddress.querySelector("[data-i18n='copy']");

  try {
    await navigator.clipboard.writeText(address);
    label.textContent = translations[currentLang].copied;
    window.setTimeout(() => {
      label.textContent = original;
    }, 1500);
  } catch {
    label.textContent = address;
  }
});

langButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.lang));
});

updateCountdown();
setInterval(updateCountdown, 1000);
setLanguage("ar");


