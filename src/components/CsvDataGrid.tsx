import * as React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridSlotsComponentsProps,
} from "@mui/x-data-grid";
import {
  Backdrop,
  Button,
  Checkbox,
  Chip,
  Dialog,
  FormControl,
  IconButton,
  Input,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import { errorToast, successfulToast } from "../functions/toast.message.ts";
import { axiosInstance } from "../axios.instance.ts";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { debounce } from "@mui/material/utils";
import { availableCarrier } from "../config.ts";
import PropTypes from "prop-types";
import LinearProgressWithLabel from "./LinearProgressWithLabel.tsx";

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
const columns: GridColDef[] = [
  {
    field: "phoneNumber",
    headerName: "Phone number",
    width: 120,
    sortable: false,
  },
  {
    field: "firstName",
    headerName: "First name",
    width: 110,
    sortable: false,
  },
  {
    field: "lastName",
    headerName: "Last name",
    width: 110,
    sortable: false,
  },
  {
    field: "type",
    headerName: "Type",
    width: 110,
    sortable: false,
  },
  {
    field: "carrier",
    headerName: "Carrier",
    width: 210,
    sortable: false,
  },
  {
    field: "inBase",
    headerName: "In base",
    width: 70,
    sortable: false,
    renderCell: (params) => {
      if (params.value !== undefined) return params.value ? "✅" : "❌";
    },
  },
  {
    field: "listTag",
    headerName: "List tag",
    description: "This column has a big value and it unable to sort",
    sortable: false,
    width: 600,
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
  const [listTag, setListTag] = React.useState("");
  const [phoneNumber, setPhoneNumber] = React.useState("");
  const [carrier, setCarier] = React.useState("");
  const [exportFile, setExportFile] = React.useState("");
  const [inBase, setInBase] = React.useState<boolean | undefined>();
  const [paginationModel, setPaginationModel] = React.useState({
    page: 0,
    pageSize: 25,
  });
  const [nullTypeAndCarrier, setNullTypeAndCarrier] =
    React.useState<boolean>(false);
  const [countStatus, setCountStatus] = React.useState("Max");
  const [countToUpdate, setCountToUpdate] = React.useState(0);
  const [displaingValues, setDisplaingValues] = React.useState<string[]>([]);
  const [phoneFilterError, setPhoneFilterError] = React.useState(false);
  const [tagFilterError, setTagFilterError] = React.useState(false);
  const [progress, setProgress] = React.useState(0);

  const updateCarrierRef = React.useRef<any>();

  const handleClickOutside = (event) => {
    if (
      updateCarrierRef.current &&
      !updateCarrierRef.current.contains(event.target)
    ) {
      setOpenOverlay(0);
    }
  };

  React.useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const refreshPage = async () => {
    setLoading(true);
    const toSkip = paginationModel.page * paginationModel.pageSize;
    const limits = paginationModel.pageSize;
    axiosInstance
      .post(
        "/csv/count",
        {
          filters: filters,
        },
        { headers: { "Access-Control-Allow-Origin": "*" } }
      )
      .then((res) => {
        setDataLenght(res.data);
        setCountStatus("Max");
      });
    axiosInstance
      .post("/csv/data/", {
        options: { skips: toSkip, limits: limits },
        filters: filters,
        displayStrings: displaingValues,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
      });
  };

  const pageChange = (pageInfo) => {
    setLoading(true);
    const toSkip = pageInfo.page * pageInfo.pageSize;
    const limits = pageInfo.pageSize;

    axiosInstance
      .post("/csv/data/", {
        options: { skips: toSkip, limits: limits },
        filters: filters,
        displayStrings: displaingValues,
      })
      .then((res) => {
        setData(res.data);
        setLoading(false);
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
    axiosInstance.get("/csv/info/export/reading").then((res) => {
      if (res == null) {
        return;
      }
      if (res.data.exportedData !== 0 && res.data.dataLimit !== 0)
        setProgress((res.data.exportedData / res.data.dataLimit) * 100);
      else setProgress(0);
    });
  }

  React.useEffect(() => {
    const timer = setInterval(() => {
      axiosInstance.get("/csv/info/export/reading").then((res: any) => {
        if (res.data.exportedData !== 0 && res.data.dataLimit !== 0)
          setProgress((res.data.exportedData / res.data.dataLimit) * 100);
        else setProgress(0);
      });
    }, 5000);

    return () => {
      clearInterval(timer);
    };
  });

  const handleExport = () => {
    axiosInstance
      .post(
        `/csv/export/${exportFile}`,
        {
          filters: filters,
          displayStrings: displaingValues,
        },
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then(async (res) => {
        if (res == null) {
          return;
        }
        successfulToast("File fully created");
      });
    successfulToast("Exporting started");
    setExportFile("");
  };

  const handleApply = () => {
    setCountStatus("Uploading");
    if (!tagFilterError) {
      if (carrier in availableCarrier) {
      }
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
      if (listTag && listTag.length >= 1) {
        axiosInstance
          .post(`/csv/analis/data/count/${listTag}`, {
            inBase: inBase === undefined ? undefined : inBase,
            nullTypeAndCarrier: !!nullTypeAndCarrier,
            carrier: carrier,
          })
          .then((res) => {
            if (res == null) {
              return;
            }
            setDataLenght(res.data);
          });
      }
      refreshPage();
    } else {
      errorToast("Filter error, check filter and try again");
      setCountStatus("Max");
    }
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

  const handleUpdateCarrier = (): void => {
    axiosInstance
      .post(
        "/csv/count",
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
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        if (res == null) {
          return;
        }
        setCountToUpdate(res.data);
        setOpenOverlay(1);
      });
  };

  const handleConfirmUpdate = async () => {
    axiosInstance
      .post(
        "/csv/check/carrier",
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
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
      .then((res) => {
        if (res == null) {
          return;
        }
        console.log(res.data);
        successfulToast("HLR updated");
        setOpenOverlay(2);
      });
  };

  function handleChange(options: string[]): void {
    if (Array.isArray(options)) {
      setDisplaingValues(options);
    }
  }

  return (
    <div
      style={{
        marginTop: "0.5%",
        marginBottom: 4,
        marginLeft: "1%",
        marginRight: "1%",
        display: "flex",
        justifyItems: "baseline",
        width: "76%",
      }}>
      <Dialog open={openOverlay === 2}>
        <Button onClick={handleClose}>Close</Button>
      </Dialog>
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
              error={tagFilterError}
              id="listTag"
              name="listTag"
              placeholder="Input tag"
              value={listTag}
              onChange={async (e) => {
                setListTag(e.target.value);
                const valid = await axiosInstance.post("/csv/analisys/check/", {
                  fileName: e.target.value,
                });

                if (valid.data) {
                  setTagFilterError(false);

                  ltFilter = e.target.value;
                } else {
                  setTagFilterError(true);
                  setListTag(e.target.value);
                  ltFilter = e.target.value;
                }
              }}></Input>
          </Box>
          <Box sx={{ margin: 3 }}>
            <Input
              error={phoneFilterError}
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Input phone number"
              value={phoneNumber}
              onChange={async (e) => {
                if (e.target.value.length > 11) {
                  setPhoneFilterError(true);
                } else {
                  setPhoneFilterError(false);
                  setPhoneNumber(e.target.value);
                  pnFilter = e.target.value;
                }
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
          <Box sx={{ margin: 3, marginBottom: 0 }}></Box>
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
              HLR Missing
            </Typography>
            <Checkbox
              value={nullTypeAndCarrier}
              checked={nullTypeAndCarrier}
              sx={{ marginLeft: 2.2 }}
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
            Update MLR
          </Button>
          <Backdrop
            ref={updateCarrierRef}
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
                  Cancel
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
          <Box
            sx={{
              display: "flex",
              marginTop: 1,
              marginRight: 1,
            }}></Box>
        </Box>
      </Box>
      <Box sx={{ maxHeight: 770, minWidth: "100%" }}>
        <DataGrid
          rows={data}
          paginationMode="server"
          rowCount={dataLenght}
          paginationModel={paginationModel}
          getRowId={(row) => row._id}
          columns={columns}
          pageSizeOptions={[5, 10, 25, 50, 100]}
          onPaginationModelChange={pageChange}
          loading={isLoading}
          style={{ minWidth: "100%" }}
          slots={{ footer: CustomFooter }}
          slotProps={{
            footer: {
              page: paginationModel.page,
              pageSize: paginationModel.pageSize,
              maxDataNumber: dataLenght,
              changePage: pageChange,
              status: countStatus,
              changeDisplayOptions: handleChange,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}>
          <Input
            sx={{ width: "50%" }}
            value={exportFile}
            onChange={(event) => {
              const exportFileName = event.target.value;
              setExportFile(exportFileName);
            }}></Input>
          <Button
            type="button"
            variant="contained"
            id="export"
            style={{ backgroundColor: "#1565c0" }}
            fullWidth
            onClick={handleExport}
            sx={{ mt: 2, mb: 2, width: "50%" }}>
            Export to file
          </Button>
        </Box>
        <LinearProgressWithLabel value={progress} />
      </Box>
    </div>
  );
}
declare module "@mui/x-data-grid" {
  interface FooterPropsOverrides {
    page: number;
    pageSize: number;
    maxDataNumber: number;
    changePage: Function;
    status: string;
    changeDisplayOptions: Function;
  }
}

CustomFooter.propTypes = {
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  maxDataNumber: PropTypes.number.isRequired,
  changePage: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  changeDisplayOptions: PropTypes.func.isRequired,
};

function CustomFooter(props: NonNullable<GridSlotsComponentsProps["footer"]>) {
  const rowOptions = [5, 10, 25, 50, 100];
  const [displaingRows, setDisplaingRows] = React.useState<number>(25);
  const [displaingValues, setDisplaingValues] = React.useState<string[]>([]);
  const displayOptions = [
    "phoneNumber",
    "firstName",
    "lastName",
    "type",
    "carrier",
    "inBase",
    "listTag",
  ];
  if (props.page === undefined) props.page = 0;
  if (props.pageSize === undefined) props.pageSize = 5;
  if (props.maxDataNumber === undefined) props.maxDataNumber = 0;
  if (props.status === undefined) props.status = "Max";
  if (props.changePage === undefined) props.changePage = (): void => {};

  function handleChangePage(event: SelectChangeEvent<number>): void {
    setDisplaingRows(Number(event.target.value));
    props.changePage({ page: props.page, pageSize: event.target.value });
  }

  const handleChangeDisplayOptions = (event: SelectChangeEvent<string[]>) => {
    if (Array.isArray(event.target.value)) {
      setDisplaingValues(event.target.value);
      props.changeDisplayOptions(event.target.value);
    }
  };

  return (
    <div
      className="props.name"
      id={props.id}
      style={{
        padding: 10,
        display: "flex",
        flexDirection: "row-reverse",
        alignItems: "center",
      }}>
      {props.children}
      <IconButton
        disabled={
          props.page * props.pageSize + props.pageSize >= props.maxDataNumber
        }
        style={{
          padding: 8,
          maxWidth: "36px",
          maxHeight: "36px",
          minWidth: "36px",
          minHeight: "36px",
        }}
        sx={{
          ...(props.page * props.pageSize + props.pageSize >=
            props.maxDataNumber && {
            color: "grey",
          }),
          color: "black",
        }}
        type="button"
        onClick={() => {
          props.changePage({
            page: props.page + 1,
            pageSize: props.pageSize,
          });
        }}>
        <ChevronRightIcon />
      </IconButton>
      <IconButton
        disabled={props.page === 0}
        sx={{
          ...(props.page * props.pageSize + props.pageSize >=
            props.maxDataNumber && {
            color: "grey",
          }),
          color: "black",
        }}
        style={{
          padding: 8,
          maxWidth: "36px",
          maxHeight: "36px",
          minWidth: "36px",
          minHeight: "36px",
        }}
        onClick={() => {
          props.changePage({
            page: props.page - 1,
            pageSize: props.pageSize,
          });
        }}>
        <ChevronLeftIcon />
      </IconButton>
      <Typography style={{ padding: 8 }}>
        {props.status ? props.status : "Err"}
      </Typography>
      <Typography style={{ padding: 8 }}>
        {props.page && props.pageSize ? props.page * props.pageSize : 0} -{" "}
        {props.maxDataNumber}{" "}
      </Typography>
      <FormControl variant="standard" style={{ margin: 5 }}>
        <Select
          labelId="mutiple-checkbox-label"
          defaultValue={25}
          value={displaingRows}
          onChange={handleChangePage}>
          {rowOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Typography style={{ padding: 8 }}>Change row count: </Typography>
      <Input
        style={{ margin: 10, padding: 0 }}
        type="number"
        placeholder="Input page number…"
        value={pageNumber}
        onChange={(e) => {
          if (props.pageSize === undefined) props.pageSize = 0;
          if (props.maxDataNumber === undefined) props.maxDataNumber = 0;
          if (
            Number(e.target.value) >= 0 &&
            Number(e.target.value) * props.pageSize <= props.maxDataNumber
          ) {
            debounce(
              props.changePage({
                page: Number(e.target.value),
                pageSize: props.pageSize,
              }),
              100
            );
          }
        }}
      />
      <FormControl fullWidth style={{ minWidth: "30%", maxWidth: "40%" }}>
        <InputLabel id="mutiple-checkbox-label">Display Options</InputLabel>
        <Select
          labelId="mutiple-checkbox-label"
          multiple
          value={displaingValues}
          onChange={handleChangeDisplayOptions}
          input={<OutlinedInput label="Display Options" />}
          renderValue={(displaingValues) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {displaingValues.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}>
          {displayOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={displaingValues.indexOf(option) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
