import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta = {
  title: 'CascadeDS/Components/Atom/Box',
  component: Box,
  tags: ['autodocs'],
} satisfies Meta<typeof Box>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Box content',
  },
};

export const AsSection: Story = {
  args: {
    as: 'section',
    children: 'Rendered as a <section>',
  },
};
