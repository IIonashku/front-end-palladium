import axios from "axios";
import React from "react";
import { backEndUrl } from "../config.ts";

export default function User() {
  const [user, setUser] = React.useState({ username: "", role: "" });
  const [start, setStart] = React.useState(true);
  const getUser = () => {
    axios
      .get(backEndUrl + "/user/me", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
        },
      })
      .then((res) => {
        console.log(res.data);
        setUser(res.data);
      });
  };
  if (start) {
    setStart(false);
    getUser();
  }
  return (
    <div>
      <h1>Username:{" " + user.username}</h1>
      <h2>Role: {" " + user.role}</h2>
    </div>
  );
}
