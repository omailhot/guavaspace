import { useNavigate } from '@tanstack/react-router';

import { useAuthContext } from '../contexts/AuthContext';
import { IndexRoute } from '../routes/home';

export const useManagerProfile = () => {
  const navigate = useNavigate();

  const { managerProfile } = useAuthContext();

  if (!managerProfile) {
    navigate({
      to: IndexRoute.fullPath,
    });
  }

  return managerProfile!;
};
