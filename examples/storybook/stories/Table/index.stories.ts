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
    '$border': { control: 'text' },
    '$width': { control: 'text' },
    '$height': { control: 'text' },
    '$caption-side': { control: 'text' },
    '$empty-cells': { control: 'text' },
    '$table-layout': { control: 'text' },
    '$vertical-align': { control: 'text' },
    '$text-align': { control: 'text' },
    '$background-color': { control: 'color' },
    '$color': { control: 'color' },
    '$padding': { control: 'text' },
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
  args: {
    $width: '500px',
    $height: '500px',
    $border: '1px dashed #e81111',
    $padding: '10px',
    $color: '#333',
    $background: '#fff',
  },
}

export const Border = {
  args: {
    $border: '1px dashed black',
  },
}

export const Size = {
  args: {
    $width: '500px',
    $height: '500px',
  },
}
