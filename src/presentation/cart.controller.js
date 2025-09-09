import { store } from '../business/cart.store.js';
import { actions } from '../business/cart.actions.js';
import { view } from './cart.view.js';

function getMount() {
  return document.getElementById('app');
}

function datasetId(el) {
  const article = el.closest('article[data-id]');
  return article ? article.getAttribute('data-id') : null;
}

export const controller = {
  init() {
    store.ensureSeed();
    const mount = getMount();
    view.init(mount);
    const snapshot = actions.getSnapshot();
    view.render(snapshot);
    this.bind();
  },

  bind() {
    const mount = getMount();

    // Click handlers
    mount.addEventListener('click', (e) => {
      const target = e.target;
      const action = target?.getAttribute('data-action');
      if (!action) return;

      if (action === 'inc') {
        const id = datasetId(target);
        if (!id) return;
        actions.incrementQty(id);
      }

      if (action === 'dec') {
        const id = datasetId(target);
        if (!id) return;
        actions.decrementQty(id);
      }

      if (action === 'remove') {
        const id = datasetId(target);
        if (!id) return;
        actions.removeItem(id);
      }

      const snapshot = actions.getSnapshot();
      view.update(snapshot);
    });

    // Change handlers (checkboxes)
    mount.addEventListener('change', (e) => {
      const target = e.target;
      const action = target?.getAttribute('data-action');
      if (!action) return;

      if (action === 'select-all') {
        const checked = target.checked;
        actions.toggleSelectAll(checked);
      }

      if (action === 'select') {
        const id = datasetId(target);
        if (!id) return;
        actions.toggleSelect(id);
      }

      if (action === 'qty' && target.matches('input[type="number"]')) {
        const id = datasetId(target);
        if (!id) return;
        const value = parseInt(target.value, 10);
        actions.updateQty(id, value);
      }

      const snapshot = actions.getSnapshot();
      view.update(snapshot);
    });

    // Input sanitization (on blur enforce min 1)
    mount.addEventListener('blur', (e) => {
      const target = e.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.getAttribute('data-action') === 'qty') {
        const id = datasetId(target);
        if (!id) return;
        const value = parseInt(target.value, 10);
        actions.updateQty(id, value);
        const snapshot = actions.getSnapshot();
        view.update(snapshot);
      }
    }, true);
  },
};

// Auto-init when loaded
window.addEventListener('DOMContentLoaded', () => controller.init());

