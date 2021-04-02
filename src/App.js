import './App.css';
import Mapa from './Mapa';
import Registro from './Registro';
import Compara from './Compara';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import Header from './components/Header.js';
import Footer from './components/Footer.js';

function App() {
    return (
        <div className="App">
            <BrowserRouter>
                <Header />
                <Switch>
                    <Route exact path="/" component={Mapa} />
                    <Route exact path="/registro" component={Registro} />
                    <Route exact path="/compara" component={Compara} />
                </Switch>
                <Footer />
            </BrowserRouter>
        </div>
    );
}

export default App;
