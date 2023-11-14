import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./mainPage";
import React from "react";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />}></Route>
        <Route path="/user" element={111}></Route>
      </Routes>
    </BrowserRouter>
  );
}
