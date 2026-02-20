import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./hooks";
import { fetchUser } from "../features/auth/authSlice";
import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";
import LoadingSpinner from "../components/LoadingSpinner";

function App() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useAutoSync()

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      dispatch(fetchUser());
    }
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return <AppRouter />;
}

export default App;
