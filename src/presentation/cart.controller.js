import * as store from '../business/cart.store.js';
import * as actions from '../business/cart.actions.js';
import * as calc from '../business/cart.calc.js';
import * as view from './cart.view.js';

function init(){
  store.ensureSeed();
  const snapshot = actions.getSnapshot();
  view.bindHandlers({
    onSelectAll(flag){ actions.toggleSelectAll(flag); view.update(actions.getSnapshot()); },
    onSelectItem(id){ actions.toggleSelect(id); view.update(actions.getSnapshot()); },
    onQtyChange(id, qty){ actions.updateQty(id, qty); view.update(actions.getSnapshot()); },
    onRemove(id){ actions.removeItem(id); view.update(actions.getSnapshot()); },
  });
  view.render(snapshot);
}

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', init);
}else{
  init();
}

