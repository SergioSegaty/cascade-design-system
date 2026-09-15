import { setProjectAnnotations } from '@storybook/react';
import { beforeAll } from 'vitest';
import * as previewAnnotations from './.storybook/preview';
import * as a11yAddonAnnotations from '@storybook/addon-a11y/preview';

const project = setProjectAnnotations([a11yAddonAnnotations, previewAnnotations]);
beforeAll(project.beforeAll);
