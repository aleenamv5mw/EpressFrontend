import {React, useEffect, useState} from "react";
import { useNavigate } from 'react-router-dom';
import {GoogleLogin} from 'react-google-login';
import logo from './logo.png';
import {gapi} from 'gapi-script';


const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;



// var userName = '';
// var email = '';
// const navigate = useNavigate();
// var isLoggedIn = false;
// var profilePic = '';


function Login() {


  useEffect(() => {
    try {
    const initClient = () => {
          gapi.auth2.getAuthInstance({
          clientId: CLIENT_ID,
          scope: ''
        });
     };
     gapi.load('client:auth2', initClient);
    }
    catch(error) {
      console.log(error);
      navigate("/login");

    }

    });


  
  const navigate = useNavigate();
  

  const [message, setMessage] = useState('');
  // const [loginData, setLoginData] = useState(
  //   localStorage.getItem('loginData')
  //     ? JSON.parse(localStorage.getItem('loginData'))
  //     : null
  // );

  const handleFailure = (result) => {
    console.log(result);
  };

  const handleLogin = async (googleData) => {
    // console.log(googleData);
    localStorage.removeItem('authToken');

    if (googleData.profileObj.email.search("@meltwater.com") != -1 )    {      //checking if the email ID has the domain @meltwater
          // redirect();
          // console.log(googleData.tokenId);
          const res = await fetch(process.env.REACT_APP_HOSTNAME + '/api/google-login', {
            method: 'POST',
            body: JSON.stringify({
              token: googleData.tokenId,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          });
      
          const data = await res.json();
          // setLoginData(data);
          
          localStorage.setItem('authToken', googleData.tokenId);    //storing the auth token in the local storage
          // console.log(data);
          
          
          navigate("/accounts", { state: { userName: data.name, email: data.email, profilePic: data.picture, CLIENT_ID: process.env.REACT_APP_CLIENT_ID, isLoggedIn: true } }); //passing the relevant states to the main page
      }
      else
      {
          console.log("Unauthorized user.");
          setMessage("You are not an authorized user.");
      }
   
  };

  

  


  return (
    <center>
    <div style={{marginTop:"50px" }}><img src={logo} width="400px" /> </div>
    <div style={{marginTop:"50px" }} >
        
        <GoogleLogin clientId={process.env.REACT_APP_CLIENT_ID} buttonText="Login with Google" onSuccess={handleLogin} cookiePolicy={"single_host_origin"} onFailure={handleFailure} uxMode="popup"  isSignedIn={false}  />
    </div>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    <br/>
    {/* <p style={{fontSize:"14px", lineHeight:"20px"}}>Developed and maintained by Abhilash and Shashank (Team Raptors - APAC)</p> */}
    {/* <p style={{fontSize:"14px", lineHeight:"20px"}}>For any assistance, please drop a mail on <a href="mailto:mfeeds@meltwater.com">mfeeds@meltwater.com</a></p> */}
   
    </center>
  );
};
  
export default Login;