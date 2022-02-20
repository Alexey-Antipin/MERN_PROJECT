import { Redirect, Route, Switch } from "react-router-dom";
import {Menu} from "./Components/Menu";
import {Authorization} from "./Registation/Authorization";

export const useRoutes = (isLogin) => {

  if (isLogin) {
    return (
      <Switch>
        <Route path="/" exact component={Menu} />
        <Redirect to="/" />
      </Switch>
    )
  }

  return (
    <Switch>
      <Route path="/login" exact component={Authorization} />
      <Redirect to="/login" />
    </Switch>
  )
}