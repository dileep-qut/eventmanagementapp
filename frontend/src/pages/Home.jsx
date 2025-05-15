import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import {
  TextInput,
  Flex,
  Text,
  Stack,
  Card,
  Group,
  Box,
  Image,
  Badge
} from "@mantine/core";
import axiosInstance from "../axiosConfig";
import { useMediaQuery } from "@mantine/hooks";

function EventCard({ event }) {
    return (
      <Card
        shadow="sm"
        padding="md"
        radius="xl"
        withBorder
        style={{
          width: 450, // uniform width
          height: 320, // uniform height
          display: "flex",
          margin:20,
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box style={{ position: "relative" }}>
          <Image
            src={event.imageUrl || "/default-event.jpg"} // fallback image
            height={160}
            radius="md"
            alt={event.name}
            style={{ objectFit: "cover" }}
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
              {new Date(event.start_time).toLocaleString("default", { month: "short" }).toUpperCase()}
            </Text>
            <Text size="lg" fw={700}>
              {new Date(event.start_time).getDate()}
            </Text>
          </Stack>
  
          <Stack spacing={2}>
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

function CircleWithIcon({ icon, text }) {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const circleSize = isMobile ? 50 : 90;
  const iconSize = isMobile ? 20 : 30;
  return (
    <Stack
      align="center"
      spacing="xs"
      style={{ flex: "1 0 auto", textAlign: "center" }}
    >
      <div
        style={{
          width: circleSize,
          height: circleSize,
          borderRadius: "50%",
          border: "1px solid #ACAEAF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={icon}
          alt="Icon"
          style={{ width: iconSize, height: iconSize }}
        />
      </div>
      <Text size="sm" fw={500} ta="center">
        {text}
      </Text>
    </Stack>
  );
}

export default function EventPage() {
    const [events, setEvents] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchEvents = async () => {
          try {
            const response = await axiosInstance.get("/events");
            if (response.status === 200) {
              setEvents(response.data);
            }
          } catch (err) {
            console.error("Failed to fetch events:", err);
          }
        };
      
        fetchEvents();
      }, []);

      const filteredEvents = searchQuery.trim()
  ? events.filter((event) =>
      event.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.category.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : events;

  return (
    <div>
      <Flex
        justify="space-between"
        align="center"
        wrap="wrap" 
        gap="md"
        mt={40}
      >
        <CircleWithIcon icon="/assets/music-filter.svg" text={"Music"} />
        <CircleWithIcon icon="/assets/sms-tracking.svg" text={"Networking"} />
        <CircleWithIcon icon="/assets/global.svg" text={"Night Life"} />
        <CircleWithIcon icon="/assets/key.svg" text={"Cyber"} />
        <CircleWithIcon
          icon="/assets/message-programming.svg"
          text={"Coding"}
        />
        <CircleWithIcon icon="/assets/lovely.svg" text={"Dating"} />
        {/* <CircleWithIcon icon="/assets/harmony-(one).svg" text={"Hobbies"} /> */}
      </Flex>

      <div
        style={{
          backgroundColor: "#0E0622",
          padding: "40px",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          maxWidth: "75%",
          margin: "50px auto",
        }}
      >
        <TextInput
          placeholder="Looking for"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.currentTarget.value)}
          radius="xl"
          size="lg"
          styles={{
            input: {
              backgroundColor: "#0E0622",
              color: "white",
              border: "none",
              height: "50%",
              borderRadius: "0px",
              borderBottom: "1px solid white",
            },
          }}
          rightSection={
            <img
              src="/assets/search-normal.svg"
              alt="Search"
              style={{ width: 30, height: 30, marginRight: 0 }}
            />
          }
          w="100%"
        />
      </div>
      <Flex wrap="wrap" gap="lg" justify="center" mt="lg">
  {filteredEvents.map((event) => (
    <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
    <EventCard key={event._id} event={event} />
  </Link>
    
  ))}
</Flex>
    </div>
  );
}
