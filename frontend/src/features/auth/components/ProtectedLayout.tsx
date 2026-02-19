import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { NavBar } from "../../../components/NavBar";
import LoadingSpinner from "../../../components/LoadingSpinner";

export default function ProtectedLayout() {
  const { user, isGuest, loading } = useAppSelector(
    (state) => state.auth
  );

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
