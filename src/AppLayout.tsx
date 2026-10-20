import React from 'react'
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <aside>Side bar</aside>
      <Outlet />
    </div>
  )
}

export default AppLayout
