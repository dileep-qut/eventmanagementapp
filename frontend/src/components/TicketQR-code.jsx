import {
    Modal,
    Image,
    Text,
    Title,
    Button,
    Stack,
    Group,
} from '@mantine/core';


// Expects [ticket] in the format 
/* {
    "_id": "682345d4c36f1bd8acc37ac0",
    "event_id": {
      "_id": "68218e24f41de91e2e46ed0a",
      "name": "Event 1",
      "description": "Description 1",
      "location": "Location 1",
      "start_time": "2026-01-24T14:00:00.000Z",
      "end_time": "2026-01-25T14:00:00.000Z"
    },
    "checked_in": false,
    "transaction_id": "dummy_transaction_id"
  }
}*/
export default function TicketQRCode({ opened, onClose, ticket }) {
    if (!ticket) return null;
    const event = ticket?.event_id;

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            withCloseButton={false}
            centered
            size="sm"
            radius="xl"
            styles={{
                body: { padding: '24px' },
                content: { borderRadius: '24px', textAlign: 'center' },
            }}
        >


            {/* Close Button Top Right */}
            <Group justify="flex-end" style={{ padding: '8px' }}>
                <Image src='/assets/close-circle.svg'
                    style={{ cursor: 'pointer', width: 30, height: 30 }}
                    onClick={onClose}
                />
            </Group>

            <Stack align="center" spacing="md">
                {/* QR Code */}
                <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${ticket._id}`}
                    width={150}
                    alt="QR Code"
                />

                {/* Event Title */}
                <Title order={3} fw={700}>
                    {event?.name}
                </Title>

                <Text size="sm">
                    {new Date(event?.start_time).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}{' '}
                    {new Date(event?.start_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                    {' – '}
                    {new Date(event?.end_time).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                    })}{' '}
                    {new Date(event?.end_time).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                    })}
                </Text>



                {/* Location */}
                <Group spacing="xs" position="center">
                    <img src="/assets/location-grey.svg" style={{ width: 18 }} />
                    <Text size="xs" fw={700} c="dimmed">
                        {event?.location?.toUpperCase()}
                    </Text>
                </Group>

                {/* Download Button */}
                <Button
                    variant="outline"
                    radius="md"
                    fullWidth
                    onClick={() => {
                        const link = document.createElement('a');
                        link.href =
                            'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Ticket123';
                        link.download = 'ticket-qr.png';
                        link.click();
                    }}
                >
                    DOWNLOAD
                </Button>
            </Stack>
        </Modal>
    );
}
