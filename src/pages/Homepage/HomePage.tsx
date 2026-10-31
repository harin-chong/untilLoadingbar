import React from "react";
import NewReleases from "./components/NewReleases";
import PopularTracks from "./components/PopularTracks";
import RecommendedAlbums from "./components/RecommendedAlbums";

const HomePage = () => {
  return (
    <>
      <NewReleases />
      <PopularTracks />
      <RecommendedAlbums />
    </>
  );
};

export default HomePage;