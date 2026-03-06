const user = JSON.parse(sessionStorage.getItem("currentUser"));

if (!user) {
  window.location.href = "/";
}

const calendar = document.getElementById("calendar");
const input = document.getElementById("challengeInput");
const button = document.getElementById("addChallenge");

function randomDateWithinWeek() {
  const today = new Date();

  const randomDays = Math.floor(Math.random() * 7) + 1;

  const randomDate = new Date(today);

  randomDate.setDate(today.getDate() + randomDays);

  return randomDate.toISOString().slice(0, 10);
}

async function loadChallenges() {
  const res = await fetch(`/api/challenges?userId=${user.id}`);
  const challenges = await res.json();

  while (calendar.firstChild) {
    calendar.removeChild(calendar.firstChild);
  }

  challenges.forEach((challenge) => {
    const div = document.createElement("div");

    div.className = "challenge";

    const date = challenge.challenge_date.split("T")[0];

    div.textContent = `${date} - ${challenge.title}`;

    if (challenge.completed) {
      div.style.textDecoration = "line-through";
    }

    calendar.appendChild(div);
  });
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
      title,
      challengeDate: date,
    }),
  });

  input.value = "";

  loadChallenges();
};

loadChallenges();
