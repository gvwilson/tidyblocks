import React from 'react'
import { expect } from 'chai';
import { mount, configure } from 'enzyme'
import { spy } from 'sinon'

import App from '../libs/ui/test.jsx'
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
global.expect = expect;
global.mount = mount;
// global.render = render;
// global.shallow = shallow;

// let TidyBlocksApp = setup('en','root')

spy(App.prototype, 'componentDidMount');

describe('<App />', () => {
  it('calls componentDidMount', () => {
    const wrapper = mount(<App />);
    expect(App.prototype.componentDidMount).to.have.property('callCount', 1);
  });
});
