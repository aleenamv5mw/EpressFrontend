import React from 'react';
import {Button, Form} from 'react-bootstrap';


const EditableFeed = ({formData, handleForm, handleFormSubmit, handleCancel, count, message}) => {    //parameters passed down from the allfeeds page
    return (
           <tr>
            <td></td>
            <td style={{width:"150px"}}><input type="text" required="required" placeholder="Enter the search name." name="searchName" style={{resize:"none"}} value={formData.searchName} onChange={handleForm}/></td>
            <td><Form.Control as="textarea" style={{resize:"none", whiteSpace:"normal", overflow:"scroll"}} required="required" placeholder="Enter the search query." name="booleanQuery" value={formData.booleanQuery} onChange={handleForm} />
            {count != null && <p>Article Hits: {count} </p>} { message != null && <p>{message}</p>}

            </td>
            <td></td>
            <td></td>
            <td style={{width:"180px"}}><Button className="button"  onClick={handleFormSubmit} style={{width:"130px", margin:"5px"}}>Save</Button><Button className="button"  onClick={handleCancel} style={{width:"130px", margin:"5px"}}>Cancel</Button></td>
            </tr>  
        
    );
};

export default EditableFeed;