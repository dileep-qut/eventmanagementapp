import React, { useEffect, useState } from 'react';
import { Container, Loader, Text, Stack,Flex } from '@mantine/core';
import TicketCard from '../components/Ticket-card';
import axiosInstance from '../axiosConfig'; // make sure this path is correct
import { showNotification } from '@mantine/notifications';

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwt')

  
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/ticket/find-my-tickets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);

        if (response.data.length === 0) {
          setError('You haven\'t purchased any tickets yet');
        } else {
          setTickets(response.data);
        }
      } catch (err) {
        setError('Failed to fetch tickets.');
        console.error(err);
        showNotification({
          title: 'Error',
          message: err?.response?.data?.message || err.message || 'Something went wrong',
          autoClose: 3000,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  if (!token) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '80vh', width: '100%' }}
      >
        <Text color="red" size="lg">Please login to view the event</Text>
      </Flex>
    );
  }
  return (
    <Container size="xl" py="sm" style={{ backgroundColor: 'transparent' }}>
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            width: '100%',
          }}
        >
          <Loader size="lg" />
        </div>
      ) : error ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '80vh',
            width: '100%',
          }}
        >
          <Text color="red" size="lg" align="center">
            {error}
          </Text>
        </div>
      ) : tickets.length === 0 ? (
        <Text>No tickets found.</Text>
      ) : (
        <Stack>
          {tickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </Stack>
      )}
    </Container>
  );
}  