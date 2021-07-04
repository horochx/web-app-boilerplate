import type { FC } from "react";
import React, { Suspense } from "react";
import { HashRouter as Router, Link, Route, Switch } from "react-router-dom";

const Example = React.lazy(() => import("lib/component/Example"));

const App: FC = () => {
  return (
    <Suspense fallback={<div>loading...</div>}>
      <Router>
        <Switch>
          <Route path="/" exact={true}>
            <Link to="/app">Example</Link>
          </Route>
          <Route path="/app" component={Example} />
        </Switch>
      </Router>
    </Suspense>
  );
};

export default App;
