import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

const meta = {
  title: 'CascadeDS/Components/Atom/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Controls the button min-height, padding and font size.',
    },
    variant: {
      control: 'radio',
      options: ['primary', 'secondary', 'danger', 'ghost'],
      description:
        '`primary` for the main action, `secondary` for alternatives, `danger` for destructive actions, `ghost` for low-emphasis actions.',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Button',
    size: 'md',
    variant: 'primary',
    disabled: false,
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Delete',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
