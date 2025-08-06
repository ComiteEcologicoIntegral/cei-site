import { useEffect, useState } from "react";
import { divIcon } from "leaflet";
import "leaflet/dist/leaflet.css";
import { Marker, Popup } from "react-leaflet";
import { Container, Col, Row } from "react-bootstrap";
import { getSensorIndex, getSensorIndexes } from "../services/sensorService";
import { useSelector } from "react-redux";
import Spinner from "./Spinner";
import useSystemLocations from "../hooks/useSystemLocations";
import moment from "moment";

function CustomMarker({
  sensor_id,
  address,
  currentInterval
}) {
  const { location: currentLocation, contaminant } = useSelector((state) => state.form);
  const [icon, setIcon] = useState(null);
  const [sensorIndexes, setSensorIndexes] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [shape, setShape] = useState("round")
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    if (!contaminant) return;
    const fetchCurrent = async () => {
      try {
        setLoading(true);

        const response = await getSensorIndex(sensor_id, contaminant.value);
        const data = await response.json();

        setCurrent(data);
      } catch (e) {
        console.error("Error: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrent();
  }, [contaminant]);

  useEffect(() => {
    if (!contaminant || !current || !currentLocation) return;

    const renderMarkerHTML = (markerLabel, status, shape = "round", isSelected) => {
      const wrapperClass = isSelected ? "marker-wrapper-selected" : "marker-wrapper";
      const dotClass = `marker-${status} marker-base marker-shape-${shape} ${isSelected ? "marker-border marker-size-" : ""}`;
      const textClass = `marker-${status}`;

      return `
    <div class="${wrapperClass}">
      <div class="${dotClass}"></div>
      <span class="${textClass}" style="background-color: transparent;">
        ${markerLabel}
      </span>
    </div>
  `;
    };

    const updateMarker = (label_, status_, currentLocation_, locationStr_) => {
      setIcon(
        divIcon({
          html: renderMarkerHTML(
            label_,
            status_,
            shape,
            currentLocation_ === locationStr_
          ),
          className: `sensor-icon ${currentLocation_ === locationStr_ ? "top" : shape === "round" ? "" : "behind"
            }`,
          popupAnchor: [7, 0],
        })
      );
    }
    if (currentInterval.label === 'Concentracion horaria') {
      updateMarker(current.hourly.value, current.status, currentLocation.value, currentLocation.value);
    } else {
      updateMarker(current.icar.value, current.status, currentLocation.value, currentLocation.value);
    }
  }, [contaminant, current, currentLocation, currentInterval]);

  const handleClick = async (event) => {
    event.target.openPopup()
    setLoading(true)
    setError(null)
    try {
      const response = await getSensorIndexes(sensor_id);
      if (!response.ok) {
        throw new Error('Netowkr response was not ok')
      }
      const result = await response.json()
      setSensorIndexes(result)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false);
    }
  }

  if (!icon) {
    return <div></div>
  }

  return (
    <Marker
      position={[address.Latitude, address.Longitude]}
      eventHandlers={{ click: handleClick }}
      icon={icon}
    >
      <Popup maxWidth={1700}>
        {loading || !sensorIndexes
          ? <Spinner height={"40px"} />
          :
          <div className="px-3 py-2">
            <div
              className={`rounded marker-${current.status}`}
              style={{
                display: "flex",
                justifyContent: "center",
                padding: "0 0.1rem ",
              }}
            >
              {contaminant.label}: {current.hourly.value} {current.hourly.unit}
            </div>
            <Row className="data-label">
              <Col xs={5}>
                <small className="text-muted">Ubicación</small>
                <br />
                <data>{address.Street}, {address.Municipality}</data>
              </Col>
              <Col xs={5}>
                <small className="text-muted">Concentración horaria</small>
                <br />

                <data><time>{moment(sensorIndexes.timestamp).format("LL, LT")}</time></data>
              </Col>
            </Row>

            <Row className="data-label">
              <Col xs={5}>
                <small className="text-muted">Humedad</small>
                <br />
                <data>{sensorIndexes.humidity_r + " %"}</data>
              </Col>
              <Col xs={5}>
                <small className="text-muted">Temperatura</small>
                <br />
                <data>{sensorIndexes.temperature_c + " ºC"}</data>
              </Col>
            </Row>
            <SensorMeasurementTable sensorIndexes={sensorIndexes} />
          </div>
        }
      </Popup>
    </Marker>
  );
}

const SensorMeasurementTable = ({ sensorIndexes }) => {
  const { system } = useSelector((state) => state.form);
  const { contaminants } = useSystemLocations(system?.value);
  return <Container style={{ padding: 0, width: "350px" }}>
    <Row className="flex-nowrap">
      <Col xs={2} className="px-1 m-1"></Col>
      <Col xs={3} className="px-1 m-1">
        <small className="text-muted m-1">Concentración horaria</small>
      </Col>
      <Col xs={2} className="px-1 m-1">
        <small className="text-muted m-1">ICAR*</small>
      </Col>
      <Col xs={2} className="px-1 m-1">
        <small className="text-muted m-1">OMS</small>
        <br />
      </Col>
      <Col xs={2} className="px-1 m-1">
        <small className="text-muted m-1">EPA AQI</small>
      </Col>
    </Row>
    {contaminants.map(c => {
      const val = sensorIndexes[c.value.toLowerCase()];
      return (<Row className="flex-nowrap">
        <Col xs={2}>{c.label}</Col>
        <Col xs={3} className={`px-1 m-1 rounded d-flex justify-content-between marker-${val.status}`}>
          <div>{val.hourly.value}</div><div> {val.units}</div>
        </Col>
        <Col xs={2} className={`px-1 m-1 rounded marker-${val.icar.status}`}>{val.icar.value}</Col>
        <Col xs={2} className={`px-1 m-1 rounded marker-${val.oms.status}`}>{val.oms.value}</Col>
        <Col xs={2} className={`px-1 m-1 rounded marker-${val.aqi.status}`}>{val.aqi.value}</Col>
      </Row>)
    })}
  </Container>
}


export default CustomMarker;
