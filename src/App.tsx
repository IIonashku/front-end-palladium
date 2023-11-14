import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.tsx";
import Main from "./components/mainPage.tsx";

function App() {
  const [access_token, setAccessToken] = useState();
  const [refresh_token, setRefreshToken] = useState();

  if (!access_token && !refresh_token) {
    return <Login setTokens={[setAccessToken, setRefreshToken]} />;
  }
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />}></Route>
          <Route path="/user" element={""}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
