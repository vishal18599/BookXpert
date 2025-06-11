import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Navbar } from 'react-bootstrap';
import { getStates } from './services/api';
import EmployeeList from './components/EmployeeList';

function App() {
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      const res = await getStates();
      setStates(res.data);
    };
    fetchStates();
  }, []);

  return (
    <>
      <Navbar bg="dark" variant="dark" className="mb-4">
        <Container>
          <Navbar.Brand>BOOKXPERT - Employee Manager</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <EmployeeList states={states} />
      </Container>
    </>
  );
}

export default App;
