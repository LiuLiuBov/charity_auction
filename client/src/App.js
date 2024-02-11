import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState} from "react";
import SignUpSignIn from './pages/SignUpSignIn';
import AuctionListing from "./pages/AuctionListing";

function App() {
    const [signedId, setSignedId] = useState(false)

    return (
        <Router>
            <Routes>
                <Route exact path="/" element={<SignUpSignIn/>}></Route>  {/* temporarily*/}
                <Route exact path="/new-lot" element={<AuctionListing/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
