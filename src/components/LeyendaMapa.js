import React, { useState, useEffect } from "react";
import { BsInfoCircle } from "react-icons/bs";
import Radium, { StyleRoot } from "radium";

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
  }
};

const styles = {
  flash: {
    animation: "x 2s linear 2",
    animationName: Radium.keyframes(flash, "flash"),
    transformOrigin: "center",
  },
};

export default function Leyenda(props) {
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

  return (
    <div className="position-absolute end-0 right-0 " style={{ zIndex: 99 }}>
      {showHideState ? (
        <div className="leyenda-width">
          <div className="leyenda-header">
            <h6>Leyenda</h6>
            <div className="ocultar-leyenda">
              <button onClick={() => setshowHideState(!showHideState)}>x</button>
            </div>
          </div>
          <div className="leyenda-grid">
            <div
              style={{
                boxSizing: "border-box",
                borderRadius: "100%",
                width: "20px",
                height: "20px",
                marginRight: "0.75rem",
                padding: 0,
                border: "1px solid black",
              }}
              className="mb-2"
            ></div>
            <div className="mb-2">Sensores del estado</div>

            <div
              style={{
                boxSizing: "border-box",
                width: "20px",
                height: "20px",
                marginRight: "0.75rem",
                padding: 0,
                border: "1px solid black",
              }}
              className="mb-2"
            ></div>
            <div className="mb-2">Sensores PurpleAir</div>
            <div className="">ND</div>
            <div>No dato</div>
          </div>
        </div>
      ) : (
        <StyleRoot>
          <div className="info-button-container" style={flashStyle}>
            <button class="info-button" onClick={() => setshowHideState(!showHideState)}>
              <BsInfoCircle style={{ height: "20px", width: "20px", backgroundColor: "white", borderRadius: "50%" }} />
            </button>
          </div>
        </StyleRoot>
      )}
    </div>
  );
}
