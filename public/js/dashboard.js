import { getChallenges, getAllChallenges } from "./api/challengeapi.js";
import { renderCalendar } from "./ui/calendar.js";
import { loadLanguage } from "./utils/i18n.js";

const { t, lang } = await loadLanguage();

const user = JSON.parse(sessionStorage.getItem("currentUser"));
if (!user) window.location.href = "/";

const calendar = document.getElementById("calendar");

const helpBtn = document.getElementById("helpBtn");
const helpDialog = document.getElementById("helpDialog");

const profileBtn = document.getElementById("profileBtn");
const profileDialog = document.getElementById("profileDialog");

const closeHelp = document.getElementById("closeHelp");
const closeProfile = document.getElementById("closeProfile");

const monthLabel = document.getElementById("monthLabel");
const usernameEl = document.getElementById("username");

const input = document.getElementById("challengeInput");
const addBtn = document.getElementById("addChallenge");

addBtn.onclick = async () => {
  const title = input.value;
  if (!title) return;

  const today = new Date();
  const randomDaysAhead = Math.floor(Math.random() * 7) + 1;

  const futureDate = new Date(today);
  futureDate.setDate(today.getDate() + randomDaysAhead);

  const randomDate = futureDate.toISOString().split("T")[0];

  try {
    await fetch("/api/challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.id,
        title,
        challengeDate: randomDate,
      }),
    });
  } catch {
    const offline = JSON.parse(localStorage.getItem("offlineChallenges")) || [];

    offline.push({
      userId: user.id,
      title,
      challenge_date: randomDate,
      completed: false,
    });

    localStorage.setItem("offlineChallenges", JSON.stringify(offline));
  }

  input.value = "";
  load();
};

let currentDate = new Date();
let challengesData = [];

if (usernameEl) {
  usernameEl.textContent = user.username;
}

function calculateStats(all) {
  const now = new Date();

  return {
    completed: all.filter((c) => c.completed && !c.deleted_at).length,
    deleted: all.filter((c) => c.deleted_at).length,
    missed: all.filter((c) => {
      const date = new Date(c.challenge_date);
      return date < now && !c.completed && !c.deleted_at;
    }).length,
  };
}

function updateMonthLabel() {
  const locale = lang === "no" ? "no-NO" : "en-US";

  const text = currentDate.toLocaleDateString(locale, {
    month: "long",
    year: "numeric",
  });

  monthLabel.textContent = text.charAt(0).toUpperCase() + text.slice(1);
}

async function load() {
  challengesData = await getChallenges(user.id);

  renderCalendar(calendar, challengesData, currentDate, t, load, user.id);

  if ("caches" in window) {
    caches.open("daily-challenge-v3").then(async (cache) => {
      try {
        const res = await fetch("/dashboard.html");
        if (res.ok) {
          await cache.put("/dashboard.html", res.clone());
        }
      } catch (err) {
        console.error("Failed to cache dashboard:", err);
      }
    });
  }
  updateMonthLabel();
}

document.getElementById("prevMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() - 1);
  load();
};

document.getElementById("nextMonth").onclick = () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  load();
};

profileBtn.onclick = async () => {
  const all = await getAllChallenges(user.id);
  const stats = calculateStats(all);

  document.getElementById("completedCount").textContent =
    t.completed + ": " + stats.completed;

  document.getElementById("missedCount").textContent =
    t.missed + ": " + stats.missed;

  document.getElementById("deletedCount").textContent =
    t.deleted + ": " + stats.deleted;

  profileDialog.showModal();
};

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.onclick = () => {
    sessionStorage.removeItem("currentUser");
    window.location.href = "/";
  };
}

helpBtn.onclick = () => {
  helpDialog.showModal();
};

closeHelp.onclick = () => helpDialog.close();
closeProfile.onclick = () => profileDialog.close();

const deleteBtn = document.getElementById("deleteUserBtn");

if (deleteBtn) {
  deleteBtn.onclick = async () => {
    const confirmDelete = confirm(t.confirmDelete + " " + user.username + "?");

    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error();

      alert(t.accountDeleted);

      sessionStorage.removeItem("currentUser");
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert(t.failedToDeleteAccount);
    }
  };
}

window.addEventListener("online", async () => {
  const offline = JSON.parse(localStorage.getItem("offlineChallenges")) || [];

  for (const challenge of offline) {
    await fetch("/api/challenges", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(challenge),
    });
  }

  localStorage.removeItem("offlineChallenges");
});

load();

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/js/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((err) => console.log("Service Worker error:", err));
}
