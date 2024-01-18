import React, { useContext } from 'react'
import { authRoutes, publicRoutes } from '../routes';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Shop from '../pages/Shop'
import { Context } from '../index';

const AppRouter = () => {
  const {user} = useContext(Context)
  console.log(user)
  return (
    <>
        <Routes>
            {user.isAuth && authRoutes.map(({path, Component}) =>
                <Route key={path} path={path} Component={Component} exact/>
              )}

            {publicRoutes.map(({path, Component}) =>
                <Route key={path} path={path} Component={Component} exact/>
              )}


            <Route path='*' element={<Shop/>}/>

            {/* Redirect to */}
          
    
              
        </Routes>
          
      
    </>
  );
}

export default AppRouter;