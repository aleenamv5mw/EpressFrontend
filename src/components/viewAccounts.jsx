import { React, useEffect, useState } from "react";
import SearchBar from './search';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import { Table } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { Button, Spinner, Container } from 'react-bootstrap';
// import image from './plus.png';
import { ErrorBoundary } from "react-error-boundary";

import { useLocation } from "react-router-dom";
import { GoogleLogout } from 'react-google-login';

// import addSub from './addSub.png';
import ReactPaginate from 'react-paginate';





















const ViewAccounts = () => {

  const state = useLocation();
  const navigate = useNavigate();
  const [loaded, setLoad] = useState(true);

  // user details--------------------------------------




  const [userName, setUser] = useState(state.state.userName);
  const [email, setEmail] = useState(state.state.email);
  const [profilePic, setImage] = useState(state.state.profilePic);
  const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
  const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);














  // user details--------------------------------------

  // console.log("UserName = " + userName + " email = " + email + "imageLink: " + profilePic + "Client ID " + CLIENT_ID + isLoggedIn);


  //pagination code----------------------
  const [accounts, setAccounts] = useState([]);
  const [paginateAccounts, setPaginate] = useState([]); //stores the first 30 accounts
  const [pageNumber, setPage] = useState(0);
  const accountPerPage = 10;
  const pagesVisited = pageNumber * accountPerPage;
  const pageCount = Math.ceil(accounts.length / accountPerPage);
  const [dark, setDark] = useState("");

  const [image, imageChange] = useState(require('./plus.png'));
  const [addSub, imageChange2] = useState(require('./addSub.png'));
  const [darkIcon, setDarkIcon] = useState(require('./darkIcon.png'))
  const [image2, setLightEye] = useState(require('./eye.png'));
  const [lineart, setLineArt] = useState(require('./lineart.png'));


  const [isAdmin, setAdmin] = useState(false);            //if the logged in user is an admin or not



  const [backColor, setColor] = useState(false);




  const [searchQuery, setSearchQuery] = useState('');






  const onSignoutSuccess = () => {
    console.log("successfully logged out.");
    //localStorage.removeItem("authToken");
    setLogin(false);
    //localStorage.removeItem("authToken");
    setUser(null);
    setEmail(null);
    setImage(null);

    navigate("/login");
  }




  const filterAccounts = (accounts, query) => {                 //live search filtering
    if (!query) {

      return accounts.slice(pagesVisited, pagesVisited + accountPerPage);    //if no search query present, return sliced response
    }

    return accounts.filter((account) => {
      const accountName = account.accountName.toLowerCase();

      return accountName.includes(query.toLowerCase());
    });
  };

  const addFeed = (e, account) => {



    navigate("/createepress", { state: { client_id: account.id, userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    console.log("Value of accountName = " + account.accountName + "cliend ID = " + account.id);

  }
  const addFeed2 = (e, account) => {



    navigate("/createavoin", { state: { client_id: account.id, userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    console.log("Value of accountName = " + account.accountName + "cliend ID = " + account.id);

  }


  const redirectSub = (e, account) => {
    navigate('/subscription', { state: { client_id: account.id, accountName: account.accountName, userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    // console.log("hello from redirectSub " + account.id);

  }


  const createRedirect = () => {
    navigate('/createaccount', { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
  }


  const redirect = (e, account) => {


    navigate("/allfeeds", { state: { client_id: account.id, userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    console.log("Value of accountName = " + account.accountName);
    console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);


  }






  function ErrorHandler({ error }) {
    return (
      <div>
        <p>An error occurred:</p>
        <pre>{error.message}</pre>
      </div>
    )
  }





  const goingDark = (e) => {
    if (dark == "dark") {
      setDark("");
      imageChange((require('./plus.png')));
      imageChange2((require('./addSub.png')));
      setDarkIcon(require('./darkIcon.png'));
      setLightEye(require('./eye.png'));
      localStorage.setItem("darkMode", "Off");
      setLineArt(require('./lineart.png'));
      console.log("Dark Mode is " + localStorage.getItem("darkMode"));



    }
    else {
      setDark("dark");
      imageChange((require('./plus_sign_white.png')));
      imageChange2((require('./plus_white.png')));
      setDarkIcon(require('./lightIcon.png'));
      setLineArt(require('./lineartwhite.png'));
      setLightEye(require('./eye_white.png'));
      localStorage.setItem("darkMode", "On");
      console.log("Dark Mode is " + localStorage.getItem("darkMode"));


    }
    setColor(setColor => !setColor);

  }



  const redirectSub2 = (e, account) => {


    navigate("/allsubscriptions", { state: { client_id: account.id, userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    console.log("Value of accountName = " + account.accountName);
    console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);


  }

  const changePage = ({ selected }) => {     //pagination code
    setPage(selected);
  }

  const filteredAccounts = filterAccounts(accounts, searchQuery);
  var i = 0;

  useEffect(async () => {



    


    const controller = new AbortController();

    if (localStorage.getItem("darkMode") === "On") {
      goingDark();
    }


    const token = localStorage.getItem("authToken");  // Get stored token from localStorage

    //admin api call to setAdmin.
    Axios.post(process.env.REACT_APP_HOSTNAME + "/user", {
      email: email
    }, {
      headers: {
        'x-access-token': token
      }

    }).then((response) => {

      console.log(response.data);
      if (response.data === "admin") {
        setAdmin(true);
      }
      else
        setAdmin(false);



    }).catch(error => {
      console.log("An error occurred: " + error);

      if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
        console.log("You have been logged out. Please log in again...")
        navigate("/login");
      }
      console.log("Something went wrong in fetching the accounts.");   //console reporting in case of other errors


    })



    Axios.get(process.env.REACT_APP_HOSTNAME + "/account", {
      headers: {
        'x-access-token': token
      }
    }).then((response) => {

      console.log(response.data);
      setAccounts(response.data);
      setPaginate(response.data.slice(0, 30));
      setLoad(false);
      console.log(image);


    }).catch(error => {
      console.log("An error occurred: " + error);

      if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
        console.log("You have been logged out. Please log in again...")
        navigate("/login");
      }
      console.log("Something went wrong in fetching the accounts.");   //console reporting in case of other errors


    });
    return () => {
      controller.abort();
    }

  }, [])







  return (

    <div>

      <ErrorBoundary FallbackComponent={ErrorHandler}>

        <center>
          <div className="justify-content-center" width="100%">
            <nav className="navbar navbar-dark bg-dark">

              <span style={{ align: "left", color: backColor ? 'white' : 'black', whiteSpace: "nowrap", display: "inline-block" }}><img align="left" className="rounded-circle" src={profilePic} width="41px" style={{ marginLeft: "40px", marginRight: "10px", lineHeight: "40px", verticalAlign: "center", marginTop: "5px" }} /><p align="left" style={{ verticalAlign: "center", color: "white", lineHeight: "40px", fontFamily: "mwfont", marginTop: "5px" }}>Welcome <b>{userName}!</b></p> </span>









              <span style={{ display: "inline-block", marginRight: "40px" }}>
                <GoogleLogout
                  clientId={CLIENT_ID}
                  buttonText="Sign Out"
                  onLogoutSuccess={onSignoutSuccess}
                >
                </GoogleLogout>
              </span>





            </nav>

          </div>

          <div style={{ width: "100%", backgroundColor: backColor ? 'black' : 'white' }}>



            <div style={{ width: "60%", display: "flex", flexDirection: "column", backgroundColor: backColor ? 'black' : 'white' }}>

              <div align="right" style={{ marginTop: "30px", marginRight: "30px", whiteSpace: "nowrap" }}>




                <Table responsive style={{ width: "100%", whiteSpace: "nowrap", verticalAlign: "middle" }}>
                  <tbody style={{ border: "none" }}>
                    <tr>
                      <td style={{ float: "left", border: "none" }} >
                        <img src={image} width="30px" align="left" style={{ marginTop: '30px', cursor: "pointer", paddingBottom: "10px" }} alt="Create a new Account" title="Create a new account." onClick={createRedirect} />
                      </td>

                      <td style={{ float: "right", marginRight: "30px", border: "none" }}>
                        <div style={{ display: "flex" }}>
                          <span display="block" style={{ verticalAlign: "top" }}>
                            <img src={darkIcon} width="45px" align="left" style={{ marginRight: "20px", cursor: "pointer", lineHeight: "1.5" }} onClick={e => { goingDark(e) }} title="Click to enable Dark Mode" />
                          </span>
                          <span style={{ verticalAlign: "bottom", lineHeight: "2", whiteSpace: "nowrap" }}>
                            <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} style={{ whiteSpace: "nowrap", marginTop: '30px', marginRight: "20px", cursor: "pointer" }} />
                          </span>
                        </div>

                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>


              <Table variant={dark} striped bordered hover style={{ whiteSpace: "nowrap", verticalAlign: "middle", textAlign: "center" }}>
                <thead className="table-dark">
                  <tr style={{ borderColor: "#28bbbb" }}>
                    <th >Account Name</th>
                    <th >Feed <br />Count</th>
                    <th >Rep</th>
                    <th >Actions</th>
                  </tr>
                </thead>

                <tbody >






                  {filteredAccounts.map(account => (
                    <tr key={i++}>
                      <td width="300px" style={{ whiteSpace: "normal", overflow: "scroll", fontSize: "14px", fontFamily: "mwfontBold" }} className='fw-bold mb-1'>{account.accountName}</td>
                      <td width="70px" style={{ fontSize: "14px" }} className='fw-muted mb-1'>{account.feedCount}</td>
                      <td width="300px" style={{ fontSize: "14px" }}>{account.accountRepEmailId}</td>
                      <td width="200px"><Button className="button" style={{ fontFamily: "mwfont", width: "95px", textAlign: "center", fontSize: "14px" }} onClick={e => { addFeed(e, account) }} >Add a Feed</Button>
                      <Button className="button" style={{ fontFamily: "mwfont", width: "95px", textAlign: "center", fontSize: "14px" }} onClick={e => { addFeed2(e, account) }} >Add a Feed Avoin</Button>
                      
                        <Button className="button" style={{ marginLeft: "20px", fontSize: "14px", textAlign: "center", fontFamily: "'mwfont" }} onClick={e => { redirect(e, account) }}>View all Feeds</Button>

                        {isAdmin &&
                          <div style={{ marginTop: "10px", marginLeft: "5px", cursor: "pointer", display: "inline-block", fontFamily: "mwfont" }} onClick={e => { redirectSub(e, account) }}><img src={addSub} title="Add / Upgrade a subscription" width="30px" /></div>
                        }

                        <div style={{ marginTop: "10px", cursor: "pointer", display: "inline-block", fontFamily: "mwfont", marginLeft: "6px" }} onClick={e => { redirectSub2(e, account) }}><img src={image2} title="View all subscriptions" width="30px" /></div>
                      </td>
                      
                    </tr>


                  ))}








                </tbody>
              </Table>

              <span><img style={{ marginBottom: "45px" }} src={lineart} width="30%" /></span>
              <div style={{ alignItems: "Center", alignContent: "justify-center", color: backColor ? "white" : "black" }}>
                { loaded === true && <Spinner animation="grow" align="center" />}


                <ReactPaginate
                  previousLabel={"Previous"}
                  nextLabel={"Next"}
                  pageCount={pageCount}
                  onPageChange={changePage}
                  containerClassName={"paginationBttns"}
                  previousLinkClassName={"previousBttn"}
                  nextLinkClassName={"nextBttn"}
                  disabledClassName={"paginationDisabled"}
                  activeClassName={"paginationEnabled"}
                  style={{ width: "600px" }}

                />
                <br />
                <br />
                <br />
              </div>


            </div>

          </div>


        </center>
        
        
      </ErrorBoundary>
    </div>




  );






};


export default ViewAccounts;