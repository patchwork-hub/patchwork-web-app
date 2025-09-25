import { getToken } from ".";

const useLoggedIn = () => {
  const token = getToken();
  const isLoggedIn = !!token;
  return isLoggedIn;
};

export default useLoggedIn;
