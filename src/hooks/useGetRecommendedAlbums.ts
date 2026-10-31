import { useQuery } from "@tanstack/react-query";
import { getRecommendedAlbums } from "../apis/albumApi";

const useGetRecommendedAlbums = () => {
  return useQuery({
    queryKey: ["recommended-albums"],
    queryFn: getRecommendedAlbums,
  });
};

export default useGetRecommendedAlbums;