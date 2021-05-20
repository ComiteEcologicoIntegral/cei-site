import moment from 'moment';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSummaryData } from '../handlers/data';
import { setSensorData } from '../redux/reducers';

const useSensorData = ({ cacheTime = 60 }) => {
    const { sensorDataLastUpdate, sensorData } = useSelector((state) => state);
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(sensorData);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Llama a la api si los datos se guardaron hace menos de una hora
        const diff = sensorDataLastUpdate
            ? moment().diff(sensorDataLastUpdate, 'minutes')
            : 999; // Caso sensorDataLastUpdate == null, se tienen que solicitar los datos

        if (diff > cacheTime) {
            fetchSummaryData()
                .then((data) => {
                    dispatch(setSensorData(data));
                    setData(data);
                })
                .catch((err) => {
                    console.error(err);
                    setData([]);
                    setError(err);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, [sensorDataLastUpdate, dispatch, cacheTime]);

    return { loading, data, error };
};

export default useSensorData;
