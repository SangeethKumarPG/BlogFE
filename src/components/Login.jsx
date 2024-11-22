import React, { useState } from "react";
import loginImage from "../assets/loginImage.png";
import {
  Button,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useNavigate } from "react-router-dom";
import { loginAPI, registerAPI } from "../services/allAPI";
import { toast } from "react-toastify";
import { OrbitProgress } from 'react-loading-indicators';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleUserNameChange = (event) => {
    const value = event.target.value;
    setUserName(value);
    if (value !== " ") {
      if (value.match(/^[a-zA-Z0-9]+$/)) {
       
        setUserNameError(false);
      } else {
        setUserNameError(true);
      }
    }
  };
  const handlePasswordChange = (event) => {
    const value = event.target.value;
    setPassword(value);
    if (value !== " ") {
      if (value.match(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,}$/)) {
        setPasswordError(false);
      } else {
        setPasswordError(true);
      }
    }
  };

  const handleConfirmPasswordChange = (event) => {
    const value = event.target.value;
    setConfirmPassword(value);
    if ( value !== " ") {
      if (value === password) {
        setConfirmPasswordError(false);
      } else {
        setConfirmPasswordError(true);
      }
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (userName !== "" && password !== "" && confirmPassword !== "") {
        if (password === confirmPassword) {
          const response = await registerAPI({
            username: userName,
            password: password,
          });
          if (response.status === 201) {
            toast.success("Registration successful please login");
            setIsRegister(false);
            setConfirmPassword("");
          } else {
            toast.error(response?.response?.data || "Registration failed");
            setConfirmPassword("");
            setPassword("");
            setUserName("");
          }
        } else {
          toast.error("Passwords do not match");
          setConfirmPassword("");
          setPassword("");
        }
      } else {
        toast.error("Please fill all fields");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (userName !== "" && password !== "") {
        const response = await loginAPI({
          username: userName,
          password: password,
        });
        if (response.status === 200) {
          toast.success("Login successful");
          sessionStorage.setItem("token", JSON.stringify(response.data.token));
          sessionStorage.setItem("userId", JSON.stringify(response.data.userId));
          setUserName("");
          setPassword("");
          navigate("/home");
        } else {
          toast.error(
            response?.response?.data || "Invalid username or password"
          );
          setPassword("");
          setUserName("");
        }
      } else {
        toast.error("Please fill all fields");
        setPassword("");
        setUserName("");
      }
    } catch (error) {
        console.log(error);
    } finally {
      setLoading(true);
    }
  };

  return (
    <>
      <div className="container-fluid">
        <div className="d-flex flex-column flex-md-row align-items-center justify-content-center">
          <div className="col-12 col-md-6">
            <img
              src={loginImage}
              width={"100%"}
              height={"100%"}
              style={{ objectFit: "cover" }}
            />
          </div>
          <div
            className="col-12 col-md-6 p-3 rounded-2 d-flex flex-column justify-content-center align-items-center"
            style={{ backgroundColor: "cyan", height: "50vh" }}
          >
            {isRegister === false ? (
              <>
                <h3 className="text-center mb-3">Login</h3>
                <TextField
                  variant="outlined"
                  label="User Name"
                  type="text"
                  value={userName}
                  className="mb-3"
                  fullWidth
                  onChange={(event) => handleUserNameChange(event)}
                />
                {userNameError && (
                  <Typography variant="body2" color="error" className="mb-2">
                    Please enter a valid user name
                  </Typography>
                )}

                <TextField
                  variant="outlined"
                  label="Password"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="mb-3"
                  fullWidth
                  onChange={(event) => handlePasswordChange(event)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleShowPassword}
                          edge="end"
                          sx={{ color: "black" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {passwordError && (
                  <Typography variant="body2" color="error" className="mb-2">
                    Password must be at least 6 characters long and contain at
                    least one lowercase letter, one number and one special
                    character
                  </Typography>
                )}

                <Button
                  variant="contained"
                  color="primary"
                  className="w-100"
                  onClick={handleLogin}
                  disabled = {userNameError || passwordError}
                >
                    
                    {loading ? (
                      <OrbitProgress
                        dense
                        color="#ab9deb"
                        size="small"
                        text=""
                        textColor="#6294e4"
                      />
                    ) : (
                      "Login"
                    )}
                </Button>
                <Typography variant="body2" className="mt-3">
                  Don't have an account?{" "}
                  <a
                    style={{ textDecoration: "none", cursor: "pointer", color: "blue" }}
                    onClick={() => setIsRegister(true)}
                  >
                    Register
                  </a>
                </Typography>
              </>
            ) : (
              <>
                <h3 className="text-center mb-3">Register</h3>
                <TextField
                  variant="outlined"
                  label="User Name"
                  type="text"
                  className="mb-3"
                  fullWidth
                  value={userName}
                  onChange={(event) => handleUserNameChange(event)}
                />
                {userNameError && (
                  <Typography variant="body2" color="error" className="mb-2">
                    Please enter a valid user name
                  </Typography>
                )}

                <TextField
                  variant="outlined"
                  label="Password"
                  value={password}
                  type={showPassword ? "text" : "password"}
                  className="mb-3"
                  fullWidth
                  onChange={(event) => handlePasswordChange(event)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleShowPassword}
                          edge="end"
                          sx={{ color: "black" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {passwordError && (
                  <Typography variant="body2" color="error" className="mb-2">
                    Password must be at least 6 characters long and contain at
                    least one lowercase letter, one number and one special
                    character
                  </Typography>
                )}

                <TextField
                  variant="outlined"
                  label="Confirm Password"
                  value={confirmPassword}
                  type={showPassword ? "text" : "password"}
                  className="mb-3"
                  fullWidth
                  onChange={(event) => handleConfirmPasswordChange(event)}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleShowPassword}
                          edge="end"
                          sx={{ color: "black" }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {confirmPasswordError && (
                  <Typography variant="body2" color="error" className="mb-2">
                    Passwords do not match
                  </Typography>
                )}
                <Button
                  variant="contained"
                  color="primary"
                  className="w-100"
                  onClick={handleRegister}
                  disabled = {userNameError || passwordError || confirmPasswordError}
                >
                  {loading ? (
                      <OrbitProgress
                        dense
                        color="#ab9deb"
                        size="small"
                        text=""
                        textColor="#6294e4"
                      />
                    ) : (
                      "Register"
                    )}
                </Button>
                <Typography variant="body2" className="mt-3">
                  Already have an account?{" "}
                  <a
                    style={{ textDecoration: "none", cursor: "pointer", color: "blue" }}
                    onClick={() => setIsRegister(false)}
                  >
                    Login
                  </a>
                </Typography>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
