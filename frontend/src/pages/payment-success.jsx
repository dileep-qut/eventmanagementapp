import { Container, Title, Text, Button, Image, Stack, Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <Container size="sm" pt="xl" style={{ textAlign: 'center' }}>
      <Card
        shadow="md"
        padding="xl"
        radius="lg"
        withBorder
        style={{ maxWidth: 500, margin: '0 auto' }}
      >
        <Stack spacing="lg" align="center">
          <Image
            src="assets/checked.png"
            alt="Success"
            style={{ width: '100px', height: '100px' }}
          />

          <Title order={2} fw={700}>
            Payment Successful
          </Title>

          <Text c="dimmed" size="md">
            Thank you! Your payment has been processed successfully. You can view the tickets here
          </Text>

          <Button
            variant="filled"
            color="green"
            radius="md"
            size="md"
            onClick={() => navigate('/mytickets')}
          >
            Go to Tickets
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
