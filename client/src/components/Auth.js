import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Loading from "../components/LoadingOverlay";
import { auth } from "../API";

const Auth = ({ children }) => {
  const navigate = useNavigate();
  const { data: checkauth, isLoading, error } = useQuery({
    queryKey: ["checkauth"],
    queryFn: auth,
    retry: false,
    refetchOnWindowFocus : false,
  });

 
  useEffect(() => {
    if (error || (checkauth && !checkauth.authenticated && !checkauth.authorized)) {
      navigate("/signin");
    }
  }, [checkauth, error, navigate]);

  
  if (isLoading) return <Loading />;

 
  return checkauth && (checkauth.authenticated || checkauth.authorized) ? children : null;
};

export default Auth;