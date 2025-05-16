import React, { useState } from "react";
import {
  TextInput,
  Textarea,
  Button,
  Group,
  FileInput,
  Select,
  Stack,
  Modal,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import axiosInstance from "../axiosConfig";
import { showNotification } from "@mantine/notifications";

export default function AddEventModal({ opened, onClose, onEventCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    start_time: null,
    end_time: null,
    ticket_price: "",
    ticket_available: "",
    category: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    console.log(`[${field}] => ${value}`);
    
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("jwt");
      if (!token) throw new Error("No token found");

      


      const formImage = new FormData();
      formImage.append("file", formData.image);
   
      const uploadRes = await axiosInstance.post(
        "/image/upload",
        formImage,
        {
          'headers': {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const imageUrl = uploadRes.data.image_url;

      const payload = {
        ...formData,
        image_url: imageUrl,
        date: new Date(formData.start_time).toISOString(),
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        ticket_price: parseFloat(formData.ticket_price),
        ticket_available: parseInt(formData.ticket_available),
      };
console.log(payload);

      const eventRes = await axiosInstance.post("/events", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      onEventCreated(eventRes.data);
      showNotification({
        title: 'Success',
        message: 'Event created',
        autoClose: 3000,
        color: 'green',
      });
      onClose();
    } catch (err) {
      console.error("Failed to create event:", err);
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || err.message || 'Something went wrong',
        autoClose: 3000,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Add New Event"
      size="lg"
      centered
      radius="lg"
      styles={{
        title: {
          fontWeight: 700,
        },
      }}
    >
      <Stack spacing="sm">
        <TextInput
          label="Event Name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />

        <Textarea
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
          minRows={3}
        />

        <Group grow>
          <DateTimePicker
            label="Start Date"
            value={formData.start_time}
            onChange={(value) => handleChange("start_time", value)}
            required
          />
          <DateTimePicker
            label="End Date"
            value={formData.end_time}
            onChange={(value) => handleChange("end_time", value)}
            required
          />
        </Group>

        <TextInput
          label="Location"
          value={formData.location}
          onChange={(e) => handleChange("location", e.target.value)}
          required
        />

        <Group grow>
          <TextInput
            label="Ticket Price"
            type="number"
            value={formData.ticket_price}
            onChange={(e) => handleChange("ticket_price", e.target.value)}
            required
          />
          <TextInput
            label="Tickets Available"
            type="number"
            value={formData.ticket_available}
            onChange={(e) => handleChange("ticket_available", e.target.value)}
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
            "Cyber",
            "Coding",
            "Dating",
          ]}
          value={formData.category}
          onChange={(value) => handleChange("category", value)}
          required
        />

        <FileInput
          label="Upload Banner"
          placeholder="Browse Images"
          accept="image/*"
          value={formData.image}
          onChange={(file) => handleChange("image", file)}
          required
        />

        <Button fullWidth onClick={handleSubmit} loading={loading} color="#6E58F6">
          Add Event
        </Button>
      </Stack>
    </Modal>
  );
}