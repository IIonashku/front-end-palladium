export default function authHeader() {
  const userStr = localStorage.getItem("user");
  let user: any = null;
  if (userStr) user = JSON.parse(userStr);

  if (user && user.accessToken) {
    return {
      Authorization: "Bearer " + user.access_token,
      refreshToken: user.refresh_token,
    };
  } else {
    return { Authorization: "" };
  }
}
