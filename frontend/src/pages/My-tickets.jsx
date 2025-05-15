import React, { useEffect, useState } from 'react';
import { Container, Loader, Text, Stack } from '@mantine/core';
import TicketCard from '../components/Ticket-card';
import axiosInstance from '../axiosConfig'; // make sure this path is correct

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('jwt')
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axiosInstance.get('/api/ticket/find-my-tickets',{
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data);
        setTickets([ {
            event_id: {
              name: 'Networking Event',
              location: 'The STAR HOTEL, BRISBANE',
              start_time: '2025-05-21T10:00:00.000Z',
              end_time: '2025-05-21T12:00:00.000Z',
            },
          }])
        // if(response.data.length === 0){
        //     setError('You haven\'t purchased any tickets yet');
        // }else{
        //     setTickets(response.data); 
        // }
      } catch (err) {
        setError('Failed to fetch tickets.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <Container size="xl" py="sm" style={{ backgroundColor: 'transparent' }}>
      {loading ? (
        <Loader size="lg" />
      ) : error ? (
        <Text color="red">{error}</Text>
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
