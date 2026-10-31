import { useQuery } from "@tanstack/react-query";
import { getPopularTracks } from "../apis/albumApi";

const useGetPopularTracks = () => {
  return useQuery({
    queryKey: ["popular-tracks"],
    queryFn: getPopularTracks,
  });
};

export default useGetPopularTracks;