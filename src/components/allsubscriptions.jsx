import { React, useEffect, useState, Fragment } from "react";
import SearchBar from './search';
import Axios from 'axios';
import { Table } from "react-bootstrap";
import { Button } from 'react-bootstrap';
import { GoogleLogout } from 'react-google-login';
import ReactPaginate from 'react-paginate';
import {useNavigate, useLocation} from 'react-router-dom';



const AllSubscriptions = () => {


    const [subList, setList] = useState([]);
    const state = useLocation();
    const navigate = useNavigate();
    //user information
    const [userName, setUser] = useState(state.state.userName);
    const [email, setEmail] = useState(state.state.email);
    const [profilePic, setImage] = useState(state.state.profilePic);
    const [CLIENT_ID, setClientId] = useState(state.state.CLIENT_ID);
    const [isLoggedIn, setLogin] = useState(state.state.isLoggedIn);
    const client_id  = state.state.client_id; 
    

    
    const token = localStorage.getItem("authToken");// Get stored token from localStorage
    console.log(email, userName, CLIENT_ID, isLoggedIn);



    const back = () =>
{   
    console.log("From the back function.");
    console.log(userName, email, profilePic, CLIENT_ID, isLoggedIn);
    navigate("/accounts", { state: { userName: userName, email: email, profilePic: profilePic, CLIENT_ID: CLIENT_ID, isLoggedIn: isLoggedIn} });
}


    useEffect(() => {
        if (!isLoggedIn) {

            navigate("/login");
        }
        else {
            Axios.get(process.env.REACT_APP_HOSTNAME + "/subscription/client/" + client_id.toString(), {
                headers: {
                  'x-access-token': token
                }
              }).then((response) => {

                console.log(response.data);
                setList(response.data);

                console.log(response.data);

            }).catch(error => {
                if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
                    console.log("You have been logged out. Please login again.")
                    navigate("/login");
                }
                else
                console.log(error);
            })
        }
    }, [])





    return (<div>
        <center><h3 style={{ background: "#28BBBB", width: "70%", color: "#ffffff" }}>Subscription List</h3></center>

        <center><div style={{ width: "70%" }}>
            <div style={{ float: "left" }}> <Button className="button"  style={{ width: "130px", margin: "5px", align: "left" }} onClick={back}>Back</Button> </div>
            <form >
                <Table responsive striped bordered hover style={{ width: "100%", whiteSpace: "nowrap", justifyContent:"center", textAlign:"center" }}>
                    <thead>
                        <tr >
                            <th style={{ width: "50px" }}>Order Number</th>
                            <th width="50px">Source</th>
                            <th width="20px">Feed Limit</th>
                            <th width="60px">Start Date</th>
                            <th width="60px">End Date</th>
                            <th width="40px">Status</th>

                        </tr>
                    </thead>
                    <tbody >
                        {subList.map(subList => (
                            <tr key={subList.orderNo}>
                                <Fragment >
                                <td style={{ width: "150px" }}>{subList.orderNo}</td>
                                    <td>{subList.sourceType}</td>
                                    <td style={{ width: "50px" }}>{subList.feedLimit}</td>
                                    <td style={{ width: "50px" }}>{subList.startDate}</td>
                                    <td style={{ width: "50px" }}>{subList.endDate}</td>
                                    <td style={{ width: "50px" }}>to be done...</td>



                                </Fragment>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </form>

        </div>
        </center >
    </div >
    );

};

export default AllSubscriptions;