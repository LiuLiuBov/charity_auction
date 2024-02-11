import React, {useState} from 'react';
import { useForm } from '../hooks/useForm';
import { Container, Form, FormGroup, Label, Input, Button, Nav, NavItem, NavLink, TabContent, TabPane, Row, Col, FormFeedback } from 'reactstrap';
import axios from 'axios';

const SignUpSignIn = () => {
  const [activeTab, setActiveTab] = useState('1');
  const signUpForm = useForm({
    name: '',
    email: '',
    password: '',
    repeatPassword: '',
  });
  const signInForm = useForm({
    email: '',
    password: '',
  });

  const toggleTab = tab => {
    if(activeTab !== tab) setActiveTab(tab);
  };

  // TODO: connect with backend
  const handleSubmit = async (event, formType) => {
    event.preventDefault();
    if (formType === 'signUp' && !signUpForm.validate()) {
      return;
    }

    const endpoint = formType === 'signUp' ? '/api/signup' : '/api/signin';
    const formData = formType === 'signUp' ? signUpForm.values : signInForm.values;

    try {
      const response = await axios.post(endpoint, formData);
      console.log(response.data);
      // Handle success
    } catch (error) {
      console.error(error);
      // Handle error
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
                    name="name"
                    id="signUpName"
                    placeholder="Enter your name"
                    onChange={signUpForm.handleChange}
                    invalid={!!signUpForm.errors.name}
                  />
                  {signUpForm.errors.name && <FormFeedback>{signUpForm.errors.name}</FormFeedback>}
                </FormGroup>

                <FormGroup>
                  <Label for="signUpEmail">Email</Label>
                  <Input
                      type="email"
                      name="email"
                      id="signUpEmail"
                      placeholder="Enter email"
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
