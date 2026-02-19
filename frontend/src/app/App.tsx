import { useEffect } from "react";
import { useAppDispatch } from "./hooks";
import { fetchUser } from "../features/auth/authSlice";
import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";

function App() {
  const dispatch = useAppDispatch();

  useAutoSync()

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  return <AppRouter />;
}

export default App;
