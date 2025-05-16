import React, { useEffect, useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  FileInput,
  Select,
  Stack,
  Modal,
  Notification,
  Loader,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import axiosInstance from "../axiosConfig";

export default function EditEventModal({
  opened,
  onClose,
  eventId,
  onEventUpdated,
}) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    start_time: null,
    end_time: null,
    ticket_price: "",
    total_tickets: "",
    category: "",
    image: null,
    image_url: "",
  });

  const [loading, setLoading] = useState(false); // loading for data fetch
  const [submitting, setSubmitting] = useState(false); // loading for submit
  const [success, setSuccess] = useState(false);

  const token = localStorage.getItem("jwt");

  useEffect(() => {
    if (!eventId || !opened) return;

    const fetchEvent = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(`/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const event = res.data;
        setFormData({
          name: event.name || "",
          location: event.location || "",
          description: event.description || "",
          start_time: new Date(event.start_time),
          end_time: new Date(event.end_time),
          ticket_price: event.ticket_price?.toString() || "",
          total_tickets: event.total_tickets?.toString() || "",
          category: event.category || "",
          image: null,
          image_url: event.image_url || "",
        });
      } catch (err) {
        console.error("Failed to fetch event:", err);
        alert("Failed to load event details.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, opened]);

  const handleChange = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(false);

    try {
      let imageUrl = formData.image_url;

      if (formData.image) {
        const imageData = new FormData();
        imageData.append("file", formData.image);

        const uploadRes = await axiosInstance.post("/image/upload", imageData, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });

        imageUrl = uploadRes.data.image_url;
      }

      const payload = {
        name: formData.name,
        location: formData.location,
        description: formData.description,
        category: formData.category,
        image_url: imageUrl,
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        ticket_price: parseFloat(formData.ticket_price),
        total_tickets: parseInt(formData.total_tickets),
      };

      const updatedResponse = await axiosInstance.put(
        `/events/${eventId}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setSuccess(true);
      onEventUpdated(updatedResponse.data);
      setTimeout(() => onClose(), 1000); // delay close for user to see success
    } catch (err) {
      console.error("Update failed:", err);
      alert(err?.response?.data?.message || "Failed to update event.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Event"
      size="lg"
      centered
      radius="lg"
    >
      {loading ? (
        <div
          style={{
            height: "300px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Loader size="lg" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <Stack spacing="md">
            <TextInput
              label="Event Name"
              value={formData.name}
              onChange={(e) => handleChange("name")(e.target.value)}
              required
            />

            <Textarea
              label="Description"
              value={formData.description}
              onChange={(e) => handleChange("description")(e.target.value)}
              required
              autosize
              minRows={2}
            />

            <Group grow>
              <DateTimePicker
                label="Start Date"
                value={formData.start_time}
                onChange={handleChange("start_time")}
                required
              />
              <DateTimePicker
                label="End Date"
                value={formData.end_time}
                onChange={handleChange("end_time")}
                required
              />
            </Group>

            <TextInput
              label="Location"
              value={formData.location}
              onChange={(e) => handleChange("location")(e.target.value)}
              required
            />

            <Group grow>
              <TextInput
                label="Ticket Price"
                type="number"
                value={formData.ticket_price}
                onChange={(e) => handleChange("ticket_price")(e.target.value)}
                required
              />
              <TextInput
                label="Total Tickets"
                type="number"
                value={formData.total_tickets}
                onChange={(e) => handleChange("total_tickets")(e.target.value)}
                required
              />
            </Group>

            <Select
              label="Category"
              placeholder="Select category"
              data={[
                "Networking",
                "Music",
                "Night Life",
                "CyberSecurity",
                "Computer Science",
                "Dating",
              ]}
              value={formData.category}
              onChange={handleChange("category")}
              required
            />

            <FileInput
              label="Change Banner (optional)"
              placeholder="Choose new image"
              accept="image/*"
              value={formData.image}
              onChange={handleChange("image")}
            />

            <Button
              fullWidth
              type="submit"
              loading={submitting}
              style={{ backgroundColor: "#6E58F6", marginTop: 10 }}
            >
              {submitting ? "Updating..." : "Update Event"}
            </Button>

            {success && (
              <Notification mt="md" color="green" title="Success">
                Event updated successfully!
              </Notification>
            )}
          </Stack>
        </form>
      )}
    </Modal>
  );
}
