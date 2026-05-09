import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Register() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await API.post("/auth/register", {
        username,
        email,
        password,
      });

      alert("Register Success");

      navigate("/");

    } catch (err) {

      console.log(err);

      alert("Register Failed");
    }
  };

  return (

    <div className="min-h-screen bg-black flex items-center justify-center">

      <div className="bg-zinc-900 p-10 rounded-2xl w-[400px] shadow-2xl border border-zinc-800">

        <h1 className="text-4xl text-white font-bold text-center mb-8">
          Register
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-zinc-800 text-white p-3 rounded-lg outline-none border border-zinc-700"
          />

          <button
            onClick={handleRegister}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-semibold transition"
          >
            Register
          </button>

        </div>

      </div>

    </div>
  );
}