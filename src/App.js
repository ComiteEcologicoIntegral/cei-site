import './App.css';
import Mapa from './Mapa'
import registro from './Registro'
import Calendario from './Calendario'
import Compara from './Compara'
import {Route, Switch, BrowserRouter} from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Mapa}/>
          <Route exact path="/registro" component={registro}/>
          <Route exact path="/calendario" component={Calendario}/>
          <Route exact path="/compara" component={Compara}/>
        </Switch>
      <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
