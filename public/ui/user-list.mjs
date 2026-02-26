import userStore from "../data/userStore.mjs";

class UserList extends HTMLElement {
  connectedCallback() {
    userStore.subscribe((users) => {
      this.render(users);
    });
  }

  render(users) {
    this.innerHTML = `
      <h2>Users</h2>
      <ul>
        ${users
          .map(
            (user) => `
          <li>
            ${user.username}
            <button data-edit="${user.id}">Edit</button>
            <button data-delete="${user.id}">Delete</button>
          </li>
        `,
          )
          .join("")}
      </ul>
    `;

    this.querySelectorAll("[data-delete]").forEach((btn) => {
      btn.addEventListener("click", () => {
        userStore.deleteUser(btn.dataset.delete);
      });
    });

    this.querySelectorAll("[data-edit]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const newName = prompt("New username:");
        if (newName) {
          userStore.updateUser(btn.dataset.edit, {
            username: newName,
          });
        }
      });
    });
  }
} //

customElements.define("user-list", UserList);
