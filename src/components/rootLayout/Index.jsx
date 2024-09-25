import React from 'react'
import Navber from '../sidebar/Navber'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <>
    <div className='w-full h-screen flex items-center justify-center'>
      <div className='w-full h-full bg-white dark:bg-slate-800 flex '>
      <Navber />
      <Outlet />
      </div>
    </div>
    </>
  )
}

export default RootLayout
