import type { TableAttributes } from '@eichjs/components'

import { createTable } from './index'
// More on how to set up stories at: https://storybook.js.org/docs/writing-stories
export default {
  title: 'Example/Table',
  tags: ['autodocs'],
  render: (args: TableAttributes) => {
    return createTable(args)
  },
  argTypes: {
    $border: { control: 'text' },
    $width: { control: 'text' },
    $height: { control: 'text' },
    '$caption-side': { control: 'text' },
    '$empty-cells': { control: 'text' },
    '$table-layout': { control: 'text' },
    '$vertical-align': { control: 'text' },
    '$text-align': { control: 'text' },
    '$background-color': { control: 'text' },
    $color: { control: 'text' },
    $padding: { control: 'text' },
    '$box-shadow': { control: 'text' },
    '$border-width': { control: 'text' },
    '$border-style': { control: 'text' },
    '$border-color': { control: 'text' },
    '$border-collapse': { control: 'text' },
    '$border-spacing': { control: 'text' },
    '$border-radius': { control: 'text' },
  },
  // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
  args: {},
}

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Default = {
  args: {},
}

export const Border = {
  args: {
    $border: '1px dashed black',
  },
}

export const Width = {
  args: {
    $width: '100px',
  },
}

export const Height = {
  args: {
    $height: '100px',
  },
}
