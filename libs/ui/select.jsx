import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import Select, {components} from 'react-select'

const Menu = props => {
  const optionSelectedLength = props.getValue().length || 0;
  return (
    <components.Menu {...props}>
      {optionSelectedLength < 2 ? (
        props.children
      ) : (
        <div className="maxSelectMsg">Maximum of Two Selections</div>
      )}
    </components.Menu>
  );
};

const colourStylesMulti = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      color: !isSelected
        ? data.type == 'user'
          ? '#222'
          : '#000'
        : '#fff',
    }
  },
  input: styles => ({ ...styles}),
  placeholder: styles => ({ ...styles }),
  singleValue: (styles, { data }) => ({ ...styles}),
  multiValueLabel: (styles, { data }) => ({
    ...styles,
  }),

};



export const DataTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    styles={colourStylesMulti}
    onChange={(e) => onChange(e)}
    components={{Menu}}
    isMulti
  />
)

export const StatsTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    styles={colourStylesMulti}
    onChange={(e) => onChange(e)}
    components={{Menu}}
    isMulti
  />
)

export const PlotTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    styles={colourStylesMulti}
    onChange={(e) => onChange(e)}
    components={{Menu}}
    isMulti
  />
)
