import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { FcGoogle } from "react-icons/fc";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function googleSignup() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          window.location.origin + "/app/welcome"
      }
    });
  }

  async function signup() {
    const { error } =
      await supabase.auth.signUp({
        email,
        password
      });

    if (error) {
      alert(error.message);
      return;
    }

    window.location.href = "/app/welcome";
  }

  return (
    <div className="space-y-4 mt-4">

      <button
        onClick={googleSignup}
        className="w-full h-12 rounded-2xl bg-white text-black font-medium flex items-center justify-center gap-3"
      >
        <FcGoogle className="text-xl" />
        Empieza con Google
      </button>

      <div className="text-center text-xs text-zinc-500">
        o regístrate con email
      </div>

      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white"
      />

      <input
        type="password"
        placeholder="Contraseña"
        onChange={(e) => setPassword(e.target.value)}
        className="w-full h-12 rounded-2xl bg-white/5 border border-white/10 px-4 text-white"
      />

      <button
        onClick={signup}
        className="w-full h-12 rounded-2xl bg-white text-black font-medium"
      >
        Crear cuenta
      </button>

    </div>
  );
}