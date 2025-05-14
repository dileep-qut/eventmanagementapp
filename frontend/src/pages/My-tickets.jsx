import React from 'react';
import {
    Container,    
} from '@mantine/core';

import TicketCard from  '../components/Ticket-card'


export default function MyTickets() {
    return (
        <Container size="xl" py="sm" style={{ backgroundColor: 'transparent' }}>
            <TicketCard/>
        </Container>
    );
}
