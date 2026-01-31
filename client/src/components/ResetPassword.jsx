import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
} from "@mui/material";
import Lottie from "lottie-react";
import backgroundAnimation from "../assets/animations/background-animation.json";
import { resetPassword } from "../apis/authApi";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== passwordConfirm) {
      return setError("Passwords do not match");
    }

    try {
      const data = await resetPassword(token, {
        password,
        passwordConfirm,
      });

      setSuccess(data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Reset failed");
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
      {/* Background Animation */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          zIndex: -1,
        }}
      >
        <Lottie animationData={backgroundAnimation} loop autoPlay />
      </Box>

      {/* Reset Card */}
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
          Reset Password
        </Typography>

        <Typography
          variant="body2"
          sx={{ mb: 3, color: "#dcdcdc" }}
        >
          Create a new strong password
        </Typography>

        {error && (
          <Typography sx={{ mb: 2, color: "#ff6b6b" }}>
            {error}
          </Typography>
        )}

        {success && (
          <Typography sx={{ mb: 2, color: "#4CAF50" }}>
            {success}
          </Typography>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
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
            Reset Password
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

export default ResetPassword;
