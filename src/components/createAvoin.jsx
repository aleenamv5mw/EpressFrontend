import React, { useState } from "react";

import { Form, Button, Container, Alert, Badge } from "react-bootstrap";
import Axios from "axios";
import XMLParser from 'react-xml-parser';
import { useLocation, useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";

const CreateAvoin = () => {
    const [articles, setArticles] = useState([]);
    const [noDoc, setNoDoc] = useState("");
    const [searchName, setName] = useState("");
    const [businessLineCode, setBusinessLineCode] = useState("");
    const [businessLine, setBusinessLine] = useState("");
    const [avoinCall, setavoin] = useState("");
    const [rssLink, setLink] = useState("");
    const [saveEnable, setSave] = useState(true);
    const [loaded, setLoaded] = useState(false);
    const [message, setMessage] = useState(null);
    const [isCopied, setCopy] = useState(false);
    const navigate = useNavigate()
    const [searchSaved, setSaved] = useState("");
    const [count, setCount] = useState(0);;
    const state = useLocation();
    const [booleanQuery, setBoolean] = useState("");
    var feedCount;
    var feedLimit;
    var currentDate = new Date();
    var endDate;
    const token = localStorage.getItem("authToken");// Get stored token from localStorage

    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    const client_id = state.state.client_id;

    const clearAll = () => {
        setName("");
        setBusinessLineCode("");
        setBusinessLine("");
        setCopy(false);
        setNoDoc("");
        setArticles([]);
        setSave(true);
        setMessage(null);
    }
    const saveSearch = async (e) => {    //function to save the search

        setLoaded(true);
        setCount(0);
        setArticles([]);          //clearing the article array 

        setSaved("");
        setCopy(false);
        console.log("Search Name = " + searchName + " Query = " + booleanQuery);
        console.log("From the set function: " + avoinCall);
        const sourceType = "avoin";
        const feedUrl = avoinCall;
        var subId;





        const token = localStorage.getItem("authToken"); // Get stored token from localStorage


        await Axios.get(process.env.REACT_APP_HOSTNAME + "/account/" + client_id, {     //fetching the account details
            headers: {
                "x-access-token": token,
                "content-type": "application/json"
            }
        }).then(response => {
            feedCount = response.data[0]["feedCount"];   //saving the feed count for the account
            console.log("Feed Count = " + feedCount);
        }).catch(error => {
            console.log("There was an error in fetching the feed count.", + error);
            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                setLoaded(false);
                setMessage("You have been logged out. Please log in again...");
                setTimeout(() => { navigate("/login"); }, 3000);
            }
            else {
                setMessage("Search creation failed.");

                setTimeout(() => { window.location.reload(); }, 3000);
                // navigate("/login");
            }

        })


        Axios.get(process.env.REACT_APP_HOSTNAME + "/subscription/client/" + client_id, {     //fetching all the subscriptions for the client
            headers: {
                "x-access-token": token,
                "content-type": "application/json"
            }
        }).then(response => {

            if (response.data.length == 0) {         //no subscription exists for the account so create a new one
                setLoaded(false);
                console.log("no subscription exists for the client.");
                setMessage("No Subscriptions found! Please create a new subscription for the client.");

                setTimeout(() => { window.location.reload(); }, 3000);
                return;

            }

            else if (response.data.length == 1) {
                console.log("coming in hotttt");
                console.log(response.data);


                if (response.data[0]["orderNo"] == "trial") {
                    endDate = new Date(response.data[0]["endDate"]);
                    if (endDate < currentDate) {
                        setLoaded(false);
                        setMessage("The trial Subscription has expired.");
                        return;

                    }
                }

                endDate = new Date(response.data[0]["endDate"]);
                if (endDate < currentDate) {
                    setLoaded(false);
                    setMessage("The Subscription has expired.");
                    return;

                }


                feedLimit = response.data[0]["feedLimit"];
                subId = response.data[0]["subscriptionId"];

                console.log("feedlimit " + feedLimit);
                console.log("Feed Count " + feedCount);



                if (feedCount < feedLimit) {
                    var body = {                            //body for the POST call to mongo
                        booleanQuery: booleanQuery,
                        searchName: searchName,
                        feedStatus: "Running",
                        sourceType: "avoin",
                        feedUrl: feedUrl,
                        emailId: email,
                        clientId: client_id,
                        subscriptionId: subId

                    };
                    feedSaveCall(body);   //function to make the POST call to mongo for saving the feed

                }
                else {
                    setMessage("Feed limit reached. Please create/upgrade the client's subscription");
                }

                setLoaded(false);




            }

            else if (response.data.length == 2) {         //there exists a trial and a non-trial subscription for the client
                var subDetails;

                if (response.data[0]["orderNo"] == 'trial') {      //skip the trial subscription (non trial subs take priority)

                    subDetails = response.data[1];
                }
                else if (response.data[1]["orderNo"] == 'trial')   //if the 1st index has the trial sub., the 0th index would have the non-trial sub
                    subDetails = response.data[0];

                console.log(subDetails);

                endDate = subDetails["endDate"];
                endDate = new Date(endDate);
                if (endDate > currentDate) {                 //checking the subscription validity
                    console.log("Sub is valid.");
                    feedLimit = subDetails["feedLimit"];
                    console.log("This is the feed limit " + feedLimit);
                    console.log("Feed count " + feedCount);
                    console.log("Feed limit " + feedLimit);
                    if (feedCount < feedLimit) {    //checking the feed limit
                        var body = {                            //body for the POST call to mongo
                            booleanQuery: booleanQuery,
                            searchName: searchName,
                            feedStatus: "Running",
                            sourceType: "avoin",
                            feedUrl: feedUrl,
                            emailId: email,
                            clientId: client_id,
                            subscriptionId: subDetails["subscriptionId"]

                        };
                        feedSaveCall(body);   //function to make the POST call to mongo for saving the feed


                    }
                    else {
                        setMessage("Feed limit reached. Please create/upgrade the client's subscription");
                    }

                    setLoaded(false);

                }
                else {
                    setLoaded(false);
                    console.log("Sub has expired.");
                    setMessage("The subscription has expired. Please upgrade your subscription");
                }

            }



        }).catch(error => {
            console.log("There was an error in saving the subscription.", + error);
            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                setLoaded(false);
                setMessage("You have been logged out. Please log in again...");
                setTimeout(() => { navigate("/login"); }, 3000);
            }
            else {
                setMessage("Subscription creation failed.");

                setTimeout(() => { window.location.reload(); }, 3000);
                // navigate("/login");
            }

        })









        // var body = {                            //body for the POST call to mongo
        //     booleanQuery: booleanQuery,
        //     searchName: searchName,
        //     feedStatus: "Running",
        //     sourceType: "avoin",
        //     feedUrl: feedUrl,
        //     emailId: email,
        //     clientId: client_id,

        // };
        // // const payload = JSON.stringify(body);
        // console.log(body);



    }

    const feedSaveCall = (body) => {
        Axios.post(process.env.REACT_APP_HOSTNAME + "/feed", body, {        //API call to save the feed to Mongo
            headers: {
                'x-access-token': token
            }
        }).then(response => {

            console.log(response.data);
            response = JSON.stringify(response.data);
            response = JSON.parse(response);
            setLink(response.rssLink.toString());
            setSaved("true");
            setSave(true);
            setLoaded(false);

        }
        ).catch(error => {
            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                setLoaded(false);
                console.log("You have been logged out. Please login again.")
                navigate("/login");
            }
            else {
                console.log("There was an error in saving the feed", + error);    //display any other error on the console
                setSaved("");
                setLoaded(false);
            }
        })
    }




    const back = () => {

        // console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
        navigate("/accounts", { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    }

  

    const getExample = async (e) => {
        e.preventDefault();
        setArticles([]);
        setNoDoc(false);
        setMessage("");

        let searchUrl = `https://avoindata.prh.fi/bis/v1?totalResults=true&maxResults=10&resultsFrom=0`;
        if (businessLineCode) {
            searchUrl += `&businessLineCode=${businessLineCode}`;
        } else if (businessLine) {
            searchUrl += `&businessLine=${businessLine}`;
        } else {
            setMessage("Please provide a businessLineCode or businessLine for the search.");
            return;
        }

        setLoaded(true);
        try {
            const response = await Axios.get(searchUrl);
            const data = response.data.results;

            if (data.length === 0) {
                setNoDoc("true");
                setLoaded(false);
                return;
            }

            // Sort by registrationDate descending
            data.sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate));

            const articles = data.map(item => ({
                title: item.name,
                pubDate: item.registrationDate,
                description: `Rekisteröity: ${item.registrationDate}, Toimiala: ${item.name}, Yhteystiedot: ${item.addresses.map(addr => `${addr.street}, ${addr.postCode}, ${addr.city}`).join(', ')}`,
                link: `http://www.kauppalehti.fi/yritykset/yritys/${item.name}/${item.businessId}`
            }));

            setArticles(articles);
            setNoDoc(false);
            setSave(false);
            setLoaded(false);

        } catch (error) {
            setMessage("An error occurred while fetching the data. Please try again.");
            setLoaded(false);
        }
    };

    return (
        <Container style={{ width: "50%" }}>
            <br />
            <Button className="button" onClick={back} style={{ width: "130px", margin: "5px" }}>Back</Button>
            <Form onSubmit={getExample}>
                <Form.Group>
                    <Alert variant="primary">Create your Avoin Feed</Alert>
                    <Form.Label>Search Name</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        value={searchName}
                        onChange={e => { setName(e.target.value); setMessage(null); }}
                        name="searchName"
                        placeholder="Enter the search name."
                    />
                    <Form.Label style={{ marginTop: "10px" }}>Business Line Code</Form.Label>
                    <Form.Control
                        type="text"
                        value={businessLineCode}
                        onChange={e => { setBusinessLineCode(e.target.value); setSave(true); setArticles([]); setNoDoc(""); setCopy(false); setMessage(null); }}
                        name="businessLineCode"
                        placeholder="Enter the business line code."
                    />
                    <Form.Label style={{ marginTop: "10px" }}>Business Line</Form.Label>
                    <Form.Control
                        type="text"
                        value={businessLine}
                        onChange={e => { setBusinessLine(e.target.value); setSave(true); setArticles([]); setNoDoc(""); setCopy(false); setMessage(null); }}
                        name="businessLine"
                        placeholder="Enter the business line."
                    />
                    <Button className="button" type="submit">Get Example Results</Button>
                    <Button className="button" disabled={saveEnable} onClick={saveSearch}>Save Search</Button>
                    <Button className="button" onClick={clearAll}>Clear All</Button>
                </Form.Group>
            </Form>
            <br />
            <center>
                {loaded && <Spinner animation="grow" />}
                {message}
            </center>
            {articles.length > 0 && (
                <div>
                    <ul>
                        <br />
                        <h2 style={{ background: "#9cc069" }}>{articles.length} Results Found!</h2>
                        {articles.map((article, index) => (
                            <div key={index}>
                                <br />
                                <h3 style={{ background: "#cbecff", padding: "15px" }}>
                                    {article.title}
                                </h3>
                                <p><b>{article.pubDate}</b></p>
                                <p>{article.description}</p>
                                <p><a href={article.link} target="_blank" rel="noopener noreferrer">Link</a></p>
                            </div>
                        ))}
                    </ul>
                </div>
            )}
            {noDoc === "true" && (
                <div>
                    <br />
                    <br />
                    <h3 style={{ background: "#FF7272" }}>No Results Found!!!</h3>
                </div>
            )}
            {isCopied && <p>Link Copied!!</p>}
        </Container>
    );
};

export default CreateAvoin;
