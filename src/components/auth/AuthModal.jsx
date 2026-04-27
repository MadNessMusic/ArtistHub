import { useEffect, useState } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthModal() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("login");

  useEffect(() => {
    function bindButtons() {
      document
        .querySelectorAll('[data-auth="login"]')
        .forEach((btn) => {
          btn.onclick = () => {
            setTab("login");
            setOpen(true);

            document
              .getElementById("mobile-panel")
              ?.classList.add("hidden");
          };
        });

      document
        .querySelectorAll('[data-auth="signup"]')
        .forEach((btn) => {
          btn.onclick = () => {
            setTab("signup");
            setOpen(true);

            document
              .getElementById("mobile-panel")
              ?.classList.add("hidden");
          };
        });
    }

    bindButtons();

    document.addEventListener(
      "astro:page-load",
      bindButtons
    );
  }, []);

  // 🔥 Scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // ESC
  useEffect(() => {
    function esc(e) {
      if (e.key === "Escape") {
        setOpen(false);
      }
    }

    window.addEventListener("keydown", esc);

    return () =>
      window.removeEventListener("keydown", esc);
  }, []);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-200 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-md rounded-3xl border border-white/10 bg-zinc-950 shadow-2xl p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-white">
            {tab === "login"
              ? "Bienvenido"
              : "Crear cuenta"}
          </h2>

          <p className="text-zinc-400 text-sm mt-1">
            {tab === "login"
              ? "Accede a ArtistHub."
              : "Empieza gratis en minutos."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-6">

          <button
            onClick={() => setTab("login")}
            className={`h-11 rounded-2xl ${
              tab === "login"
                ? "bg-white text-black"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            Entrar
          </button>

          <button
            onClick={() => setTab("signup")}
            className={`h-11 rounded-2xl ${
              tab === "signup"
                ? "bg-white text-black"
                : "bg-white/5 text-zinc-400"
            }`}
          >
            Registro
          </button>

        </div>

        {tab === "login"
          ? <LoginForm />
          : <SignupForm />}

      </div>
    </div>
  );
}