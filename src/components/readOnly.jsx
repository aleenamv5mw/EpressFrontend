import { React, useState } from 'react';
import { Button, Form, Modal, Spinner } from 'react-bootstrap';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';



const ReadOnly = ({ feed, handleEdit, handleDelete, deleteId }) => {     //parameters passed down from the allfeeds page

  const [localShow, setShow] = useState(false);

  const navigate = useNavigate();
  const deleteFeed = async (feed) => {
    const token = localStorage.getItem("authToken");    // Get stored token from localStorage
    console.log(feed.id);
    var call = process.env.REACT_APP_HOSTNAME + '/feed/' + feed.id.toString();
    Axios.delete(call, {              //api call to delete the feed from Mongo
      headers: {
        'x-access-token': token
      }
    }).then(response => {
      console.log("Feed successfully deleted " + response);
      window.location.reload();
    }).catch(error => {
      if (error.response.status === 403) {         //redirecting to login page in case of authentication failure
        console.log("You have been logged out. Please log in again...");
        setTimeout(() => { navigate("/login");; }, 3000);
      }
      else {
        console.log("Error in deleting the feed: " + error.error);
      }
    })
    setShow(false);
  }




  return (
    <tr style={{ textAlign: "center" }}>

      <td style={{ width: "10px", fontSize:"14px" }}>{feed.id}</td>
      <td style={{ width: "150px", fontSize:"14px" }}>{feed.searchName}</td>
      <td style={{ width: "270px"}}><div style={{fontSize:"14px",overflow:"scroll", resize:"none"}}>{feed.booleanQuery}</div>
      {deleteId === feed.id && <Modal show={localShow} >
        <Modal.Header>
          <Modal.Title>Are you sure?</Modal.Title>
        </Modal.Header>
        <Modal.Body>This action will remove the feed from the database.</Modal.Body>
        <Modal.Footer>
          <Button className="button" variant="secondary" onClick={(e) => setShow(false)} >
            Close
          </Button>
          <Button className="button" variant="primary" onClick={e => deleteFeed(feed)} >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>}</td>
      <td style={{fontSize:"14px"}}>{feed.sourceType}</td>
      <td style={{ width: "50px", fontSize:"14px" }}>{feed.feedStatus}</td>
      <td style={{ width: "200px" }}>
        <Button className="button" style={{}} onClick={(e) => handleEdit(e, feed)}>Edit</Button>
        <Button className="button" style={{ margin: "6px" }} onClick={e => { handleDelete(e, feed); setShow(true); }}>Delete</Button>
      </td>
      <td style={{ width: "260px", fontSize: "13px", marginRight:"5px" }}><a href={feed.rssLink} target="_blank">{feed.rssLink}</a></td>
    </tr>

  )
    ;
}

export default ReadOnly;