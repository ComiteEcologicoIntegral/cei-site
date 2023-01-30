import React from "react"
function TablePred({
    title
}){
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    return (
        <div>
           <div class="tableDiv">
        <h3 class="stationName">{title}</h3>
        <div id="table-wrapper">
        <div id="table-scroll">
        <table class="predictionTable">
          <thead>
            <tr>
              <th class="superTableSpace">HORARIO</th>
              <th>{tomorrow.toDateString()}</th>
              <th>{dayAfterTomorrow.toDateString()}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th class="titleH">Madrugada 12:00 am - 6:00 am</th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
              <th style={{ backgroundColor: "#95BF39" }}></th>
            </tr>
            <tr>
              <th class="titleH">Mañana 6:00 am - 12:00 pm</th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
              <th style={{ backgroundColor: "#F2E313" }}></th>
            </tr>
            <tr>
              <th class="titleH">Tarde 12:00 pm - 6:00 pm</th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
              <th style={{ backgroundColor: "#F2811D" }}></th>
            </tr>
            <tr>
              <th class="titleH" align="center">Noche 6:00 pm - 12:00 am</th>
              <th style={{ backgroundColor: "#F22233" }}></th>
              <th style={{ backgroundColor: "#F22233" }}></th>
            </tr>
          </tbody>
        </table>
        </div>
      </div>
      </div>
    </div> 
    );
}
export default TablePred;