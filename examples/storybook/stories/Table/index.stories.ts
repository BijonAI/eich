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
    '$caption-side': { control: 'select', options: ['top', 'bottom', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
    '$empty-cells': { control: 'select', options: ['show', 'hide', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
    '$table-layout': { control: 'select', options: ['auto', 'fixed', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
    '$vertical-align': { control: 'select', options: ['top', 'middle', 'bottom', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
    '$text-align': { control: 'select', options: ['left', 'right', 'center', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
    '$background-color': { control: 'color' },
    '$color': { control: 'color' },
    '$padding': { control: 'text' },
    '$box-shadow': { control: 'text' },
    '$border-width': { control: 'text' },
    '$border-style': { control: 'text' },
    '$border-color': { control: 'color' },
    '$border-collapse': { control: 'select', options: ['separate', 'collapse', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'] },
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

export const TableLayout = {
  args: {
    $width: '600px',
    '$table-layout': 'fixed',
    '$border-collapse': 'collapse',
    '$border-spacing': '2px',
    '$empty-cells': 'show',
  },
}

export const Alignment = {
  args: {
    '$text-align': 'center',
    '$vertical-align': 'middle',
    $width: '500px',
    $height: '300px',
    '$background-color': '#f5f5f5',
  },
}

export const ComplexBorder = {
  args: {
    '$border-width': '2px',
    '$border-style': 'solid',
    '$border-color': '#007bff',
    '$border-radius': '8px',
    '$border-collapse': 'separate',
    '$border-spacing': '4px',
  },
}

export const StylingAndEffects = {
  args: {
    '$background-color': '#f8f9fa',
    '$color': '#212529',
    '$box-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
    '$padding': '15px',
    '$caption-side': 'bottom',
  },
}

export const ResponsiveTable = {
  args: {
    $width: '100%',
    '$table-layout': 'auto',
    '$border-collapse': 'collapse',
    '$border': '1px solid #dee2e6',
    '$background-color': '#ffffff',
    '$color': '#212529',
    '$padding': '0.75rem',
  },
}

export const CompactTable = {
  args: {
    '$padding': '4px',
    '$border-collapse': 'collapse',
    '$border': '1px solid #e0e0e0',
    '$font-size': '14px',
    '$background-color': '#fafafa',
    '$color': '#333',
  },
}

export const ModernStyle = {
  args: {
    '$border-radius': '12px',
    '$box-shadow': '0 4px 20px rgba(0, 0, 0, 0.08)',
    '$border': 'none',
    '$background-color': '#ffffff',
    '$color': '#2d3748',
    '$padding': '16px',
    '$width': '100%',
    '$border-collapse': 'separate',
    '$border-spacing': '0',
  },
}

export const DarkTheme = {
  args: {
    '$background-color': '#1a202c',
    '$color': '#e2e8f0',
    '$border': '1px solid #2d3748',
    '$box-shadow': '0 4px 6px rgba(0, 0, 0, 0.3)',
    '$padding': '12px',
    '$border-radius': '8px',
  },
}

export const MinimalStyle = {
  args: {
    '$border': 'none',
    '$border-bottom': '2px solid #edf2f7',
    '$padding': '12px 16px',
    '$background-color': 'transparent',
    '$color': '#4a5568',
    '$table-layout': 'auto',
  },
}

export const HighContrastStyle = {
  args: {
    '$background-color': '#000000',
    '$color': '#ffffff',
    '$border': '2px solid #ffffff',
    '$padding': '16px',
    '$text-align': 'left',
    '$vertical-align': 'middle',
    '$border-collapse': 'collapse',
  },
}

export const ZebraStripe = {
  args: {
    '$background-color': '#ffffff',
    '$color': '#333333',
    '$border-collapse': 'collapse',
    '$border': '1px solid #e2e8f0',
    '$padding': '12px',
    '$tr-even-background': '#f7fafc',
  },
}
