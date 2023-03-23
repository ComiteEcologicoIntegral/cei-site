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
			color = "#4d4d4d";
			if (contaminantSTR == "PM25") {
				if (biggest[p] >= 0 && biggest[p] < 25) {
					color = "#95BF39";
				} else if (biggest[p] >= 25 && biggest[p] < 41) {
					color = "#F2E313";
				} else if (biggest[p] >= 41 && biggest[p] < 79) {
					color = "#F2811D";
				} else if (biggest[p] >= 79 && biggest[p] < 147) {
					color = "#F22233";
				} else if (biggest[p] >= 147) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else if (contaminantSTR == "PM10") {
				if (biggest[p] >= 0 && biggest[p] < 50) {
					color = "#95BF39";
				} else if (biggest[p] >= 50 && biggest[p] < 70) {
					color = "#F2E313";
				} else if (biggest[p] >= 70 && biggest[p] < 155) {
					color = "#F2811D";
				} else if (biggest[p] >= 155 && biggest[p] < 235) {
					color = "F22233";
				} else if (biggest[p] >= 235) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else if (contaminantSTR == "O3") {
				if (biggest[p] >= 0 && biggest[p] < 0.051) {
					color = "#95BF39";
				} else if (biggest[p] >= 0.051 && biggest[p] < 0.07) {
					color = "#F2E313";
				} else if (biggest[p] >= 0.07 && biggest[p] < 0.092) {
					color = "#F2811D";
				} else if (biggest[p] >= 0.092 && biggest[p] < 0.114) {
					color = "#F22233";
				} else if (biggest[p] >= 0.114) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else if (contaminantSTR == "CO") {
				if (biggest[p] >= 0 && biggest[p] < 8.75) {
					color = "#95BF39";
				} else if (biggest[p] >= 8.75 && biggest[p] < 9) {
					color = "#F2E313";
				} else if (biggest[p] >= 9 && biggest[p] < 13.3) {
					color = "#F2811D";
				} else if (biggest[p] >= 13.3 && biggest[p] < 15.5) {
					color = "F22233";
				} else if (biggest[p] >= 15.5) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else if (contaminantSTR == "NO2") {
				if (biggest[p] >= 0 && biggest[p] < 0.103) {
					color = "#95BF39";
				} else if (biggest[p] >= 0.103 && biggest[p] < 0.106) {
					color = "#F2E313";
				} else if (biggest[p] >= 0.106 && biggest[p] < 0.23) {
					color = "#F2811D";
				} else if (biggest[p] >= 0.23 && biggest[p] < 0.25) {
					color = "#F22233";
				} else if (biggest[p] >= 0.25) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else if (contaminantSTR == "SO2") {
				if (biggest[p] >= 0 && biggest[p] < 0.015) {
					color = "#95BF39";
				} else if (biggest[p] >= 0.015 && biggest[p] < 0.04) {
					color = "#F2E313";
				} else if (biggest[p] >= 0.04 && biggest[p] < 0.165) {
					color = "#F2811D";
				} else if (biggest[p] >= 0.165 && biggest[p] < 0.22) {
					color = "#F22233";
				} else if (biggest[p] >= 0.22) {
					color = "#73022C";
				} else {
					color = "#4d4d4d";
				}
			} else {
				console.log("Contaminante no válido");
			}
			colors[p] = color;
		}
		setDataColors(colors);
	}
	function GETJASON() {
		var xhReq = new XMLHttpRequest();
		xhReq.open(
			"GET",
			`${apiUrl}/get-location-prediction?location=${location.label}&gas=${contaminant.value}`,
			false
		);
		xhReq.send(null);
		var dataJSON = JSON.parse(xhReq.responseText);
		return dataJSON;
	}
	const fetchData = () => {
		if (system != null && location != null && contaminant != null) {
			var dataJSON = null;
			let contaminantSTR = getDropdownValues();
			console.log(contaminantSTR);
			try {
				dataJSON = GETJASON();
			} catch (error) {
				console.error(error);
			}
			if (dataJSON != null) {
				try {
					let biggest = getBigger6hrs(dataJSON);
					getColors(contaminantSTR, biggest);
					getHoursText();
					setIsShown(true);
				} catch (error) {
					console.error(error);
				}
			} else {
				console.log("GET JSON ERROR");
			}
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

			{isShown && (
				<Table
					title={title}
					texts={dataText}
					colors={dataColors}
					dateHour={hourDateText}
				/>
			)}
		</div>
	);
}
export default Prediccion;
