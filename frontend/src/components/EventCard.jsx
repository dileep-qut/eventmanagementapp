
import { baseURL } from '../config';
import {
  Text,
  Stack,
  Card,
  Group,
  Box,
  Image,
  Badge
} from "@mantine/core";


export default function EventCard({ event }) {
    return (
      <Card
  shadow="sm"
  padding="md"
  radius="xl"
  withBorder
  style={{
    width: 400,
    height: 320,
    display: "flex",
    flexDirection: "column",
    margin: 20,
  }}
>
  
  <Box style={{ position: "relative", height: 200 }}>
    <Image
      src={`${baseURL}${event.image_url}` || "/default-event.jpg"}
      radius="md"
      alt={event.name}
      style={{
        objectFit: "cover",
        width: "100%",
        height: "100%",
        borderRadius: "20px",
      }}
    />
    <Badge
      color="dark"
      variant="filled"
      style={{
        position: "absolute",
        top: 10,
        left: 10,
        borderRadius: "999px",
        backgroundColor: "white",
        color: "black",
        fontWeight: 600,
        padding: "5px 10px",
      }}
    >
      ${event.ticket_price}
    </Badge>
  </Box>

  
  <Group mt="md" spacing="xs" align="flex-start">
    <Stack spacing={0} align="center" w={50}>
      <Text size="xs" c="blue" fw={700}>
        {new Date(event.start_time)
          .toLocaleString("default", { month: "short" })
          .toUpperCase()}
      </Text>
      <Text size="lg" fw={700}>
        {new Date(event.start_time).getDate()}
      </Text>
    </Stack>

    <Stack spacing={2} style={{ flex: 1 }}>
      <Text fw={700} size="md" lineClamp={2}>
        {event.name}
      </Text>
      <Text size="sm" c="gray" lineClamp={1}>
        {event.location}
      </Text>
    </Stack>
  </Group>
</Card>
    );
  }