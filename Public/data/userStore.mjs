let users = [];
const listeners = [];

async function loadUsers() {
  const res = await fetch("/api/users");
  users = await res.json();
  notify();
}

function getUsers() {
  return users;
}

function subscribe(fn) {
  listeners.push(fn);
}

function notify() {
  listeners.forEach((fn) => fn(users));
}

async function createUser(user) {
  await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  });

  await loadUsers();
}

async function deleteUser(id) {
  await fetch(`/api/users/${id}`, {
    method: "DELETE",
  });

  await loadUsers();
}

async function updateUser(id, updates) {
  await fetch(`/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  await loadUsers();
}

export default {
  loadUsers,
  getUsers,
  createUser,
  deleteUser,
  updateUser,
  subscribe,
};
