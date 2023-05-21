import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUser } from "../../api/auth";
import { useAuth, useNotification } from "../../hooks";
import { isValidEmail } from "../../utils/helper";
import { commonModalClasses } from "../../utils/theme";
import Container from "../Container";
import CustomLink from "../CustomLink";
import FormContainer from "../form/FormContainer";
import FormInput from "../form/FormInput";
import Submit from "../form/Submit";
import Title from "../form/Title";

const validateUserInfo = ({ name, email, password, confirmPassword }) => {
  const isValidName = /^[a-zA-Z0-9]+(?:\s[a-zA-Z0-9]+)*$/;
  const isValidPassword =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,100}$/;

  if (!name.trim()) {
    return { ok: false, error: "Name missing!" };
  }

  if (!isValidName.test(name)) {
    return {
      ok: false,
      error:
        "Invalid name! Name must be single-spaced and only alphanumeric characters!",
    };
  }

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

  if (password && !confirmPassword.trim()) {
    return {
      ok: false,
      error: "Confirm Password missing!",
    };
  }

  if (password !== confirmPassword) {
    return {
      ok: false,
      error: "Passwords do not match!",
    };
  }

  return { ok: true };
};

export default function Signup() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const { authInfo } = useAuth();

  const { isLoggedIn } = authInfo;

  const { updateNotification } = useNotification();

  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    const isUser = Object.values({
      name,
      email,
      password,
      confirmPassword,
    }).every((item) => Boolean(item));
    isUser ? setSubmitDisabled(false) : setSubmitDisabled(true);
  }, [userInfo]);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleChange = ({ target }) => {
    const { name, value } = target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { ok, error } = validateUserInfo(userInfo);

    if (!ok) {
      return updateNotification("error", error);
    }

    const response = await createUser(userInfo);

    if (response.error) {
      return updateNotification("error", response.error);
    }

    navigate("/auth/verification", {
      state: { user: response.user },
      replace: true,
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn]);

  const { name, email, password, confirmPassword } = userInfo;

  return (
    <FormContainer>
      <Container>
        <form onSubmit={handleSubmit} className={commonModalClasses + " w-72"}>
          <Title>Sign up</Title>
          <FormInput
            value={name}
            onChange={handleChange}
            label="Name"
            placeholder="Your Awesome Name"
            name="name"
          />
          <FormInput
            value={email}
            onChange={handleChange}
            label="Email"
            placeholder="movierate@email.com"
            name="email"
          />
          <FormInput
            value={password}
            onChange={handleChange}
            label="Password"
            placeholder="xxxxxxxx"
            name="password"
            type={passwordVisible ? "text" : "password"}
            togglePasswordVisibility={togglePasswordVisibility}
            passwordVisible={passwordVisible}
          />
          <FormInput
            value={confirmPassword}
            onChange={handleChange}
            label="Confirm Password"
            placeholder="xxxxxxxx"
            name="confirmPassword"
            type={passwordVisible ? "text" : "password"}
            togglePasswordVisibility={togglePasswordVisibility}
            passwordVisible={passwordVisible}
          />
          <Submit value="Sign Up" isButtonDisabled={submitDisabled} />

          <div className="flex justify-between">
            <CustomLink to="/auth/forget-password">Forget password</CustomLink>
            <CustomLink to="/auth/signin">Sign in</CustomLink>
          </div>

          <p className="text-center text-xl text-red-600  dark:text-red font-mono font-bold">
            <a href="mailto:gioanno000@citymail.cuny.edu">Become Admin</a>
          </p>
        </form>
      </Container>
    </FormContainer>
  );
}
