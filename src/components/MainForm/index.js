import Select from "react-select";
import { systemOptions } from "../../constants";
import useSystemLocations from "../../hooks/useSystemLocations";
import { useDispatch, useSelector } from "react-redux";
import { setContaminant, setLocation, setSystem } from "../../redux/formSlice";
import { useEffect, useState } from "react";

import { Card } from "react-bootstrap";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

export const customStyles = {
  control: (provided) => ({
    ...provided,
    backgroundColor: 'inherit',
  }),
  menu: (provided) => ({
    ...provided,
  }),
  option: (provided, state) => ({
    ...provided,
    color: state.isSelected ? 'white' : 'inherit',
  }),
  singleValue: (provided) => ({
    ...provided,
    // color: 'white',
    fontSize: '0.8rem',
  }),
  placeholder: (provided) => ({
    ...provided,
    // color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '0.8rem',
  }),
};

function MainForm({ otherSelects, className }) {
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


  const [showPanel, setShowPanel] = useState(false);
  var selectedValues = [system, location, contaminant]
  if (!!otherSelects) {
    selectedValues.push(otherSelects.value)
  }
  const Sumary = () => selectedValues.map((e, i) =>
            <span style={{ fontSize: "0.9rem" }} key={i}>
              {(i !== 0 ? (<>&nbsp;</>) : "")} {e?.shortLabel || e?.label || "—"} {(i !== (selectedValues.length - 1) && "-")}
            </span>)

  return (
    <Card
      style={{
        transition: "width 0.3s",
        position: "relative",
      }}
      className={"p-2 shadow-sm border" + className}>
      <div className="d-flex justify-content-center align-items-center flex-wrap">
        {!showPanel
          ? <Sumary/>
          :
          <div className="d-flex justify-content-center align-items-center flex-wrap">
            <CustomSelect
              title="Sistema:"
              select={
                <Select
                  options={systemOptions}
                  value={system}
                  placeholder="Sistema"
                  onChange={handleUpdateSystem}
                  styles={customStyles}
                />
              }
            />
            <CustomSelect
              title="Ubicación:"
              select={
                <Select
                  options={locations}
                  value={location}
                  placeholder="Ubicación"
                  onChange={handleUpdateLocation}
                  styles={customStyles}
                />
              }
            />
            <CustomSelect
              title="Contaminante:"
              select={
                <Select
                  options={contaminants}
                  value={contaminant}
                  placeholder="Contaminante"
                  onChange={handleUpdateContaminant}
                  styles={customStyles}
                />
              }
            />
            {otherSelects &&
              <CustomSelect
                title={otherSelects.title}
                select={
                  <Select
                    title={otherSelects.title}
                    options={otherSelects.options}
                    value={otherSelects.value}
                    placeholder={otherSelects.placeholder}
                    onChange={otherSelects.onChange}
                    styles={otherSelects.styles}
                  />
                }
              />
            }
          </div>
        }
        <div
          onClick={() => setShowPanel(!showPanel)}
        >
          {showPanel ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>
    </Card >
  );
}

export const CustomSelect = ({ title, select }) => {
  return (
    <div className="m-2" style={{width: "200px"}}>
      <strong className="d-block mb-2">{title}</strong>
      {select}
    </div>
  );

}

export default MainForm;
