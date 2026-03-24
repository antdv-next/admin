import type { Router } from 'vue-router';

import { useLoading } from '@/composables/loading';
import { useGlobalToken } from '@/composables/token';

export function setupLoadingGuard(router: Router) {
  const { remove, trickling } = useLoading();
  const { token } = useGlobalToken();
  router.beforeEach(async () => {
    if (token.value) {
      trickling.setOptions({
        color: token.value.colorPrimary,
        progressBarHeight: `${token.value.lineWidthBold}px`,
        spinnerSize: `${token.value.fontSizeXL}px`,
        spinnerStrokeWidth: `${token.value.lineWidthBold}px`,
      });
    }
    trickling.start();
    remove();
  });

  router.afterEach(() => {
    trickling.done();
    trickling.remove(true);
  });
}
