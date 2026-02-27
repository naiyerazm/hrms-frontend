import Cookies from "js-cookie";

export function saveToken(token) {
  Cookies.set("token", token, { expires: 1 }); // valid for 1 day
}

export function getToken() {
  return Cookies.get("token");
}

export function logout() {
  Cookies.remove("token");
}
