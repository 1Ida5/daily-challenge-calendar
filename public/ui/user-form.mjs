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
          I accept the 
          <a href="/tos.html" target="_blank">Terms of Service</a>
          and
          <a href="/privacy.html" target="_blank">Privacy Policy</a>
        </label>

        <button type="submit">Create</button>
      </form>
    `;

    this.querySelector("form").addEventListener("submit", async (event) => {
      event.preventDefault();

      const form = event.target;

      const user = {
        username: form.username.value,
        acceptTos: form.acceptTos.checked,
      };

      if (!user.acceptTos) {
        alert("You must accept the Terms of Service.");
        return;
      }

      try {
        await userStore.createUser(user);
        form.reset();
      } catch (error) {
        console.error(error);
        alert("Failed to create user.");
      }
    });
  }
}

customElements.define("user-form", UserForm);
