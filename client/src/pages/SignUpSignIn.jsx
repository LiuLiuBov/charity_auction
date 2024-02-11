import React, {useState} from 'react';
import { useForm } from '../hooks/useForm';
import { Container, Form, FormGroup, Label, Input, Button, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, FormFeedback } from 'reactstrap';
import axios from 'axios';
import {useAuth} from "../contexts/useAuth";
import {useNavigate} from "react-router-dom";

const SignUpSignIn = () => {
  const [activeTab, setActiveTab] = useState('1');
  const signUpForm = useForm({
    username: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const signInForm = useForm({
    email: '',
    password: '',
  });

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const toggleTab = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  };

  const handleSubmit = async (event, formType) => {
    event.preventDefault();

    if (formType === 'signUp' && !signUpForm.validate()) {
      return;
    }

    const endpoint = formType === 'signUp' ? 'http://127.0.0.1:8000/api/signup/' : 'http://127.0.0.1:8000/api/signin/';
    const formData = formType === 'signUp' ? signUpForm.values : signInForm.values;

    console.log("FormData: ", formData);

    try {
      const response = await axios.post(endpoint, formData);
      console.log(response.data);

      if (formType === 'signUp') {
        setActiveTab('2');    // automatically switch to the sign-in tab
        signUpForm.reset();
      } else {
        signIn({token: response.data.token}); // save the token after sign in
        navigate('/');
      }
    } catch (error) {
      if (error.response && error.response.data) {
        const errors = error.response.data;
        let message = '';
        if (errors.username) {
          message += errors.username.join(' ') + '\n';
        }
        if (errors.email) {
          message += errors.email.join(' ') + '\n';
        }
        alert(message);
      } else {
        console.error(error);
      }
    }
  };

  return (
    <Container>
      <Row className="justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <Col xs={12} sm={8} md={6} lg={4}>
          <Nav tabs className="mb-4">

          <NavItem>
            <NavLink onClick={() => { toggleTab('1'); }} active={activeTab === '1'}>
              Sign Up
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink onClick={() => { toggleTab('2'); }} active={activeTab === '2'}>
              Sign In
            </NavLink>
          </NavItem>

        </Nav>
          <TabContent activeTab={activeTab}>
            <TabPane tabId="1">

              <Form onSubmit={(e) => handleSubmit(e, 'signUp')}>
                <FormGroup>
                  <Label for="signUpName">Name</Label>
                  <Input
                    type="text"
                    name="username"
                    id="signUpName"
                    placeholder="Enter your name"
                    value={signUpForm.values.username}
                    onChange={signUpForm.handleChange}
                    invalid={!!signUpForm.errors.username}
                  />
                  {signUpForm.errors.username && <FormFeedback>{signUpForm.errors.username}</FormFeedback>}
                </FormGroup>

                <FormGroup>
                  <Label for="signUpEmail">Email</Label>
                  <Input
                      type="email"
                      name="email"
                      id="signUpEmail"
                      placeholder="Enter email"
                      value={signUpForm.values.email}
                      onChange={signUpForm.handleChange}
                      invalid={!!signUpForm.errors.email}
                  />
                  {signUpForm.errors.email && <FormFeedback>{signUpForm.errors.email}</FormFeedback>}
                </FormGroup>

                <FormGroup>
                  <Label for="signUpPassword">Password</Label>
                  <Input
                      type="password"
                      name="password"
                      id="signUpPassword"
                      placeholder="Enter password"
                      value={signUpForm.values.password}
                      onChange={signUpForm.handleChange}
                      invalid={!!signUpForm.errors.password}
                  />
                  {signUpForm.errors.password && <FormFeedback>{signUpForm.errors.password}</FormFeedback>}
                </FormGroup>

                <FormGroup>
                  <Label for="signUpRepeatPassword">Repeat password</Label>
                  <Input
                      type="password"
                      name="repeatPassword"
                      id="signUpRepeatPassword"
                      placeholder="Repeat password"
                      value={signUpForm.values.repeatPassword}
                      onChange={signUpForm.handleChange}
                      invalid={!!signUpForm.errors.repeatPassword}
                  />
                  {signUpForm.errors.repeatPassword && <FormFeedback>{signUpForm.errors.repeatPassword}</FormFeedback>}
                </FormGroup>

                <Button type="submit" className="w-100">Sign Up</Button>
              </Form>
            </TabPane>

            <TabPane tabId="2">
            <Form onSubmit={(e) => handleSubmit(e, 'signIn')}>
              <FormGroup>
                <Label for="signInEmail">Email</Label>
                <Input
                    type="email"
                    name="email"
                    id="signInEmail"
                    placeholder="Enter email"
                    value={signInForm.values.email}
                    onChange={signInForm.handleChange}
                />
              </FormGroup>

              <FormGroup>
                <Label for="signInPassword">Password</Label>
                <Input
                    type="password"
                    name="password"
                    id="signInPassword"
                    placeholder="Enter password"
                    value={signInForm.values.password}
                    onChange={signInForm.handleChange}
                />
              </FormGroup>
              <Button type="submit" className="w-100">Sign In</Button>
            </Form>
          </TabPane>

          </TabContent>
        </Col>
      </Row>
    </Container>
  );
};

export default SignUpSignIn;
