import React from 'react';
import { TablaCalidad } from '../../components/TablaCalidad';
import { useSelector } from 'react-redux';

function AirQualityTable () {
  const { contaminant } = useSelector((state) => state.form);
  return(
    <div>
      <TablaCalidad gas={contaminant?.label || ""}/>
    </div>
  );
}

export default AirQualityTable;
