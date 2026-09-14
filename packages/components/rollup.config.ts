import wyw from '@wyw-in-js/rollup';
import css from 'rollup-plugin-css-only';

export default {
  plugins: [
    wyw({
      sourceMap: process.env.NODE_ENV !== 'production',
    }),
    css({
      output: 'styles.css',
    }),
  ],
};
