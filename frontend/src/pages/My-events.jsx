import React, { useEffect, useState } from "react";
import { Text, Stack, Container, Loader } from "@mantine/core";
import axiosInstance from "../axiosConfig";
import AddEventModal from "../components/AddEvent";
import MyEventCard from "../components/MyEventCard";

const MyEventsPage = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt");

  // Defensive filter to ensure only valid events with _id get set
  const setFilteredEvents = (events) => {
    const filtered = (events || []).filter((event) => event && event._id);
    setMyEvents(filtered);
    if (filtered.length === 0) {
      setError("You haven't hosted any events yet");
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    const fetchMyEvents = async () => {
      try {
        const response = await axiosInstance.get("/events/my-events", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Filter out invalid events here
        setFilteredEvents(response.data);
        console.log("Fetched events:", response.data);
      } catch (err) {
        setError("Failed to fetch events.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, [token]);

  const handleEventDeleted = (deletedId) => {
    setMyEvents((events) => events.filter((e) => e && e._id !== deletedId));
  };

  return (
    <div style={{ padding: "40px" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "#13032C",
          borderRadius: "30px",
          padding: "50px 0",
          marginBottom: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "0.3s",
         
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
          // Defensive check before adding newEvent
          if (newEvent && newEvent._id) {
            setMyEvents((prev) => [newEvent, ...prev]);
            setError(null);
          } else {
            console.warn("Invalid event created:", newEvent);
          }
        }}
      />

      <Container size="xl" py="sm" style={{ backgroundColor: "transparent" }}>
        {loading ? (
          <div
            style={{
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div
            style={{
              height: "60vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text color="red" size="lg" fw={600}>
              {error}
            </Text>
          </div>
        ) : myEvents.length === 0 ? (
          <Text>No events created yet.</Text>
        ) : (
          <Stack>
            {myEvents
              .filter((event) => event && event._id) // Defensive filtering here
              .map((event) => (
                <MyEventCard
                  key={event._id}
                  event={event}
                  onEventDeleted={handleEventDeleted}
                  onEventUpdated={(updatedEvent) => {
                    // Defensive update check
                    if (!updatedEvent || !updatedEvent._id) {
                      console.warn("Invalid updated event:", updatedEvent);
                      return;
                    }
                    setMyEvents((prevEvents) =>
                      prevEvents.map((e) =>
                        e._id === updatedEvent._id ? updatedEvent : e
                      )
                    );
                  }}
                />
              ))}
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default MyEventsPage;