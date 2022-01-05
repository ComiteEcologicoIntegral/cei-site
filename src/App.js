import { lazy, Suspense } from "react";
import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";

const Mapa = lazy(() => import("./Mapa"));
const Registro = lazy(() => import("./Registro"));
const Compara = lazy(() => import("./Compara"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route exact path="/" component={Mapa} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/compara" component={Compara} />
          </Switch>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
