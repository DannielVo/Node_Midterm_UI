import React, { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Register = () => {
  const {
    registerInfo,
    updateRegisterInfo,
    registerUser,
    registerError,
    isRegisterLoading,
  } = useContext(AuthContext);

  return (
    <Row className="min-vh-100 justify-content-center align-items-center">
      <Col xs={12} sm={10} md={6} lg={4}>
        <Card
          className="shadow-lg border-0"
          style={{ backgroundColor: "#121314ff" }}
        >
          <Card.Body className="p-4">
            <Stack gap={3}>
              <div className="text-center mb-2">
                <h3 className="fw-bold text-light">Create Account</h3>
                <small className="text-secondary">
                  Sign up to start chatting
                </small>
              </div>

              <Form
                onSubmit={(e) => {
                  e.preventDefault();
                  registerUser();
                }}
              >
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    className="bg-dark text-light border-secondary"
                    onChange={(e) =>
                      updateRegisterInfo({
                        ...registerInfo,
                        name: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="bg-dark text-light border-secondary"
                    onChange={(e) =>
                      updateRegisterInfo({
                        ...registerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    className="bg-dark text-light border-secondary"
                    onChange={(e) =>
                      updateRegisterInfo({
                        ...registerInfo,
                        password: e.target.value,
                      })
                    }
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-semibold"
                >
                  {isRegisterLoading ? "Creating your account" : "Register"}
                </Button>
              </Form>
              {registerError && (
                <Alert variant="danger" className="py-2 mb-0 text-center">
                  <p>{registerError?.message}</p>
                </Alert>
              )}

              <div className="text-center">
                <small className="text-secondary">
                  Already have an account?{" "}
                  <a href="/login" className="text-decoration-none">
                    Login
                  </a>
                </small>
              </div>
            </Stack>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
