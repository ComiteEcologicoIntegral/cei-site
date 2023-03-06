import "../../App.css";
import React, { useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import { apiUrl } from "../../constants";

function Prediccion() {

  const [system, setSystem] = useState(null);
  const [location, setLocation] = useState(null);
  const [isShown, setIsShown] = useState(false);
  const [title, setTitle] = useState(null);
  const [contaminant, setContaminant] = useState(null);
  const [dataText, setDataText] = useState(null);
  const [hourDateText, sethourDateText] = useState(null);
  const [dataColors, setDataColors] = useState(null);

  function getDropdownValues(){
    var locationSTR = location.label
    var contaminantSTR = contaminant.value
    setTitle(locationSTR.concat("    (",contaminant.label,")"))
    return contaminantSTR
  }

  function getBigger6hrs(dataJSON){
    var biggers = [];
    var LookBiggers = [];
    var n=0;
    for (var o = 0; o < 8; o++) {
      LookBiggers = []
      for (var i = n; i < 6+n; i++) {
        if(i>=Object.keys(dataJSON).length){
          break;
        }else{
          LookBiggers.push(dataJSON[i][contaminant.label])
        }
      }
      console.log(Math.max.apply(null,LookBiggers))
      biggers[o]=(Math.max.apply(null,LookBiggers))
      n = n+6
    }
    setDataText(biggers)
    return biggers
  }
  function getHoursText(){
    var HoursText = [];
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfterTomorrow = new Date(today);
    dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
    var date = 1
    const d = new Date();
    let hour = d.getHours();
    var string = ""
    for (var i = 0; i < 8; i++) {
      if((hour+6)>=24){
        string = ""
        if(date==1){
          HoursText.push(string.concat((today.toDateString().slice(4,-4))," | ",hour," hrs - ",((6-(24-hour))+0)," hrs"))
        }else if(date==2){
          HoursText.push(string.concat((tomorrow.toDateString().slice(4,-4))," | ",hour," hrs - ",((6-(24-hour))+0)," hrs"))
        }else if(date==3){
          HoursText.push(string.concat((dayAfterTomorrow.toDateString().slice(4,-4))," | ",hour," hrs - ",((6-(24-hour))+0)," hrs"))
        }
        hour = ((6-(24-hour))+0)
        date = date + 1
      }else{
        string = ""
        if(date==1){
          HoursText.push(string.concat((today.toDateString().slice(4,-4))," | ",hour," hrs - ",hour+6," hrs"))
        }else if(date==2){
          HoursText.push(string.concat((tomorrow.toDateString().slice(4,-4))," | ",hour," hrs - ",hour+6," hrs"))
        }else if(date==3){
          HoursText.push(string.concat((dayAfterTomorrow.toDateString().slice(4,-4))," | ",hour," hrs - ",hour+6," hrs"))
        }
        hour = hour+6
      }    
      }
      sethourDateText(HoursText)
    }
  function getColors(contaminantSTR, biggest){
    var colors = [];
    var color = "#4d4d4d"
    for (var p = 0;p<8;p++){
      color = "#4d4d4d"
      if (contaminantSTR=="PM25"){
        if(biggest[p]>=0&&biggest[p]<=12){
          color = "#95BF39"
        }else if(biggest[p]>=12.1&&biggest[p]<=35.4){
          color = "#F2E313"
        }else if(biggest[p]>=35.5&&biggest[p]<=55.4){
          color = "#F2811D"
        }else if(biggest[p]>=55.5&&biggest[p]<=150.4){
          color = "#F22233"
        }else if(biggest[p]>=150.5&&biggest[p]<=250.4){
          color = "#73022C"
        }else if(biggest[p]>=250.5&&biggest[p]<=500.4){
          color = "#45011A"
        }else{
          color = "#4d4d4d"
        }

      }else if(contaminantSTR=="PM10"){
        if(biggest[p]>=0&&biggest[p]<=54){
          color = "#95BF39"
        }else if(biggest[p]>=55&&biggest[p]<=154){
          color = "#F2E313"
        }else if(biggest[p]>=155&&biggest[p]<=254){
          color = "#F2811D"
        }else if(biggest[p]>=255&&biggest[p]<=354){
          color = "#F22233"
        }else if(biggest[p]>=355&&biggest[p]<=424){
          color = "#73022C"
        }else if(biggest[p]>=425&&biggest[p]<=604){
          color = "#45011A"
        }else{
          color = "#4d4d4d"
        }

      }else if(contaminantSTR=="O3"){
        if(biggest[p]>=0&&biggest[p]<=0.054){
          color = "#95BF39"
        }else if(biggest[p]>=0.055&&biggest[p]<=0.070){
          color = "#F2E313"
        }else if(biggest[p]>=0.071&&biggest[p]<=0.085){
          color = "#F2811D"
        }else if(biggest[p]>=0.086&&biggest[p]<=0.105){
          color = "#F22233"
        }else if(biggest[p]>=0.106&&biggest[p]<=0.200){
          color = "#73022C"
        }else{
          color = "#4d4d4d"
        }
      }else if(contaminantSTR=="CO"){
        if(biggest[p]>=0&&biggest[p]<=4.4){
          color = "#95BF39"
        }else if(biggest[p]>=4.5&&biggest[p]<=9.4){
          color = "#F2E313"
        }else if(biggest[p]>=9.5&&biggest[p]<=12.4){
          color = "#F2811D"
        }else if(biggest[p]>=12.5&&biggest[p]<=15.4){
          color = "F22233"
        }else if(biggest[p]>=15.5&&biggest[p]<=30.4){
          color = "#73022C"
        }else if(biggest[p]>=30.5&&biggest[p]<=50.4){
          color = "45011A"
        } else{
          color = "#4d4d4d"
        }
      }else if(contaminantSTR=="NO2"){
        if(biggest[p]>=0&&biggest[p]<=53){
          color = "#95BF39"
        }else if(biggest[p]>=54&&biggest[p]<=100){
          color = "#F2E313"
        }else if(biggest[p]>=101&&biggest[p]<=360){
          color = "#F2811D"
        }else if(biggest[p]>=361&&biggest[p]<=649){
          color = "#F22233"
        }else if(biggest[p]>=650&&biggest[p]<=1249){
          color = "#73022C"
        }else if(biggest[p]>=1250&&biggest[p]<=2049){
          color = "45011A"
        }else{
          color = "#4d4d4d"
        }
      }else if(contaminantSTR=="SO2"){
        if(biggest[p]>=0&&biggest[p]<=35){
          color = "#95BF39"
        }else if(biggest[p]>=36&&biggest[p]<=75){
          color = "#F2E313"
        }else if(biggest[p]>=76&&biggest[p]<=185){
          color = "#F2811D"
        }else if(biggest[p]>=186&&biggest[p]<=304){
          color = "#F22233"
        }else if(biggest[p]>=305&&biggest[p]<=604){
          color = "#73022C"
        }else if(biggest[p]>=605&&biggest[p]<=1004){   
          color = "45011A"
        }else{
          color = "#4d4d4d"
        }
      }else{
        console.log("Contaminante no válido")
      }
      colors[p]=color
    }
    setDataColors(colors);
  }
  function GETJASON(){
    var xhReq = new XMLHttpRequest();
    xhReq.open("GET", `${apiUrl}/get-location-prediction?location=${location.label}`, false);
    xhReq.send(null);
    var dataJSON = JSON.parse(xhReq.responseText);
    return dataJSON
  }
  const fetchData = () => {
    if(system!=null&&location!=null&&contaminant!=null){
      var dataJSON = null
      let contaminantSTR = getDropdownValues();
      console.log(contaminantSTR);
      try{
        dataJSON = GETJASON();
      }catch (error) {
        console.error(error)
      }
      if(dataJSON!=null){
        console.log(dataJSON)
        try{
        let biggest = getBigger6hrs(dataJSON);
        getColors(contaminantSTR, biggest)
        getHoursText();
        setIsShown(true)
        }catch(error){
          console.error(error)
        }
      }else{
        console.log("GET JSON ERROR")
      }
      
    }else{
      console.log("Formulario Incompleto")
    }
  }

  return (
    <div className="container mt-5">
      <div className="ta-center mb-5">
        <h2>Predicción</h2>
        <p><b>***GLOBAL en construcción***</b></p>
        <p>Consulta la predicción de la calidad del aire</p>
      </div>
      <hr className="mb-4" />
      <div>
        <p>Pasos para generar la predicción:</p>
        <ol>
          <li>
            Seleccione primero el sistema, despues la ubicación que quiere consultar y por último el contaminate
            </li>
            <li>
              De clic en generar predicción
            </li>
          </ol>
      </div>
      <Form
        system={system}
        location={location}
        setSystem={setSystem}
        setLocation={setLocation}
        search={fetchData}
        setGas={setContaminant}
      />
      
      {isShown && <Table 
      title={title}
      texts={dataText} 
      colors={dataColors}
      dateHour={hourDateText}/>}
      </div>
  );
}
export default Prediccion;