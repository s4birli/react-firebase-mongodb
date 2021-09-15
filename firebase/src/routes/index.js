import React from "react";
import {Route, Switch} from "react-router-dom";

import asyncComponent from "util/asyncComponent";

const App = ({match}) => (
  <div className="gx-main-content-wrapper">
    <Switch>
      <Route path={`${match.url}players`} component={asyncComponent(() => import('./Players'))}/>
      <Route path={`${match.url}teams`} component={asyncComponent(() => import('./Teams'))}/>
    </Switch>
  </div>
);

export default App;
