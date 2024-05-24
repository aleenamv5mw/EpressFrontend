import React from "react";
import { Alert, Card, Button } from 'react-bootstrap';
import {useNavigate, useLocation} from 'react-router-dom';
import { useState } from 'react';

const BooleanGuide = () => {

    const state = useLocation();
    const navigate = useNavigate();
    //user information
    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    const client_id  = state.state.client_id; 




    const back = () =>
    {   
        
        console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
        navigate("/createepress", { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn } });
    }







    return (
        
        
        <center>
            <div style={{ marginBottom: "150px", width:"80%" }}>
            <Button className="button"  style={{ width: "130px", margin: "5px", float: "left", display:"block", marginLeft:"10%" }} onClick={back}>Back</Button>
            <br/>
            <br/>
                <Alert variant="primary" style={{ width: "80%" }}>
                    <Alert.Heading>Epress Boolean Guide</Alert.Heading>
                </Alert>
                <Card style={{ width: "80%", textAlign: "left" }}>
                    <Card.Header as="h5">Boolean Operator Syntax</Card.Header>
                </Card>
                <Card style={{ width: "80%", textAlign: "left", marginTop: "20px" }}>
                    <Card.Body>
                        <Card.Title>OR<br /></Card.Title>
                        <Card.Text>
                            <ul>
                                <li>nokia or ericsson</li>
                                <li>Nokia OR ericsson</li>
                            </ul>
                        </Card.Text>

                    </Card.Body>
                </Card>
                <Card style={{ width: "80%", textAlign: "left", marginTop: "20px" }}>
                    <Card.Body>
                        <Card.Title>AND<br /></Card.Title>
                        <Card.Text>
                            <ul>
                                <li>nokia and ericsson</li>
                                <li>Nokia AND ericsson</li>
                                Note: The expressions have an implicit AND operator by default, ie the expression "nokia ericsson" is practically "nokia AND
                                    ericsson".
                            </ul>
                        </Card.Text>

                    </Card.Body>
                </Card>
                <Card style={{ width: "80%", textAlign: "left", marginTop: "20px" }}>
                    <Card.Body>
                        <Card.Title>Phrases<br /></Card.Title>

                        <Card.Text>
                            <ul>
                                <li>
                                    "nokia siemens networks"
                                </li>
                            </ul>
                        </Card.Text>

                    </Card.Body>
                </Card>
                <Card style={{ width: "80%", textAlign: "left", marginTop: "20px" }}>
                    <Card.Body>
                        <Card.Title>PROXIMITY OPERATOR/NEAR<br /></Card.Title>
                        <Card.Text>
                            <ul>
                                <li>
                                    "Oulun yliopisto"~4
                                </li>

                            </ul>

                            Note: This returns results, where the distance between the words<b> "oulun"</b> and <b>"yliopisto"</b> (or their inflections) is no more
                                than four words, eg "Oulun kaupunki panostaa tulevaisuudessa yliopiston liikenneyhteyksien kehittämiseen" would
                                match the search result.

                            


                        </Card.Text>

                    </Card.Body>
                </Card>
                <Card style={{ width: "80%", textAlign: "left", marginTop: "20px" }}>
                    <Card.Body>
                        <Card.Title>Grouping<br /></Card.Title>
                        <Card.Text>
                            <ul> <li>
                                (nokia NOT ericsson) OR (apple NOT pear) <br />

                            </li>
                                <li>(nokia OR apple) NOT (ericsson AND pear) </li>
                            </ul>
                            Note: <ul> <li><b>OR</b> operator is not supported with NOT groups. Eg: <b>nokia NOT (ericsson OR samsung)</b> will yield unexpected output.</li>
                                <li><b>OR</b>-operator has greater priority than <b>AND</b>, so "smartphone samsung OR apple" is in practice " smartphone (samsung OR
                                    apple)", not "( smartphone samsung) OR apple"</li>
                            </ul>
                        </Card.Text>

                    </Card.Body>
                </Card>
            </div >
        </center>
        
    );
};

export default BooleanGuide;