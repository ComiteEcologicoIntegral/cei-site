import React from "react";
import { BsInfoCircle } from "react-icons/bs";

export default function Leyenda (props) {

  const { showHideState, setshowHideState } = props;

  return (
    <div className="position-absolute end-0 right-0 " style={{zIndex: 99}}>
      { showHideState ?                 
        <div className="leyenda-width" >
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
            <div className="mb-2">
              Sensores del estado
            </div>

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
            <div className="mb-2">
              Sensores PurpleAir
            </div>

            <div className="">ND</div>
            <div>No dato</div>
          </div>
        </div>
        : 
        <div style ={{display: "block"}}>
          <button class="smallBotton" onClick={() => setshowHideState(!showHideState)} >
            <BsInfoCircle  style={{height: "20px", width: "20px"}}/>
          </button>
        </div>

      }
      {/* <OverlayTrigger
              trigger="click"
              placement={"left"}
              overlay={
                <Popover>
                  <Popover.Title as="h3">Leyenda</Popover.Title>
                  <Popover.Content>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          boxSizing: "border-box",
                          borderRadius: "100%",
                          width: "35px",
                          height: "20px",
                          marginRight: "0.75rem",
                          padding: 0,
                          border: "1px solid black",
                        }}
                      ></div>
                      Los sensores del estado se representan con un círculo
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          boxSizing: "border-box",
                          width: "35px",
                          height: "20px",
                          marginRight: "0.75rem",
                          padding: 0,
                          border: "1px solid black",
                        }}
                      ></div>
                      Los sensores de Purple Air se representan con un cuadrado
                    </div>
                  </Popover.Content>
                </Popover>
              }
            >
              <Button variant="link" className="pe-auto">
                Leyenda
              </Button>
            </OverlayTrigger> */}
    </div>
  );
}
