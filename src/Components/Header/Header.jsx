import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useCart } from "../../Context/CartContext";
import "./Header.css";

const Header = () => {
  const { state } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getCookie = (cookieName) => {
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
  };

  const StyledBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
      right: 10,
      top: 25,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  }));

  const location = useLocation();
  const showProfile = getCookie("userID") || getCookie("managerID");

  const getNavItemClass = (pathname) => {
    return location.pathname === pathname
      ? "navbar-item current-page"
      : "navbar-item";
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevState) => !prevState);
    document.body.classList.toggle("body__fixed", !isMenuOpen); // Prevent body scroll when menu is open
  };

  return (
    <div className="header">
      <nav>
        <Link to="/" className={getNavItemClass("/")}>
          <img
            src="/Images/logo.png"
            alt="logo-shophouse"
            className="nav__logo"
          />
        </Link>
        <div className="header-with-search__search-section">
          <div className="search_body">
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                id="searchInput"
                placeholder="Search..."
              />
              <button className="search-button">Search</button>
            </div>
          </div>
        </div>
        <ul
          className={`nav__navigation ${isMenuOpen ? "nav__navigation_visible" : ""}`}
        >
          <Link to="/" className={getNavItemClass("/")}>
            <p className="a__navbar btn btn--primary">HOME</p>
          </Link>
          <Link to="/AboutUs" className={getNavItemClass("/AboutUs")}>
            <p className="a__navbar btn btn--primary">ABOUT US</p>
          </Link>
          <Link to="/ChatPage" className={getNavItemClass("/ChatPage")}>
            <p className="a__navbar btn btn--primary">CHAT</p>
          </Link>
          {/* <a href="#" className="a__navbar btn btn--primary">
                        <li className="nav__item">OFFERS</li>
                    </a> */}
          <Link to="/" className={getNavItemClass("/")}>
            <p className="a__navbar btn btn--primary">OFFERS</p>
          </Link>
          <Link to="/Cart" className={getNavItemClass("/Cart")}>
            {state.cart.length > 0 ? (
              <StyledBadge badgeContent={state.cart.length} color="secondary">
                <p className="a__navbar btn btn--primary">MY CART</p>
              </StyledBadge>
            ) : (
              <p className="a__navbar btn btn--primary">MY CART</p>
            )}
          </Link>
          {!showProfile && (
            <Link to="/Login" className={getNavItemClass("/Login")}>
              <p className="a__navbar btn btn--primary">LOGIN</p>
            </Link>
          )}
          {showProfile && (
            <Link to="/Profile" className={getNavItemClass("/Profile")}>
              <p className="a__navbar btn btn--primary">PROFILE</p>
            </Link>
          )}
        </ul>
        <i
          className="fa fa-bars wrap-menu"
          onClick={toggleMenu}
          aria-label="Open menu"
        ></i>
      </nav>
    </div>
  );
};

export default Header;
