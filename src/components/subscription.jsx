import { React, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Form, Col, Row, Container, DropdownButton, Dropdown, Modal } from "react-bootstrap";
import Datepicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Axios from 'axios';










const Subscription = () => {

    const state = useLocation();
    const navigate = useNavigate();
    const client_id = state.state.client_id;
    const accountName = state.state.accountName;
    console.log("client ID = " + client_id);
    const [orderNo, setOrderNo] = useState("");
    const [source, setSource] = useState("Source Type");
    const [feedLimit, setFeedLimit] = useState(1);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [message, setMessage] = useState(null);
    const [createEnable, setEnable] = useState(true);
    const [trial, setTrial] = useState(false);
    const [localShow, setShow] = useState(false);
    const [subscriptionId, setSub] = useState(null);
    

    // user details--------------------------------------
    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    // user details--------------------------------------
    const backColor = state.state.backColor;

    console.log(orderNo, source, feedLimit, startDate, endDate);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (startDate > endDate)          //validate the date ranges before saving the subscription
        {
            setMessage("Error in date range! Make sure the start date is less than the end date.");
            setTimeout(() => { setMessage(""); }, 3000);
        }
        else if (feedLimit < 1) {
            setMessage("The feed limit can't be less than 1.");
            setFeedLimit(1);
            setTimeout(() => { setMessage(""); }, 3000);

        }
        else if (source == "Source Type") {
            setMessage("Select a source type.");
            return;
        }

        else {

            const token = localStorage.getItem("authToken"); // Get stored token from localStorage

            var body = {

                orderNo: orderNo,
                sourceType: source,
                feedLimit: feedLimit,
                clientId: client_id,
                startDate: startDate,
                endDate: endDate
            }
            //checking for active subscriptions. If found, confirm if the user wants to upgrade the current subscription.
            //A different order ID would be required for a subscription upgrade. 
            // algorithm summary--> fetch all the subscriptions for the client.
            // check the currently active ones and if found, show up a dialogue to confirm a subscription upgrade
            // The patch/put call will then be made to the Endpoint......

            Axios.get(process.env.REACT_APP_HOSTNAME + "/subscription/client/" + client_id, {     //fetching all the subscriptions for the client
                headers: {
                    "x-access-token": token,
                    "content-type": "application/json"
                }
            }).then(response => {

                var sourceT;
                var endDateT;
                var orderNoT;

                if (response.data.length == 0) {         //no subscription exists for the account so create a new one
                    console.log("no subscription exists for the client.");

                    var lower = orderNo.toLowerCase();

                    if (lower == "trial") {                   //if "trial" or "TRIAL" is used as the order No., the start and end date will be populated automatically
                        body.orderNo = lower;
                    }
                    Axios.post(process.env.REACT_APP_HOSTNAME + "/subscription", body, {    //creating a new subscription via the POST call
                        headers: {
                            'x-access-token': token
                        }
                    }).then(response => {

                        console.log(response.data);
                        response = JSON.stringify(response.data);
                        response = JSON.parse(response);
                        setMessage("Subscription successfully created.");
                        setTimeout(() => { window.location.reload(); }, 3000);


                    }
                    ).catch(error => {
                        console.log("There was an error in saving the subscription.", + error);
                        if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                            setMessage("You have been logged out. Please log in again...");
                            setTimeout(() => { navigate("/login");; }, 3000);
                        }
                        else {
                            setMessage("Subscription creation failed.");

                            setTimeout(() => { window.location.reload(); }, 3000);
                            // navigate("/login");
                        }

                    })

                    return;
                }


                else if (response.data.length == 1 ) {  //only 1 subscription exists in the account
                    // sourceT = response.data[0]["sourceType"];
                    // endDateT = response.data[0]["endDate"];
                    if (response.data[0]["orderNo"] == "trial" && orderNo.toLowerCase() == "trial") { //a trial subscription already exists in the account.
                        console.log("a trial for this account already exists");
                        setMessage("A trial subscription for this account already exists.");
                        console.log(response.data[0]["orderNo"]);
                        return;
                    }
                    else if (response.data[0]["orderNo"] == "trial" && orderNo.toLowerCase() != "trial") {
                        Axios.post(process.env.REACT_APP_HOSTNAME + "/subscription", body, {    //creating a new subscription via the POST call as there are no non-trial subscriptions present.
                            headers: {
                                'x-access-token': token
                            }
                        }).then(response => {

                            console.log(response.data);
                            response = JSON.stringify(response.data);
                            response = JSON.parse(response);
                            setMessage("Subscription successfully created.");
                            setTimeout(() => { window.location.reload(); }, 3000);


                        }
                        ).catch(error => {
                            console.log("There was an error in saving the subscription.", + error);
                            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                                setMessage("You have been logged out. Please log in again...");
                                setTimeout(() => { navigate("/login"); }, 3000);
                            }
                            else {
                                setMessage("Subscription creation failed.");

                                setTimeout(() => { window.location.reload(); }, 3000);
                                // navigate("/login");
                            }

                        })

                    }
                    else if ( response.data[0]["orderNo"] != "trial" && orderNo.toLowerCase() == "trial") {

                        Axios.post(process.env.REACT_APP_HOSTNAME + "/subscription", body, {    //creating a new subscription via the POST call
                            headers: {
                                'x-access-token': token
                            }
                        }).then(response => {
    
                            console.log(response.data);
                            response = JSON.stringify(response.data);
                            response = JSON.parse(response);
                            setMessage("Subscription successfully created.");
                            setTimeout(() => { window.location.reload(); }, 3000);
    
    
                        }
                        ).catch(error => {
                            console.log("There was an error in saving the subscription.", + error);
                            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                                setMessage("You have been logged out. Please log in again...");
                                setTimeout(() => { navigate("/login");; }, 3000);
                            }
                            else {
                                setMessage("Subscription creation failed.");
    
                                setTimeout(() => { window.location.reload(); }, 3000);
                                // navigate("/login");
                            }
    
                        });

                    }

                    else if (response.data[0]["orderNo"] != "trial") {   //There is a non trial subscription already present hence upgrade it
                        setSub(response.data[0]["subscriptionId"]);
                        setShow(true);
                        return;
                    }
                }
                else if (response.data.length == 2 ) {   //two subscriptions exist in the account 
                    

                    if ((response.data[0]["orderNo"] == "trial" || response.data[1]["orderNo"] == "trial")  && orderNo.toLowerCase() == "trial" ) {   //trying to create another trial when it already exists.
                        console.log("a trial for this account already exists");
                        setMessage("A trial subscription for this account already exists.");
                        console.log(response.data[0]["orderNo"]);
                        return;
                    }
                    else if (response.data[0]["orderNo"] == "trial" && orderNo.toLowerCase() != "trial"){
                        setSub(response.data[1]["subscriptionId"]);   //if the non trial subscription is at the 1th index, upgrade.
                        setShow(true);
                        return;

                    }
                    
                    else {
                        setSub(response.data[0]["subscriptionId"]);   //if the non trial subscription is at the 1th index, upgrade.
                        setShow(true);
                        return;
                    }

                }
                else {
                    setMessage("Something went wrong!!");
                    console.log("Response data -->" + " " + response.data);
                } 
                


            }).catch(error => {
                console.log("There was an error in saving the subscription.", + error);
                if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                    setMessage("You have been logged out. Please log in again...");
                    setTimeout(() => { navigate("/login"); }, 3000);
                }
                else {
                    setMessage("Subscription creation failed.");

                    setTimeout(() => { window.location.reload(); }, 3000);
                    // navigate("/login");
                }

            });


        }
    }

    const upgrade = () => {

        const token = localStorage.getItem("authToken"); // Get stored token from localStorage
        console.log("Executing upgrade....");

        var body = {

            orderNo: orderNo,
            feedLimit: feedLimit,
            startDate: startDate,
            endDate: endDate
        }
        console.log(orderNo, feedLimit, typeof(startDate), endDate, client_id);

        Axios.patch(process.env.REACT_APP_HOSTNAME + "/subscription/" + subscriptionId, body, {
            headers: {
                'x-access-token': token
            }
        }).then(response => {

            console.log(response.data);
            response = JSON.stringify(response.data);
            response = JSON.parse(response);
            setShow(false);
            setMessage("Subscription successfully upgraded. This page will refresh in 5 seconds.");
            setTimeout(() => { window.location.reload(); }, 5000);


        }
        ).catch(error => {
            console.log("There was an error in saving the subscription.", + error);
            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                setMessage("You have been logged out. Please log in again...");
                setTimeout(() => { navigate("/login");; }, 3000);
            }
            else {
                setMessage("Subscription creation failed.");

                // setTimeout(() => { window.location.reload(); }, 3000);
                // navigate("/login");
            }

        })
    }




    const onTrial = () => {


        var lower = orderNo.toLowerCase();

        if (lower == "trial") {

            var current = new Date();

            var trialEnd = new Date();
            trialEnd.setDate(trialEnd.getDate() + 14)

            setStartDate(current);
            setEndDate(trialEnd);
            setTrial(true);

        }
        else {
            setTrial(false);
        }





    }







    const clear = () => {
        setOrderNo("");
        setSource("Source Type");
        setFeedLimit("");
        setStartDate("");
        setEndDate("");
        setMessage("");
    }

    const handleSelect = (e) => {

        setEnable(false)
        setSource(e);


    }


    const back = () => {
        console.log("From the back function.");
        console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
        navigate("/accounts", { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn, backColor: backColor } });
    }


    return (

        <Container>

            
                <div width="100%" style={{justifyContent:"center", display:"flex"}}>
                <h3 style={{ marginTop: "50px",  }}>Creating Subscription for {accountName}</h3>
                </div>
                <div style={{ marginTop: "50px", display:"flex", justifyContent:"center", alignItems:"center" }} className="border d-flex align-items-center ">

                    <Row className="mx-auto justify-content-center">
                        <Button className="button"  variant="primary" onClick={back} style={{ marginTop: "20px", float: "left", marginRight: "auto", maxWidth:"120px" }}>
                            Back
                        </Button>
                        <Form onSubmit={handleSubmit} style={{display:"flex", justifyContent:"center", alignItems:"center", textAlign:"center"}} >

                            <Form.Group controlId="orderNo" style={{ textAlign:"center"}} >
                                <div>
                                <Form.Label >Order Id</Form.Label>
                                <Form.Control value={orderNo} style={{  align:"center"}} onBlur={onTrial} type="orderNo" onChange={e => { setOrderNo(e.target.value); setMessage(""); }} required="required" placeholder="Enter order Id" />
                                <p style={{ marginTop: "10px" }}>Enter 'Trial' or 'trial' for a trial order. </p>

                               </div>



                                <Form.Label style={{ marginTop: "20px" }} >Feed Limit</Form.Label>
                                <Form.Control value={feedLimit} style={{ width: "100px", textAlign: "center", margin:"auto" }} value={feedLimit} type="feedLimit" type="number" onChange={e => { setFeedLimit(e.target.value); setMessage(""); }} required="required" />


                                <Form.Label style={{ marginTop: "20px" }} >Client ID</Form.Label>
                                <Form.Control  value={client_id} style={{ width: "120px", textAlign: "center", margin: "auto" }} type="clientId" disabled required="required" />



                                <DropdownButton  style={{ align: "center", marginTop: "20px" }} id="dropdown-basic-button" title={source} required="required" onSelect={handleSelect} >
                                    <Dropdown.Item eventKey="Epress">Epress</Dropdown.Item>
                                    {/* <Dropdown.Item eventKey="futusome">Futusome</Dropdown.Item> */}
                                </DropdownButton>
                                <Modal show={localShow} >
                                    <Modal.Header closeButton>
                                        <Modal.Title>Subscription Upgrade?</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>This action will upgrade the existing subscription with the new one.</Modal.Body>
                                    <Modal.Footer>
                                        <Button   variant="secondary" onClick={(e) => setShow(false)}>
                                            Close
                                        </Button>
                                        <Button   variant="primary" onClick={(e) => { upgrade() }} >
                                            Upgrade
                                        </Button>
                                    </Modal.Footer>
                                </Modal>



                                <Form.Label style={{ marginTop: "20px" }} >Start Date</Form.Label>
                                <Datepicker style={{ paddingTop: "10px" }} selected={startDate} disabled={trial} onChange={(date) => setStartDate(date)} required="required" />
                                <br />
                                <Form.Label style={{ marginTop: "20px" }} >End Date</Form.Label>
                                <Datepicker style={{ paddingTop: "10px" }} selected={endDate} disabled={trial} onChange={(date) => setEndDate(date)} required="required" />
                                <center>
                                    <br />
                                    <Button className="button"  variant="primary" onClick={clear} style={{ marginTop: "20px", width: "80px" }}>
                                        Clear
                                    </Button>
                                    <Button className="button"  variant="primary" type="submit" style={{ marginTop: "20px", width: "200px", marginLeft: "25px" }}>
                                        Create / Upgrade Subscription
                                    </Button>
                                    <br />
                                    <p style={{ marginTop: "20px" }}>{message}</p>
                                </center>
                                <br />
                                <br />

                            </Form.Group>

                        </Form>

                    </Row>

                </div>
            
        </Container>

    );
};

export default Subscription;