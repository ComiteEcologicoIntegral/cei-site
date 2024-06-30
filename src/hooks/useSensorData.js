import { useState, useEffect } from "react";
import { fetchSummaryData } from "../handlers/data";

const useSensorData = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    fetchSummaryData()
      .then((data) => {
        setSensorData(data)
      }).catch((error) => {
        console.error(error);
      });
  }, []);

  return { sensorData };
};

export default useSensorData;
