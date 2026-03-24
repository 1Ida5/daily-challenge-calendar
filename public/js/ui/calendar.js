import { completeChallenge, deleteChallenge } from "../api/challengeapi.js";

export function renderCalendar(
  calendar,
  challengesData,
  currentDate,
  t,
  reload,
  userId,
) {
  calendar.innerHTML = "";

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  let firstDay = new Date(year, month, 1).getDay();
  if (firstDay === 0) firstDay = 7;
  firstDay--;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendar.appendChild(createDayCell());
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateString = formatDate(year, month, day);
    const cell = createDayCell(day);

    cell.onclick = () => {
      const existing = document.querySelector(".day input");
      if (existing) existing.remove();

      const inputField = document.createElement("input");
      inputField.placeholder = t.newChallenge || "Add...";
      inputField.style.width = "100%";
      inputField.style.marginTop = "5px";

      inputField.onkeydown = async (e) => {
        if (e.key === "Enter" && inputField.value) {
          await fetch("/api/challenges", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userId,
              title: inputField.value,
              challengeDate: dateString,
            }),
          });

          reload();
        }
      };

      cell.appendChild(inputField);
      inputField.focus();
    };

    addChallenges(cell, challengesData, dateString, reload);

    highlightToday(cell, day, month, year);

    calendar.appendChild(cell);
  }
}

function createDayCell(day = null) {
  const cell = document.createElement("div");
  cell.className = "day";

  if (day) {
    const number = document.createElement("div");
    number.className = "day-number";
    number.textContent = day;
    cell.appendChild(number);
  }

  return cell;
}

function formatDate(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function highlightToday(cell, day, month, year) {
  const today = new Date();

  if (
    day === today.getDate() &&
    month === today.getMonth() &&
    year === today.getFullYear()
  ) {
    cell.classList.add("today");
  }
}

function addChallenges(cell, data, dateString, reload) {
  const filtered = data.filter((c) => {
    const d = new Date(c.challenge_date).toLocaleDateString("en-CA");
    return d === dateString;
  });

  filtered.forEach((challenge) => {
    const p = document.createElement("p");
    p.textContent = challenge.title;

    const today = new Date();
    const challengeDate = new Date(challenge.challenge_date);

    today.setHours(0, 0, 0, 0);
    challengeDate.setHours(0, 0, 0, 0);

    if (challenge.completed) {
      p.style.textDecoration = "line-through";
      p.style.opacity = "0.6";
    } else if (challengeDate < today) {
      p.style.background = "#f8d7da";
      p.style.color = "#b00020";
    }

    let clickTimeout;

    p.onclick = () => {
      clickTimeout = setTimeout(async () => {
        await completeChallenge(challenge.id);
        reload();
      }, 200);
    };

    p.ondblclick = async () => {
      clearTimeout(clickTimeout);
      if (!confirm("Delete challenge?")) return;

      await deleteChallenge(challenge.id);
      reload();
    };

    cell.appendChild(p);
  });
}
