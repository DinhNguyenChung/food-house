import { useSelector } from "react-redux";

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  return {
    user,
    isAuthenticated,
    loading,
    isAdmin: isAuthenticated && user?.user?.role === "ADMIN",
    isStaff: isAuthenticated && user?.user?.role === "STAFF",
  };
};
