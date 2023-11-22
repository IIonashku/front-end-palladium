import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { backEndUrl } from "../config.ts";
import { Backdrop, Button, Input, Typography } from "@mui/material";
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

type filter = {
  listTag: string;
  phoneNumber: string;
  carrier: string;
};

const header = [
  { label: "Phone number", key: "phoneNumber" },
  { label: "First name", key: "firstName" },
  { label: "Last name", key: "lastName" },
  { label: "Carrier", key: "carrier" },
  { label: "List tag", key: "listTag" },
];

const csvReport = {
  filename: "Export_data.csv",
  headers: header,
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
    width: 300,
  },
];

let ltFilter;
let cFilter;
let pnFilter;

let filters: filter;

export default function TableGrid() {
  const [dataLenght, setDataLenght] = React.useState(100);
  const [isLoading, setLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<tableData[]>([]);
  const [openOverlay, setOpenOverlay] = React.useState(0);
  const [start, setStart] = React.useState(true);
  const [exportData, setExportData] = React.useState([]);
  const [listTag, setListTag] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [carrier, setCarier] = React.useState("");
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });

  const refreshPage = async () => {
    setLoading(true);
    const toSkip = paginationModel.page * paginationModel.pageSize;
    const limits = paginationModel.pageSize;
    axios
      .post(
        backEndUrl + "/csv/count",
        {
          filters: filters,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.access_token },
        }
      )
      .then((res) => {
        setDataLenght(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    axios
      .post(
        backEndUrl + "/csv/data/",
        {
          options: { skips: toSkip, limits: limits },
          filters: filters,
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
  };

  const pageChange = (pageInfo) => {
    setLoading(true);
    const toSkip = pageInfo.page * pageInfo.pageSize;
    const limits = pageInfo.pageSize;

    axios
      .post(
        backEndUrl + "/csv/data/",
        {
          options: { skips: toSkip, limits: limits },
          filters: filters,
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
    axios
      .post(
        backEndUrl + "/csv/count",
        {
          filters: filters,
        },
        {
          headers: { Authorization: "Bearer " + localStorage.access_token },
        }
      )
      .then((res) => {
        setDataLenght(res.data);
      })
      .catch((e) => {
        console.log(e);
      });
    setPaginationModel(pageInfo);
  };

  const handleClose = () => {
    setOpenOverlay(0);
  };

  const handleOpenUpload = () => {
    setOpenOverlay(1);
  };

  if (data.length === 0 && start) {
    setStart(false);
    refreshPage();
  }

  const handleExport = () => {
    axios
      .post(
        backEndUrl + "/csv/data/",
        {
          options: { skips: 0, limits: 1_000_000 },
          filters: filters,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then(async (res) => {
        setExportData(res.data);
        setOpenOverlay(2);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleApply = () => {
    filters = {
      listTag: ltFilter,
      phoneNumber: pnFilter,
      carrier: cFilter,
    };
    refreshPage();
  };

  const hanldeReset = () => {
    filters = {
      listTag: "",
      phoneNumber: "",
      carrier: "",
    };

    setListTag("");
    setPhoneNumber("");
    setCarier("");

    refreshPage();
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
          minWidth: 200,
          display: "flex",
          alignContent: "center",
          justifyContent: "centre",
        }}>
        <Box>
          <Box sx={{ margin: 3 }}>
            <Typography>List tag</Typography>
            <Input
              id="listTag"
              name="listTag"
              value={listTag}
              onChange={async (e) => {
                setListTag(e.target.value);
                ltFilter = e.target.value;
              }}></Input>
          </Box>
          <Box sx={{ margin: 3 }}>
            <Typography>Phone number</Typography>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              value={phoneNumber}
              onChange={async (e) => {
                setPhoneNumber(e.target.value);
                pnFilter = e.target.value;
              }}></Input>
          </Box>
          <Box sx={{ margin: 3 }}>
            <Typography>Carrier</Typography>
            <Input
              id="carrier"
              name="carrier"
              value={carrier}
              onChange={(e) => {
                setCarier(e.target.value);
                cFilter = e.target.value;
              }}></Input>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            style={{
              backgroundColor: "#1565c0",
              margin: 25,
              marginBottom: 0,
              maxWidth: "75%",
            }}>
            Apply filters
          </Button>
          <Button
            variant="contained"
            fullWidth
            onClick={hanldeReset}
            style={{
              backgroundColor: "#1565c0",
              margin: 25,
              marginTop: 10,
              maxWidth: "75%",
            }}>
            Reset filters
          </Button>
        </Box>
      </Box>
      <Box sx={{ height: 870 }}>
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
            onClick={handleOpenUpload}>
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
            open={openOverlay === 2}
            onDoubleClick={handleClose}>
            <CSVLink data={exportData} {...csvReport}>
              <Button
                type="button"
                variant="contained"
                style={{ backgroundColor: "#1565c0", width: 400 }}>
                Download
              </Button>
            </CSVLink>
          </Backdrop>
          <Backdrop
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
            open={openOverlay === 1}
            onDoubleClick={handleClose}>
            <UploadForm></UploadForm>
          </Backdrop>
        </Box>
      </Box>
    </>
  );
}
