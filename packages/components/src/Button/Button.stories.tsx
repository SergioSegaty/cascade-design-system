import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium'],
      description: 'Controls the button padding and font size.',
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
    },
  },
  args: {
    children: 'Button',
    size: 'small',
    variant: 'primary',
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'small',
  },
};

export const Medium: Story = {
  args: {
    size: 'medium',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};
