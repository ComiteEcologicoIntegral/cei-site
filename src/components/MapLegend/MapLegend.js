import React, { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import Radium, { StyleRoot } from "radium";
import "./MapLegend.css"

const flash = {
  "10%": {
    transform: "scale(1.3)",
  },
  "20%": {
    transform: "rotate(0.1turn) scale(1.3)",
  },
  "40%": {
    transform: "rotate(-0.1turn) scale(1.3)",
  },
  "60%": {
    transform: "rotate(0.1turn) scale(1.3)",
  },
  "80%": {
    transform: "rotate(-0.1turn) scale(1.3)",
  },
};

const styles = {
  flash: {
    animation: "x 2s linear 2",
    animationName: Radium.keyframes(flash, "flash"),
    transformOrigin: "center",
  },
};

export default function MapLegend(props) {
  const { showHideState, setshowHideState } = props;
  const [flashStyle, setflashStyle] = useState(styles.flash);
  let intervalId = null;

  useEffect(() => {
    if (!showHideState) {
      clearInterval(intervalId);
      intervalId = setInterval(() => {
        setflashStyle((flashStyle) => (flashStyle === styles.flash ? {} : styles.flash));
      }, 5000);

      return () => {
        clearInterval(intervalId);
        intervalId = null;
      };
    }
  }, [showHideState]);

  const LegendItem = (props) => {
    const { text, icon } = props;

    return (
      <div className="legend-item">
        {icon && (
          <div className="legend-item-icon">
            <img src={icon} alt={"Legend Icon"} />
          </div>
        )}
        <div className="legend-item-text">{text}</div>
      </div>
    );
  };

  return (
    <div className="position-absolute end-0 right-0 d-flex flex-center" style={{ zIndex: 99 }}>
      {showHideState ? (
        <div className="legend-width">
          <div className="legend-header">
            <h6>Leyenda</h6>
            <div className="hide-legend-button">
              <button onClick={() => setshowHideState(!showHideState)}>x</button>
            </div>
          </div>
          <div className="legend-grid">
            <LegendItem text={"Sensores del Estado"} icon={"images/sensor_estado.png"} />
            <LegendItem text={"Sensores PurpleAir"} icon={"images/sensor_purple_air.png"} />
            <LegendItem text={"ND"} icon={"images/no_data.png"} />
          </div>
        </div>
      ) : (
        <StyleRoot>
          <div className="info-button-container" style={flashStyle}>
            <button class="info-button" onClick={() => setshowHideState(!showHideState)}>
              <BsInfoCircle
                style={{
                  height: "20px",
                  width: "20px",
                  backgroundColor: "white",
                  borderRadius: "50%",
                }}
              />
            </button>
          </div>
        </StyleRoot>
      )}
    </div>
  );
}

