import { createUser, loginUser, signOutUser } from "./index.js";

window.createAndLoginUserImported = function createAndLoginUserImported() {
  createAndLoginUser();
}

window.loginUserImported = function loginUserImported() {
  loginUser();
}

window.signOutUserImported = function signOutUserImported() {
  signOutUser();
}

window.authStateImported = function authStateImported() {
  authState();
}
