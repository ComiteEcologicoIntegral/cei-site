import { apiUrl } from '../constants';

const retry = (fn, ms = 1000, maxRetries = 5) =>
    new Promise((resolve, reject) => {
        var retries = 0;
        fn()
            .then(resolve)
            .catch(() => {
                setTimeout(() => {
                    ++retries;
                    if (retries === maxRetries) {
                        return reject(
                            'Se excedió el número máximo de intentos'
                        );
                    }
                    retry(fn, ms).then(resolve);
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
