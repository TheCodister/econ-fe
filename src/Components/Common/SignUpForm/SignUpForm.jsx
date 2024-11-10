import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function SignUpForm( {toggleSignState} ) {
    const navigate = useNavigate();
  const [state, setState] = useState({
    CustomerID: "",
    CFName: "",
    CLName: "",
    CAddress: "",
    CPhone: "",
  });

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        // This effect will be triggered whenever formData is updated
  
        if (state.CFName === "" || state.CLName === "" || state.CAddress === "" || state.CPhone === "") {
          return;
        }
      
        if(state.CustomerID === "") {
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/lastid`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.data)
          .then((data) => {
            console.log('Fetched Data:', data)
            const newID = data + 1;
            setState({
              ...state,
              CustomerID: newID,
            });
          })
          .then(() => {
            // Use useEffect to ensure state update is complete before calling submitsignupForm
          })
          .catch((error) => console.error("Error fetching data:", error));
        }
      }, [state]);

  const handleChange = evt => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value
    });
  };

  const handleOnSubmit = evt => {
    evt.preventDefault();

    const { CFName, CLName, CAddress, CPhone } = state;
    alert(
      `You are signing up with First Name: ${CFName}, Last Name: ${CLName}, Address: ${CAddress}, Phone Number: ${CPhone}`
    );

    setState({
        CustomerID: "",
        CFName: "",
        CLName: "",
        CAddress: "",
        CPhone: "",
      });
  };

  const HandleSignUp = (evt) => {
    evt.preventDefault();

    console.log("state", state);

    axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/lastid`, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.data)
      .then((data) => {
        console.log('Fetched Data:', data)
        const newID = data + 1;
        setState({
          ...state,
          CustomerID: newID,
        });
      })
      .then(() => {
        console.log('Form Data:', state);
        // Use useEffect to ensure state update is complete before calling submitsignupForm
        submitsignupForm();
      })
      .catch((error) => console.error("Error fetching data:", error));
  };
  
  const submitsignupForm = async () => {
    try {
      // Making a POST request using axios
      const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/`, state);

      // Updating the state with the response data
      setResponse(response.data);
      setError(null);
      toggleSignState("signIn");
      setState({
        CustomerID: "",
        CFName: "",
        CLName: "",
        CAddress: "",
        CPhone: "",
      });
  } catch (error) {
      // Handling errors
      setResponse(null);
      setError('Error posting data');
      console.error('Error posting data:', error);
      setState({
        ...state,
        CustomerID: "",
      });
  }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={HandleSignUp}>
        <h1>Create Account</h1>
        <div className="social-container">
          <a href="#" className="social">
            <i className="fa fa-facebook-f" />
          </a>
          <a href="#" className="social">
            <i className="fa fa-google" />
          </a>
          <a href="#" className="social">
            <i className="fa fa-envelope-o" />
          </a>
        </div>
        <span>or use your email for registration</span>
        <input
          className="login_input"
          type="text"
          name="CFName"
          value={state.CFName}
          onChange={handleChange}
          placeholder="First Name"
          required
        />
        <input
          className="login_input"
          type="text"
          name="CLName"
          value={state.CLName}
          onChange={handleChange}
          placeholder="Last Name"
          required
        />
        <input
          className="login_input"
          type="text"
          name="CAddress"
          value={state.CAddress}
          onChange={handleChange}
          placeholder="Address"
            required
        />
        <input
          className="login_input"
          type="text"
          name="CPhone"
          value={state.CPhone}
          onChange={handleChange}
          placeholder="Phone Number"
            required
        />
        <button className="button-77">Sign Up</button>
      </form>
    </div>
  );
}

export default SignUpForm;
