import React, { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIsAuth, signInUser } from "../api/auth";
import { useNotification } from "../hooks";

export const AuthContext = createContext();

const defaultAuthInfo = {
  profile: null,
  isLoggedIn: false,
  isPending: false,
  error: "",
};

export default function AuthProvider({ children }) {
  const [authInfo, setAuthInfo] = useState({ ...defaultAuthInfo });
  const { updateNotification } = useNotification();

  const navigate = useNavigate();

  const handleLogin = async (email, password) => {
    setAuthInfo({ ...authInfo, isPending: true });

    const { error, user } = await signInUser({ email, password });

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    navigate("/", { replace: true });

    setAuthInfo({
      profile: { ...user },
      isPending: false,
      isLoggedIn: true,
      error: "",
    });

    localStorage.setItem("auth-token", user.token);
  };

  function getCookie(name) {
    let matches = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  const isAuth = async () => {
    const tokenLocalStorage = localStorage.getItem("auth-token");
    const tokenCookie = getCookie("auth-token");

    let token = tokenLocalStorage;

    if (!tokenLocalStorage && !tokenCookie) {
      return;
    }

    if (!tokenLocalStorage) {
      token = tokenCookie;
      localStorage.setItem("auth-token", token);
    }

    setAuthInfo({ ...authInfo, isPending: true });

    const { error, user } = await getIsAuth(token);

    if (error) {
      updateNotification("error", error);
      return setAuthInfo({ ...authInfo, isPending: false, error });
    }

    setAuthInfo({
      profile: { ...user },
      isLoggedIn: true,
      isPending: false,
      error: "",
    });
  };

  function removeCookie(name) {
    document.cookie = `${name}=; expires=Mon, 01 Jan 1900 00:00:00 UTC; path=/`;
  }

  const handleLogout = () => {
    localStorage.removeItem("auth-token");
    removeCookie("auth-token");
    setAuthInfo({ ...defaultAuthInfo });
    navigate("/");
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ authInfo, handleLogin, handleLogout, isAuth }}
    >
      {children}
    </AuthContext.Provider>
  );
}
