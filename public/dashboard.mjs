const en = await fetch("./localization/en.json").then((r) => r.json());
const no = await fetch("./localization/no.json").then((r) => r.json());

const translations = { en, no };

const browserLang = navigator.languages?.[0] || navigator.language || "en";

let lang = "en";
let currentDate = new Date();

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
  if (t[key]) element.textContent = t[key];
});

const weekdayContainer = document.getElementById("weekdays");

if (weekdayContainer) {
  weekdayContainer.innerHTML = "";

  const locale = lang === "no" ? "no-NO" : "en-US";
  const baseDate = new Date(2023, 0, 2);

  for (let i = 0; i < 7; i++) {
    const day = new Date(baseDate);
    day.setDate(baseDate.getDate() + i);

    const div = document.createElement("div");
    div.textContent = day.toLocaleDateString(locale, {
      weekday: "short",
    });

    weekdayContainer.appendChild(div);
  }
}

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
const monthLabel = document.getElementById("monthLabel");

function updateMonthLabel() {
  const options = { month: "long", year: "numeric" };

  const text = currentDate.toLocaleDateString(
    lang === "no" ? "no-NO" : "en-US",
    options,
  );

  monthLabel.textContent = text.charAt(0).toUpperCase() + text.slice(1);
}

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
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  let firstDay = new Date(year, month, 1).getDay();

  if (firstDay === 0) firstDay = 7;
  firstDay = firstDay - 1;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendar.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.className = "day";
    calendar.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const cell = document.createElement("div");
    cell.className = "day";

    const today = new Date();

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      cell.classList.add("today");
    }

    const number = document.createElement("div");
    number.className = "day-number";
    number.textContent = day;

    cell.appendChild(number);

    const dateString = `${year}-${String(month + 1).padStart(
      2,
      "0",
    )}-${String(day).padStart(2, "0")}`;

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

    calendar.appendChild(cell);
  }
}

button.onclick = async () => {
  const title = input.value;
  if (!title) return;

  const date = randomDateWithinWeek();

  await fetch("/api/challenges", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: user.id,
      title,
      challengeDate: date,
    }),
  });

  input.value = "";
  loadChallenges();
};

loadChallenges();
updateMonthLabel();

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  generateCalendar();
  updateMonthLabel();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  generateCalendar();
  updateMonthLabel();
};

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.log("Service Worker error:", err));
}
