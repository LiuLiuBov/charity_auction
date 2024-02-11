import React from 'react';
import { Form, Input, Button } from 'reactstrap';
import { useNavigate } from "react-router-dom";

const FilterContainer = ({ filters, onFilterChange, onSortChange, onCreateNewAuction }) => {
    const navigate = useNavigate();
    const handleFilterChange = (e) => {
        onFilterChange(e.target.name, e.target.value);
    };

    const handleSortChange = (e) => {
        onSortChange(e.target.value);
    };

    const handleCreateNewAuction = () => {
        navigate('/new-lot');
    };

    return (
        <div className="filter-panel">
            <Form>
                <Input
                    type="text"
                    name="title"
                    placeholder="Search by auction title"
                    onChange={handleFilterChange}
                    className="form-control my-2"
                />
                <Input
                    type="select"
                    name="category"
                    onChange={handleFilterChange}
                    className="form-control my-2"
                >
                    <option value="">Select Category</option>
                    <option value="category1">Category 1</option>
                    <option value="category2">Category 2</option>
                    {/* Add other categories here */}
                </Input>
                <Input
                    type="select"
                    name="sort"
                    onChange={handleSortChange}
                    className="form-control my-2"
                >
                    <option value="">Sort By</option>
                    <option value="price_asc">Price Ascending</option>
                    <option value="price_desc">Price Descending</option>
                    <option value="date_created_new">From newest to oldest</option>
                    <option value="date_created_old">From oldest to newest</option>
                </Input>
                <Button color="primary" onClick={handleCreateNewAuction} className="mt-3 w-100">
                    Add New Auction
                </Button>
            </Form>
        </div>
    );
};

export default FilterContainer;
