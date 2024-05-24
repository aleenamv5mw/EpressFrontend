import './App.css';

import { BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import CreateAccount from "./components/createAccount";
import ViewAccounts from "./components/viewAccounts";
import CreateEpress from './components/createEpress';
import AllFeeds from './components/allFeeds';
import Login from './components/login';
import Subscription from './components/subscription';
import AllSubscriptions from './components/allsubscriptions';
import BooleanGuide from './components/booleanguide';
import './fonts/mwfont/gt.ttf';

import CreateAvoin from './components/createAvoin';





function App() {

  

 



  return (
    
      
      <Router>
        <Routes>
         
          <Route path="/" element={<Login/>}  />
          <Route path="/createAccount" element={<CreateAccount/>}  />
          <Route path="/Accounts" element={<ViewAccounts/>}  />
          <Route path="/createEpress" element={<CreateEpress/>}  />
          <Route path="/createAvoin" element={<CreateAvoin/>}  />
          <Route path="/allfeeds" element={<AllFeeds/>}  />
          <Route path="/login" element={<Login/>} />
          <Route path="/subscription" element={<Subscription/>} />
          <Route path="/allsubscriptions" element={<AllSubscriptions/>} />
          <Route path="/booleanguide" element={<BooleanGuide/>} />
          
          
        </Routes>
      </Router>
    
  );
}

export default App;