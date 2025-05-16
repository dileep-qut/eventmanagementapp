import React, { useState, useEffect } from 'react';

import { Flex, Text, Title, Paper, Button, Stack, Container, Box, Modal, Checkbox, Loader } from "@mantine/core";
import { useDisclosure } from '@mantine/hooks'
import { useParams } from 'react-router-dom';

import axiosInstance from '../axiosConfig';

import dayjs from 'dayjs';
import { showNotification } from '@mantine/notifications';



import { baseURL } from '../config';


export default function EventPage() {
  const { eventId } = useParams();

  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  const [modalOpened, setModalOpened] = useState(false); // For the Addon Model


  const [selectedAddons, setSelectedAddons] = useState([]); // Store the selected addons

  const [ticket_price, setTicketPrice] = useState(null)


  const token = localStorage.getItem('jwt')



  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await axiosInstance.get(`/events/${eventId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          console.log(response.data);

          setEventDetails(response.data);
          setTicketPrice(response.data.ticket_price)
        } else {
          showNotification({
            title: 'Error',
            message: response.data.message,
            autoClose: 3000,
            color: 'red'
          });
        }
      } catch (err) {
        showNotification({
          title: 'Error',
          message: err?.response?.data?.message || err.message || 'Something went wrong',

          message: err?.response?.data?.message || err.message || 'Something went wrong',

          autoClose: 3000,
          color: 'red',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, token]);

  const getTicketPrice = async (addons) => {
    setModalLoading(true)



    try {
      const response = await axiosInstance.post(`/ticket/get-price`, {
        "event_id": eventId,
        "add_on": {
          "vip": addons.includes('vip'),
          "parking": addons.includes('parking'),
          "food": addons.includes('food'),
          "priority": addons.includes('priority'),
        }
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201 || response.status === 200) {
        setSelectedAddons(addons);
        setTicketPrice(response.data.price)
      } else {
        showNotification({
          title: 'Error',
          message: response.data.message,
          autoClose: 3000,
          color: 'red'
        });
      }
    } catch (err) {

      setSelectedAddons(selectedAddons)
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || err.message || 'Something went wrong',

        message: err?.response?.data?.message || err.message || 'Something went wrong',
        autoClose: 3000,
        color: 'red',
        color: 'red',

      });
    } finally {
      setModalLoading(false)

    }
  };

  const purchaseTicket = async () => {
    setModalLoading(true)

    try {
      const response = await axiosInstance.post(`/ticket/purchase`, {
        "event_id": eventId,
        "add_on": {
          "vip": selectedAddons.includes('vip'),
          "parking": selectedAddons.includes('parking'),
          "food": selectedAddons.includes('food'),
          "priority": selectedAddons.includes('priority'),
        }
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 201 || response.status === 200) {
        window.location.href = response.data.url;
      } else {
        showNotification({
          title: 'Error',
          message: response.data.message,
          color: 'red',
          autoClose: 3000,
        });
      }
    } catch (err) {
      showNotification({
        title: 'Error',
        message: err?.response?.data?.message || err.message || 'Something went wrong',
        autoClose: 3000,
        color: 'red',
      });
    } finally {
      setModalLoading(false)
    }


  };

  if (loading) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '80vh', width: '100%' }}
      >
        <Loader size="lg" />
      </Flex>
    );
  }

  if(!token) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '80vh', width: '100%' }}
      >
        <Text color="red" size="lg">Please login to view the event</Text>
      </Flex>
    );
  }
  
  if (!eventDetails) {
    return (
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '80vh', width: '100%' }}
      >
        <Text color="red" size="lg">Error loading event details.</Text>
      </Flex>
    );
  }
  

  const { name, description, start_time, end_time, location, image_url, creator, category ,ticket_left} = eventDetails;

  const start = dayjs(start_time);
  const end = dayjs(end_time);

  const sameDay = start.isSame(end, 'day');

  const formattedTime = sameDay
    ? `${start.format('h:mm A')} - ${end.format('h:mm A')}`
    : `${start.format('D MMM YYYY, h:mm A')} - ${end.format('D MMM YYYY, h:mm A')}`;


  return (

    <>
      <Container
        size="xl"
        py="sm">

        <div style={{ marginTop: 30 }} />

        {image_url && (
          <img
            src={`${baseURL}${image_url}`}
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

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Stack spacing={4}>
            <Box
              px="sm"
              py={4}
              style={{
                display: 'inline-block',
                borderRadius: 20,
                backgroundColor: '#E0E7FF',
                color: '#4338CA',
                fontWeight: 600,
                fontSize: 14,
                textAlign: 'center',
                width: 'fit-content'
              }}
            >
              {category}
            </Box>
            <Title order={2} fw={700} style={{ fontSize: 25 }} mb={0}>
              {name}
            </Title>
          </Stack>
          <div style={{ marginTop: 100 }} />



          <Stack spacing={2} align="center">
            <Text fz="md" fw={400} color="dimmed">
              {ticket_left} tickets left
            </Text>
            <Button
              style={{
                backgroundColor: ticket_left === 0 ? '#adb5bd' : '#28A745',
                color: '#fff',
                borderRadius: 5,

              }}
              disabled={ticket_left === 0}
              radius="md"
              onClick={() => {
                if (ticket_left > 0) {
                  setModalOpened(true);
                }
              }}
            >
              Get For ${ticket_price}
            </Button>
            {(selectedAddons.length > 0) && (
              <Text color="red" size="sm" mt="sm">
                * Addons applied
              </Text>
            )}
          </Stack>
        </div>

        <Text color="dimmed" mb={20} style={{ fontSize: 15 }}>{description}</Text>

        <div style={{ marginTop: 30 }} />

        <Flex
          justify="space-between"
          align="center"



          wrap="wrap"
          gap="md"
          mt={30}



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
              display: "inline-flex",
              minWidth: "50%",
              paddingLeft: 15,

              paddingRight: 15,


            }}
          >
            <div style={{ paddingLeft: 20 }}>
              <Text color="black" fw={500}>{creator.name}</Text>
              <Text color="black" fw={200}>{creator.email}</Text>
            </div>
          </Paper>

        </Paper>

      </Container>


      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<Title order={3}>Add Extras</Title>}
        centered
        radius="lg"
      >
        <Stack spacing="md">
          <Checkbox.Group
            spacing="sm"
            orientation="vertical"
            label="Choose your add-ons"
            value={selectedAddons}
            onChange={(value) => {
              getTicketPrice(value)
            }}
          >
            <Stack spacing="sm" mt="xs">
              <Checkbox value="vip" label="VIP" color='#6E58F6' />
              <Checkbox value="parking" label="Parking" color='#6E58F6' />
              <Checkbox value="food" label="Food" color='#6E58F6' />
              <Checkbox value="priority" label="Priority Access" color='#6E58F6' />
              <Text fw={600}>Price: ${ticket_price}</Text>
            </Stack>
          </Checkbox.Group>


          <Button
            variant={'filled'}
            color="#6E58F6"
            fullWidth
            onClick={purchaseTicket}
            disabled={modalLoading} // Optional: disables button while loading
            style={{
              borderColor: '#6E58F6',
              color: '#fff',
              backgroundColor: '#6E58F6',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {modalLoading ? (
              <Loader size="xs" color={"#fff"} />
            ) : (
              'Confirm Booking'
            )}
          </Button>
        </Stack>
      </Modal>
    </>
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
