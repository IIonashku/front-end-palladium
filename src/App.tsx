import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/login.tsx";
import Main from "./components/mainPage.tsx";
import TableGrid from "./components/CsvDataGrid.tsx";
import Upload from "./components/UploadGrid.tsx";
import { User } from "./components/User.tsx";
import TagList from "./components/TagList.tsx";
import { Export } from "./components/Export.tsx";
import { NotFound } from "./components/NotFoundPage.tsx";
import { toRefresh } from "./config.ts";

function App() {
  React.useEffect(() => {
    const timer = setInterval(() => {
      toRefresh();
    }, 3600000);
    return () => {
      clearInterval(timer);
    };
  });
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
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
