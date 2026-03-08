const en = await fetch("./locales/en.json").then((r) => r.json());
const no = await fetch("./locales/no.json").then((r) => r.json());

const translations = { en, no };

// detect browser language
const browserLang = navigator.languages?.[0] || navigator.language || "en";

// normalize language
let lang = "en";

if (
  browserLang.startsWith("no") ||
  browserLang.startsWith("nb") ||
  browserLang.startsWith("nn")
) {
  lang = "no";
}

const t = translations[lang];

// translate elements
document.querySelectorAll("[data-i18n]").forEach((element) => {
  const key = element.dataset.i18n;

  if (t[key]) {
    element.textContent = t[key];
  }
});
const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

const tosContainer = document.getElementById("tos-container");
const submitBtn = document.getElementById("submitBtn");

const form = document.getElementById("auth-form");
const errorMsg = document.getElementById("error-msg");

let mode = "login";

tosContainer.style.display = "none";

loginTab.onclick = () => {
  mode = "login";

  loginTab.classList.add("active");
  registerTab.classList.remove("active");

  tosContainer.style.display = "none";

  submitBtn.textContent = t.login;
};

registerTab.onclick = () => {
  mode = "register";

  registerTab.classList.add("active");
  loginTab.classList.remove("active");

  tosContainer.style.display = "block";

  submitBtn.textContent = t.createAccount;
};

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    let response;

    if (mode === "login") {
      response = await fetch("/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
    } else {
      const acceptTos = document.getElementById("tos").checked;

      response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          acceptTos,
        }),
      });
    }

    const data = await response.json();

    if (!response.ok) {
      errorMsg.textContent = data.error;
      return;
    }

    sessionStorage.setItem("currentUser", JSON.stringify(data));

    window.location.href = "dashboard.html";
  } catch (err) {
    errorMsg.textContent = t.genericError;
  }
});

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((error) => console.log("Service Worker error:", error));
}
