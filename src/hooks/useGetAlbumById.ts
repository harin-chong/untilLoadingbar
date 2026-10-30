import { useQuery } from "@tanstack/react-query";
import { getAlbumById } from "../apis/albumApi";

const useGetAlbumById = (albumId: string) => {
  return useQuery({
    queryKey: ["album", albumId],
    queryFn: () => getAlbumById(albumId),
    enabled: Boolean(albumId),
  });
};

export default useGetAlbumById;