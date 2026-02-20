
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/LoadingSpinner';
import { fetchUser } from '../authSlice';
import { useAppDispatch } from '../../../app/hooks';
import { setToken } from '../authSlice';

export default function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {

    const hash = window.location.hash.substring(1); // remove '#'
    const params = new URLSearchParams(hash);
    const token = params.get('token');

    if (token) {
      dispatch(setToken(token));
      dispatch(fetchUser());
      navigate('/');
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <LoadingSpinner />
}