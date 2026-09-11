import { useLocation, useNavigate, useParams } from 'react-router-dom';

export { useLocation, useNavigate, useParams };

export const useHistory = () => {
  const navigate = useNavigate();
  return {
    push: (path: string, state?: any) => navigate(path, { state }),
    replace: (path: string, state?: any) => navigate(path, { replace: true, state }),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };
};
