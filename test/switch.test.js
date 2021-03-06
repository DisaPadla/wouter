import React from "react";
import TestRenderer from "react-test-renderer";

import { Router, Route, Switch } from "../index.js";
import memoryHistory from "../extra/memory-history";

const testRouteRender = (initialPath, jsx) => {
  const history = memoryHistory(initialPath);
  const instance = TestRenderer.create(<Router history={history}>{jsx}</Router>)
    .root;

  return instance;
};

it("always renders no more than 1 matched children", () => {
  const result = testRouteRender(
    "/users/12",
    <Switch>
      <Route path="/users/home">
        <h1 />
      </Route>
      <Route path="/users/:id">
        <h2 />
      </Route>
      <Route path="/users/:rest*">
        <h3 />
      </Route>
    </Switch>
  );

  const rendered = result.children[0].children;

  expect(rendered.length).toBe(1);
  expect(result.findByType("h2")).toBeTruthy();
});

it("ignores mixed children", () => {
  const result = testRouteRender(
    "/users",
    <Switch>
      Here is a<Route path="/users">route</Route>
      route
    </Switch>
  );

  const rendered = result.children[0].children;

  expect(rendered.length).toBe(1);
  expect(rendered[0].type).toBe(Route);
});

it("allows to specify which routes to render via `location` prop", () => {
  const result = testRouteRender(
    "/something-different",
    <Switch location="/users">
      <Route path="/users">route</Route>
    </Switch>
  );

  const rendered = result.children[0].children;

  expect(rendered.length).toBe(1);
  expect(rendered[0].type).toBe(Route);
});

