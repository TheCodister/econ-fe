import React, { useState } from "react";
import axios from "axios";

const MyAccount = () => {
    const [CFName, setCFName] = useState("");
    const [CLName, setCLName] = useState("");
    const [CAddress, setCAddress] = useState("");
    const [CPhone, setCPhone] = useState("");
    const [rank, setrank] = useState("");

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

      const getRankIcon = () => {
        switch (rank) {
          case 'iron':
            return < img src= "Images/user-ranks/bronze.png" alt="Iron Icon" style={{ width: "75px", height: "auto" }}/>;
          case 'bronze':
            return < img src= "Images/user-ranks/iron.png" alt="Bronze Icon" style={{ width: "75px", height: "auto" }}/>;
          case 'silver':
            return < img src= "Images/user-ranks/silver.png" alt="Silver Icon" style={{ width: "75px", height: "auto" }}/>;
          case 'gold':
            return < img src= "Images/user-ranks/gold.png" alt="Gold Icon" style={{ width: "75px", height: "auto" }}/>;
            case 'platinum':
              return < img src= "Images/user-ranks/plat.png" alt="Platinum Icon" style={{ width: "75px", height: "auto" }}/>;
          default:
            return null; // You can customize this based on your actual rank values
        }
      };

    const submitloginForm = async () => {

        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/${getCookie('userID')}`, {
        headers: {
            "Content-Type": "application/json",
        },
        })
          .then((response) => {
            console.log('Fetched Cookie:', response.data);
            return response.data;
          })
          .then((data) => {
              console.log('Fetched Cookie:', data);
              setCFName(data.CFName);
              setCLName(data.CLName);
              setCAddress(data.CAddress);
              setCPhone(data.CPhone);
          })
          .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
  
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/customer-rank/${getCookie('userID')}`,{
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log('Fetched Data:', response.data)
        return response.data
      })
      .then((data) => {
        console.log('Fetched Data:', data.rank);
        setrank(data.rank);
      })
        .catch((error) => console.error("Error fetching data:", error));
    }

    useState(() => {
        if (getCookie("userID")) {
          submitloginForm();
        }
      }, []);

    return (
      <div>
        <h1>My Account</h1>
        <form className="customer_profile_form">
            {/* <UserMenu /> */}
            <div>Hello user {CFName} {CLName}</div>
            <div>Your number {CPhone}</div>
            <div>Your address {CAddress}</div>
            {rank !== "" ? (
              <div>
                Your current rank: {rank} {getRankIcon()}
              </div>
            ) : (
              <p>No rank available</p>
            )}
        </form>
      </div>
    );
}

export default MyAccount;