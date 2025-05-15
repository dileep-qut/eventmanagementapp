import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import { useMediaQuery } from '@mantine/hooks';
import React from 'react';
import {
  TextInput,
  Button,
  Title,
  Text,
  Box,
  Paper,
  Stack,
} from '@mantine/core';
import { Link } from 'react-router-dom';

const Register = () => {
  const [formData,setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
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
            backgroundImage: 'url(/image-4.png)',
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
            <Title order={2} fw={700} ta="center" style={{
              fontSize:'2rem',paddingBottom:20
            }}>
              EventX
            </Title>
            <Text  size="sm" ta="center"
            style={{ color : 'grey'}}>
              Together make events memorable!
            </Text>
            <form onSubmit={handleSubmit}>
            <TextInput
              label="Name"
              name="name"
              placeholder=" "
              withAsterisk
              value={formData.name}
              onChange={handleChange}
              styles={{
                input: {
                  paddingTop: 20,
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
              label="Email"
              placeholder=" "
              name="email"
              withAsterisk
              value={formData.email}
              onChange={handleChange}
              styles={{
                input: {
                  paddingTop: 20,
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
              name="password"
              withAsterisk
              value={formData.password}
              onChange={handleChange}
              type="password"
              styles={{
                input: {
                  paddingTop: 20,
                  width: '100%',
                  height: '60px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  transition: 'border 0.3s',
                },
            
              }}
            />

            <Button type="submit" style={{
                  marginTop: 30,
                  paddingTop: 10,
                  paddingLeft: 12,
                  backgroundColor: '#6E58F6',
                  color: 'white',
                  width: '100%',
                  height: '50px',
                  padding: '10px',
                  border: '1px solid #ccc',
                  borderRadius: '10px',
                  transition: 'border 0.3s'}}>
              Create Account
            </Button>

            <Text size="sm" ta="center"
            style={{
              paddingTop:20
            }}>
              Already have an account?{' '}
              <Text component={Link} to="/login" fw={500} color="violet">
                Login
              </Text>
            </Text>
            </form>
          </Stack>
        </Box>
       
      </Paper>
      
    </Box>
  );
};

export default Register;
