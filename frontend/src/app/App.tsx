import AppRouter from "./router";
import { useAutoSync } from "../hooks/useAutoSync";
import { ToastContainer } from "react-toastify";

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

  return (
    <>
    <ToastContainer 
      position="top-right" 
      autoClose={5000} 
      hideProgressBar={false} 
      closeOnClick={false} 
      pauseOnHover={true} 
      draggable={true} 
      theme="colored" 
    />
    <AppRouter />
    </>
  )
}

export default App;
