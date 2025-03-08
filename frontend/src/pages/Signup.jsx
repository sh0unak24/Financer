import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Appbar } from "../components/Appbar";
import { Button } from "../components/Button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Heading } from "../components/Heading";
import { BottomWarning } from "../components/BottomWarning";

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      setLoading(true);
      console.log("Sending signup request...");

      const response = await axios.post("http://localhost:3000/api/v1/user/signup", {
        username,
        firstName,
        lastName,
        password,
      });

      console.log("Signup Response:", JSON.stringify(response.data, null, 2));

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
        console.log("Token stored successfully:", localStorage.getItem("token"));

        toast.success("Signup successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/home", { replace: true }), // Navigate to /home
        });
      } else {
        console.error("Token is missing in the response");
        toast.error("Signup successful, but no token received. Please log in.");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#e8d5c4] text-[#429ab9]">
      <Appbar />
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-[#c6b295] p-6 rounded-lg shadow-lg w-full max-w-md">
          <div className="text-center mb-4">
            <Heading label="Sign up" />
          </div>

          {/* Email Input */}
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="text"
            placeholder="e.g., johndoe123"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-[#429ab9] bg-[#e8d5c4] text-[#429ab9]"
          />

          {/* First Name Input */}
          <label className="block text-sm font-medium mb-1">First Name</label>
          <input
            type="text"
            placeholder="e.g., John"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-[#429ab9] bg-[#e8d5c4] text-[#429ab9]"
          />

          {/* Last Name Input */}
          <label className="block text-sm font-medium mb-1">Last Name</label>
          <input
            type="text"
            placeholder="e.g., Doe"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="w-full p-2 mb-4 rounded border border-[#429ab9] bg-[#e8d5c4] text-[#429ab9]"
          />

          {/* Password Input */}
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            placeholder="e.g., Password123!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 mb-6 rounded border border-[#429ab9] bg-[#e8d5c4] text-[#429ab9]"
          />

          <Button
            label={loading ? "Signing Up..." : "Signup"}
            className="w-full bg-[#429ab9] text-white py-2 rounded-lg hover:bg-[#367a91]"
            onClick={handleSignup}
            disabled={loading}
          />

          <div className="mt-4">
            <BottomWarning label="Already have an account?" buttonText="Sign in" to="/signin" />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};