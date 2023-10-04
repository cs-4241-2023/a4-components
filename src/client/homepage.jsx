import "./css/theming.css";
import rbeLogo from "./Resources/RhoBetaEpsilon_Logo_noBackground.png";
import "./css/sidebar.css";
import React from "react";
import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Table,
} from "react-bootstrap";

import TableData from "./tableData";

class hourEntry {
  constructor(date, num, reasoning) {
    this.date = date;
    this.numHours = num;
    this.reason = reasoning;
  }
  setDate(date) {
    this.date = date;
  }
  setNumHours(num) {
    this.numHours = num;
  }

  setReason(reason) {
    this.reason = reason;
  }

  setID(id) {
    this.id = id;
  }
}

function Homepage() {
  const [hours, setHours] = useState("");
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [submissions, setSubmissions] = useState({});
  let tableData = null;

  //gets data from the server on load
  useEffect(() => {
    fetch("/getData", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("recieved data: ", data);
        setSubmissions(data);
      });
  }, []);

  const submitData = async function () {
    event.preventDefault();
    let newSubmission = new hourEntry(date, hours, reason);
    const body = JSON.stringify(newSubmission);
    console.log("New submission: ", body);
    const response = await fetch("/getData", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      body: body,
    });

    const text = await response.text();
    const data = JSON.parse(text);
    setSubmissions(data);
    console.log("gonna print data:", data);
  };

  return (
    <Container fluid>
      <Row>
        <Col
          sm={3}
          className=" text-white min-vh-100 p-3 primary-color"
          style={{ width: "340px" }}
        >
          <Navbar.Brand
            href="/homepage"
            className="d-flex align-items-center mb-3 mb-md-0 text-decoration-none"
          >
            <img src={rbeLogo} alt="Rho Beta Epsilon Logo" width="100px" />
            <span className="fs-4">Rho Beta Epsilon</span>
          </Navbar.Brand>
          <hr />
          <Nav
            defaultActiveKey="/homepage"
            className="flex-column mb-auto"
            variant="pills"
          >
            <Nav.Link href="/homepage" className="primary">
              Home
            </Nav.Link>
            {/* Add more Nav.Link items as needed */}
          </Nav>
          <hr />
          <NavDropdown
            title="Options"
            id="options-dropdown"
            className="btn-dark"
            fixed="bottom"
          >
            {/* Add NavDropdown.Item items as needed */}
            <NavDropdown.Divider />
            <NavDropdown.Item href="/signout" disabled>
              Sign out
            </NavDropdown.Item>
          </NavDropdown>
        </Col>

        <Col
          style={{ marginLeft: "20px", marginTop: "50px", maxWidth: "700px" }}
        >
          <Form
            style={{
              border: "1px solid",
              padding: "10px",
              borderRadius: "5px",
              maxWidth: "500px",
            }}
          >
            <Form.Group className="mb-3">
              <Form.Label htmlFor="hourSubmission">
                Number of Hours Completed
              </Form.Label>
              <Form.Control
                type="number"
                id="hourSubmission"
                required
                onChange={(event) => setHours(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="dateSubmission">Date Completed</Form.Label>
              <Form.Control
                type="date"
                id="dateSubmission"
                required
                onChange={(event) => setDate(event.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="reasonSubmission">
                Reason for Hours
              </Form.Label>
              <Form.Control
                as="textarea"
                id="reasonSubmission"
                rows={5}
                onChange={(event) => {
                  setReason(event.target.value);
                  // console.log(reason);
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              className="btn-primary"
              id="submissionButton"
              onClick={submitData}
            >
              Submit
            </Button>
          </Form>
          <hr />
          <TableData entries={submissions} />
        </Col>
      </Row>
    </Container>
  );
}

export default Homepage;
