import './App.css';
import Mapa from './Mapa'
import registro from './Registro'
import Calendario from './Calendario'
import {Route, Switch, Link, BrowserRouter} from 'react-router-dom';
import Header from './components/Header.js';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <Switch>
          <Route exact path="/" component={Mapa}/>
          <Route exact path="/registro" component={registro}/>
          <Route exact path="/calendario" component={Calendario}/>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
