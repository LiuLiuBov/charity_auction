import React, { useEffect, useState } from 'react';
import { useForm } from '../hooks/useForm';
import {
  Container, Form, FormGroup, Label, Input, Button, Row, Col, FormFeedback
} from 'reactstrap';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const AuctionListing = () => {
  const { values, handleChange, setValues, validate, errors, setErrors } = useForm({
    title: '',
    description: '',
    category: '',
    starting_bid: '',
  });

  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const imagesNumber = 8;
  const navigate = useNavigate();

   const handleImageChange = (event) => {
    if (event.target.files.length > imagesNumber) {
      event.target.value = null;
      alert(`You can only upload up to ${imagesNumber} images.`);
      return;
    }

    // Only proceed if the number of existing images plus the new ones is imagesNumber or less
    if (images.length + event.target.files.length <= imagesNumber) {
      const newImages = Array.from(event.target.files);
      const newImageUrls = newImages.map(file => URL.createObjectURL(file));

      setImages([...images, ...newImages]);
      setFilePreviews([...filePreviews, ...newImageUrls]);
    } else {
      alert(`You can only upload up to ${imagesNumber} images.`);
    }
  };

  const handleDeletePreview = (imageIndex) => {
    setImages(images.filter((_, index) => index !== imageIndex));
    setFilePreviews(filePreviews.filter((_, index) => index !== imageIndex));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/categories/');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validate();
    if (!isValid) {
      return;
    }

    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('starting_bid', values.starting_bid);
    formData.append('category', values.category);

    images.forEach((image) => {
      formData.append('photos', image);
    });

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auctions/', formData, {
        headers: {
          'Authorization': `Token ${token}`,
        },
      });
      console.log(response.data);
      navigate('/');
    } catch (error) {
      console.error('Error creating auction listing:', error.response.data);
    }
};

  return (
    <Container>
      <Form onSubmit={handleSubmit} style={{ border: '1px solid #ced4da', borderRadius: '0.25rem', marginTop: '2rem', padding: '1rem' }}>
        <Row>
          <Col md={6} style={{ borderRight: '1px solid #ced4da', paddingRight: '20px', marginBottom: '20px' }}>
            <FormGroup>
              <Label for="image">Upload Photo</Label>
              <div className="image-preview-container">
                {filePreviews.map((previewUrl, index) => (
                  <div key={index} className="image-preview" style={{ marginRight: '10px' }}>
                    <img src={previewUrl} alt={`Preview ${index}`} style={{ maxWidth: '100px', maxHeight: '100px' }} />
                    <Button onClick={() => handleDeletePreview(index)} style={{ display: 'block', margin: '10px 0' }}>Delete</Button>
                  </div>
                ))}
              </div>
              <Input
                type="file"
                name="image"
                id="image"
                onChange={handleImageChange}
                multiple
                className="choose-image-label"
              />
            </FormGroup>
          </Col>
          <Col md={6} style={{ paddingLeft: '20px' }}>
            <FormGroup>
              <Label for="title">Name *</Label>
              <Input
                type="text"
                name="title"
                id="title"
                value={values.title}
                onChange={handleChange}
                required
                invalid={!!errors.title}
              />
              {errors.title && <FormFeedback>{errors.title}</FormFeedback>}
            </FormGroup>

            <FormGroup>
              <Label for="description">Description</Label>
              <Input
                type="textarea"
                name="description"
                id="description"
                value={values.description}
                onChange={handleChange}
                required
                invalid={!!errors.description}
              />
              {errors.description && <FormFeedback>{errors.description}</FormFeedback>}
            </FormGroup>

            <FormGroup>
              <Label for="starting_bid">Price *</Label>
              <Input
                type="number"
                name="starting_bid"
                id="starting_bid"
                value={values.starting_bid}
                onChange={handleChange}
                required
                invalid={!!errors.starting_bid}
              />
              {errors.starting_bid && <FormFeedback>{errors.starting_bid}</FormFeedback>}
            </FormGroup>

            <FormGroup>
              <Label for="category">Category *</Label>
              <Input
                type="select"
                name="category"
                id="category"
                value={values.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a Category</option>
                {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.title}
                    </option>
                ))}
              </Input>
            </FormGroup>
            <Button type="submit" color="primary" className="create-lot-button">Create Lot</Button>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default AuctionListing;