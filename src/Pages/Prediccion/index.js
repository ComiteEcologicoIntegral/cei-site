import "../../App.css";
import React, { useState } from "react";
import Form from "./components/Form";
import Table from "./components/Table";
import { apiUrl } from "../../constants";
import { Spinner } from "react-bootstrap";
import { statusColor } from "../../constants";
import { getICAR } from "../../handlers/statusCriteria";

function Prediccion() {
	const [system, setSystem] = useState(null);
	const [location, setLocation] = useState(null);
	const [isShown, setIsShown] = useState(false);
	const [title, setTitle] = useState(null);
	const [contaminant, setContaminant] = useState(null);
	const [dataText, setDataText] = useState(null);
	const [hourDateText, sethourDateText] = useState(null);
	const [dataColors, setDataColors] = useState(null);
	const [loading, setLoading] = useState(false);

	function getDropdownValues() {
		var locationSTR = location.label;
		var contaminantSTR = contaminant.value;
		setTitle(locationSTR.concat("    (", contaminant.label, ")"));
		return contaminantSTR;
	}

	function getBigger6hrs(dataJSON) {
		var biggers = [];
		var LookBiggers = [];
		var n = 0;
		// for (var o = 0; o < 8; o++) {
		// 	LookBiggers = [];
		// 	for (var i = n; i < 6 + n; i++) {
		// 		if (i >= Object.keys(dataJSON).length) {
		// 			break;
		// 		} else {
		// 			LookBiggers.push(dataJSON[i][contaminant.label]);
		// 		}
		// 	}
		// 	console.log(Math.max.apply(null, LookBiggers));
		// 	biggers[o] = Math.max.apply(null, LookBiggers);
		// 	n = n + 6;
		// }
		biggers[0] = dataJSON[0];
		biggers[1] = dataJSON[1];
		biggers[2] = dataJSON[2];
		biggers[3] = dataJSON[3];

		setDataText(biggers);
		return biggers;
	}

	function getHoursText() {
		var HoursText = [];
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		const dayAfterTomorrow = new Date(today);
		dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);
		var date = 1;
		const d = new Date();
		let hour = d.getHours();
		var string = "";
		for (var i = 0; i < 4; i++) {
			if (hour + 12 >= 24) {
				string = "";
				if (date == 1) {
					HoursText.push(
						string.concat(
							today.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							12 - (24 - hour) + 0,
							" hrs"
						)
					);
				} else if (date == 2) {
					HoursText.push(
						string.concat(
							tomorrow.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							12 - (24 - hour) + 0,
							" hrs"
						)
					);
				} else if (date == 3) {
					HoursText.push(
						string.concat(
							dayAfterTomorrow.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							12 - (24 - hour) + 0,
							" hrs"
						)
					);
				}
				hour = 12 - (24 - hour) + 0;
				date = date + 1;
			} else {
				string = "";
				if (date == 1) {
					HoursText.push(
						string.concat(
							today.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							hour + 12,
							" hrs"
						)
					);
				} else if (date == 2) {
					HoursText.push(
						string.concat(
							tomorrow.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							hour + 12,
							" hrs"
						)
					);
				} else if (date == 3) {
					HoursText.push(
						string.concat(
							dayAfterTomorrow.toDateString().slice(4, -4),
							" | ",
							hour,
							" hrs - ",
							hour + 12,
							" hrs"
						)
					);
				}
				hour = hour + 12;
			}
		}
		sethourDateText(HoursText);
	}

  function getColors(contaminantSTR, biggest) {
    var colors = [];
    var color = "#4d4d4d";
    for (var p = 0; p < 4; p++) {
	  const statusClass = getICAR(biggest[p], contaminantSTR, "ssa");
	  color = statusColor[statusClass];
      colors[p] = color;
    }
    setDataColors(colors);
  }

	function GETJASON() {
		setLoading(true);
		var dataJSON = null;
		var xhReq = new XMLHttpRequest();
		xhReq.open(
			"GET",
			`${apiUrl}/get-location-prediction?location=${location.label}&gas=${contaminant.value}`,
			true
			// La llamada al API es asincronica, para que el usuario pueda seguir usando la aplicación mientras se espera a la respuesta
		);
		xhReq.send(null);
		xhReq.onload = function () {
			// Cuando la llamada al API ha terminado, se ejecuta
			dataJSON = JSON.parse(xhReq.responseText);
			if (dataJSON != null) {
				try {
					let biggest = getBigger6hrs(dataJSON);
					getColors(contaminant.value, biggest);
					getHoursText();
					setIsShown(true);
					setLoading(false);
				} catch (error) {
					console.error(error);
				}
			} else {
				console.log("GET JSON ERROR");
				setLoading(false);
			}
		};
		return dataJSON;
	}

	const fetchData = () => {
		if (system != null && location != null && contaminant != null) {
			GETJASON();
		} else {
			console.log("Formulario Incompleto");
		}
	};

	return (
		<div className="container mt-5">
			<div className="ta-center mb-5">
				<h2>Predicción</h2>
				<p>
					<b>***GLOBAL en construcción***</b>
				</p>
				<p>Consulta la predicción de la calidad del aire</p>
			</div>
			<hr className="mb-4" />
			<div>
				<p>Pasos para generar la predicción:</p>
				<ol>
					<li>
						Seleccione primero el sistema, despues la ubicación que
						quiere consultar y por último el contaminate
					</li>
					<li>De clic en generar predicción</li>
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

			{loading ? (
				<Spinner animation="border" className="loadingSpinner" />
			) : (
				<>
					{isShown && (
						<Table
							title={title}
							texts={dataText}
							colors={dataColors}
							dateHour={hourDateText}
						/>
					)}
				</>
			)}
		</div>
	);
}
export default Prediccion;
