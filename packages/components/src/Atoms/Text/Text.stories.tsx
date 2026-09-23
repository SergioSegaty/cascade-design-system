import type { Meta, StoryObj } from '@storybook/react-vite';
import Text from './Text';

const meta = {
  title: 'CascadeDS/Components/Atom/Text',
  component: Text,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'radio',
      options: ['body', 'caption'],
      description:
        'Typographic role. `body` for running text (renders a `p`), `caption` for small supporting text (renders a `span`). Sets the default size, weight and color.',
    },
    size: {
      control: 'radio',
      options: ['xs', 'sm', 'md', 'lg'],
      description:
        'Overrides the font size set by `variant`. Leave unset to use the variant default.',
    },
    weight: {
      control: 'radio',
      options: ['regular', 'medium', 'semibold', 'bold'],
      description:
        'Overrides the font weight set by `variant`. Leave unset to use the variant default.',
    },
    color: {
      control: 'select',
      options: [
        'primary',
        'secondary',
        'tertiary',
        'disabled',
        'brand',
        'inverse',
        'danger',
        'success',
        'warning',
        'info',
      ],
      description:
        'Overrides the text color set by `variant` (`body` defaults to `primary`, `caption` to `secondary`). Use `inverse` only on inverse backgrounds.',
    },
    as: {
      control: 'select',
      options: ['p', 'span', 'div', 'label', 'strong', 'em', 'small'],
      description: 'Element to render. Defaults to `p` for `body` and `span` for `caption`.',
    },
  },
  args: {
    children: 'The quick brown fox jumps over the lazy dog.',
    variant: 'body',
  },
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Caption: Story = {
  args: {
    variant: 'caption',
    children: 'Last updated 5 minutes ago',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const Bold: Story = {
  args: {
    weight: 'bold',
  },
};

export const Secondary: Story = {
  args: {
    color: 'secondary',
  },
};

export const Danger: Story = {
  args: {
    color: 'danger',
    children: 'Something went wrong.',
  },
};

export const AsStrong: Story = {
  args: {
    as: 'strong',
    weight: 'semibold',
    children: 'Important inline text',
  },
};
