// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/userSlice"; // Asegúrate de tener este slice configurado
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // importante para cookies
      body: JSON.stringify({ email, password })
    });

    if (res.ok) {
      const data = await res.json();
      
      router.push("/chat");
      dispatch(setUser(data.user)); // Guarda el usuario en Redux
    } else {
      alert("Login inválido");
      
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <input
        type="email"
        placeholder="Email"
        className="border p-2"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        className="border p-2"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white px-4 py-2 rounded">
        Iniciar sesión
      </button>
    </div>
  );
}
