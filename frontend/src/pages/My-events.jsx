import React, { useEffect, useState } from "react";
import {
  Card,
  Text,
  Stack,
  Container,
  Flex,
  Box,
  Image,
  Badge,
  Button,
  Loader,
} from "@mantine/core";
import { useMediaQuery } from '@mantine/hooks';
import axiosInstance from "../axiosConfig";
import { baseURL } from "../config";
import AddEventModal from "../components/AddEvent";

const MyEventCard = ({ event }) => {
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="xl"
      withBorder
      style={{ width: "100%", maxWidth: "85%", margin: "0 auto 30px auto" }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap="md"
        direction={{ base: "column", sm: "row" }}
      >
        {/* Image Left */}
        <Box
          style={{
            flex: "0 0 130px",
            height: 100,
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            minWidth: 130,
          }}
        >
          <Image
            src={`${baseURL}${event.image_url}`}
            alt={event.name}
            layout="fill"
            objectFit="cover"
            style={{ borderRadius: 8 }}
          />
        </Box>

        {/* Event Details Center */}
        <Box style={{ flex: "1 1 auto", marginLeft: isLargeScreen ? 20 : 0, minWidth: 0 }}>
          <Stack spacing={5} style={{ overflow: "hidden" }}>
            <Text fw={700} truncate size="lg">
              {event.name}
            </Text>
            <Text size="sm" truncate>
              {new Date(event.start_time).toLocaleDateString()} —{" "}
              {new Date(event.start_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              to{" "}
              {new Date(event.end_time).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <Text size="sm" c="dimmed" truncate>
              {event.location}
            </Text>
          </Stack>
        </Box>

        {/* Buttons Right */}
        <Stack
          spacing="xs"
          align={isLargeScreen ? "flex-end" : "stretch"}
          mt={isLargeScreen ? 0 : "sm"}
          style={{ flex: "0 0 auto", marginLeft: isLargeScreen ? 20 : 0, width: isLargeScreen ? "auto" : "100%" }}
        >
          <Badge
            color="green"
            variant="light"
            size="lg"
            style={{ minWidth: 70, textAlign: "center" }}
          >
            ${event.ticket_price}
          </Badge>
          <Button
            color="violet"
            size="sm"
            fullWidth={!isLargeScreen}
            styles={{
              root: {
                width: "100%",
                "@media (min-width: 768px)": {
                  width: "fit-content",
                },
              },
            }}
          >
            View Participants
          </Button>
          <Button
            color="red"
            variant="outline"
            size="sm"
            fullWidth={!isLargeScreen}
            styles={{
              root: {
                width: "100%",
                "@media (min-width: 768px)": {
                  width: "fit-content",
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
};

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt");
  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axiosInstance.get("/events/my-events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);

        if (response.data.length === 0) {
          setError("You haven't purchased any tickets yet");
        } else {
          setMyEvents(response.data);
        }
      } catch (err) {
        setError("Failed to fetch tickets.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

  return (
    <div style={{ padding: "40px" }}>
      {/* Big Add Events Bar */}
      <div
        style={{
          width: "100%",
          backgroundColor: "#13032C", // deep purple
          borderRadius: "30px",
          padding: "50px 0",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.3s",
          hover: {
            backgroundColor: "#1E1E2F",
          },
        }}
        onClick={() => setAddModalOpen(true)}
      >
        <img
          src="/assets/wallet-add.svg"
          alt="Add"
          style={{ width: 40, height: 40, marginBottom: 10 }}
        />
        <Text size="xl" fw={700} c="white">
          Add Events
        </Text>
      </div>
      <AddEventModal
        opened={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onEventCreated={(newEvent) => {
          setMyEvents((prev) => [newEvent, ...prev]);
        }}
      />

      {/* Events List */}
      <Container size="xl" py="sm" style={{ backgroundColor: "transparent" }}>
        {loading ? (
          <Loader size="lg" />
        ) : error ? (
          <Text color="red">{error}</Text>
        ) : myEvents.length === 0 ? (
          <Text>No events created yet.</Text>
        ) : (
          <Stack>
            {myEvents.map((event) => (
              <MyEventCard key={event._id} event={event} />
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default MyEventsPage;
