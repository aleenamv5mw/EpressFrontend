import React from "react";
import { useState } from "react";
import { Form, Button, Container, Alert, Badge } from "react-bootstrap";
import Axios from "axios";
import XMLParser from 'react-xml-parser';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";




const CreatePaikat = () => {

    const [articles, setArticles] = useState([]);
    const [noDoc, setNoDoc] = useState("");
    const [searchName, setName] = useState("");
    const [booleanQuery, setBoolean] = useState("");
    const [paikatCall, setpaikat] = useState("");
    const [rssLink, setLink] = useState("");
    const [saveEnable, setSave] = useState(true);
    const [titles, setTitles] = useState([]);
    const [pubDate, setDate] = useState([]);
    const [source, setSource] = useState([]);
    const [description, setDesc] = useState([]);
    const [link, setlink] = useState([]);
    const [guid, setGuid] = useState([]);
    const [searchSaved, setSaved] = useState("");
    const [count, setCount] = useState(0);
    const [isCopied, setCopy] = useState(false);
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    var feedCount;
    var feedLimit;
    const state = useLocation();
    const [loaded, setLoaded] = useState(null);  //hook for loading animation
    const [message, setMessage] = useState(null);
    const token = localStorage.getItem("authToken");// Get stored token from localStorage
    var key = 1;
    var currentDate = new Date();
    var endDate;
    //user Details-----------
    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    //User Details-----------
    console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
    const [flag, setFlag] = useState("");

    const client_id = state.state.client_id;    //client ID passed down from the Accounts Page






    const booleanGuide = () => {    //redirecting to the boolean guide




        navigate("/booleanguide", { state: { client_id: client_id, userName: userName, email: email, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
        // console.log("Value of accountName = " + account.accountName + "cliend ID = " + account.id);


    }

    const clearAll = async (e) => {    //clearing all the fields 
        setName("");
        setBoolean("");
        setCopy(false);
        setSaved("");
        setCount(0);
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
        console.log("From the set function: " + paikatCall);
        const sourceType = "paikat";
        const feedUrl = paikatCall;
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
                        sourceType: "paikat",
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
                            sourceType: "paikat",
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
        //     sourceType: "paikat",
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





    const getExample = async (e) => {              //function to get the example results based on the search boolean

        e.preventDefault();
        setArticles([]);
        setNoDoc(false);
        setMessage("");

        // let finalQuery = "https://paikat.te-palvelut.fi/tpt-api/v1/tyopaikat.rss?hakusana=varainhank";  //paikat call
        // finalQuery += encodeURIComponent(keyword);
        // console.log("this is the final query " + finalQuery);
        
        // setpaikat(finalQuery);    //saving the final api call for the search in the variable paikatCall

        let paikatCall = `https://paikat.te-palvelut.fi/tpt-api/v1/tyopaikat.rss?hakusana=${encodeURIComponent(keyword)}`;
        //  console.log(paikatCall);
        await Axios.get(paikatCall).then(response => {     //making the api call to paikat
            var rawRes = response;
            var xml = new XMLParser().parseFromString(response.data);    //using xml parser to parse the response
            console.log(xml);
            //storing the titles, pubDate, link, description, guid in separate variables
            var title = xml.getElementsByTagName("title");
            title.shift();
            var link = xml.getElementsByTagName("link");
            var description = xml.getElementsByTagName("description");
            description.shift();
            var pubDate = xml.getElementsByTagName("pubDate");
            var guid = xml.getElementsByTagName("guid");
          
            if (pubDate.length > 0) {        //checking if there are any hits using the pubDate node
                setCount(pubDate.length);
                setNoDoc(false);
                setSave(false);
                setTitles(title);
                setDesc(description);
                setlink(link);
               
                setDate(pubDate);
                setGuid(guid);
                setFlag("true");
                var i = 0;
                var articles = [];
                for (i = 0; i < pubDate.length; i++) {
                    articles.push({
                        title: title[i].value,
                        link: link[i].value,
                        description: description[i].value,
                        pubDate: pubDate[i].value,
                        guid: guid[i].value,
                    })
                }
                console.log(articles);
                setArticles(articles);
                setLoaded(false);


                // console.log(title.length + "\n" + pubDate.length + "\n" + source.length + "\n" + description.length);

            }
            else {
                console.log("No results found! Please check your boolean query.");
                setNoDoc("true");
                setLoaded(false);
                console.log(noDoc);

            }



        }).catch(error => {
            console.log("An error occurred: " + error);
        });

    }





    return (
        <Container style={{width:"50%"}}>
            <br />
            <Button className="button"  onClick={back} style={{ width: "130px", margin: "5px" }}>Back</Button>
            <Form onSubmit={e => { getExample(e); }}>
                <Form.Group>
                    <Alert variant="primary">Create your paikat Feed</Alert>
                    <Form.Label>Search Name</Form.Label>
                    <Form.Control required={true} type="text" value={searchName} onChange={e => { setName(e.target.value); setMessage(null); }} name="searchName" placeholder="Enter the search name." />
                    <Form.Label style={{ marginTop: "10px" }}>Keyword</Form.Label>
                    <Form.Control
                        type="text"
                        value={keyword}
                        onChange={e => { setKeyword(e.target.value); setSave(true); setArticles([]); setNoDoc(""); setCopy(false); setMessage(null); }}
                        name="Keyword"
                        placeholder="Enter keyword."
                    />
                   
                   


                    <Button className="button"  type="submit">Get Example Results</Button> <Button className="button"  disabled={saveEnable} onClick={e => { saveSearch(e) }}>Save Search</Button> <Button className="button"  onClick={e => { clearAll(e) }}>Clear All</Button>
                </Form.Group>
            </Form>
            <br />
            <center>
                {loaded === true && <Spinner animation="grow" />}
                {message}
            </center>
            {flag.length > 0 &&
                <div>

                    <ul>
                        <br />

                        {count > 0 && <h2 style={{ background: "#9cc069" }}>{count} Results Found!</h2>}
                        {articles.length > 0 && articles.map(article => {
                            return (
                                <div key={key++}>

                                    <br />

                                    <h3 style={{ background: "#cbecff", padding: "15px" }}>
                                        {article.title}
                                    </h3>
                                    <p><b>{article.link}</b></p>
                                  
                                    <p>{article.description}</p>
                                    <p><b>{article.pubDate}</b></p>
                                    <p><b>{article.guid}</b></p>
                                </div>
                            )
                        })}


                    </ul>

                    {searchSaved.length > 0 && <div>
                        <Badge bg="secondary" style={{ fontSize: "15px" }}>RSS link = <a href={rssLink} target="_blank" style={{ color: "white" }}>{rssLink}</a></Badge>
                        {/* <Button className="button"  type="copy" onClick={() => { navigator.clipboard.writeText(rssLink); setCopy(true) }}>Copy Link</Button> */}
                    </div>

                    }
                </div>

            }

            {noDoc == "true" &&
                <div>
                    <br />
                    <br />
                    <h3 style={{ background: "#FF7272" }}>No Results Found!!!</h3>
                </div>

            }
            {isCopied && <p>Link Copied!!</p>}

        </Container>


    );
};

export default CreatePaikat;