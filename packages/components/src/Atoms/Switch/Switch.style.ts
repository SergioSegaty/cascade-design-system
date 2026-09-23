import { css } from 'linaria';
import { component, semantic } from '@cascade-ds/styles';
import { cva } from 'class-variance-authority';

const baseSwitchCss = css`
  font-family: ${semantic.font.family.body};
  font-size: ${semantic.font.size.md};
  line-height: ${semantic.font.lineHeight.body};
  color: ${semantic.color.text.primary};
  display: inline-flex;
  align-items: center;
  gap: ${semantic.gap.sm};
  cursor: pointer;
  vertical-align: middle;
`;

const disabledStates = {
  true: css`
    color: ${semantic.color.text.disabled};
    cursor: not-allowed;
  `,
};

export const switchVariant = cva(baseSwitchCss, {
  variants: {
    disabled: disabledStates,
  },
});

// The native input is restyled (appearance: none) to become the visible track,
// so it keeps focus, hover, checked and disabled states natively. The thumb is
// a sibling that slides across when the input is `:checked`. Its inset is
// derived from the track and thumb sizes so it stays centred vertically.
export const switchControlCss = css`
  position: relative;
  display: inline-flex;
  flex-shrink: 0;
  width: ${component.switch.track.width};
  height: ${component.switch.track.height};

  & > input {
    appearance: none;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    margin: 0;
    border: none;
    border-radius: ${component.switch.track.radius};
    background-color: ${component.switch.color.track.off};
    cursor: inherit;
    transition: background-color ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:hover:not(:disabled) {
    background-color: ${component.switch.color.track.offHover};
  }

  & > input:checked {
    background-color: ${component.switch.color.track.on};
  }

  & > input:checked:hover:not(:disabled) {
    background-color: ${component.switch.color.track.onHover};
  }

  & > input:focus-visible {
    outline: ${semantic.focus.ring.width} solid ${semantic.color.border.focus};
    outline-offset: ${semantic.focus.ring.offset};
  }

  & > input:disabled {
    background-color: ${component.switch.color.track.disabled};
  }

  & > span {
    position: absolute;
    top: calc((${component.switch.track.height} - ${component.switch.thumb.size}) / 2);
    left: calc((${component.switch.track.height} - ${component.switch.thumb.size}) / 2);
    width: ${component.switch.thumb.size};
    height: ${component.switch.thumb.size};
    border-radius: ${semantic.round.full};
    background-color: ${component.switch.color.thumb.default};
    box-shadow: ${semantic.elevation.sm};
    pointer-events: none;
    transition: transform ${semantic.motion.duration.fast} ${semantic.motion.easing.standard};
  }

  & > input:checked ~ span {
    transform: translateX(calc(${component.switch.track.width} - ${component.switch.track.height}));
  }

  & > input:disabled ~ span {
    background-color: ${component.switch.color.thumb.disabled};
    box-shadow: none;
  }

  @media (prefers-reduced-motion: reduce) {
    & > input,
    & > span {
      transition: none;
    }
  }
`;
