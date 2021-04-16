import { apiUrl } from '../constants';

const retry = (fn, ms = 1000, retries = 5) =>
    new Promise((resolve, reject) => {
        fn()
            .then(resolve)
            .catch(() => {
                setTimeout(() => {
                    if (!retries) {
                        return reject(
                            'Se excedió el número máximo de intentos'
                        );
                    }
                    retry(fn, ms, retries - 1).then(resolve, reject);
                }, ms);
            });
    });

const fetchSummaryDataFn = () =>
    new Promise((resolve, reject) => {
        fetch(`${apiUrl}/sensor-summary`)
            .then((res) => {
                if (res.status === 200) {
                    return res.json();
                } else {
                    reject();
                }
            })
            .then((json) => {
                resolve(json);
            })
            .catch((err) => reject(err));
    });

export const fetchSummaryData = () => {
    return retry(fetchSummaryDataFn);
};
