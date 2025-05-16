import React, { useEffect, useState } from "react";
import { Text, Stack, Container, Loader } from "@mantine/core";
import axiosInstance from "../axiosConfig";
import AddEventModal from "../components/AddEvent";
import MyEventCard from "../components/MyEventCard";
import { saveAs } from "file-saver";

const MyEventsPage = () => {
  const handleEventDeleted = (deletedId) => {
    setMyEvents((events) => events.filter((e) => e._id !== deletedId));
  };


  const [myEvents, setMyEvents] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("jwt");

  const handleDownloadCSV = async (eventId) => {
  try {
    

    const response = await axiosInstance.get(`/report/${eventId}/attendees`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    saveAs(response.data, `attendees_${eventId}.csv`);
  } catch (err) {
    console.error("CSV Download Failed:", err);
  }
};


const handleDownloadPDF = async (eventId) => {
  try {
    

    const response = await axiosInstance.get(`/report/${eventId}/tickets`, {
      headers: { Authorization: `Bearer ${token}` },
      responseType: "blob",
    });

    saveAs(response.data, `revenue_${eventId}.pdf`);
  } catch (err) {
    console.error("PDF Download Failed:", err);
  }
};
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

          setError("You haven't hosted any events yet");

        } else {
          setMyEvents(response.data);
        }
      } catch (err) {

        setError("Failed to fetch events.");

        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEvents();
  }, []);

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
          if (myEvents.length === 0) {
            setMyEvents([newEvent])
          } else {
            setMyEvents((prev) => [newEvent, ...prev]);
          }
        }}
      />


      <Container size="xl" py="sm" style={{ backgroundColor: "transparent" }}>
        {loading ? (
          <div
            style={{
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Loader size="lg" />
          </div>
        ) : error ? (
          <div
            style={{
              height: '60vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
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
            {myEvents.map((event) => (
              <MyEventCard
                key={event._id}
                event={event}
                onEventDeleted={handleEventDeleted}
                onDownloadCSV={() => handleDownloadCSV(event._id)}
                onDownloadPDF={() => handleDownloadPDF(event._id)}
              />
            ))}
          </Stack>
        )}
      </Container>
    </div>
  );
};

export default MyEventsPage;
