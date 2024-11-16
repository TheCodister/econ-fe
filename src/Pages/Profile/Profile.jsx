import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Footer, Header, UserMenu } from "../../Components";
import CreateProduct from "../../Components/Common/ManagerComponents/CreateProduct";
import CreatePromotion from "../../Components/Common/ManagerComponents/CreatePromotion";
import Dashboard from "../../Components/Common/ManagerComponents/Dashboard";
import Restock from "../../Components/Common/ManagerComponents/Restock";
import StoreOrders from "../../Components/Common/ManagerComponents/StoreOrders";
import AccountDetails from "../../Components/Common/UserComponents/AccountDetail";
import MyAccount from "../../Components/Common/UserComponents/MyAccount";
import MyOrders from "../../Components/Common/UserComponents/MyOrders";
import Promotions from "../../Components/Common/UserComponents/Promotions";
import "./Profile.scss";

import CasinoIcon from "@mui/icons-material/Casino"; // Icon for the floating button
import {
  Badge,
  Box,
  Button,
  IconButton,
  Modal,
  Typography,
} from "@mui/material";
import { keyframes } from "@mui/system";
import { Wheel } from "react-custom-roulette";

// Define the pulse animation
const pulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(254, 59, 212, 0.7);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 20px rgba(254, 59, 212, 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(254, 59, 212, 0);
  }
`;

const Profile = () => {
  // Variables for customer information

  const navigate = useNavigate();

  const [CFName, setCFName] = useState("");
  const [CLName, setCLName] = useState("");
  const [CAddress, setCAddress] = useState("");
  const [CPhone, setCPhone] = useState("");
  const [rank, setrank] = useState("");
  const [transaction, settransaction] = useState([]);
  const [promotion, setpromotion] = useState([]);

  const [showmanager, setShowmanager] = useState(false);
  const [showuser, setShowuser] = useState(false);

  //Cookie
  const [cookie, setcookie] = useState(false);

  const [formData, setformData] = useState({
    CFName: "",
    CLName: "",
    CAddress: "",
    CPhone: "",
    CustomerID: 0,
  });
  /* make cookie when need to get customer id*/
  const setCookie = (name, value, days) => {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookieValue = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookieValue;
  };
  /*Take cookie*/
  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(";");

    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  //   delete cookie
  function deleteCookie(cookieName) {
    if (getCookie(cookieName)) {
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  useEffect(() => {
    // This effect will be triggered whenever formData is updated
    setformData({
      ...formData,
      CFName: CFName,
      CLName: CLName,
      CAddress: CAddress,
      CPhone: CPhone,
    });

    if (CFName === "" || CLName === "" || CAddress === "" || CPhone === "") {
      return;
    }

    if (formData.CustomerID === 0) {
      axios
        .get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/lastid`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.data)
        .then((data) => {
          console.log("Fetched Data:", data);
          const newID = data + 1;
          setformData({
            ...formData,
            CustomerID: newID,
            CFName: CFName,
            CLName: CLName,
            CAddress: CAddress,
            CPhone: CPhone,
          });
        })
        .then(() => {
          // Use useEffect to ensure state update is complete before calling submitsignupForm
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [CFName, CLName, CAddress, CPhone]);

  const submitloginForm = async () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/${getCookie("userID")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Fetched Cookie:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched Cookie:", data);
        setCFName(data.CFName);
        setCLName(data.CLName);
        setCAddress(data.CAddress);
        setCPhone(data.CPhone);
      })
      .catch((error) => console.error(`Error fetching ${cookie} data:`, error));

    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/customer-rank/${getCookie("userID")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Fetched Data:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched Data:", data.rank);
        setrank(data.rank);
      });

    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/shipping/${getCookie("userID")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Fetched Data:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched Data:", data.data);
        settransaction(data.data);
      })
      .catch((error) =>
        console.error(`Error fetching ${getCookie("userID")} data:`, error)
      );
    axios
      .get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotion/`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Fetched Cookie:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched data:", data);
        setpromotion(data);
      })
      .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
  };

  const submitmanagerLoginForm = async () => {
    axios
      .get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/employees/${getCookie("managerID")}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Fetched cookie:", response.data);
        return response.data;
      })
      .then((data) => {
        console.log("Fetched cookie:", data);
        setCFName(data.FirstName);
        setCLName(data["LastName "]);
        setCAddress(data["Address "]);
      })
      .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
  };

  const [activeComponent, setActiveComponent] = useState("MyAccount"); // Default active component

  useState(() => {
    if (getCookie("userID")) {
      submitloginForm();
      setShowuser(true);
    } else if (getCookie("managerID")) {
      submitmanagerLoginForm();
      setShowmanager(true);
      setActiveComponent("Dashboard");
    }
  }, []);

  // State for managing the modal and wheel
  const [openWheel, setOpenWheel] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [wheelData, setWheelData] = useState([
    { option: "10% OFF" },
    { option: "Try Again" },
    { option: "Free Shipping" },
    { option: "5% OFF" },
    { option: "20% OFF" },
    { option: "15% OFF" },
  ]);
  const [fortuneChances, setFortuneChances] = useState(1);

  // Function to handle opening the modal
  const handleOpenWheel = () => {
    setOpenWheel(true);
  };

  // Function to handle closing the modal
  const handleCloseWheel = () => {
    setOpenWheel(false);
  };

  // Function to handle spinning the wheel
  const handleSpinClick = () => {
    if (fortuneChances > 0) {
      const newPrizeNumber = Math.floor(Math.random() * wheelData.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  // Function to handle the result when the wheel stops spinning
  const handleWheelStop = () => {
    const winner = wheelData[prizeNumber].option;
    alert(`Congratulations! You won ${winner}!`);
    // Handle granting the promotion to the user
    // For example, send a request to the backend
    //   // Send the promotion to the backend
    // axios
    //   .post(`${import.meta.env.VITE_REACT_APP_API_URL}/promotions/apply`, {
    //     userId: getCookie('userID'),
    //     promotion: winner,
    //   })
    //   .then((response) => {
    //     // Handle success
    //     console.log('Promotion applied:', response.data);
    //   })
    //   .catch((error) => {
    //     // Handle error
    //     console.error('Error applying promotion:', error);
    //   });
    setMustSpin(false);
    setFortuneChances(fortuneChances - 1); // Decrease chances by 1
  };

  // Adjust the badge position
  const badgeStyle = {
    "& .MuiBadge-badge": {
      left: 8,
      top: 8,
    },
  };

  // Function to handle which menu item is clicked
  const handleMenuClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="login">
      <Header />

      <div className="profile-content">
        {showuser && (
          <div className="profile-content-wrapper">
            <UserMenu
              username={`${CFName} ${CLName}`}
              onMenuClick={handleMenuClick}
              mode="Customer"
            />
            <div className="component-container">
              {activeComponent === "MyOrders" && <MyOrders />}
              {activeComponent === "Promotions" && <Promotions />}
              {activeComponent === "MyAccount" && <MyAccount />}
              {activeComponent === "AccountDetails" && <AccountDetails />}
            </div>
          </div>
        )}
        {showmanager && (
          <div className="profile-content-wrapper">
            <UserMenu
              username={`${CFName} ${CLName}`}
              onMenuClick={handleMenuClick}
              mode="Manager"
            />
            <div className="component-container">
              {activeComponent === "Restock" && <Restock />}
              {activeComponent === "CreateProduct" && <CreateProduct />}
              {activeComponent === "CreatePromotion" && <CreatePromotion />}
              {activeComponent === "Dashboard" && <Dashboard />}
              {activeComponent === "StoreOrders" && <StoreOrders />}
            </div>
          </div>
        )}
        {!showuser && !showmanager && (
          <div>
            <h2> Please login to view your profile</h2>
          </div>
        )}
        {/* Floating Icon */}
        {showuser && (
          <Box
            sx={{
              position: "fixed",
              bottom: 24,
              right: 24,
            }}
          >
            <Badge
              badgeContent={fortuneChances > 0 ? fortuneChances : null}
              color="secondary"
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              sx={badgeStyle}
            >
              <IconButton
                onClick={handleOpenWheel}
                sx={{
                  backgroundColor: "#fe3bd4",
                  color: "white",
                  width: 64,
                  height: 64,
                  animation: `${pulse} 4s infinite`,
                  "&:hover": {
                    backgroundColor: "#d81b60",
                  },
                }}
              >
                <CasinoIcon sx={{ fontSize: 40 }} />
              </IconButton>
            </Badge>
          </Box>
        )}

        {/* Modal for the Fortune Wheel */}
        <Modal open={openWheel} onClose={handleCloseWheel}>
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              bgcolor: "background.paper",
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              width: "90%",
              maxWidth: "500px", // Set a maximum width for larger screens
              textAlign: "center", // Center-align text
            }}
          >
            <Typography
              variant="h5"
              align="center"
              gutterBottom
              sx={{
                fontWeight: "bold",
                fontFamily: "'Quicksand', sans-serif",
                fontSize: "1.8rem",
              }}
            >
              Spin the Wheel!
            </Typography>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Wheel
                mustStartSpinning={mustSpin}
                prizeNumber={prizeNumber}
                data={wheelData}
                backgroundColors={["#3e3e3e", "#df3428"]}
                textColors={["#ffffff"]}
                outerBorderColor={"#000000"}
                outerBorderWidth={5}
                innerRadius={30}
                radiusLineColor={"#ffffff"}
                radiusLineWidth={8}
                spinDuration={0.5}
                onStopSpinning={handleWheelStop}
              />
              {fortuneChances === 0 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    backgroundColor: "rgba(0, 0, 0, 0.6)",
                    width: "80%",
                    color: "white",
                    padding: 2,
                    borderRadius: 1,
                    zIndex: 99,
                  }}
                >
                  <Typography>
                    Purchase more than $100 to gain a spin.
                  </Typography>
                </Box>
              )}
            </Box>
            <Typography
              sx={{
                mt: 2,
                fontWeight: "bold",
                fontFamily: "'Quicksand', sans-serif",
              }}
            >
              Attempt(s): {fortuneChances}
            </Typography>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSpinClick}
              sx={{
                mt: 2,
                backgroundColor: "#fe3bd4",
                color: "#ffffff",
                fontWeight: "bold",
                fontFamily: "'Quicksand', sans-serif",
                "&:hover": {
                  backgroundColor: "#d81b60",
                },
              }}
            >
              Spin
            </Button>
          </Box>
        </Modal>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
