import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const AuctionDetailPage = () => {
    const [auction, setAuction] = useState(null);
    const [bidAmount, setBidAmount] = useState('');
    const [showBidForm, setShowBidForm] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        const fetchAuction = async () => {
            try {
                if (id) {
                    const response = await axios.get(`http://127.0.0.1:8000/api/auctions/${id}`);
                    setAuction(response.data);
                }
            } catch (error) {
                console.error('Error fetching auction:', error);
            }
        };

        fetchAuction();
    }, [id]);

    const handleBidChange = (event) => {
        setBidAmount(event.target.value);
    };

    const handleBidSubmit = async () => {
        try {
            const data = { current_bid: bidAmount };
            console.debug('Data sent to server:', data);


            const response = await axios.put(`http://127.0.0.1:8000/api/auctions/${id}/`, data, {
                headers: {
                    'Authorization': `Bearer token`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            setAuction(response.data);
            setBidAmount('');
            setShowBidForm(false);
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };



    if (!auction) {
        return <div>Loading...</div>;
    }

    return (
        <div className="auction-detail">
            <h2>{auction.title}</h2>
            {auction.photos && auction.photos.length > 0 && (
                <img src={auction.photos[0]} alt={auction.title} />
            )}
            <p>Description: {auction.description}</p>
            <p>Current Price: {auction.starting_bid} UAH</p>
            {showBidForm ? (
                <div>
                    <input
                        type="number"
                        value={bidAmount}
                        onChange={handleBidChange}
                        placeholder="Enter bid amount"
                    />
                    <button onClick={handleBidSubmit}>OK</button>
                </div>
            ) : (
                <button onClick={() => setShowBidForm(true)}>Зробити ставку</button>
            )}
        </div>
    );
};

export default AuctionDetailPage;
