import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { backEndUrl } from "../config.ts";
import { Backdrop, Button } from "@mui/material";
import UploadForm from "./fileupload.tsx";
import { CSVLink } from "react-csv";

type tableData = {
  _id: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  carrier: string;
  listTag: string;
};

const columns: GridColDef[] = [
  { field: "phoneNumber", headerName: "Phone number", width: 210 },
  {
    field: "firstName",
    headerName: "First name",
    width: 110,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 110,
  },
  {
    field: "carrier",
    headerName: "Carrier",
    width: 210,
  },
  {
    field: "listTag",
    headerName: "List tag",
    description: "This column has a big value and it unable to sort",
    sortable: false,
    width: 800,
  },
];

export default function TableGrid() {
  const [dataLenght, setDataLenght] = React.useState(100);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<tableData[]>([]);
  const [openOverlay, setOpenOverlay] = React.useState(false);
  const [start, setStart] = React.useState(true);
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const pageChange = (pageInfo) => {
    setLoading(true);
    const toSkip = pageInfo.page * pageInfo.pageSize;
    const limits = pageInfo.pageSize;
    axios
      .post(
        backEndUrl + "/csv/data/",
        {
          options: { skips: toSkip, limits: limits },
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
    setPaginationModel(pageInfo);
  };
  const handleClose = () => {
    setOpenOverlay(false);
  };
  const handleOpen = () => {
    setOpenOverlay(true);
  };

  if (data.length === 0 && start) {
    setStart(false);
    axios
      .post(
        backEndUrl + "/csv/data/",
        { options: { skips: 0, limits: paginationModel.pageSize } },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then(async (res) => {
        setData(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .get(backEndUrl + "/csv/count", {
        headers: { Authorization: "Bearer " + localStorage.access_token },
      })
      .then((res) => {
        setDataLenght(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
  }

  React.useEffect(() => {}, []);

  const handleExport = () => {
    axios
      .get(backEndUrl + "/csv/export", {
        headers: {
          Authorization: "Bearer " + localStorage.access_token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        console.log(res);
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const fileName = "Export_csv.csv";
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Box sx={{ height: 820, width: "100%" }}>
      <DataGrid
        rows={data}
        paginationMode="server"
        rowCount={dataLenght}
        paginationModel={paginationModel}
        getRowId={(row) => row._id}
        columns={columns}
        pageSizeOptions={[5, 10, 25, 50, 100]}
        checkboxSelection
        disableRowSelectionOnClick
        onPaginationModelChange={pageChange}
        loading={isLoading}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        }}>
        <Button
          type="submit"
          variant="contained"
          id="upload"
          style={{ backgroundColor: "#1565c0" }}
          sx={{ mt: 2, mb: 2, maxWidth: "45%" }}
          fullWidth
          onClick={handleOpen}>
          Upload
        </Button>
        <Button
          type="button"
          variant="contained"
          id="export"
          style={{ backgroundColor: "#1565c0" }}
          fullWidth
          onClick={handleExport}
          sx={{ mt: 2, mb: 2, maxWidth: " 45%" }}>
          Export to file
        </Button>
        <Backdrop
          sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
          open={openOverlay}
          onDoubleClick={handleClose}>
          <UploadForm></UploadForm>
        </Backdrop>
      </Box>
    </Box>
  );
}
