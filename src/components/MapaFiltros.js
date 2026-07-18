import { useState, useEffect } from 'react';
import Select from 'react-select';

const intervalos = [
    { value: 0, label: 'Indice Calidad Aire' },
    { value: 1, label: 'Concentracion horaria' },
]

const MapaFiltros = ({ onApply }) => {

    const [interval, setInterval_] = useState(intervalos[0]);

    useEffect(() => {
        onApply({ interval });
    }, [interval, onApply])

    return (
        <Select
            className="mb-4"
            placeholder="Medida"
            options={intervalos}
            onChange={setInterval_}
            value={interval}
        />
    );
};

export default MapaFiltros;
