import React from "react";
import { Form, Button, Container, Row, Col, DropdownButton, Dropdown } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import Axios from "axios";
import { useLocation } from "react-router-dom";




const CreateAccount = () => {

  const [accountName, setAccount] = useState("");
  const [region, setRegion] = useState("Select a Region");
  const [rep, setRep] = useState("");
  const [message, setMessage] = useState(null);
  const state = useLocation();
  // user details--------------------------------------
  const [userName, setUser] = useState(state.state.userName);
  const [email, setEmail] = useState(state.state.email);
  const [profilePic, setImage] = useState(state.state.profilePic);
  const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
  const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
  // user details--------------------------------------
  const token = localStorage.getItem("authToken");// Get stored token from localStorage
  const navigate = useNavigate();

  

  const redirect = () => {
    navigate('/accounts', { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
  }

  const createAccount = (e) => {
    e.preventDefault();
    console.log(accountName + " " + region + " " + rep);

    var body = {

      accountName: accountName,
      accountRepEmailId: email,  
      region: region




    };
    // const payload = JSON.stringify(body);
    console.log(body + " " + process.env.REACT_APP_HOSTNAME);
    Axios.post(process.env.REACT_APP_HOSTNAME + "/account", body, {      //POST call to save the account to Mongo
      headers: {
        'x-access-token': token
      }
    }).then(response => {

      console.log(response.data);
      response = JSON.stringify(response.data);
      response = JSON.parse(response);
      setMessage("Account successfully added.");
      // setTimeout(() => { window.location.reload(); }, 2000);


    }
    ).catch(error => {
      if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
        console.log("You have been logged out. Please login again.")
        setTimeout( () => { setMessage("You have been logged out. Please login again.");},3000);
        navigate("/login");
      }
      else {
        console.log(error);                         //report the error on the console
        setMessage("Account creation failed.");    
        // setTimeout(() => {  window.location.reload(); }, 3000);
      }

    })


  }

  const handleSelect = (e) => {
    console.log(e);
    setRegion(e);

  }




  return (
    <Container>
      <div style={{ align: "center", marginTop: "100px" }} className="border d-flex align-items-center justify-content-center">
        <Row className="mx-auto">

          <Form onSubmit={e => { createAccount(e) }}>
            <Form.Group as={Col} className="sm-8" controlId="accountName">
              <Form.Label className="sm-8">Account Name</Form.Label>
              <Form.Control className="sm-8" value={accountName} style={{ width: "350px" }} type="accountName" onChange={e => { setAccount(e.target.value) }} required="required" placeholder="Enter account name" />
              <Form.Label className="sm-8">Rep Email ID</Form.Label>
              <Form.Control className="sm-8" value={email} disabled onChange={e => { setRep(e.target.value) }} type="email" required="required" />
              <Form.Label className="sm-8">Region</Form.Label>
              {/* <Form.Control className="sm-8" type="region" value={region} onChange={e => {setRegion(e.target.value)}} required="required" placeholder="Enter the region" /> */}


              <DropdownButton id="dropdown-basic-button" title={region} onSelect={handleSelect}>
                <Dropdown.Item eventKey="Denmark">Denmark</Dropdown.Item>
                <Dropdown.Item eventKey="Finland">Finland</Dropdown.Item>
                <Dropdown.Item eventKey="Norway">Norway</Dropdown.Item>
                <Dropdown.Item eventKey="Others">Others</Dropdown.Item>
                <Dropdown.Item eventKey="South Africa">South Africa</Dropdown.Item>
                <Dropdown.Item eventKey="Sweden">Sweden</Dropdown.Item>
              </DropdownButton>


              <Button className="button"  variant="primary" onClick={redirect} style={{ marginTop: "15px" }}>
                Back
              </Button>
              <Button className="button"  variant="primary" type="submit" style={{ marginTop: "15px", marginLeft: "25px" }}>
                Create account
              </Button>
              <br />
              <br />
              {message}
            </Form.Group>
          </Form>

        </Row>

      </div>
    </Container>

  );
};

export default CreateAccount;