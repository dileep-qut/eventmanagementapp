import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
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
  
  const navigate = useNavigate();
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

if (loading) {
  return (
    <Container size="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Loader size="lg" />
    </Container>
  );
}
if (error) {
  return (
    <Container size="md" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
      <Text color="red" size="lg" fw={600}>
        {error}
      </Text>
    </Container>
  );
}


  return (
    <Container size="md" py="md">
      <MyEventCard event={event}  onEventDeleted={(event) => {
          navigate(-1)
        }}/>

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