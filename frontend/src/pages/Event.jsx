import React, { useState, useEffect } from 'react';
import { Flex, Text, Title, Paper, Button, Stack } from "@mantine/core";
import { useParams } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import dayjs from 'dayjs';

export default function EventPage() {
  const { eventId } = useParams();
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);

 const token = localStorage.getItem('jwt')

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosInstance.get(`/api/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setEventDetails(response.data);
        } else {
          console.log('Error:', response.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, token]);

  if (loading) return <Text>Loading event details...</Text>;
  if (!eventDetails) return <Text>Error loading event details.</Text>;

  const { name, description, start_time, end_time, location, image, creator } = eventDetails;

  const start = dayjs(start_time);
  const end = dayjs(end_time);

  const sameDay = start.isSame(end, 'day');

  const formattedTime = sameDay
    ? `${start.format('h:mm A')} - ${end.format('h:mm A')}`
    : `${start.format('D MMM YYYY, h:mm A')} - ${end.format('D MMM YYYY, h:mm A')}`;


  return (
    <div>
      <div style={{ paddingLeft: '20px', paddingRight: '20px' }}>
        <div style={{ marginTop: 30 }} />

        {image && (
          <img
            src={image}
            alt="Event Banner"
            style={{
              width: '100%',
              height: '500px',
              objectFit: 'cover',
              borderRadius: '8px',
              marginBottom: 20
            }}
          />
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack spacing={4}>
            <Text size="sm" style={{ fontSize: 15 }}>
              On {start.format('dddd, MMM YYYY')}
            </Text>
            <Title order={2} fw={700} style={{ fontSize: 25 }} mb={0}>
              {name}
            </Title>
          </Stack>
          <div style={{ marginTop: 100 }} />

          <Button
            style={{
              backgroundColor: "#28A745",
              color: "#fff",
              borderRadius: 5,
              padding: "10px 20px"
            }}
            radius="md"
          >
            Get Tickets
          </Button>
        </div>

        <Text color="dimmed" mb={20} style={{ fontSize: 15 }}>{description}</Text>

        <div style={{ marginTop: 30 }} />

        <Flex
          justify="space-between"
          align="center"
          wrap="wrap" // Optional: wraps items on smaller screens
          gap="md"    // Optional: adds spacing between items
          mt={30}     // Optional: adds top margin
        >
          <CircleWithIcon icon="/assets/calender.svg" text={start.format('dddd, MMM YYYY')} />
          <CircleWithIcon icon="/assets/clock.svg" text={formattedTime} />
          <CircleWithIcon icon="/assets/location.svg" text={location || 'TBA'} />
        </Flex>

        <div style={{ marginTop: 30 }} />

        <Paper shadow="none" p="md" mb={20}>
          <Title order={2} fw={400} style={{ fontSize: 25 }} mb={10}>Organised By</Title>
          <div style={{ marginTop: 10 }} />
          <Paper
            p="sm"
            radius="md"
            style={{
              backgroundColor: "#E5E5E5",
              display: "inline-flex", // use inline-flex to adjust based on content
              minWidth: "50%", // set the minimum width
              paddingLeft: 15,
              paddingRight: 15, // optional, if you want to add padding on the right side
            }}
          >
            <div style={{ paddingLeft: 20 }}>
              <Text color="black" fw={500}>{creator.name}</Text>
              <Text color="black" fw={200}>{creator.email}</Text>
            </div>
          </Paper>

        </Paper>
      </div>
    </div>
  );
}

function CircleWithIcon({ icon, text }) {
  return (
    <Stack align="center" spacing="xs" style={{ flex: 1, textAlign: 'center' }}>
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: '50%',
          border: '1px solid #ACAEAF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img src={icon} alt="Icon" style={{ width: 30, height: 30 }} />
      </div>
      <Text size="lg" color="dimmed">{text}</Text>
    </Stack>
  );
}
