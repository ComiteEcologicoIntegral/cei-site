import Select from "react-select";
import { systemOptions } from "../../constants";
import useSystemLocations from "../../hooks/useSystemLocations";
import { useDispatch, useSelector } from "react-redux";
import { setContaminant, setLocation, setSystem } from "../../redux/formSlice";
import { Col, Row } from "react-bootstrap";
import { useEffect } from "react";

function MainForm() {

  const dispatch = useDispatch();
  const { system, location, contaminant } = useSelector((state) => state.form);

  const { locations, contaminants } = useSystemLocations(system?.value);

  const handleUpdateSystem = (selected) => {
    dispatch(setSystem(selected));
  };

  const handleUpdateLocation = (newLocation) => {
    dispatch(setLocation(newLocation));
  };

  const handleUpdateContaminant = (newContaminant) => {
    dispatch(setContaminant(newContaminant));
  };

  useEffect(() => {
    dispatch(setContaminant(contaminants[0]));
  }, [contaminants, dispatch]);

  useEffect(() => {
    dispatch(setLocation(locations[0]));
  }, [locations, dispatch]);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: 'inherit',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
    }),
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? 'white' : 'inherit',
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontSize: '0.8rem',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '0.8rem',
    }),
  };

  return (
    <Row>
      <Col>
        <Select
          options={systemOptions}
          value={system}
          placeholder={"Sistema"}
          onChange={handleUpdateSystem}
          styles={customStyles}
        />
      </Col>
      <Col>
        <Select
          options={contaminants}
          value={contaminant}
          placeholder={"Contaminante"}
          onChange={handleUpdateContaminant}
          styles={customStyles}
        />
      </Col>
      <Col>
        <Select
          options={locations}
          value={location}
          placeholder={"Ubicación"}
          onChange={handleUpdateLocation}
          styles={customStyles}
        />
      </Col>
    </Row>
  );
}

export default MainForm;
