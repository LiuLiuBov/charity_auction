import React, { useState, useEffect, useRef } from 'react';

function BidsComponent({ auctionId }) {
  const [bids, setBids] = useState([]);
  // Use useRef to hold a mutable object that persists for the lifetime of the component
  const ws = useRef(null);

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(`ws://localhost:8000/ws/auctions/${auctionId}/bids/`);
    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onclose = () => console.log('WebSocket disconnected');
    ws.current.onerror = (error) => console.error('WebSocket error:', error);

    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      if (data.type === 'bids') {
        setBids(data.bids); // Update bids state
      }
    };

    // Clean up function to close the WebSocket connection when the component unmounts
    return () => {
      ws.current.close();
    };
  }, [auctionId]); // Reconnect the WebSocket if the auctionId changes

  // Function to send a message through WebSocket
  const sendMessage = (message) => {
    if (ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    }
  };

  // Example of using sendMessage to send a bid
  // This can be triggered by a user action, such as submitting a form
  // sendMessage({ action: 'send_bid', amount: 100 });

  return (
    <div>
      <h2>Bids</h2>
      <ul>
        {bids.map((bid) => (
          <li key={bid.id}>{bid.bidder}: ${bid.amount}</li>
        ))}
      </ul>
    </div>
  );
}

export default BidsComponent;
