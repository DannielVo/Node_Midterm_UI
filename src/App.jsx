import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Container } from "react-bootstrap";
import Chat from "./pages/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NavBar from "./components/NavBar";
import { AuthContext } from "./context/AuthContext";
import { ChatContextProvider } from "./context/ChatContext";

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          {/* Protected route */}
          <Route
            path="/"
            element={user ? <Chat /> : <Navigate to="/login" />}
          />

          {/* Auth routes */}
          <Route
            path="/login"
            element={user ? <Navigate to="/" /> : <Login />}
          />
          <Route
            path="/register"
            element={user ? <Navigate to="/" /> : <Register />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  );
};

export default App;
