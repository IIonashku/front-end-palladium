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
import { axiosInstance } from "./axios.instance.ts";

function App() {
  React.useEffect(() => {
    const timer = setInterval(() => {
      axiosInstance
        .get("/auth/refresh/")
        .then((res) => {
          localStorage.access_token = res.data.access_token;
          localStorage.refresh_token = res.data.refresh_token;
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${res.data.access_token}`;
          axiosInstance.defaults.headers.refresh_token = `Bearer ${res.data.refresh_token}`;
        })
        .catch((err) => {
          console.log(err);
        });
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
