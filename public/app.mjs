import userStore from "./data/userStore.mjs";
import "./ui/user-list.mjs";
import "./ui/user-form.mjs";

await userStore.loadUsers();
console.log("Users from API:", userStore.getUsers());

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/service-worker.js")
    .then(() => console.log("Service Worker registered"))
    .catch((error) => console.log("Service Worker error:", error));
}
