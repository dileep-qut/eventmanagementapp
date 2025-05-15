import React, { useState } from 'react';
import {
  Box,
  Paper,
  Stack,
  TextInput,
  Button,
  Title,
  Text,
  Alert
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { Link, useNavigate } from 'react-router-dom';

import axiosInstance from '../axiosConfig';

const Login = ({setToken}) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate(); 
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password } = formData;

    try {
      const response = await axiosInstance.post('/auth/login', {
        email,
        password,
      });
      console.log(response.data);

      const { token,id } = response.data;

      
      localStorage.setItem('jwt', token);
      localStorage.setItem('user_id',id );

      setToken(token)
      
      navigate('/');
    } catch (err) {
      console.log(err);
      
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box
      style={{
        minHeight: '100vh',
        backgroundColor: '#f3f3f3',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
      }}
    >
      <Paper
        radius="lg"
        shadow="md"
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%',
          maxWidth: '1200px',
          height: isMobile ? 'auto' : '500px',
          overflow: 'hidden',
        }}
      >
        
        
        <Box
          style={{
            width: isMobile ? '100%' : '50%',
            height: isMobile ? '200px' : '100%',
            backgroundImage: 'url(/image-3.png)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderTopLeftRadius: isMobile ? '12px' : '12px',
            borderTopRightRadius: isMobile ? '12px' : 0,
            borderBottomLeftRadius: isMobile ? 0 : '12px'
          }}
        />
        

        
        <Box
          style={{
            width: isMobile ? '100%' : '50%',
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: isMobile ? '12px' : 0,
            borderBottomRightRadius: '12px',
            borderTopRightRadius: isMobile ? 0 : '12px',
            padding: isMobile ? '2rem 1rem' : '0',
          }}
        >
          
          
          <Stack spacing="md" style={{ width: '80%', maxWidth: 400 }}>
            <Title  order={2} fw={700} ta="center"
            style={{
              fontSize:'2rem',paddingBottom:20
            }}>
              Welcome back to EventX
            </Title>
            <Text  size="sm" ta="center"
            style={{ color : 'grey'}}>
              Seamlessly Discover, Organize and Book your next Event
            </Text>
            

            
            <form onSubmit={handleLogin}>
              
            <TextInput
              label="Email"
              placeholder=" "
              withAsterisk
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              styles={{
                input: {
                  width: '100%',
                  height: '60px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  transition: 'border 0.3s',
                },
              }}
            />
            

            <TextInput
              label="Password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              withAsterisk
              name="password"
              type="password"
              styles={{
                input: {
                  width: '100%',
                  height: '60px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  transition: 'border 0.3s',
                },
            
              }}
            />

            <Button type="submit" loading={loading} style={{
                  marginTop: 30,
                  paddingTop: 10,
                  backgroundColor: '#6E58F6',
                  color: 'white',
                  width: '100%',
                  height: '50px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  transition: 'border 0.3s'}}>
              Login
            </Button>
            {error && <Alert color="red" mb="sm">{error}</Alert>}

            <Text size="sm" ta="center"
            style={{
              paddingTop:30
            }}>
              Don't have an account?{' '}
              <Text component={Link} to="/register" fw={500} color="violet">
                Register
              </Text>
            </Text>
            </form>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;
