import { Navigate, Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { NavBar } from "../../../components/NavBar";
import LoadingSpinner from "../../../components/LoadingSpinner";
import { useEffect } from "react";
import { fetchUser } from "../authSlice";

export default function ProtectedLayout() {
  const { user, isGuest, loading } = useAppSelector(
    (state) => state.auth
  );
  const dispatch = useAppDispatch();
  

  useEffect(() => {
    dispatch(fetchUser())
  },[])


  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <LoadingSpinner text="Checking authentication..." />
      </div>
    )
  }

  if (!user && !isGuest) {
    return <Navigate to="/login" replace />;
  }




  return (
    <div className="pt-16 pb-10 min-h-screen">
      <NavBar />
      <Outlet />
    </div>
  );
}
