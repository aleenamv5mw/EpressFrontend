import React from "react";
import { useState, useEffect, Fragment } from "react";
import Axios from "axios";
import { Button, SplitButton, Dropdown, Table, Spinner } from "react-bootstrap";
import ReadOnly from "./readOnly";
import EditableFeed from "./editableFeeds";
import XMLParser from 'react-xml-parser';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';







const AllFeeds = () => {

    const [feedList, setFeeds] = useState([]);
    const [loaded, setLoad] = useState(true);
    const [empty, setEmpty] = useState(false);
    const [editFeedId, setFeedId] = useState(null);
    const [formData, setFormData] = useState({
        id: "",
        searchName: "",
        booleanQuery: "",
    });

    const state = useLocation();
    const client_id = state.state.client_id;    //client ID passed down from the Accounts Page



    const navigate = useNavigate();

    const [articles, setArticles] = useState([]);

    const [deleteId, setDeleteId] = useState(null);
    const [show, setShow] = useState(null);
    const [message, setMessage] = useState(null);
    const [hasChanged, setChange] = useState(false);

    const [count, setCount] = useState(null);
    const [count2, setCount2] = useState(null);
    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    const token = localStorage.getItem("authToken");      // Get stored token from localStorage





    useEffect(() => {


        Axios.get(process.env.REACT_APP_HOSTNAME + "/feed/client/" + client_id.toString(), {
            headers: {
                'x-access-token': token
            }
        }).then((response) => {

            if (response.data.length == 0) {
                setEmpty(true);
            }

            console.log(response.data);
            setFeeds(response.data);
            setLoad(false);
            console.log("Client ID = " + client_id);



        }).catch(error => {
            if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                console.log("You have been logged out. Please login again.")
                navigate("/login");
            }
            else {
                console.log("An error occurred: " + error);
            }
        })
    }, [])


    const handleDelete = (event, feed) => {
        event.preventDefault();
        setShow(true);
        setFeedId(null);
        setDeleteId(feed.id);
        console.log("The feed id is: " + feed.id);    //returning the deleted feed.



    }

    const handleEdit = (event, feed) => {
        event.preventDefault();
        setMessage(null);
        setCount(null);
        setDeleteId(null);
        setFeedId(feed.id);
        const formValues = {
            id: feed.id,
            searchName: feed.searchName,
            booleanQuery: feed.booleanQuery,
        }
        setFormData(formValues);
    }


    const back = () => {

        console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
        navigate("/accounts", { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    }

    const handleForm = (event) => {
        event.preventDefault();
        setCount(null);
        setChange(true);
        setMessage(null);
        const fieldName = event.target.getAttribute('name');
        const value = event.target.value;
        const newData = { ...formData };
        newData[fieldName] = value;
        setFormData(newData);
        console.log(formData);


    }

    const handleCancel = (event) => {
        setFeedId(null);     //setting the currently active feed to null. this is will switch the view to read-only mode.
        setCount(null);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        setCount(null);
        setMessage(null);
        if (hasChanged) {      //checking if there was a change in the search name or boolean

            //validating the word count for the query---------------------------------

            var originalBoolean = formData.booleanQuery.trim().replace(/ OR | or /g, " ")
                .replace(/ AND | and /g, " ")
                .replace(/ NOT | not /g, " ")
                .replace(/ \( | \) |\(|\)/g, " ")
                .replace(/ NOT | not /g, " ")
                .replace(/\s+/g, " ");


            console.log("original boolean= " + originalBoolean);

            originalBoolean = originalBoolean.trim(); //removing any extra white spaces

            if ((originalBoolean.match(/"/g) || []).length > 0) {    //if condition if there are quotes (" ") in the boolean





                var quoteCount = (originalBoolean.match(/"/g) || []).length;

                // console.log("Quote count = " + quoteCount);

                if (quoteCount % 2 != 0)    //returns true if there are imabalanced quotes in the boolean
                {
                    setMessage("Please check your boolean query for proper quotes and try again.");
                    return;
                }


                var i = 0;
                var indexArray = [];




                while (i < originalBoolean.lastIndexOf("\"")) {    //this loop replaces the quotes with a " - " for future processing
                    var quoteIndex = originalBoolean.indexOf("\"");
                    indexArray[i++] = quoteIndex;
                    originalBoolean = originalBoolean.replace("\"", "-");
                    // console.log(originalBoolean);
                }

                // console.log("Index array " + indexArray);
                i = 0;
                var keywordS = new Array();
                var j = 0;
                var count2 = 0;
                originalBoolean = originalBoolean.trim();
                var splitBoolean = originalBoolean.split(" ");
                // console.log(splitBoolean);
                try {

                    while (i < splitBoolean.length) {                             //loop for counting the keywords
                        if ((splitBoolean[i].match(/-/g) || []).length > 0) {
                            // console.log("quote detected at index " + i);
                            i = i + 1;
                            while (((splitBoolean[i].match(/-/g) || []).length == 0)) {     //loop to cycle through the quote phrase until the tracker reaches the end
                                i = i + 1;
                                // console.log("rollinggg..."); 
                            }


                        }
                        count2 = count2 + 1;       //taking the quote pair as a single count
                        i = i + 1;   //shifting the tracker outside of the quote pair
                    }
                }
                catch (error) {
                    console.log(error);
                }


                console.log("Count " + count2); //Final word count for queries containing quotes
                setCount2(count2);

            }
            else {      //code block that will execute in case there are no quotes in the boolean query
                count2 = originalBoolean.split(" ").length;
                console.log("wordCount = " + count2);
                setCount2(count2);
            }

            if (count2 > 10) {            //return from the function in case the keyword limit is exceeded
                setCount2(0);
                setMessage("Keyword limit exceeded. Please use a max of 10 keywords.");
                // setLoaded(false);
                return;
            }

            //--------------------------------------------------

            setMessage("Please wait....");
            const editedFeed = {
                id: formData.id,
                searchName: formData.searchName,
                booleanQuery: formData.booleanQuery,
            }
            //   console.log("This is the data to be pushed to the DB: " + editedFeed.id, editedFeed.searchName, editedFeed.booleanQuery);
            //Validating the query
            var query = editedFeed.booleanQuery.trim().replace(/ OR | or /g, " | ")
                .replace(/ AND | and /g, " ")
                .replace(/\s+/g, " ");


            //handling the NOT grouping in the search query--------------------------------------

            if (query.match(/not \(.*?\)/g)) {             //match for any NOT groups in the query          

                var notPart = query.match(/not \(.*?\)/g);   //storing the NOT part 



                var i = 0;
                while (i < notPart.length) {   //preprocessing the NOT part for further modifications

                    notPart[i] = notPart[i].replace("(", "").replace(")", "").replace("not", "").replace(/\s+/g, " ");
                    i = i + 1;
                }


                i = 0;
                var j = 0;
                var notString = [];
                var temp = [];
                while (i < notPart.length) {                   //storing each NOT keyword in an array
                    temp.push(notPart[i].trim().split(" "));

                    i = i + 1;



                }


                while (j < temp.length) {

                    notString = notString + " " + "!" + (temp[j].join(" !"));   //adding a "!" before every not keyword and storing it as a string
                    j = j + 1;

                }










                query = query.replace(/not \(.*?\)/g, "").replace(/\s+/g, " ");   //removing the not groupings from the original query

                query = query + " " + notString;
                query = query.replace(/\s+/g, " ");     //final query for the api call


                query = query.replace(/ NOT | not /g, " !"); // replace any left over NOT keywords
                console.log("Final query ----> " + query);




            }
            //-------------------------------------------------------------

            else
                query = query.replace(/ NOT | not /g, " !");  //if no not grouping found, just replace the not with " !"








            //---------------------------------------------------------------------------






            const finalQuery = "https://www.epress.fi/api/search?limit=250&sort=date-desc&f=rss&au_id=10001&au_key=wvyZ9mU1zc612YWaSWgH&q=" + encodeURI(query) + "&output=json";  //epress call





            var queryFinal = "https://www.epress.fi/api/search?limit=250&sort=date-desc&f=rss&au_id=10001&au_key=wvyZ9mU1zc612YWaSWgH&q=" + encodeURI(query) + "&output=json";  //this query will be saved in the mongoDB
            console.log("Encoded query = " + queryFinal);
            var apiCall = "https://www.epress.fi/api/search?limit=250&sort=date-desc&f=rss&au_id=10001&au_key=wvyZ9mU1zc612YWaSWgH&q=" + queryFinal + "&output=json";










            await Axios.get(apiCall).then(response => {

                var xml = new XMLParser().parseFromString(response.data);
                console.log(xml);

                var pubDate = xml.getElementsByTagName("pubDate");   //checking the number of article hits using the pubDate node

                if (pubDate.length > 0) {
                    setCount(pubDate.length);

                    console.log(articles);
                    setArticles(articles);

                    console.log(count + " results Found!!");

                    //axios patch call to update the records is below:
                    var patchEndpoint = process.env.REACT_APP_HOSTNAME + "/feed/" + editedFeed.id.toString();
                    console.log("final call = " + patchEndpoint);
                    const payload = {
                        searchName: editedFeed.searchName,
                        booleanQuery: editedFeed.booleanQuery,
                        feedUrl: queryFinal,
                        clientId: client_id,
                    }

                    console.log(payload);
                    Axios.patch(patchEndpoint, payload, {
                        headers: {
                            'x-access-token': token
                        }
                    }).then(response => {
                        console.log(response.data);
                        setMessage("Changes successfully saved!");
                        setTimeout(() => { setFeedId(null); window.location.reload(); }, 2000);   //wait 2 seconds before switching to read only mode


                    }).catch(err => {
                        if (err.response.status === 403) {         //redirecting to login page in case of authentication failure
                            console.log("You have been logged out. Please login again.")
                            navigate("/login");
                        }
                        else {
                            console.log(err);
                            setMessage("Something went wrong during the API call!"); // reporting any other error to the console
                        }
                    })

                }
                else {
                    setCount(0);
                    console.log("No results found! Please check your boolean query.");
                    setMessage("No results found! Please check your boolean query and try again.");



                }



            }).catch(error => {
                if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                    console.log("You have been logged out. Please login again.")
                    navigate("/login");
                }
                else
                    console.log("An error occurred: " + error);
            });
            //  setFeedId(null); //this turns off the inline edit mode

        }//end of if
        else {
            setFeedId(null);
        }
    }




    return (
        <center>
        <Table responsive style={{ width:"80%"}}>
            <tbody>
                <tr>
                    <td>
                        <div>
                        <Button className="button back"  onClick={back} style={{ width: "100px", textAlign: "Center", dsiplay:"block" }}>Back</Button>
                            </div>
                        <div style={{ paddingTop: "10px" }}>
                       
                            
                            <center>
                            
                                
                                <h3 style={{ background: "#28BBBB", width: "80%", color: "#ffffff", display: "block" }}>Feed List</h3></center>

                            <center><div style={{ width: "80%" }}>


                                <form onSubmit={handleFormSubmit}>
                                    <Table responsive striped bordered hover style={{ width: "100%" }}>
                                        <thead>
                                            <tr>
                                                <th style={{  }}>ID</th>
                                                <th>Name</th>
                                                <th style={{overflow:"scroll"}}>Query</th>
                                                <th >Type</th>
                                                <th >Status</th>
                                                <th >Actions</th>
                                                <th>RSS Link</th>
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {feedList.map(feed => (
                                                <Fragment key={feed.id}>
                                                    {editFeedId === feed.id ? <EditableFeed formData={formData} handleForm={handleForm} handleFormSubmit={handleFormSubmit} handleCancel={handleCancel} count={count} message={message} /> : <ReadOnly feed={feed} handleEdit={handleEdit} handleDelete={handleDelete} deleteId={deleteId} />}

                                                </Fragment>
                                            ))}
                                        </tbody>
                                    </Table>
                                    <center>
                                        {loaded && <Spinner animation="grow" align="center" />}
                                    </center>
                                </form>
                                {empty === true && <p>No feeds Found.</p>}
                            </div>
                            </center>
                        </div>
                    </td>
                </tr>
            </tbody>
        </Table>
        </center>
    );

};

export default AllFeeds;