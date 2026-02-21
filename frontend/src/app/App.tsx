import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";

function App() {
  // const dispatch = useAppDispatch();

  useAutoSync()

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
