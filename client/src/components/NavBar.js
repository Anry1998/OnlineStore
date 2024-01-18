import React, {useContext} from "react";
import {Context} from "../index";

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from "react-router-dom";
import { ADMIN_ROUTE, LOGIN_ROUTE, SHOP_ROUTE } from "../utils/consts";
import {Button}from 'react-bootstrap';
import {observer} from "mobx-react-lite";
import {useNavigate } from "react-router-dom"

const NavBar = observer(() => {
     const {user} = useContext(Context)
     const navigate = useNavigate()

     const logOut = () => {
      user.setUser({})
      user.setIsAuth(false)
      navigate(LOGIN_ROUTE)
     }



    return (
        <>
        <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <NavLink style={{color: 'white', textDecoration: 'none'}} to={SHOP_ROUTE}>Купи девайс</NavLink>
         {user.isAuth ?
          <Nav style={{color: 'white'}} className="nl-auto">
            <Button variant={'outline-light'} onClick={()=>navigate(ADMIN_ROUTE)}>Админ панель</Button>
            <Button 
              variant={'outline-light'} 
              className='ml-4' 
              onClick={()=>logOut()}
            >
              Выйти
            </Button>
          </Nav>
          :
          <Nav style={{color: 'white'}} className="nl-auto">
            <Button variant={'outline-light'} >Авторизация</Button>
          </Nav>
        }
          
        </Container>
      </Navbar>
 
      
        </>
    )
})

export default NavBar