
import { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { fetchUser } from '../authSlice';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);
  
  useEffect(() => {

    const hash = window.location.hash.substring(1); // remove '#'
    const params = new URLSearchParams(hash);
    const token = params.get('token');

    console.log("token in oauthCallback: ",token)

    if (token) {
      localStorage.setItem("token", token);
      dispatch(fetchUser());
    } else {
      navigate('/login');
    }
  }, []);

  if(loading) {
    return <div className='flex h-screen w-screen items-center justify-center'>
      <LoadingSpinner text="loading user..."/>
    </div>
  }

  return <Navigate to="/" replace />
}