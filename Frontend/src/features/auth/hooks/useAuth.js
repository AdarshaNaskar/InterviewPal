/* eslint-disable no-unused-vars */
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth.contex";
import { login, register, logout, getMe } from "../services/auth.api";

export const useAuth = () => {
  const context = useContext(AuthContext);
  const { user, setuser, loading, setloading } = context;

  const handleLogin = async ({ email, password }) => {
    setloading(true);
    try {
      const data = await login({ email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      setuser(data?.user);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handleRegister = async ({ username, email, password }) => {
    setloading(true);
    try {
      const data = await register({ username, email, password });
      if (data?.token) {
        localStorage.setItem("token", data.token);
      }
      setuser(data?.user);
      return data;
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      const data = await logout();
      localStorage.removeItem("token");
      setuser(null);
    } catch (err) {
      console.log(err);
      localStorage.removeItem("token");
      setuser(null);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
  const getAndSetUser = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setloading(false);
      return;
    }

    try {
      const data = await getMe();
      if (data?.user) {
        setuser(data.user);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setloading(false);
    }
  };

  getAndSetUser();
}, []);


  return { user, loading, handleRegister, handleLogin, handleLogout };
};
