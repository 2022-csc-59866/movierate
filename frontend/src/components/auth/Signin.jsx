import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";
import googleImage from "../../assets/googleImage.png";
import githubImage from "../../assets/githubImage.png";

const validateUserInfo = ({ email, password }) => {
  const isValidPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;

  if (!email.trim()) {
    return { ok: false, error: "Email missing!" };
  }

  if (!isValidEmail(email)) {
    return { ok: false, error: "Invalid email!" };
  }

  if (!password.trim()) {
    return { ok: false, error: "Password missing!" };
  }

  if (password.length < 8) {
    return {
      ok: false,
      error: "Password must be 8 to 100 characters inclusive!",
    };
  }

  if (password.length > 100) {
    return {
      ok: false,
      error: "Password must be 8 to 100 characters inclusive!",
    };
  }

  if (!isValidPassword.test(password)) {
    return {
      ok: false,
      error:
        "Invalid password! Must contain at least one lowercase letter, one uppercase letter, one number, and one special character!",
    };
  }

  return { ok: true };
};

export default function Signin() {
  const [userInfo, setUserInfo] = useState({
    email: "",
    password: "",
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const navigate = useNavigate();
  const { updateNotification } = useNotification();
  const { handleLogin, authInfo } = useAuth();
  const { isPending, isLoggedIn } = authInfo;

  const { email, password } = userInfo;

  useEffect(() => {
    const isUser = Object.values({ email, password }).every((item) =>
      Boolean(item)
    );
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [userInfo]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const googleLogin = () => {
    window.open("https://movierate.tv/auth/google", "_self");
  };

  const githubLogin = () => {
    window.open("https://movierate.tv/auth/github", "_self");
  };

  const handleChange = ({ target }) => {
    const { value, name } = target;

    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) {
      return updateNotification("error", error);
    }
    handleLogin(userInfo.email, userInfo.password);
  };

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign in</Title>
          <FormInput
            value={userInfo.email}
            onChange={handleChange}
            label="Email"
            placeholder="movierate@email.com"
            name="email"
          />
          <FormInput
            value={userInfo.password}
            onChange={handleChange}
            label="Password"
            placeholder="xxxxxxxx"
            name="password"
            type={passwordVisible ? "text" : "password"}
            togglePasswordVisibility={togglePasswordVisibility}
            passwordVisible={passwordVisible}
          />
          <Submit
            value="Sign in"
            busy={isPending}
            isButtonDisabled={submitDisabled}
          />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password?</CustomLink>
            <CustomLink to="/auth/signup">New User?</CustomLink>
          </div>
          <p
            htmlFor="title"
            className="dark:text-custom-gold text-custom-gold font-semibold font-mono text-center"
          >
            Login with Google or GitHub
          </p>
          <div className="flex justify-center mt-4">
            <button
              className="mx-2"
              onClick={googleLogin}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src={googleImage} alt="Google" width={40} />
            </button>
            <button
              className="mx-2"
              onClick={githubLogin}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img src={githubImage} alt="GitHub" width={35} />
            </button>
          </div>

          <p className="text-center text-xl text-red-600  dark:text-red font-mono font-bold">
            <a href="mailto:gioanno000@citymail.cuny.edu">Become Admin</a>
          </p>
        </form>
      </Container>
    </FormContainer>
  );
}
