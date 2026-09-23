import type { Meta, StoryObj } from '@storybook/react-vite';
import Stack from '@/Layout/Stack/Stack';
import Icon from './Icon';

const StarSvg = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8z" />
  </svg>
);

const meta = {
  title: 'CascadeDS/Components/Atom/Icon',
  component: Icon,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg', 'xl'],
      description: 'Icon box size, from the `semantic.size.icon` scale.',
    },
    color: {
      control: 'select',
      options: ['current', 'primary', 'secondary', 'brand', 'inverse', 'disabled'],
      description:
        '`current` (default) inherits the surrounding text color; the others use the `semantic.color.icon` tokens.',
    },
    label: {
      control: 'text',
      description:
        'Accessible name. Set it when the icon carries meaning on its own; leave it empty for decorative icons (rendered with `aria-hidden`).',
    },
    children: {
      control: false,
    },
  },
  args: {
    size: 'md',
    color: 'current',
    children: <StarSvg />,
  },
} satisfies Meta<typeof Icon>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <Stack direction="row" align="center" gap="md">
      {(['xs', 'sm', 'md', 'lg', 'xl'] as const).map((size) => (
        <Icon key={size} {...args} size={size} />
      ))}
    </Stack>
  ),
};

export const Brand: Story = {
  args: {
    color: 'brand',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const Labelled: Story = {
  args: {
    label: 'Favorite',
    color: 'primary',
  },
};
