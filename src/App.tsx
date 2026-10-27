import React,  { Suspense }  from 'react';
import './App.css';
import { Routes, Route } from "react-router-dom";
import HomePage from './pages/Homepage/HomePage';
import SearchPage from './pages/SearchPage/SearchPage';
import SearchWithPage from './pages/SearchWithPage/SearchWithPage';
import PlaylistDetailPage from './pages/PlaylistDetailPage/PlaylistDetailPage';
import PlaylistPage from './pages/PlaylistPage/PlaylistPage';
import LoadingSpinner from './common/component/LoadingSpinner';
const AppLayout = React.lazy(() => import('./AppLayout'));

// 0. 사이드바 있어야 함 (플레이리스트, 메뉴)
// 1. 홈페이지 /
// 2. 서치페이지 /search
// 3. 서치 결과 페이지 /search/:keyword
// 4. 플레이리스트 디테일 페이지 /playlist/:id
// 5. (모바일 버전) 플레이리스트 보여주는 페이지 /playlist

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
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;