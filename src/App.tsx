
import React, { Suspense } from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";

import HomePage from "./pages/Homepage/HomePage";
import SearchPage from "./pages/SearchPage/SearchPage";
import SearchWithPage from "./pages/SearchWithPage/SearchWithPage";
import PlaylistDetailPage from "./pages/PlaylistDetailPage/PlaylistDetailPage";
import PlaylistPage from "./pages/PlaylistPage/PlaylistPage";
import AlbumDetail from "./pages/AlbumDetail";

import LoadingSpinner from "./common/component/LoadingSpinner";

const AppLayout = React.lazy(() => import("./AppLayout"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />

          <Route path="search" element={<SearchPage />} />
          <Route path="search/:keyword" element={<SearchWithPage />} />

          <Route path="playlist/:id" element={<PlaylistDetailPage />} />
          <Route path="playlist" element={<PlaylistPage />} />

          {/* Album detail page */}
          <Route path="album/:id" element={<AlbumDetail />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
