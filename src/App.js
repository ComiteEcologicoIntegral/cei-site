import { Route, Routes } from "react-router-dom";
import Prediccion from "./Pages/Prediccion";
import MapPage from "./Mapa";
import ReporteAnual from "./Pages/AnnualReport";
import "./App.css";
import CalendarSection from "./Pages/CalendarSection/index.js";
import GraphSection from "./Pages/Plot/index.js";
import Concepts from "./Pages/Concepts/index.js";
import Layout from "./components/Layout.js";
import Recomendaciones from "./components/Recomendaciones";
import Landing from "./Pages/Landing/landing.jsx";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="/mapa" element={<MapPage />} />
          <Route path="/calendario" element={<CalendarSection />} />
          <Route path="/historico" element={<GraphSection />} />
          <Route path="/pronostico" element={<Prediccion />} />
          <Route path="/reporte-anual" element={<ReporteAnual />} />
          <Route path="/conceptos" element={<Concepts />} />
          <Route path="/recomendaciones" element={<Recomendaciones selected="buena" isManual={true} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
