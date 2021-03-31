import React, { useState, useEffect} from 'react'
import RHFiltros from './components/RHFiltros'
import Grafica from './components/Grafica';
import Calendario from './components/Calendario';
import recordData from './handlers/last-records.json';

function Registro() {
    const [data, setData] = useState(null);
    const [radioValue, setRadioValue] = useState('1');
    const [q, setQ] = useState(null);
    
    const [indi, setIndi] = useState("PM25");
    const [desde, setDesde] = useState(null);
    const [hasta, setHasta] = useState(null);

    useEffect(() => {
        if (q) {
            console.log(q);
        }
        setData(recordData);

    }, [q]);
    
    function createQuery(ind, ubic) {
        if (!ubic) {
            alert("Selecciona una ubicación.");
            return;
        }

        let query = {};
        if (radioValue === "1") {
            if (!desde || !hasta) {
                alert("Llena las fechas.");
                return;
            }
            query.fechaInicial = desde;
            query.fechaFinal = hasta;
        }

        query.indicador = ind.value;
        query.ubicacion = ubic;

        setIndi(ind.value);
        setQ(query); 
    }

    return (
        <div className="container mb-10">
            <RHFiltros createQuery={createQuery} radioValue={radioValue} setRadioValue={setRadioValue}/>
            { radioValue === '1' && (
                <Grafica setDesde={setDesde} setHasta={setHasta}/>
            )}
            { radioValue === '2' && (
                <Calendario data={data} indi={indi}/>
            )}
        </div>
    )
}

export default Registro
