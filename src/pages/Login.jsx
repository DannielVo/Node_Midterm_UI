import React, { useContext } from "react";
import { Alert, Button, Col, Form, Row, Stack, Card } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { loginInfo, updateLoginInfo, loginUser, loginError, isLoginLoading } =
    useContext(AuthContext);

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
                <h3 className="fw-bold text-light">Welcome Back</h3>
                <small className="text-secondary">
                  Please login to your account
                </small>
              </div>

              <Form onSubmit={loginUser}>
                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    className="bg-dark text-light border-secondary"
                    value={loginInfo.email}
                    onChange={(e) => updateLoginInfo({ email: e.target.value })}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="text-light">Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    className="bg-dark text-light border-secondary"
                    value={loginInfo.password}
                    onChange={(e) =>
                      updateLoginInfo({ password: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 fw-semibold"
                  disabled={isLoginLoading}
                >
                  {isLoginLoading ? "Logging in..." : "Login"}
                </Button>
              </Form>

              {loginError && (
                <Alert variant="danger" className="py-2 mb-0 text-center">
                  <small>{loginError.message}</small>
                </Alert>
              )}
            </Stack>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
