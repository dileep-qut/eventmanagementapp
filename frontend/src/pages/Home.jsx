import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import EventCard from "../components/EventCard";
import {
  TextInput,
  Flex,
} from "@mantine/core";
import CircleWithIcon from "../components/CategoryIcon";
import axiosInstance from "../axiosConfig";


const categories = [
  { icon: "/assets/music-filter.svg", text: "Music" },
  { icon: "/assets/sms-tracking.svg", text: "Networking" },
  { icon: "/assets/global.svg", text: "Night Life" },
  { icon: "/assets/key.svg", text: "CyberSecurity" },
  { icon: "/assets/message-programming.svg", text: "Computer Science" },
  { icon: "/assets/lovely.svg", text: "Dating" },
];




export default function EventPage() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const [events, setEvents] = useState([]);
  let searchQuery= null

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
  const searchByName = async (query) => {
    try {
      const response = await axiosInstance.get(`/events?name=${query}`);
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }
  const searchByCategory = async (category) => {
    try {
      const response = await axiosInstance.get(`/events?category=${category}`);
      if (response.status === 200) {
        setEvents(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  }

  return (
    <div>
      <Flex justify="space-between" align="center" wrap="wrap" gap="md" mt={40}>
        {categories.map(({ icon, text }) => (
          <CircleWithIcon
            key={text}
            icon={icon}
            text={text}
            selected={selectedCategory === text}
            onClick={() => {
              const newCategory = selectedCategory === text ? '' : text;
              setSelectedCategory(newCategory);
              searchByCategory(newCategory);
            }}
          />
        ))}
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
          onChange={(e) => searchByName(e.currentTarget.value)}
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
        {events.map((event) => (
          <Link to={`/events/${event._id}`} style={{ textDecoration: 'none' }}>
            <EventCard key={event._id} event={event} />
          </Link>

        ))}
      </Flex>
    </div>
  );
}
