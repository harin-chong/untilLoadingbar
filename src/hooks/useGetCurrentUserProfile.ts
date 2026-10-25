
import { useQuery } from "@tanstack/react-query";
import { getCurrentUserProfile } from "../apis/userApi";

const useGetCurrentUserProfile = (
  accessToken: string | null
) => {
  return useQuery({
    queryKey: ["current-user-profile", accessToken],
    queryFn: () => {
      if (!accessToken) {
        throw new Error("Access token is missing");
      }

      return getCurrentUserProfile(accessToken);
    },
    enabled: Boolean(accessToken),
  });
};

export default useGetCurrentUserProfile;
