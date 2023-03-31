import React from "react";
function TablePred({ title, texts, colors, dateHour }) {
	var bgColors = {
		color1: colors[0],
		color2: colors[1],
		color3: colors[2],
		color4: colors[3],
		color5: colors[4],
		color6: colors[5],
		color7: colors[6],
		color8: colors[7],
	};

	return (
		<div>
			<div className="tableDiv">
				<h3 className="stationName">{title}</h3>
				<div id="table-wrapper">
					<div id="table-scroll">
						<table className="predictionTable">
							<thead>
								<tr>
									<th className="superTableSpace">HORARIO</th>
									<th className="colorSpaces"></th>
									{/* <th className="superTableSpace">HORARIO</th>
              <th className="colorSpaces"></th> */}
								</tr>
							</thead>
							<tbody>
								<tr>
									<th className="titleH">{dateHour[0]}</th>
									<th
										className="colorSpaces"
										style={{
											backgroundColor: bgColors.color1,
										}}
									>
										{texts[0].toFixed(2)}
									</th>
									{/* <th className="titleH">{dateHour[4]}</th>
              <th className="colorSpaces" style={{backgroundColor: bgColors.color5}}>{texts[4].toFixed(2)}</th> */}
								</tr>
								<tr>
									<th className="titleH">{dateHour[1]}</th>
									<th
										className="colorSpaces"
										style={{
											backgroundColor: bgColors.color2,
										}}
									>
										{texts[1].toFixed(2)}
									</th>
									{/* <th className="titleH">{dateHour[5]}</th>
              <th className="colorSpaces" style={{backgroundColor: bgColors.color6}}>{texts[5].toFixed(2)}</th> */}
								</tr>
								<tr>
									<th className="titleH">{dateHour[2]}</th>
									<th
										className="colorSpaces"
										style={{
											backgroundColor: bgColors.color3,
										}}
									>
										{texts[2].toFixed(2)}
									</th>
									{/* <th className="titleH">{dateHour[6]}</th>
              <th className="colorSpaces" style={{backgroundColor: bgColors.color7}}>{texts[6].toFixed(2)}</th> */}
								</tr>
								<tr>
									<th className="titleH" align="center">
										{dateHour[3]}
									</th>
									<th
										className="colorSpaces"
										style={{
											backgroundColor: bgColors.color4,
										}}
									>
										{texts[3].toFixed(2)}
									</th>
									{/* <th className="titleH">{dateHour[7]}</th>
              <th className="colorSpaces" style={{backgroundColor: bgColors.color8}}>{texts[7].toFixed(2)}</th> */}
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
