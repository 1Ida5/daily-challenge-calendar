export const Users = {};

export function createUser() {
  return {
    id: null,
    username: null,
    tosAcceptedAt: null,
    deletedAt: null,
  };
}

export function generateID() {
  return crypto.randomUUID();
}
