
import React from 'react';
import {
    Card,
    Image,
    Text,
    Button,
    Flex,
    Stack,
    Title
} from '@mantine/core';

import { useMediaQuery } from '@mantine/hooks';

const TicketCard = ({ ticket }) => {
    const event = ticket.event_id;
    const isLargeScreen = useMediaQuery('(min-width: 768px)');

    return (<Card
        shadow="md"
        radius="xl"
        p="md"
        withBorder
        style={{ height: 'auto' }}
    >
        <Flex
            direction={{ base: 'column', sm: 'row' }}
            align={{ base: 'flex-start', sm: 'center' }}
            justify="space-between"
            gap="md"
        >
            {/* Image and Text */}
            <Flex
                direction={{ base: 'column', sm: 'row' }}
                align="flex-start"
                gap="md"
                style={{ flex: 1, }}
            >
                <div style={{ maxWidth: isLargeScreen ? '30%' : '100%' }}>
                    <Image
                        src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=900&auto=format&fit=crop&q=60"
                        styles={{
                            objectFit: 'cover',
                            maxWidth: '20%',
                            height: '150px',

                        }}
                        radius="md"
                    />
                </div>
                <Stack spacing={4}>
                    <Title fw={700} size="md" style={{ fontSize: 20 }}>
                       {event.name}
                    </Title>
                    <Text size="sm">{new Date(event.start_time).toLocaleString()} - {new Date(event.end_time).toLocaleString()}</Text>
                    <Flex align="center" gap={6}>
                        <img
                            src="/assets/location-grey.svg"
                            style={{ width: 18, height: 18 }}
                        />
                        <Text size="xs" fw={700} c="dimmed">
                        {event.location}
                        </Text>
                    </Flex>
                </Stack>
            </Flex>

            {/* Buttons */}
            <Stack
                spacing="xs"
                mt={{ base: 'sm', sm: 0 }}
                align={{ base: 'stretch', sm: 'flex-end' }}
                w={{ base: '100%', sm: 'auto' }}
            >
                <Button
                    color="violet"
                    radius="md"
                    size="sm"
                    fullWidth={true}
                    styles={{
                        root: {
                            width: '100%',
                            '@media (min-width: 768px)': {
                                width: 'fit-content',
                            },
                        },
                    }}
                >
                    View Ticket
                </Button>
                <Button
                    color="red"
                    radius="md"
                    size="sm"
                    variant="outline"
                    fullWidth={true}
                    styles={{
                        root: {
                            width: '100%',
                            '@media (min-width: 768px)': {
                                width: 'fit-content',
                            },
                        },
                    }}
                >
                    Remove
                </Button>
            </Stack>
        </Flex>
    </Card>
    );
}

export default TicketCard;