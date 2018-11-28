import { db } from './firebase';

// User API

export const doCreateUser = (id, username, email, role) =>
  db.ref(`users/${id}`).set({
    username,
    email,
    role,
  });

export const onceGetUsers = () =>
  db.ref('users').once('value');

export const getCurrentUsername = (id) =>
  db.ref('/users/' + id).once('value');

export const deleteUser = (id) =>
  db.ref('/users/' + id).remove();

  //USER TRACKING and INFO
export const lastLoadedData = (userId, dateTime) => {
  if (userId) {
    db.ref(`users/${userId}/data/last_loaded_data`).set(dateTime)
  }
}
export const lastViewedPage = (userId, pageName) => {
  if (userId) {
    db.ref(`users/${userId}/data/last_viewed_page`).set(pageName)
  }
}