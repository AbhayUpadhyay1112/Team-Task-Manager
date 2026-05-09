import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    try {

      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem(
        "token",
        res.data.token
      );

      alert("Login Success");

      navigate("/dashboard");

    } catch (err) {

      console.log(err);

      alert("Login Failed");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px] shadow-2xl border border-zinc-800">

        <h1 className="text-4xl text-white font-bold text-center mb-8">
          Team Task Manager
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700"
          />

          <button
            onClick={handleLogin}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

          <p className="text-white text-center mt-4">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register")}
              className="text-blue-500 cursor-pointer font-bold"
            >
              Register
            </span>
          </p>

        </div>

      </div>

    </div>
  );
}