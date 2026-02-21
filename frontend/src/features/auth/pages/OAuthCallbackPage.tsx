
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { fetchUser } from '../authSlice';
import { useAppDispatch } from '../../../app/hooks';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    const token = params.get("token");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("token", token);

    dispatch(fetchUser())
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch(() => {
        navigate("/login");
      });

  }, [dispatch, navigate]);

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <LoadingSpinner text="Loading user..." />
    </div>
  );
}