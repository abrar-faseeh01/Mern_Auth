import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  axios.defaults.withCredentials = true; // Ensure cookies are sent with requests
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(false);

  const ghetAuthState = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/auth/is-auth");
      if (data.success) {
        setIsLoggedIn(true);
        getUserData();
      }
    } catch (error) {
      // 401 just means "not logged in" — not an error worth showing the user
      if (error.response?.status !== 401) {
        toast.error(error.response?.data?.message || error.message);
      }
    }
  };

  const getUserData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/data", {
        withCredentials: true, // ensures cookies/JWT are sent
      });

      data.success
        ? setUserData(data.data.userData) // the actual userData is nested inside data, so you should access it with data.data.userData rather than data.userData
        : toast.error(data.message || "Failed to fetch user data");
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    ghetAuthState();
  }, []);

  const value = {
    backendUrl,
    isLoggedIn,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
  };

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
