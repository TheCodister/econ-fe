import React, { useState } from "react";
import InfoForm from "../InfoForm/InfoForm";
import axios from "axios";
import "./AccountDetail.scss";

const AccountDetails = () => {
    const [buttonClass, setButtonClass] = useState('');

    const saveUserDetails = async () => {
        console.log('Saving user details...');
        setButtonClass('onclic');
        setTimeout(() => {
          setButtonClass('validate');
          setTimeout(() => {
            setButtonClass('');
          }, 1250);
        }, 2250);
    }


    return (
        <div className="account_details_wrapper">
            <InfoForm title="Account Details" />
            {/* save button  */}
            <button
              id='save-info-button'
              className={`save-info ${buttonClass}`}
              onClick={saveUserDetails}
            >
            </button>
        </div>
    );

}

export default AccountDetails;