import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Footer from '../widgets/layout/footer'; 
import styled from "styled-components";


const Container = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: white;
`;

const LoginSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: white;
`;

const ImageSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
`;

const Image = styled.img`
  width: 80%;
  height: auto;
  border-radius: 12px;
  object-fit: cover;
`;

const LoginBox = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0px 10px 30px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  text-align: center;
`;

const Heading = styled.h2`
  color: #000;
  font-size: 24px;
  margin-bottom: 10px;
`;

const SubHeading = styled.p`
  color: #666;
  margin-bottom: 30px;
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 14px;
  margin: 10px 0 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s;

  &:focus {
    border-color: #000;
    outline: none;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 14px;
  background: #000;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background: #333;
  }
`;

const LinkText = styled.p`
  color: #666;
  font-size: 14px;
  margin-top: 20px;

  a {
    color: #000;
    text-decoration: none;
    font-weight: bold;
  }
`;

const SignIn = () => {
  const uname = useRef();
  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = uname.current.value;

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Login successful');
        Cookies.set('hospital', data.name);
        Cookies.set('nin', username);
        navigate('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <section>
      <Container>
      <LoginSection>
        <LoginBox>
          <Heading>Sign In</Heading>
          <SubHeading>Enter your Hospital ID/NIN number to Sign In.</SubHeading>
          <label htmlFor="uname">Hospital ID/NIN Number</label>
          <Input
            ref={uname}
            type="text"
            name="uname"
            id="uname"
            placeholder="Enter hospital ID/NIN number"
          />
          <Button onClick={handleLogin}>Sign In</Button>
         
        </LoginBox>
      </LoginSection>
      <ImageSection>
        <Image src="/img/login_img.png" alt="Healthcare illustration" />
      </ImageSection>
    </Container>
    <Footer></Footer>
    </section>
  );
};

export default SignIn;