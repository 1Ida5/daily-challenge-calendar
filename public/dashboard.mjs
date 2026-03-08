const en = await fetch("./locales/en.json").then((r) => r.json());
const no = await fetch("./locales/no.json").then((r) => r.json());

const translations = { en, no };

const browserLang = navigator.languages?.[0] || navigator.language || "en";

let lang = "en";

if (
  browserLang.startsWith("no") ||
  browserLang.startsWith("nb") ||
  browserLang.startsWith("nn")
) {
  lang = "no";
}

const t = translations[lang];

document.documentElement.lang = lang;

document.querySelectorAll("[data-i18n]").forEach((element) => {
  const key = element.dataset.i18n;

  if (t[key]) {
    element.textContent = t[key];
  }
});

document.querySelectorAll("[data-i18n-placeholder]").forEach((element) => {
  const key = element.dataset.i18nPlaceholder;

  if (t[key]) {
    element.placeholder = t[key];
  }
});

const user = JSON.parse(sessionStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "/";
}

document.getElementById("username").textContent = user.username;

document.getElementById("logoutBtn").onclick = () => {
  sessionStorage.removeItem("currentUser");
  window.location.href = "/";
};

const calendar = document.getElementById("calendar");
const input = document.getElementById("challengeInput");
const button = document.getElementById("addChallenge");

let challengesData = [];

function randomDateWithinWeek() {
  const today = new Date();

  const randomDays = Math.floor(Math.random() * 7) + 1;

  const randomDate = new Date(today);

  randomDate.setDate(today.getDate() + randomDays);

  return randomDate.toISOString().slice(0, 10);
}

async function loadChallenges() {
  const res = await fetch(`/api/challenges?userId=${user.id}`);

  challengesData = await res.json();

  generateCalendar();
}

function generateCalendar() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  let row;

  for (let day = 1; day <= daysInMonth; day++) {
    if ((day - 1) % 7 === 0) {
      row = document.createElement("div");
      row.setAttribute("role", "row");
      calendar.appendChild(row);
    }

    const cell = document.createElement("div");

    cell.className = "day";

    cell.setAttribute("role", "gridcell");
    cell.setAttribute("aria-label", `Day ${day}`);

    const number = document.createElement("div");

    number.className = "day-number";

    number.textContent = day;

    cell.appendChild(number);

    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

    const dayChallenges = challengesData.filter((c) => {
      const challengeDate = (c.challenge_date || c.challengeDate).split("T")[0];

      return challengeDate === dateString;
    });

    dayChallenges.forEach((challenge) => {
      const p = document.createElement("p");

      p.textContent = challenge.title;

      if (challenge.completed) {
        p.style.textDecoration = "line-through";
      }

      cell.appendChild(p);
    });

    row.appendChild(cell);
  }
}

button.onclick = async () => {
  const title = input.value;

  if (!title) return;

  const date = randomDateWithinWeek();

  await fetch("/api/challenges", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      userId: user.id,
      title: title,
      challengeDate: date,
    }),
  });

  input.value = "";

  loadChallenges();
};

loadChallenges();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.log("Service Worker error:", err));
}
