import ReactDOM from 'react-dom'
import React, {useState} from 'react'
import Select from 'react-select'


const dot = (color = 'blue') => ({
  alignItems: 'center',
  display: 'flex',

  ':before': {
    backgroundColor: color,
    borderRadius: 10,
    content: '" "',
    display: 'block',
    marginRight: 8,
    height: 10,
    width: 10,
  },
});

const DATA_USER_COLOUR = '#7f99ba'
const DATA_REPORT_COLOUR = '#c2a129'
const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const dotColor = data.type == 'user' ? DATA_USER_COLOUR : DATA_REPORT_COLOUR
    return {
      ...styles,
      color: !isSelected
        ? data.type == 'user'
          ? '#222'
          : '#000'
        : '#fff',
      ...dot(dotColor)
    }
  },
  input: styles => ({ ...styles, ...dot() }),
  placeholder: styles => ({ ...styles, ...dot() }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.type == 'user' ? DATA_USER_COLOUR : DATA_REPORT_COLOUR) }),
};

export const DataTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    onChange={(e) => onChange(e)}
  />
)

export const StatsTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    onChange={(e) => onChange(e)}
  />
)

export const PlotTabSelect = ({options, onChange, value}) => (
  <Select className="sourceSelect" classNamePrefix="sourceSelectInner"
    options={options}
    value={value}
    onChange={(e) => onChange(e)}
  />
)
