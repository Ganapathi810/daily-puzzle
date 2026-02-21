import { useAppSelector } from "./hooks";
import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";

function App() {
  // const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  if(user) useAutoSync()

  // useEffect(() => {
  //   const token = localStorage.getItem("token");

  //   if (token) {
  //     dispatch(fetchUser());
  //   }
  // }, []);

  // if (loading) {
  //   return <LoadingSpinner />;
  // }

  return <AppRouter />;
}

export default App;
