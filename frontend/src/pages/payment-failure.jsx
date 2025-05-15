import { Container, Title, Text, Button, Image, Stack, Card } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export default function PaymentFailurePage() {
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
            src="assets/cancel.png"
            alt="Cancelled"
            style={{ width: '100px', height: '100px' }}
          />

          <Title order={2} fw={700}>
            Payment Cancelled
          </Title>

          <Text c="dimmed" size="md">
            Your payment was not completed. If this was a mistake, you can try again or contact support.
          </Text>

          <Button
            variant="outline"
            color="red"
            radius="md"
            size="md"
            onClick={() => navigate('/')}
          >
            Return to Home
          </Button>
        </Stack>
      </Card>
    </Container>
  );
}
