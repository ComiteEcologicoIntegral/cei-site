import { Suspense } from "react";
import { Route, Switch, BrowserRouter } from "react-router-dom";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import Loading from "./components/Loading.js";
import Acerca from "./Acerca";
import Mapa from "./Mapa";
import Registro from "./Pages/RegistroHistorico";
import Compara from "./Compara";
import Recomendaciones from "./components/Recomendaciones.js";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Suspense fallback={<Loading class="loading-default" />}>
          <Switch>
            <Route exact path="/" component={Mapa} />
            <Route exact path="/registro" component={Registro} />
            <Route exact path="/compara" component={Compara} />
            <Route exact path="/acerca" component={Acerca} />
          </Switch>
        </Suspense>
      </BrowserRouter>
      <Recomendaciones selected="buena" isManual={true} />
      <Footer />
    </div>
  );
}

export default App;
