import { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import backgroundAnimation from "../assets/animations/background-animation.json";
import { forgotPassword } from "../apis/authApi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const data = await forgotPassword(email);
      setMessage(data.message || "Reset link sent to your email");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        alignItems: "center",
        justifyContent: "left",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background animation */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
        }}
      >
        <Lottie animationData={backgroundAnimation} loop autoPlay />
      </Box>

      {/* Card */}
      <Paper
        elevation={10}
        sx={{
          width: "400px",
          padding: "2rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          borderRadius: "20px",
          boxShadow: "0px 4px 30px rgba(110, 30, 255, 0.5)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          textAlign: "center",
          marginLeft: "10%",
        }}
      >
        <Typography
          variant="h5"
          sx={{ mb: 1, fontWeight: "bold", color: "#ffffff" }}
        >
          Forgot Password
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: "#dcdcdc" }}
        >
          Enter your email and we’ll send you a reset link
        </Typography>

        {message && (
          <Typography sx={{ mb: 2, color: "#4CAF50" }}>
            {message}
          </Typography>
        )}

        {error && (
          <Typography sx={{ mb: 2, color: "#ff6b6b" }}>
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            sx={{
              "& label.Mui-focused": { color: "#ffffff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": { borderColor: "#6E1EFF" },
                "&:hover fieldset": { borderColor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#ffffff" },
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            sx={{
              mt: 2,
              backgroundColor: "#6E1EFF",
              color: "#ffffff",
              "&:hover": { backgroundColor: "#5714D9" },
            }}
          >
            Send Reset Link
          </Button>
        </form>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            color: "#ffffff",
            cursor: "pointer",
          }}
          onClick={() => navigate("/login")}
        >
          Back to Login
        </Typography>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
