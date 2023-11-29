import React, { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.tsx";
import Main from "./components/mainPage.tsx";
import TableGrid from "./components/CsvDataGrid.tsx";
import Upload from "./components/UploadGrid.tsx";
import User from "./components/User.tsx";
import TagList from "./components/TagList.tsx";

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
          <Route path="/" element={<Main Element={TableGrid} />}></Route>
          <Route path="/upload" element={<Main Element={Upload} />}></Route>
          <Route path="/user" element={<Main Element={User} />}></Route>
          <Route path="/tag/lists" element={<Main Element={TagList} />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
