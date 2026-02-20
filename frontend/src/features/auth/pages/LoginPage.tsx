import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../app/hooks";
import { fetchUser } from "../authSlice";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export default function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGoogleLogin = () => {
    window.location.href = `/api/auth/google`;
  };

  const handleLoginAsGuest = async () => {
    localStorage.setItem("authMode", "guest");
    localStorage.setItem("guestId", crypto.randomUUID());
    localStorage.setItem(
    "guestCreatedAt",
      new Date().toISOString()
    );

    await dispatch(fetchUser()); 

    navigate("/");
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col gap-5 items-center bg-[#03162c] rounded-2xl shadow-lg shadow-[#130f59] p-3 h-[70vh] w-full mx-4 sm:mx-0  sm:w-96">
          <img 
            src="/favicon.ico" 
            alt="Logo" 
            className="size-12 rounded-md mt-2" 
            style={{
              boxShadow: "0px 0px 10px 2px #2f26d4"
            }}
          />
          <span className="text-3xl text-white font-semibold">Daily Puzzle</span>
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold text-white">Log in or Sign up</h1>
            <p className="text-gray-400 mt-1">Ready to solve today’s puzzle?</p>
          </div>
        <button
          className="mt-8 bg-blue-500 hover:bg-blue-600 transition-all duration-200 px-8 py-2 rounded-md flex items-center gap-2 cursor-pointer"
          onClick={handleGoogleLogin}
        >
          <svg className="size-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
            <path d="M564 325.8C564 467.3 467.1 568 324 568C186.8 568 76 457.2 76 320C76 182.8 186.8 72 324 72C390.8 72 447 96.5 490.3 136.9L422.8 201.8C334.5 116.6 170.3 180.6 170.3 320C170.3 406.5 239.4 476.6 324 476.6C422.2 476.6 459 406.2 464.8 369.7L324 369.7L324 284.4L560.1 284.4C562.4 297.1 564 309.3 564 325.8z"/>
          </svg>
          Sign up with Google
        </button>

        <p className="text-white mt-4">OR</p>

        <button   
          className="bg-blue-500 w-60 py-2 hover:bg-blue-600 transition-all duration-200 rounded-md flex items-center justify-center cursor-pointer"
          onClick={handleLoginAsGuest}
        >
          Login as Guest
        </button>
      </div>
    </div>
  );
}
