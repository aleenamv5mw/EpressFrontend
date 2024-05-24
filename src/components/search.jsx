import React from "react";
import {Button} from "react-bootstrap";
  
const SearchBar = ({ searchQuery, setSearchQuery }) => (    //search bar
    
    <div>
        <label htmlFor="header-search">
            <span className="visually-hidden">Search an account</span>
        </label>
        <input style={{verticalAlign:"middle"}}
            type="text"
            id="header-search"
            placeholder="Search an account"
            name="s" 
            value={searchQuery} onInput={e => setSearchQuery(e.target.value)}
        />
        
    </div>
   
);

export default SearchBar;
  
