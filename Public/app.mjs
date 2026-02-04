import userStore from "./data/userStore.mjs";
import "./ui/user-list.mjs";
import "./ui/user-form.mjs";

await userStore.loadUsers();
console.log("Users from API:", userStore.getUsers());
