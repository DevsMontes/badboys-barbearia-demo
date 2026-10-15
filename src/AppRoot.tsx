import { useEffect, useState } from "react";
import App from "./App";
import { DemoProvider } from "./context/DemoContext";
import AdminDemo from "./sections/AdminDemo";
export default function AppRoot() {
  const [admin, setAdmin] = useState(() =>
    window.location.hash.startsWith("#/admin"),
  );
  useEffect(() => {
    const route = () => {
      const next = window.location.hash.startsWith("#/admin");
      setAdmin(next);
      if (next) window.scrollTo({ top: 0, behavior: "instant" });
    };
    window.addEventListener("hashchange", route);
    return () => window.removeEventListener("hashchange", route);
  }, []);
  useEffect(() => {
    if (
      !admin &&
      window.location.hash &&
      !window.location.hash.startsWith("#/")
    )
      requestAnimationFrame(() =>
        document
          .getElementById(window.location.hash.slice(1))
          ?.scrollIntoView({ block: "start", behavior: "instant" }),
      );
  }, [admin]);
  return <DemoProvider>{admin ? <AdminDemo /> : <App />}</DemoProvider>;
}
