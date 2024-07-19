import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  TablePagination,
  TableSortLabel,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  MenuItem,
  CircularProgress,
  Box,
} from "@mui/material";
import { styled } from "@mui/system";
import { toast } from "react-toastify";

const CurrencyConverter = () => {
  const [amount, setAmount] = useState(0);
  const [fromCurrency, setFromCurrency] = useState();
  const [toCurrency, setToCurrency] = useState();
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState([]);
  const [tableCurrency, setTableCurrency] = useState([]);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("price");
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  console.log("sssssss", tableCurrency);

  useEffect(() => {
    const fetchData = async () => {
      const responseData = await axios.get(
        "https://interview.switcheo.com/prices.json"
      );
      setTableCurrency(responseData?.data);
      setExchangeRate(responseData?.data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  const sortedData = stableSort(tableCurrency, getComparator(order, orderBy));

  const handleConvert = () => {
    if (!amount || !fromCurrency || !toCurrency) {
      toast.error("Please fill in all fields!", {
        style: { fontSize: "18px" },
      });
      return;
    }
    const fromRate =
      exchangeRate.find((rate) => rate.currency === fromCurrency)?.price || 0;
    const toRate =
      exchangeRate.find((rate) => rate.currency === toCurrency)?.price || 0;
    if (fromRate && toRate) {
      const result = (amount / (1 / fromRate)) * (1 / toRate);
      setConvertedAmount(result);
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setAmount("");
    setFromCurrency("");
    setToCurrency("");
  };

  const AnimatedTextField = styled(TextField)(({ theme }) => ({
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderWidth: "3px", // Make border thicker
        borderStyle: "solid", // Solid border style
        borderRadius: "8px", // Adjust the thickness of the border
      },
      "&:hover fieldset": {
        animation: "borderAnimation 2s infinite",
      },
    },
    "@keyframes borderAnimation": {
      "0%": {
        borderColor: "#a93eff",
      },
      "33%": {
        borderColor: "#5e40de",
      },
      "66%": {
        borderColor: "#00b3ff",
      },
      "100%": {
        borderColor: "#a93eff",
      },
    },
  }));

  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="flex flex-col gap-10 lg:flex-row justify-evenly lg:gap-20">
      <div>
        <TableContainer component={Paper} sx={{ backgroundColor: "#D6e8ee" }}>
          <Typography variant="h4" component="h2" gutterBottom>
            <h2>Currency Conversion Table</h2> (Based on USD)
          </Typography>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Currency</TableCell>
                <TableCell>Date</TableCell>
                <TableCell sortDirection={orderBy === "price" ? order : false}>
                  <TableSortLabel
                    active={orderBy === "price"}
                    direction={orderBy === "price" ? order : "asc"}
                    onClick={() => handleRequestSort("price")}>
                    Price
                  </TableSortLabel>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedData
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.currency}</TableCell>
                    <TableCell>
                      {new Date(item.date).toLocaleString()}
                    </TableCell>
                    <TableCell>{item.price}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={tableCurrency.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      </div>
      <div>
        <div className="text-4xl text-black">Currency Converter</div>
        <TextField
          label="Amount"
          variant="outlined"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          fullWidth
          margin="normal"
          type="number"
          sx={{ border: "3px" }}
          inputProps={{ min: 0 }}
        />
        <AnimatedTextField
          select
          label="From Currency"
          variant="outlined"
          value={fromCurrency}
          onChange={(e) => setFromCurrency(e.target.value)}
          fullWidth
          margin="normal">
          {exchangeRate.map((rate) => (
            <MenuItem key={rate.currency} value={rate.currency}>
              {rate.currency}
            </MenuItem>
          ))}
        </AnimatedTextField>
        <AnimatedTextField
          select
          label="To Currency"
          variant="outlined"
          value={toCurrency}
          onChange={(e) => setToCurrency(e.target.value)}
          fullWidth
          margin="normal">
          {exchangeRate.map((rate) => (
            <MenuItem key={rate.currency} value={rate.currency}>
              {rate.currency}
            </MenuItem>
          ))}
        </AnimatedTextField>
        <Button
          variant="contained"
          color="primary"
          onClick={handleConvert}
          sx={{
            position: "relative",
            overflow: "hidden",
            background: "linear-gradient(94deg, #2196F3, #2196F3)",
            color: "white", //
            transition: "background 0.7s ease",
            "&:hover": {
              background: "linear-gradient(94deg, #2196F3, #9C27B0)",
              color: "black",
            },
          }}>
          Convert
        </Button>

        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Conversion Result</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {amount} {fromCurrency} ={" "}
              {convertedAmount !== null ? convertedAmount.toFixed(2) : "0"}{" "}
              {toCurrency}.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default CurrencyConverter;
