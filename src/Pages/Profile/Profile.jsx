// src/Pages/Profile/Profile.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Header, Footer, UserMenu } from "../../Components";
import "./Profile.scss";
import MyAccount from "../../Components/Common/UserComponents/MyAccount";
import MyOrders from "../../Components/Common/UserComponents/MyOrders";
import Promotions from "../../Components/Common/UserComponents/Promotions";
import Restock from "../../Components/Common/ManagerComponents/Restock";
import CreateProduct from "../../Components/Common/ManagerComponents/CreateProduct";
import CreatePromotion from "../../Components/Common/ManagerComponents/CreatePromotion";
import Dashboard from "../../Components/Common/ManagerComponents/Dashboard";
import StoreOrders from "../../Components/Common/ManagerComponents/StoreOrders";
import AccountDetails from "../../Components/Common/UserComponents/AccountDetail";
import axios from "axios";
import { Modal, IconButton, Box, Typography, Button, Badge } from '@mui/material';
import { keyframes } from '@mui/system';
import CasinoIcon from '@mui/icons-material/Casino'; // Icon for the floating button
import { Wheel } from 'react-custom-roulette';
import { useAuth } from "../../hooks/useAuth";

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
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user from context

  const [CFName, setCFName] = useState("");
  const [CLName, setCLName] = useState("");
  const [CAddress, setCAddress] = useState("");
  const [CPhone, setCPhone] = useState("");
  const [rank, setRank] = useState("");
  const [transaction, setTransaction] = useState([]);
  const [promotion, setPromotion] = useState([]);

  // State to determine which components to show
  const [showManager, setShowManager] = useState(false);
  const [showUser, setShowUser] = useState(false);

  const [activeComponent, setActiveComponent] = useState("MyAccount");  // Default active component

  useEffect(() => {
    // If user is not authenticated, redirect to login page
    if (!user) {
      navigate("/Login");
      return;
    }

    // Set user data
    setCFName(user.fName);
    setCLName(user.lName);
    setCAddress(user.address);
    setCPhone(user.phoneNumber);

    // Check user role
    if (user.role === "Customer") {
      setShowUser(true);
      // Fetch additional data for customer
      fetchCustomerData(user.id);
    } else if (user.role === "Manager") {
      setShowManager(true);
      setActiveComponent("Dashboard"); // Default component for manager
      // Fetch additional data for manager if needed
      fetchManagerData(user.id);
    }
  }, [user, navigate]);

  const fetchCustomerData = async (userId) => {
    try {
      // Fetch customer rank
      const rankResponse = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/customer-rank/${userId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("Rank response:", rankResponse.data);
      setRank(rankResponse.data.rank);

      // Fetch customer transactions
      const transactionsResponse = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/customers/shipping/${userId}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      );
      setTransaction(transactionsResponse.data.data);

      // Fetch promotions
      const promotionsResponse = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/promotion/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      setPromotion(promotionsResponse.data);
    } catch (error) {
      console.error("Error fetching customer data:", error);
    }
  };

  const fetchManagerData = async (managerId) => {
    try {
      // TODO: Fetch manager-specific data if needed
    } catch (error) {
      console.error("Error fetching manager data:", error);
    }
  };

  // State for managing the modal and wheel (no changes)
  const [openWheel, setOpenWheel] = useState(false);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [wheelData, setWheelData] = useState([
    { option: '10% OFF' },
    { option: 'Try Again' },
    { option: 'Free Shipping' },
    { option: '5% OFF' },
    { option: '20% OFF' },
    { option: '15% OFF' },
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
    '& .MuiBadge-badge': {
      left: 8,
      top: 8,
    },
  };

  // Function to handle which menu item is clicked
  const handleMenuClick = (componentName) => {
    setActiveComponent(componentName);
  };

  return (
    <div className="profile">
      <Header />
      <div className="profile-content" >
        {showUser && (
          <div className="profile-content-wrapper">
            <UserMenu username={`${CFName} ${CLName}`} onMenuClick={handleMenuClick} mode="Customer" />
            <div className="component-container">
              {activeComponent === "MyOrders" && <MyOrders />}
              {activeComponent === "Promotions" && <Promotions />}
              {activeComponent === "MyAccount" && <MyAccount />}
              {activeComponent === "AccountDetails" && <AccountDetails />}
            </div>
          </div>
        )}
        {showManager && (
          <div className="profile-content-wrapper">
            <UserMenu username={`${CFName} ${CLName}`} onMenuClick={handleMenuClick} mode="Manager" />
            <div className="component-container">
              {activeComponent === "Dashboard" && <Dashboard />}
              {activeComponent === "Restock" && <Restock />}
              {activeComponent === "CreateProduct" && <CreateProduct />}
              {activeComponent === "CreatePromotion" && <CreatePromotion />}
              {activeComponent === "StoreOrders" && <StoreOrders />}
            </div>
          </div>
        )}
        {!showUser && !showManager && (
          <div>
            <h2> Please log in to view your profile</h2>
          </div>
        )}
        {/* Floating Icon */}
        {showUser && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 24,
              right: 24,
            }}
          >
            <Badge
              badgeContent={fortuneChances > 0 ? fortuneChances : null}
              color="secondary"
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              sx={badgeStyle}
            >
              <IconButton
                onClick={handleOpenWheel}
                sx={{
                  backgroundColor: '#fe3bd4',
                  color: 'white',
                  width: 64,
                  height: 64,
                  animation: `${pulse} 4s infinite`,
                  '&:hover': {
                    backgroundColor: '#d81b60',
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
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              bgcolor: 'background.paper',
              boxShadow: 24,
              borderRadius: 2,
              p: 4,
              width: '90%',
              maxWidth: '500px',
              textAlign: 'center',
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