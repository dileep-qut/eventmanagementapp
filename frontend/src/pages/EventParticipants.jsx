import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Text, Loader, SimpleGrid, Paper, Stack } from "@mantine/core";
import axiosInstance from "../axiosConfig";
import MyEventCard from "../components/MyEventCard"; 


export default function EventParticipantsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("jwt");
  

useEffect(() => {
  const fetchEventAndParticipants = async () => {
    try {
      

      const [eventRes, participantsRes] = await Promise.all([
        axiosInstance.get(`/events/${eventId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        axiosInstance.get(`/events/${eventId}/attendees`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      setEvent(eventRes.data);
      setParticipants(participantsRes.data);
    } catch (err) {
      setError("Failed to load event or participants.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  fetchEventAndParticipants();
}, [eventId]);

  if (loading) return <Loader />;
  if (error) return <Text color="red">{error}</Text>;

  return (
    <Container size="md" py="md">
      <MyEventCard event={event} />

      <Text fw={700} size="lg" mt="xl" mb="sm">
        Participants
      </Text>

      {participants.length === 0 ? (
        <Text color="dimmed">No participants have registered yet.</Text>
      ) : (
        <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
          {participants.map((user) => (
            <Paper key={user._id} withBorder p="md" radius="md" shadow="xs">
              <Stack spacing={4}>
                <Text fw={600}>{user.name}</Text>
                <Text size="sm" color="dimmed">{user.email}</Text>
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
}