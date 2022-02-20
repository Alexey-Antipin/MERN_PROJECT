import {Header} from "./Components/Header";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { useRoutes } from "./routes";
import { AuthContext } from './Context/AuthContext';
import { useAuth } from './hook/auth.hook';
import "./scss/index.scss";

function App() {
  const { login, logout, token, userId, isReady } = useAuth()
  const isLogin = !!token
  const routes = useRoutes(isLogin)

  return (
    <AuthContext.Provider value={{ isLogin,login, logout, token, userId, isReady }}>
      <div className="App">
        <BrowserRouter>
          <Header />
          {routes}
        </BrowserRouter>
      </div>
    </AuthContext.Provider>
  );
}

export default App;
