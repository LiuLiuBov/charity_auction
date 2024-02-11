import React from 'react';
import '../styles/MainPage.css';
import AuctionCard from "../components/AuctionCard";
import image from '../assets/logo.png'
import image2 from '../assets/crash.jpg'
import image3 from '../assets/crash2.jpg'
import FilterContainer from "../components/FilterContainer";

const MainPage = () => {
    return (
        <div className="main-page">
            <FilterContainer />
            <div className="auction-container">
                <AuctionCard
                    images={[image3, image2]}
                    name="Ющенко"
                    price="1 UAH"
                    description="Люблю його"
                />
                <AuctionCard
                    images={[image]}
                    name="Green Boot"
                    price="200 UAH"
                    description="Unique, slightly worn"
                />
                <AuctionCard
                    images={[image]}
                    name="Green Boot"
                    price="200 UAH"
                    description="Unique, slightly worn"
                />
                <AuctionCard
                    images={[image]}
                    name="Green Boot"
                    price="200 UAH"
                    description="Unique, slightly worn"
                />
                <AuctionCard
                    images={[image]}
                    name="Green Boot"
                    price="200 UAH"
                    description="Unique, slightly worn"
                />
                <AuctionCard
                    images={[image]}
                    name="Green Boot"
                    price="200 UAH"
                    description="Unique, slightly worn"
                />
            </div>
        </div>
    );
};

export default MainPage;
