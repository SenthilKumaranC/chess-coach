// Button.stories.ts|tsx

import type { Meta, StoryObj } from '@storybook/react';


import { Color } from '../../features/pieces/pieces.slice';
import '../Game/Game.css'
import Square from './Square';

const meta: Meta<typeof Square> = {
  component: Square,
  argTypes: {
    color: {
      options: [Color.GRAY,Color.WHITE],
      control: { type: 'radio' },
    },
    direction: {
      options: ['BW','WB'],
      control: { type: 'radio' },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Square>;

/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/react/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  render: (props) => {
    const data = { file: 'b', rank: '1', color: props.color, bwPosition: '1/7/2/8', wbPosition: '8/2/9/3' }
    return <div className='Game'><Square  {...data} direction={props.direction}  id="b_1" kind="" /></div>
  },
  args: {
    color: Color.GRAY,
  },
};