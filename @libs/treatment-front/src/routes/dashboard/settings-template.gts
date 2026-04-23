import type { TOC } from '@ember/component/template-only';
import SettingsPage from '#src/components/settings/settings-page.gts';
import type SettingsRoute from './settings.gts';

export default <template><SettingsPage /></template> as TOC<{
  model: Awaited<ReturnType<SettingsRoute['model']>>;
  controller: undefined;
}>
