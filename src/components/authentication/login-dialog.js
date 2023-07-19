import React, { Fragment, useContext, useState } from "react";
import { Dialog } from "@headlessui/react";
import "../../styles/authentication.css";
import { AiOutlineClose } from "react-icons/ai";
import { AuthContext } from "../../context/auth-context";
import axios from "axios";

const loginFormInitialState = {
  email: "",
  password: "",
};

export const LoginForm = (props) => {
  const { closeModal } = props;
  const [loginForm, setLoginForm] = useState(loginFormInitialState);
  const { setUser } = useContext(AuthContext);

  const handleChange = (event) => {
    setLoginForm({
      ...loginForm,
      [event.target.name]: event.target.value,
    });
  };

  const handleLogin = () => {
    if (loginForm.email === "" || loginForm.password === "") {
      alert("Faltan campos por llenar");
    } else {
      axios
        .post("http://localhost:3001/login", {
          email: loginForm.email,
          password: loginForm.password,
        })
        .then((res) => {
          setUser(res.data);
          setLoginForm(loginFormInitialState);
          closeModal();
        })
        .catch((e) => {
          alert(e.message);
        });
    }
  };

  return (
    <div className="auth-dialog-content">
      <p className="auth-form-item">
        <b>EMAIL</b>
      </p>
      <input
        className="auth-form-input"
        placeholder="nombre@email.com"
        onChange={handleChange}
        name="email"
        value={loginForm.email}
      />
      <p className="auth-form-item">
        <b>CONTRASEÑA</b>
      </p>
      <input
        className="auth-form-input"
        placeholder="Ingresa tu contraseña"
        onChange={handleChange}
        name="password"
        value={loginForm.password}
      />
      <p id="forgot-password">¿Olvidaste tu contraseña?</p>
      <button id="auth-submit-button" onClick={handleLogin}>
        <b>Iniciar Sesión</b>
      </button>
    </div>
  );
};
