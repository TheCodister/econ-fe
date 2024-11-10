  import { useEffect, useState } from "react";
  import { useNavigate } from "react-router-dom";
  import { Header, Footer, SignInForm, SignUpForm } from "../../Components";
  import "./Login.css";
  import axios, { AxiosError } from "axios";
  const Login = () => {
    // Variables for customer information
    const navigate = useNavigate();

    const [CFName, setCFName] = useState("");
    const [CLName, setCLName] = useState("");
    const [CAddress, setCAddress] = useState("");
    const [CPhone, setCPhone] = useState("");
    const [rank, setrank] = useState("");
    const [transaction, settransaction] = useState([]);
    const [promotion, setpromotion] = useState([]);
    //Varables for product restock

    // Variable to swap between sign up and sign in
    const [showSignup, setShowSignup] = useState(false);
    const [showuserLogin, setShowuserLogin] = useState(false);
    const [showmanagerLogin, setShowmanagerLogin] = useState(false);
    const [showprivilgde, setShowprivilgde] = useState(true);
    const [showmanager, setShowmanager] = useState(false);
    const [showuser, setShowuser] = useState(false);

    //Cookie
    const [cookie, setcookie] = useState(false);

    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const [formData, setformData]= useState({
      CFName:'',
      CLName:'',
      CAddress:'',
      CPhone:'',
      CustomerID: 0,
    })
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
      const cookieArray = decodedCookie.split(';');
    
      for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
        }
      }
      return null;
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
    
      if(formData.CustomerID === 0) {
      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/lastid`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log('Fetched Data:', data)
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
  

    const signup = () => {

      console.log('Form Data:', formData);

      axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/lastid`, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.data)
        .then((data) => {
          console.log('Fetched Data:', data)
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
          console.log('Form Data:', formData);
          // Use useEffect to ensure state update is complete before calling submitsignupForm
          submitsignupForm();
        })
        .catch((error) => console.error("Error fetching data:", error));
    };
    
    const submitsignupForm = async () => {
      try {
        // Making a POST request using axios
        const response = await axios.post(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/`, formData);

        // Updating the state with the response data
        setResponse(response.data);
        setError(null);
    } catch (error) {
        // Handling errors
        setResponse(null);
        setError('Error posting data');
        console.error('Error posting data:', error);
    }
      setShowuserLogin(true);
      setShowSignup(false);
    };

      const submitloginForm = async () => {
        const status = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/login/${CPhone}/${CFName}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('Fetched Data:', response.data)
          return response.data
        })
        .then((data) => {
          console.log('Fetched Data:', data)
          setCookie( 'userID', data.CustomerID , 1);       
          setShowuserLogin(false);
          setShowSignup(false);
          setShowuser(true);
          setcookie(getCookie('userID'))
          console.log(getCookie('userID'))
        })  
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
            setCLName(data.LastName);
            setCAddress(data.Address);
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

          axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/customers/shipping/${getCookie('userID')}`, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
            .then((response) => {
              console.log('Fetched Data:', response.data);
              return response.data;
            })
            .then((data) => {
              console.log('Fetched Data:', data.data);
              settransaction(data.data);
            })
            .catch((error) => console.error(`Error fetching ${getCookie('userID')} data:`, error));
          axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/promotion/`,{
            headers: {
              "Content-Type": "application/json",
          },
          })
            .then((response) => {
              console.log('Fetched Cookie:', response.data);
              return response.data;
            })
            .then((data) => {
              console.log('Fetched data:', data);
              setpromotion(data);
            })
            .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
        }

        
    const submitmanagerLoginForm = async () => {
          const status = await axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/employees/info/${CFName}/${CPhone}`, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log('Fetched Data:', response.data)
          return response.data
        })
        .then((data) => {
          console.log('Fetched Data:', data)
          setCookie('managerID', data.EmployeeID , 1 )
          setShowuserLogin(false);
          setShowSignup(false);
          setShowmanager(true);
          setcookie(getCookie('managerID'))
        })
        axios.get(`${import.meta.env.VITE_REACT_APP_API_URL}/employees/${getCookie('managerID')}`, {
        headers: {
          "Content-Type": "application/json",
        },
        })
          .then((response) => {
            console.log('Fetched cookie:', response.data);
            return response.data;
          })
          .then((data) => {
            console.log('Fetched cookie:', data);
            setCFName(data.FirstName);
            setCLName(data.LastName);
            setCAddress(data.CAddress);
            navigate("/Profile");
          })
          .catch((error) => console.error(`Error fetching ${cookie} data:`, error));
      };
    


    const toggleSignup = () => {
      setShowSignup(!showSignup);
      setShowuserLogin(!showuserLogin);
      setCFName("");
      setCLName("");
      setCPhone("");
      setCAddress("")
      setformData({
        ...formData,
        CustomerID: 0,
      });
    };
    const toggleUserlogin =() =>{
      setShowuserLogin(!showuserLogin);
      setShowprivilgde(!showprivilgde)
      setCFName("");
      setCPhone("");
    }
    /*const togglemanager =() =>{
      setShowmanagerLogin(!showmanagerLogin)
      setShowmanager(!showmanager)
    }
    const toggleuser =() =>{
      setShowuser(!showuser)
      setShowuserLogin(!showuserLogin)
    }*/
    const toggleManagerlogin =() =>{
      setShowmanagerLogin(!showmanagerLogin);
      setShowprivilgde(!showprivilgde)
    }

  const [type, setType] = useState("signIn");
  const containerClass =
    "cred-box-container " + (type === "signUp" ? "right-panel-active" : "");

  const toggleSignState = text => {
    if (text !== type) {
      setType(text);
      return;
    }
  };

    return (
      <div className="login">
        <Header />
            {/*Choose privilegde */}
            {showprivilgde && (
              <form id="choosing priviledge" className="priviledge-form">
              <section className="form">
                <p>Login as:</p>
              <button className="form-button" type="button" onClick={toggleManagerlogin} >
              Manager
              </button>
              <button className="form-button" type="button" onClick={toggleUserlogin } >
              Customer
              </button>
              </section>
              </form>
            )}
            
            {showmanagerLogin && (
              <div className="managerform">
                <form id="managerFormPopup" onSubmit={submitmanagerLoginForm}>
                  {/* Manager login form inputs */}
                <label className="form-label" >
                Full Name:
                </label>
                <input
                  // className="form-input"
                  type="text"
                  id="CFName"
                  name="CFName"
                  required
                  value={CFName}
                  onChange={(e) => setCFName(e.target.value)}
                />
                <label className="form-label" >
                  Tel:
                </label>
                <input
                  // className="form-input"
                  type="password"
                  id="Tel"
                  name="CPhone"
                  required
                  value={CPhone}
                  //test using input of Tel for cookie valu
                  onChange={(e) => setCPhone(e.target.value)}
                />
                <button className="form-button" type="button" onClick={submitmanagerLoginForm} >
                  Log in
                </button>
                </form>
              </div>
            )}

        <div className="login-content" >
          <section className="form">
            {/*This is where user login start*/ }
            {showuserLogin && (
              <div className={containerClass} id="container">
              <SignUpForm toggleSignState={toggleSignState} />
              <SignInForm />
              <div className="overlay-container">
                <div className="overlay">
                  <div className="overlay-panel overlay-left">
                    <h1>Welcome Back!</h1>
                    <p>
                      To keep connected with us please login with your personal info
                    </p>
                    <button
                      className="ghost-button"
                      id="signIn"
                      onClick={() => toggleSignState("signIn")}
                    >
                      Sign In
                    </button>
                  </div>
                  <div className="overlay-panel overlay-right">
                    <h1>Hello, Friend!</h1>
                    <p>Enter your personal details and start journey with us</p>
                    <button
                      className="ghost-button"
                      id="signUp"
                      onClick={() => toggleSignState("signUp")}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              </div>
            </div>
            )}
          </section>

        </div>
        <Footer />
      </div>
    );
  };

  export default Login;
  