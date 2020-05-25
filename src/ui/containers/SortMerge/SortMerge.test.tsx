import React from 'react';
import { mount, render } from 'enzyme';

import SortMerge from './SortMerge';

describe('test App', () => {
  it('renders SortMerge default state', () => {
    const wrapper = render(<SortMerge value={''} />);
    const field = wrapper.find('#field');
    const buttonSort = wrapper.find('.t-sort');
    const buttonClear = wrapper.find('.t-clear');
    const result = wrapper.find('.t-result');

    expect(field.length).toBe(1);
    expect(field.val()).toBe('');
    expect(buttonSort.length).toBe(1);
    expect(buttonClear.length).toBe(1);
    expect(result.length).toBe(0);
  });

  it('shows error on empty input', () => {
    const wrapper = mount(<SortMerge value={''} />);
    wrapper.find('.t-sort').simulate('click');
    expect(
      wrapper.find('.t-error').filterWhere((x) => {
        return x.text() === 'Array must contain at least 1 interval';
      }).length
    ).toBe(1);
  });

  it('shows error on incorrect input', () => {
    let wrapper = mount(<SortMerge value={'1'} />);
    wrapper.find('.t-sort').simulate('click');

    expect(
      wrapper.find('.t-error').filterWhere((x) => {
        return x.text() === 'Interval "1" is incorrect: boundaries are not valid integer numbers';
      }).length
    ).toBe(1);

    wrapper = mount(<SortMerge value={'1--1'} />);
    wrapper.find('.t-sort').simulate('click');

    expect(
      wrapper.find('.t-error').filterWhere((x) => {
        return (
          x.text() === 'Interval "1--1" is incorrect: start value cannot be larger than end value'
        );
      }).length
    ).toBe(1);

    wrapper = mount(<SortMerge value={'sad-1'} />);
    wrapper.find('.t-sort').simulate('click');

    expect(
      wrapper.find('.t-error').filterWhere((x) => {
        return (
          x.text() === 'Interval "sad-1" is incorrect: boundaries are not valid integer numbers'
        );
      }).length
    ).toBe(1);
  });

  it('clears field and result after error', () => {
    let wrapper = mount(<SortMerge value={'1'} />);
    wrapper.find('.t-sort').simulate('click');

    expect(wrapper.find('.t-error').length).toBe(1);

    wrapper.find('.t-clear').simulate('click');

    expect(wrapper.find('.t-error').length).toBe(0);
    expect(wrapper.find('.t-result').length).toBe(0);
    expect(wrapper.find('#field').hostNodes().prop('value')).toBe('');
  });

  it('clears field and result after success', () => {
    let wrapper = mount(<SortMerge value={'1-1'} />);
    wrapper.find('.t-sort').simulate('click');

    expect(wrapper.find('.t-error').hostNodes().length).toBe(0);
    expect(wrapper.find('.t-result').hostNodes().length).toBe(1);

    wrapper.find('.t-clear').simulate('click');

    expect(wrapper.find('.t-error').hostNodes().length).toBe(0);
    expect(wrapper.find('.t-result').hostNodes().length).toBe(0);
    expect(wrapper.find('#field').hostNodes().prop('value')).toBe('');
  });

  it('renders result', () => {
    let wrapper = mount(<SortMerge value={'1-3,5-7,2-4,8-12,5-11'} />);
    const answer = ['1-4', '5-12'];
    wrapper.find('.t-sort').simulate('click');

    expect(wrapper.find('.t-result').hostNodes().length).toBe(1);
    expect(wrapper.find('#field').hostNodes().prop('value')).toBe('1-3,5-7,2-4,8-12,5-11');
    expect(wrapper.find('.t-result-item').hostNodes().length).toBe(2);
    expect(
      wrapper
        .find('.t-result-item')
        .hostNodes()
        .filterWhere((x) => {
          return answer.indexOf(x.text()) !== -1;
        }).length
    ).toBe(2);
  });
});
