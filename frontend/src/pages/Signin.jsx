import { Appbar } from "../components/Appbar";
import { BottomWarning } from "../components/BottomWarning";
import { Button } from "../components/Button";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignin = async () => {
    try {
      setLoading(true);
      console.log("Sending sign-in request...");

      const response = await axios.post("http://localhost:3000/api/v1/user/signin", {
        username,
        password,
      });

      console.log("Signin Response:", response.data);

      if (response.data.token) {
        // Store token in localStorage
        localStorage.setItem("token", response.data.token);
        console.log("Token stored successfully:", localStorage.getItem("token"));

        toast.success("Sign-in successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          onClose: () => navigate("/home", { replace: true })
        });
      } else {
        console.error("Token missing in response");
        toast.error("Sign-in successful, but no token received. Please try again.");
      }
    } catch (error) {
      console.error("Signin error:", error.response?.data || error.message);
      toast.error(error.response?.data?.msg || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="h-screen flex flex-col items-center"
      style={{ backgroundColor: "#e8d5c4", color: "#429ab9" }}
    >
      <div className="w-full text-center py-4">
        <Appbar />
      </div>

      <div className="flex flex-col justify-center flex-grow">
        <div className="rounded-lg w-[32rem] bg-[#c6b295] text-center py-6 h-max px-4">
          <Heading label="Sign in" />
          <SubHeading label="Enter your credentials to access your account" />

          <InputBox onChange={(e) => setUsername(e.target.value)} placeholder="sh@gmail.com" label="Email" />
          <InputBox onChange={(e) => setPassword(e.target.value)} type="password" placeholder="123456" label="Password" />

          <div className="pt-4">
            <Button onClick={handleSignin} type = "button" label={loading ? "Signing In..." : "Sign in"} disabled={loading} />
          </div>

          <BottomWarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};