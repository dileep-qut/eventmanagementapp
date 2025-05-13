import { Link, useNavigate } from 'react-router-dom';
import { useDisclosure } from '@mantine/hooks';

import {
  Container,
  Group,
  Burger,
  Button,
  Drawer,
  Stack,
  Title,
} from '@mantine/core';

const Navbar = ({token, setToken }) => {
  const [opened, { toggle, close }] = useDisclosure(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setToken(null);
    navigate('/');
  };

  return (
    <header style={{ borderBottom: '1px solid #eee' }}>
        <Container
          size="xl"
          py="sm"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem',
          }}
        >
          <Link to="/">
            <Title style={{
              fontSize:'2rem',paddingBottom:20, marginTop:20
            }}>EventX</Title>
          </Link>
  
          
          <Group visibleFrom="sm" spacing="md">
            {token ? (
              <>
                
                <Button
                component={Link}
                to="/mytickets"
                variant="outline"
                color="dark"
                onClick={close}
                style={{ borderColor: '#000', color: '#000',paddingRight:20 }}
                
                >
                  My Tickets
                </Button>

                <Button
                  component={Link}
                  to="/myevents"
                  variant="outline"
                  color="gray"
                  onClick={close}
                  style={{ borderColor: '#888', color: '#444',paddingRight:20 }}
                >
                  My Events
                </Button>

                <Button
                  component={Link}
                  to="/profile"
                  variant="outline"
                  color="gray"
                  style={{ borderColor: '#aaa', color: '#333',paddingRight:20 }}
                >
                  Profile
                </Button>

                <Button
                  color="red"
                  variant="outline"
                  onClick={handleLogout}
                  style={{ borderColor: '#e63946', color: '#e63946',paddingRight:20 }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="default" onClick={() => navigate('/login')}>
                  Login
                </Button>
                <Button style={{
                  backgroundColor: '#6E58F6'
                }}  component={Link} to="/register" onClick={() => navigate('/register')}>
                  Register
                </Button>
              </>
            )}
          </Group>
  
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" />
  
          
          <Drawer
            opened={opened}
            onClose={close}
            title="Menu"
            padding="md"
            size="xs"
            hiddenFrom="sm"
          >
            <Stack spacing="md">
              {token ? (
                <> 
                  
                  <Button style={{
                  backgroundColor: '#6E58F6'
                }} component={Link} to="/mytickets" onClick={close}>
                    My Tickets
                  </Button>
                  <Button style={{
                  backgroundColor: '#6E58F6'
                }} component={Link} to="/myevents" onClick={close}>
                    My Events
                  </Button>
                  
                  <Button style={{
                  backgroundColor: '#6E58F6'
                }} component={Link} to="/profile" onClick={close}>
                    Profile
                  </Button>
                  <Button color="red" variant="outline" onClick={() => { handleLogout(); close(); }}>
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/login" onClick={() => { navigate('/login') }}>
                    Login
                  </Button>
                  <Button component={Link} to="/signup" onClick={() => { navigate('/register') }}>
                    Register
                  </Button>
                </>
              )}
            </Stack>
          </Drawer>
        </Container>
      </header>
    );
  }

export default Navbar;
