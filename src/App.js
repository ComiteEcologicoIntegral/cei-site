import { lazy, Suspense } from "react";
import "./App.css";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Loading from "./components/Loading.js";

const Acerca = lazy(() => import("./Acerca"))
const Mapa = lazy(() => import("./Mapa"));
const Registro = lazy(() => import("./Registro"));
const Compara = lazy(() => import("./Compara"));

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Suspense fallback={<Loading class="loading-default"/>}>
          <Switch>
            <Route exact path="/" component={Mapa} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/compara" component={Compara} />
            <Route exact path="/acerca" component={Acerca} />
          </Switch>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
