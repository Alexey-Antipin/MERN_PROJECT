import React, { useContext, useState } from "react";
import { BrowserRouter, Route, Link, Switch } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../Context/AuthContext";

export const Authorization = () => {
  const { login } = useContext(AuthContext)

  //Регистрация.
  const [RegisUndLogin, setRegisUndLogin] = useState({
    email: '',
    password: ''
  })

  //Value регистрация.
  const changevalue = (event) => {
    setRegisUndLogin({ ...RegisUndLogin, [event.target.name]: event.target.value })
  }

  //Post.Регистрация.
  const Registration = async (req, res) => {
    try {
      await axios.post('/api/auth/registration', { ...RegisUndLogin }, {
        headers: { "Content-Type": "application/json" }
      })
        .then((res) => console.log("Регистрация произошла", res))
    } catch (error) {
      console.log("Не произошло регистрации", error)
    }
  }

  //Post.Авторизование.
  const Authorization = async (req, res) => {
    try {
      await axios.post('/api/auth/authorization', { ...RegisUndLogin }, {
        headers: { "Content-Type": "application/json" }
      })
        .then(res => {
          login(res.data.token, res.data.userId)
        })
    } catch (error) {
      console.log("Не произошло Авторизовации", error)
    }
  }

  return (
    <BrowserRouter>
      <Switch>
        <React.Fragment>
          <div>
            <Route path="/registration">
              {/* Форма регистрации */}
              <form
                className="Authorization"
                onClick={(e) => e.preventDefault()}>
                <div className="Authorization_blue">
                  <div className="Authorization__Slide">
                    Регистрация
                  </div>

                  {/* Почта */}
                  <input
                    className="Authorization__Input"
                    placeholder="email"
                    type="email"
                    name="email"
                    onChange={changevalue}>
                  </input>

                  {/* Пароль */}
                  <input
                    className="Authorization__Input"
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={changevalue}>
                  </input>

                  <div className="Authorization__ButtonContainer">
                    <button
                      className="Authorization__Button"
                      onClick={() => (Registration())}>
                      Регистрация
                    </button>
                    <button
                      className="Authorization__Button">
                      <Link to="/login">Есть аккаунт.</Link>
                    </button>
                  </div>

                </div>
              </form>
            </Route>

            <Route path="/login">
              {/* Форма авторизации */}
              <form
                className="Authorization"
                onClick={(e) => e.preventDefault()}>
                <div className="Authorization_blue">
                  <div className="Authorization__Slide">
                    Авторизация
                  </div>

                  {/* Почта */}
                  <input
                    className="Authorization__Input"
                    placeholder="email"
                    type="email"
                    name="email"
                    onChange={changevalue}>
                  </input>

                  {/* Пароль */}
                  <input
                    className="Authorization__Input"
                    placeholder="password"
                    type="password"
                    name="password"
                    onChange={changevalue}>
                  </input>

                  <div className="Authorization__ButtonContainer">
                    <button
                      className="Authorization__Button"
                      onClick={() => (Authorization())}>
                      Авторизоваться
                    </button>
                    <button
                      className="Authorization__Button">
                      <Link to="/registration">Нет аккаунта.</Link>
                    </button>
                  </div>
                </div>

              </form>
            </Route>
          </div >
        </React.Fragment>
      </Switch>
    </BrowserRouter>
  )
}