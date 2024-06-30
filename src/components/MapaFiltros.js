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
        <div className="position-absolute end-50 top-0 z-1">
            <Select
                className="mb-4"
                placeholder="Medida"
                options={intervalos}
                onChange={setInterval_}
                value={interval}
            />
        </div>
    );
};

export default MapaFiltros;
