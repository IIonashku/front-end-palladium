import React from "react";
import { notificationStrings } from "./mainPage";

export function Notifications() {
  return notificationStrings.map((message) => {
    return message.message;
  });
}
