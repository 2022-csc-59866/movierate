import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks";

export default function NotVerified() {
  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const isVerified = authInfo.profile?.isVerified;

  const navigate = useNavigate();

  const navigateToVerification = () => {
    navigate("/auth/verification", { state: { user: authInfo.profile } });
  };

  return (
    <div>
      {isLoggedIn && !isVerified ? (
        <p className="text-lg text-center bg-orange-200 p-2">
          It looks like you haven not verified your account!{" "}
          <button
            onClick={navigateToVerification}
            className="text-red-600 font-semibold font-mono hover:underline"
          >
            Click here to verify your account!
          </button>
        </p>
      ) : null}
    </div>
  );
}
