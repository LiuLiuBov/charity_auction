import '../styles/MainPage.css';
import AuctionCard from "../components/AuctionCard";
import FilterContainer from "../components/FilterContainer";
import axios from 'axios';
import React, { useState, useEffect } from 'react';



const MainPage = () => {
    const [auctions, setAuctions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/api/auctions/');
                setAuctions(response.data);
            } catch (error) {
                console.error('Error fetching auctions:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div className="main-page">
            <FilterContainer />
            <div className="auction-container">
                {auctions.map(auction => (
                    <AuctionCard
                        key={auction.id}
                        images={auction.photos.map(photo => photo.photo)}
                        name={auction.title}
                        price={auction.starting_bid + ' UAH'}
                        description={auction.description}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainPage;
