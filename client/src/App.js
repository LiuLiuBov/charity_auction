import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState} from "react";
import SignUpSignIn from './pages/SignUpSignIn';
import NavigationBar from './components/NavigationBar';
import MainPage from "./pages/MainPage";
import AuctionListing from "./pages/AuctionListing";

function App() {
    const [signedId, setSignedId] = useState(false)

    return (
        <Router>
            <NavigationBar />
            <Routes>

                <Route exact path="/" element={<MainPage/>}></Route>  {/* temporarily*/}
                <Route exact path="/new-lot" element={<AuctionListing/>}></Route>
            </Routes>
        </Router>
    );
}

export default App;
