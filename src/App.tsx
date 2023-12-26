import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.tsx";
import Main from "./components/mainPage.tsx";
import TableGrid from "./components/CsvDataGrid.tsx";
import Upload from "./components/UploadGrid.tsx";
import { User } from "./components/User.tsx";
import TagList from "./components/TagList.tsx";
import { Export } from "./components/Export.tsx";

export let isLogIn = false;

export const logout = () => {
  console.log(isLogIn);
  isLogIn = !isLogIn;
};

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/data" element={<Main Element={TableGrid} />}></Route>
          <Route path="/upload" element={<Main Element={Upload} />}></Route>
          <Route path="/user" element={<Main Element={User} />}></Route>
          <Route path="/tag/lists" element={<Main Element={TagList} />}></Route>
          <Route path="/export" element={<Main Element={Export} />}></Route>
          <Route path="/" element={<Login />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
