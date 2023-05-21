import React from "react";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, useTheme } from "../../hooks";
import Container from "../Container";
import AppSearchForm from "../form/AppSearchForm";

export default function Navbar() {
  const { toggleTheme } = useTheme();
  const { authInfo, handleLogout } = useAuth();
  const { isLoggedIn } = authInfo;

  const navigate = useNavigate();

  const handleSeachSubmit = (value) => {
    navigate("/movie/search?title=" + value);
  };

  return (
    <div className="dark:bg-secondary bg-white shadow-sm shadow-gray-500">
      <Container className="p-2">
        <div className="flex justify-between items-center">
          <Link to="/">
            <img src="./logo.png" alt="" className="sm:h-10 h-8" />
          </Link>

          <ul className="flex items-center sm:space-x-4 space-x-2">
            <li>
              <button
                onClick={toggleTheme}
                className="p-1 rounded sm:text-2xl text-lg"
              >
                <BsFillMoonStarsFill
                  className="dark:bg-secondary bg-white dark:text-custom-gold text-primary"
                  size={24}
                />
              </button>
            </li>
            <li>
              <AppSearchForm
                placeholder="Search"
                styleClassName="border-dark-subtle dark:text-custom-gray text-primary focus:border-primary hover:border-primary dark:focus:border-custom-gold dark:hover:border-custom-gold s:w-auto w-40 sm:text-lg rounded-3xl"
                onSubmit={handleSeachSubmit}
              />
            </li>
            <li>
              {isLoggedIn ? (
                <button
                  onClick={handleLogout}
                  className="dark:text-custom-gray text-primary font-semibold text-lg font-mono"
                >
                  Log out
                </button>
              ) : (
                <Link
                  className="dark:text-custom-gray text-primary font-semibold text-lg font-mono"
                  to="/auth/signin"
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </Container>
    </div>
  );
}
