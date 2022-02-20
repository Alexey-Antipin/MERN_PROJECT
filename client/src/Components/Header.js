import React, { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export const Header = () => {
  const { isLogin, logout } = useContext(AuthContext)

  return (
    <div className="Header">
      <header className="Header__Slide">
        Контактик
      </header>
      <div className="Header__Title">
        {isLogin
          ? <div onClick={logout}> Выйти</div>
          : <div>Войти</div>}
      </div>
    </div>
  )
}