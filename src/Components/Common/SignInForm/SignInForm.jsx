import React, { useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";

function SignInForm() {
  const navigate = useNavigate();
  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (evt) => {
    const value = evt.target.value;
    setState({
      ...state,
      [evt.target.name]: value,
    });
  };

  const submitLoginForm = async (evt) => {
    evt.preventDefault();
    const { email, password } = state;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_REACT_APP_API_URL}/login/${email}/${password}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((response) => {
        console.log('Fetched Data:', response.data)
      }
      )

      // Navigate to the home page or dashboard after successful login
      // navigate("/");

    } catch (error) {
      console.error("Error logging in:", error);
      toast.error('Invalid email or password', {
        position: "bottom-left",
        autoClose: 5000,
        theme: "colored",
      });
    }

    setState({
      email: "",
      password: "",
    });
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={submitLoginForm}>
        <h1>Sign in</h1>
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
        <span>or use your account</span>
        <input
          className="login_input"
          type="email"
          placeholder="Email"
          name="email"
          value={state.email}
          onChange={handleChange}
          required
        />
        <input
          className="login_input"
          type="password"
          name="password"
          placeholder="Password"
          value={state.password}
          onChange={handleChange}
          required
        />
        <a className="link-L1" href="#">
          Forgot your password?
        </a>
        <button className="button-77">Sign In</button>
      </form>
    </div>
  );
}

export default SignInForm;