
import { useQuery } from "@tanstack/react-query";
import { getClientCredentialToken } from "../apis/authApi";

const useClientCredentialToken = () => {
  return useQuery({
    queryKey: ["client-credential-token"],
    queryFn: getClientCredentialToken,
    staleTime: 3500 * 1000,
    retry: 1,
  });
};

export default useClientCredentialToken;
