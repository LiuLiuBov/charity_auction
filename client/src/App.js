import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useState} from "react";
import SignUpSignIn from './pages/SignUpSignIn';
import NavigationBar from './components/NavigationBar';
import MainPage from "./pages/MainPage";
import AuctionListing from "./pages/AuctionListing";
import {AuthProvider} from "./contexts/useAuth";
import AuctionListingDetails from "./pages/AuctionListingDetails";

function App() {
    const [signedId, setSignedId] = useState(false)

    return (
         <AuthProvider>
            <Router>
                <NavigationBar />
                <Routes>
                    <Route exact path="/" element={<MainPage/>}></Route>
                    <Route exact path="/signin" element={<SignUpSignIn/>}></Route>
                    <Route exact path="/signup" element={<SignUpSignIn/>}></Route>
                    <Route exact path="/new-lot" element={<AuctionListing/>}></Route>
                    <Route exact path="/listing/1" element={<AuctionListingDetails auctionId={1}/>}></Route>
                </Routes>
            </Router>
         </AuthProvider>
    );
}

export default App;
