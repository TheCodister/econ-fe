import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Title from '../Common/Title/Title';
import "./UserMenu.scss";


const UserMenu = ({ username, onMenuClick, mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = React.useState(false);
  const [currentUserRole, setCurrentUserRole] = React.useState(null);

  const handleClickOpen = (user) => {
    setOpen(true);
    setCurrentUserRole(user);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
  
    for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i].trim();
      if (cookie.indexOf(name) === 0) {
        return cookie.substring(name.length, cookie.length);
      }
    }
    return null;
  }

  function deleteCookie(cookieName) {
    if (getCookie(cookieName)) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    }
  }

  function logout() {
    deleteCookie(currentUserRole);
    // go to home page
    navigate("/");
  }

  const theme = createTheme({
    typography: {
      // Custom typography variants
      dialogTitle: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      dialogContent: {
        fontSize: '1rem',
        fontWeight: 600,
      },
      dialogButton: {
        fontSize: '0.875rem',
        fontWeight: 600,
      }
    },
  });

  return (
    <div className="menu-item-wrapper">

      <Title titleText={`Hello, ${username}!`} size={24} />
      <p className="text-base font-light italic">Welcome to your account.</p>

      
      <div class="usr-menu-list">
        {mode === "Customer" && (
          <ul>
            <li><span onClick={() => onMenuClick("MyOrders")}>My Orders</span></li>
            <li><span onClick={() => onMenuClick("Promotions")}>Promotions</span></li>
            <li><span onClick={() => onMenuClick("MyAccount")}>My Account</span></li>
            <li><span onClick={() => onMenuClick("AccountDetails")}>Account Details</span></li>
            <li><span onClick={() => handleClickOpen('userID')}>Logout</span></li>
          </ul>
        )}
        {mode === "Manager" && (
          <ul>
            <li><span onClick={() => onMenuClick("Dashboard")}>Dashboard</span></li>
            <li><span onClick={() => onMenuClick("CreateProduct")}>Create New Product</span></li>
            {/* <li><span onClick={() => onMenuClick("")}>Add New Product To Store</span></li> */}
            <li><span onClick={() => onMenuClick("Restock")}>Restock</span></li>
            <li><span onClick={() => onMenuClick("StoreOrders")}>View All Orders</span></li>
            <li><span onClick={() => onMenuClick("CreatePromotion")}>Create Promotion</span></li>
            <li><span onClick={() => handleClickOpen('managerID')}>Logout</span></li>
          </ul>
        )}

      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle 
          id="alert-dialog-title"
          sx={{ 
            fontSize: theme.typography.dialogTitle.fontSize,
            fontWeight: theme.typography.dialogTitle.fontWeight
          }}
        >
          {"Logout?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText 
            id="alert-dialog-description"
            sx={{ 
              fontSize: theme.typography.dialogContent.fontSize,
              fontWeight: theme.typography.dialogContent.fontWeight
            }}
          >
            Are you sure you want to logout?
            
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            sx={{ 
              fontSize: theme.typography.dialogButton.fontSize,
              fontWeight: theme.typography.dialogButton.fontWeight
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={logout} 
            autoFocus 
            color="error"
            sx={{ 
              fontSize: theme.typography.dialogButton.fontSize,
              fontWeight: theme.typography.dialogButton.fontWeight
            }}
          >
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserMenu;