import { createContext, useCallback, useEffect, useState } from "react";
import { baseUrl, postRequest } from "../utils/services";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // ======================
  // USER STATE
  // ======================
  const [user, setUser] = useState(null);

  // ======================
  // REGISTER STATE
  // ======================
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  // ======================
  // LOGIN STATE
  // ======================
  const [loginError, setLoginError] = useState(null);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  // ======================
  // LOAD USER FROM STORAGE
  // ======================
  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ======================
  // REGISTER
  // ======================
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo((prev) => ({
      ...prev,
      ...info,
    }));
  }, []);

  const registerUser = useCallback(
    async (e) => {
      if (e) e.preventDefault();

      setIsRegisterLoading(true);
      setRegisterError(null);

      try {
        const response = await postRequest(
          `${baseUrl}/users/register`,
          JSON.stringify(registerInfo)
        );

        if (response.error) {
          setRegisterError(response);
          return;
        }

        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);
      } catch {
        setRegisterError({ message: "Network error" });
      } finally {
        setIsRegisterLoading(false);
      }
    },
    [registerInfo]
  );

  // ======================
  // LOGIN
  // ======================
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo((prev) => ({
      ...prev,
      ...info,
    }));
  }, []);

  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await postRequest(
          `${baseUrl}/users/login`,
          JSON.stringify(loginInfo)
        );

        if (response.error) {
          setLoginError(response);
          return;
        }

        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);
      } catch {
        setLoginError({ message: "Network error" });
      } finally {
        setIsLoginLoading(false);
      }
    },
    [loginInfo]
  );

  // ======================
  // LOGOUT
  // ======================
  const logout = useCallback(() => {
    localStorage.removeItem("User");
    setUser(null);
  }, []);

  // ======================
  // CONTEXT PROVIDER
  // ======================
  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,

        // register
        registerInfo,
        updateRegisterInfo,
        registerUser,
        registerError,
        isRegisterLoading,

        // login
        loginInfo,
        updateLoginInfo,
        loginUser,
        loginError,
        isLoginLoading,

        // logout
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
