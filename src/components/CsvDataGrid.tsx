import * as React from "react";
import Box from "@mui/material/Box";
import axios from "axios";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { backEndUrl } from "../config.ts";
import { Backdrop, Button, Checkbox, Input, Typography } from "@mui/material";
import { CSVLink } from "react-csv";
import { errorToast } from "../functions/toast.message.ts";
import { notificationStrings } from "./mainPage.tsx";

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
  inBase: boolean | undefined;
};

const header = [
  { label: "Phone number", key: "phoneNumber" },
  { label: "First name", key: "firstName" },
  { label: "Last name", key: "lastName" },
  { label: "Type", key: "type" },
  { label: "Carrier", key: "carrier" },
  { label: "List tag", key: "listTag" },
];

const csvReport = {
  filename: "Export_data.csv",
  headers: header,
};

const columns: GridColDef[] = [
  { field: "phoneNumber", headerName: "Phone number", width: 120 },
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
    field: "type",
    headerName: "Type",
    width: 110,
  },
  {
    field: "carrier",
    headerName: "Carrier",
    width: 210,
  },
  {
    field: "inBase",
    headerName: "In base",
    width: 70,
  },
  {
    field: "listTag",
    headerName: "List tag",
    description: "This column has a big value and it unable to sort",
    sortable: false,
    width: 390,
  },
];

let ltFilter = "";
let cFilter = "";
let pnFilter = "";
let inBaseFilter;

let pageNumber;

let filters: filter = {
  listTag: "",
  phoneNumber: "",
  carrier: "",
  inBase: undefined,
};

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
  const [inBase, setInBase] = React.useState<boolean | undefined>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [nullTypeAndCarrier, setNullTypeAndCarrier] =
    React.useState<boolean>(false);
  const [countToUpdate, setCountToUpdate] = React.useState(0);

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

  if (data.length === 0 && start) {
    setStart(false);
    filters = {
      phoneNumber: "",
      carrier: "",
      listTag: "",
      inBase: undefined,
    };
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
    if (nullTypeAndCarrier) {
      filters = {
        listTag: ltFilter,
        phoneNumber: pnFilter,
        carrier: "nullTypeAndCarrier",
        inBase: inBaseFilter,
      };
    } else
      filters = {
        listTag: ltFilter,
        phoneNumber: pnFilter,
        carrier: cFilter,
        inBase: inBaseFilter,
      };
    refreshPage();
  };

  const hanldeReset = () => {
    filters = {
      listTag: "",
      phoneNumber: "",
      carrier: "",
      inBase: undefined,
    };
    cFilter = "";
    pnFilter = "";
    ltFilter = "";
    inBaseFilter = undefined;
    setListTag("");
    setPhoneNumber("");
    setCarier("");
    setInBase(undefined);
    setNullTypeAndCarrier(false);

    refreshPage();
  };

  function handleUpdateCarrier(): void {
    axios
      .post(
        backEndUrl + "/csv/count",
        {
          filters: {
            phoneNumber: filters.phoneNumber,
            listTag: filters.listTag,
            carrier: "nullTypeAndCarrier",
            inBase: filters.inBase,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        setCountToUpdate(res.data);
        setOpenOverlay(1);
      })
      .catch((e) => {
        errorToast(e.message);
        notificationStrings.unshift({
          type: "error",
          message: "Error occured",
        });
      });
  }

  const handleConfirmUpdate = async () => {
    const phoneArray: string[] = [];

    await axios
      .post(
        backEndUrl + "/csv/data",
        {
          options: { limits: 0, skips: 0 },
          filters: {
            phoneNumber: filters.phoneNumber,
            listTag: filters.listTag,
            carrier: "nullTypeAndCarrier",
            inBase: filters.inBase,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        for (let i = 0; i < res.data.length; i++) {
          phoneArray.push(res.data[i].phoneNumber);
        }
      })
      .catch((e) => {
        errorToast(e.message);
        notificationStrings.unshift({
          type: "error",
          message: "Error occured",
        });
      });
    console.log(phoneArray);
    axios
      .post(
        backEndUrl + "/csv/check/carrier",
        {
          phoneNumber: phoneArray,
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.access_token,
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
      })
      .catch((e) => {
        console.log(e);
        errorToast(e.message);
        notificationStrings.unshift({
          type: "error",
          message: "Error occured",
        });
      });
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
            <Input
              id="listTag"
              name="listTag"
              placeholder="Input tag"
              value={listTag}
              onChange={async (e) => {
                setListTag(e.target.value);
                ltFilter = e.target.value;
              }}></Input>
          </Box>
          <Box sx={{ margin: 3 }}>
            <Input
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Input phone number"
              value={phoneNumber}
              onChange={async (e) => {
                setPhoneNumber(e.target.value);
                pnFilter = e.target.value;
              }}></Input>
          </Box>
          <Box sx={{ margin: 3, marginBottom: 0 }}>
            <Input
              id="carrier"
              name="carrier"
              placeholder="Input carrier"
              value={carrier}
              onChange={(e) => {
                setCarier(e.target.value);
                cFilter = e.target.value;
              }}></Input>
          </Box>
          <Box sx={{ margin: 3, marginBottom: 0 }}>
            <Input
              type="number"
              placeholder="Input page number…"
              value={pageNumber}
              onChange={(e) => {
                if (
                  Number(e.target.value) >= 0 &&
                  Number(e.target.value) * paginationModel.pageSize <=
                    dataLenght
                ) {
                  setPaginationModel({
                    page: Number(e.target.value),
                    pageSize: paginationModel.pageSize,
                  });
                  pageChange({
                    page: e.target.value,
                    pageSize: paginationModel.pageSize,
                  });
                }
              }}
            />
          </Box>
          <Box
            sx={{
              marginLeft: 3,
              display: "flex",
            }}>
            <Typography
              sx={{
                display: "grid",
                alignItems: "center",
              }}>
              inBase
            </Typography>
            <Checkbox
              sx={{ marginLeft: 7.5 }}
              onChange={(e) => {
                inBaseFilter = !inBase;
                setInBase(!inBase);
              }}
            />
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleApply}
            style={{
              backgroundColor: "#1565c0",
              margin: 25,
              marginTop: 0,
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
          <Box
            sx={{
              marginLeft: 3,
              marginRight: 3,
              display: "flex",
            }}>
            <Typography
              sx={{
                display: "grid",
                alignItems: "center",
              }}>
              Null carrier and type
            </Typography>
            <Checkbox
              onChange={(e) => {
                cFilter = "";
                if (nullTypeAndCarrier === true) setNullTypeAndCarrier(false);
                else setNullTypeAndCarrier(true);
              }}
            />
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={handleUpdateCarrier}
            style={{
              backgroundColor: "#1565c0",
              margin: 25,
              marginTop: 0,
              marginBottom: 0,
              maxWidth: "75%",
            }}>
            Update null carrier
          </Button>
          <Backdrop
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              height: 150,
              background: "#fffff9",
              border: "2px solid #1565c0",
              borderRadius: "5px",
            }}
            open={openOverlay === 1}
            onDoubleClick={handleClose}>
            <Box
              sx={{
                display: "flow",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}>
                <Typography sx={{ color: "black" }}>
                  Number of data to update: {countToUpdate}
                </Typography>
              </Box>
              <Box
                sx={{
                  height: 100,
                  width: 500,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleClose}
                  style={{
                    backgroundColor: "#1565c0",
                    margin: 25,
                    marginTop: 0,
                    marginBottom: 0,
                    maxWidth: "75%",
                    maxHeight: 40,
                  }}>
                  Cansel
                </Button>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={handleConfirmUpdate}
                  style={{
                    backgroundColor: "#1565c0",
                    margin: 25,
                    marginTop: 0,
                    marginBottom: 0,
                    maxWidth: "75%",
                    maxHeight: 40,
                  }}>
                  Update
                </Button>
              </Box>
            </Box>
          </Backdrop>
        </Box>
      </Box>
      <Box sx={{ height: 770, minWidth: "100%" }}>
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
          style={{ minWidth: "100%" }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Button
            type="button"
            variant="contained"
            id="export"
            style={{ backgroundColor: "#1565c0" }}
            fullWidth
            onClick={handleExport}
            sx={{ mt: 2, mb: 2, maxWidth: " 100%" }}>
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
        </Box>
      </Box>
    </>
  );
}
