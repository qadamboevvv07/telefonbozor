import { useEffect, useState } from "react";
import { ADMIN_CREDENTIALS } from "./site-data";

const KEY = "tb_admin_session";

export function useAdminAuth() {
  const [authed, setAuthed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setAuthed(typeof window !== "undefined" && localStorage.getItem(KEY) === "1");
    setReady(true);
  }, []);

  return {
    authed,
    ready,
    login: (login: string, password: string) => {
      if (login === ADMIN_CREDENTIALS.login && password === ADMIN_CREDENTIALS.password) {
        localStorage.setItem(KEY, "1");
        setAuthed(true);
        return true;
      }
      return false;
    },
    logout: () => {
      localStorage.removeItem(KEY);
      setAuthed(false);
    },
  };
}