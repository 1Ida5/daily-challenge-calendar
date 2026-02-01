export const Users = {};

export function createUser() {
  return {
    id: null,
    tosAcceptedAt: null,
    deletedAt: null,
  };
}

export function generateID() {
  return crypto.randomUUID();
}
