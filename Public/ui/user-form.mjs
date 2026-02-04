import userStore from "../data/userStore.mjs";

class UserForm extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <h2>Create user</h2>
      <form>
        <input 
          name="username" 
          placeholder="Username" 
          required 
        />
        <label>
          <input type="checkbox" name="acceptTos" />
          Accept terms
        </label>
        <button type="submit">Create</button>
      </form>
    `;

    this.querySelector("form").addEventListener("submit", (event) => {
      event.preventDefault(); //

      const form = event.target;

      const user = {
        username: form.username.value,
        acceptTos: form.acceptTos.checked,
      };

      userStore.createUser(user);
      form.reset();
    });
  }
}

customElements.define("user-form", UserForm);
