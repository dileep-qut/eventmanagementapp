import React, { useState } from "react";
import EditEventModal from "./EditEvent";
import {
  Card,
  Text,
  Stack,
  Flex,
  Box,
  Image,
  Badge,
  Button,
  Loader,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import axiosInstance from "../axiosConfig";
import { baseURL } from "../config";
import { useNavigate } from "react-router-dom";
import { showNotification } from "@mantine/notifications";

const MyEventCard = ({
  event,
  onEventDeleted,
  onEventUpdated,
}) => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [downloading, setDownloading] = useState({ csv: false, pdf: false });
  const isLargeScreen = useMediaQuery("(min-width: 768px)");

  const token = localStorage.getItem("jwt");

  const handleViewParticipants = () => {
    navigate(`/events/${event._id}/attendees`);
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    setDeleting(true);
    try {
      await axiosInstance.delete(`/events/${event._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onEventDeleted(event._id);
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event. Please try again.");
    } finally {
      setDeleting(false);
    }
  };

  const handleDownloadCSV = async () => {
    setDownloading((prev) => ({ ...prev, csv: true }));
    try {
      const res = await axiosInstance.get(`/report/${event._id}/attendees`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url, '_blank');
      showNotification({
        title: 'Success',
        message: 'CSV file downloaded',
        autoClose: 3000,
        color: 'green',
      });
    } catch (err) {
      console.error("CSV download failed", err);
      showNotification({
        title: 'Error',
        message: "Failed to download attendees list",
        autoClose: 3000,
        color: 'green',
      });
    } finally {
      setDownloading((prev) => ({ ...prev, csv: false }));
    }
  };

  const handleDownloadPDF = async () => {
    setDownloading((prev) => ({ ...prev, pdf: true }));
    try {
      const res = await axiosInstance.get(`/report/${event._id}/revenue`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });
      const url = URL.createObjectURL(res.data);
      window.open(url, '_blank');
    } catch (err) {
      console.error("PDF download failed", err);
      showNotification({
        title: 'Error',
        message: "Failed to download revenue report",
        autoClose: 3000,
        color: 'green',
      });
    } finally {
      setDownloading((prev) => ({ ...prev, pdf: false }));
    }
  };

  return (
    <Card
      shadow="sm"
      padding="md"
      radius="xl"
      withBorder
      style={{ width: "100%", maxWidth: "85%", margin: "auto auto 30px auto" }}
    >
      <Flex
        align="center"
        justify="space-between"
        gap="md"
        direction={{ base: "column", sm: "row" }}
      >
        <Box
          style={{
            flex: "0 0 130px",
            height: 200,
            position: "relative",
            borderRadius: 8,
            overflow: "hidden",
            minWidth: 250,
          }}
        >
          <Image
            src={`${baseURL}${event.image_url}`}
            alt={event.name}
            layout="fill"
            style={{ borderRadius: 8, objectFit: "cover" }}
          />
        </Box>

        <Box
          style={{
            flex: "1 1 auto",
            marginLeft: isLargeScreen ? 20 : 0,
            minWidth: 0,
          }}
        >
          <Stack spacing={5} style={{ overflow: "hidden" }}>
            <Text fw={700} truncate size="lg">
              {event.name}
            </Text>
            <Text size="sm">
              {new Date(event.start_time).toLocaleString('en-AU', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}{' '}
              -{' '}
              {new Date(event.end_time).toLocaleString('en-AU', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              })}
            </Text>
            <Text size="sm" c="dimmed" truncate>
              {event.location}
            </Text>
          </Stack>
        </Box>

        <Stack
          spacing="xs"
          align={isLargeScreen ? "flex-end" : "stretch"}
          mt={isLargeScreen ? 0 : "sm"}
          style={{
            flex: "0 0 auto",
            marginLeft: isLargeScreen ? 20 : 0,
            width: isLargeScreen ? "auto" : "100%",
          }}
        >
          <Badge
            color="green"
            variant="light"
            size="lg"
            style={{ minWidth: 70, textAlign: "center" }}
          >
            ${event.ticket_price}
          </Badge>

          <Button color="violet" size="sm" onClick={handleViewParticipants}>
            View Participants
          </Button>

          <Button
            variant="light"
            size="xs"
            color="blue"
            onClick={handleDownloadCSV}
            disabled={downloading.csv}
          >
            {downloading.csv ? <Loader size="xs" /> : "Download Attendees CSV"}
          </Button>

          <Button
            variant="light"
            size="xs"
            color="orange"
            onClick={handleDownloadPDF}
            disabled={downloading.pdf}
          >
            {downloading.pdf ? <Loader size="xs" /> : "Download Revenue PDF"}
          </Button>
          <Button
            color="teal"
            size="sm"
            variant="outline"
            onClick={() => setEditModalOpen(true)}
          >
            Edit Event
          </Button>
          <Button
            color="red"
            variant="outline"
            size="sm"
            fullWidth={!isLargeScreen}
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? <Loader size="xs" /> : "Remove"}
          </Button>
        </Stack>
      </Flex>

      <EditEventModal
        opened={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        eventId={event._id}
        onEventUpdated={(updatedEvent) => {
          // Pass the updated event back to parent immediately
          onEventUpdated?.(updatedEvent);
          // Close modal after update
          setEditModalOpen(false);
        }}
      />
    </Card>
  );
};

export default MyEventCard;