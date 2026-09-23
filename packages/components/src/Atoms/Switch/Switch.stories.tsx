import type { Meta, StoryObj } from '@storybook/react-vite';
import Switch from './Switch';

const meta = {
  title: 'CascadeDS/Components/Atom/Switch',
  component: Switch,
  tags: ['autodocs'],
  argTypes: {
    children: {
      control: 'text',
      description:
        'Inline label text. When omitted, name the switch with `aria-label` or an external `<label htmlFor>`.',
    },
    disabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Email notifications',
    disabled: false,
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const On: Story = {
  args: {
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const DisabledOn: Story = {
  args: {
    disabled: true,
    defaultChecked: true,
  },
};

export const WithoutVisibleLabel: Story = {
  args: {
    children: undefined,
    'aria-label': 'Dark mode',
  },
};
