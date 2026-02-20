import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchUser } from "../features/auth/authSlice";
import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";

function App() {
  const dispatch = useAppDispatch();

  useAutoSync()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchUser());
    }
  }, []);

  return <AppRouter />;
}

export default App;
