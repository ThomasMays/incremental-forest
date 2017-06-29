export function bindItemSlot(slotNum, inventory) {
  const slotEl = document.getElementById('item-slot-' + slotNum);

  // bind to left click
  slotEl.addEventListener('click', function() {
    inventory.select(slotNum);
  });

  // bind to right click
  slotEl.addEventListener('contextmenu', function(event) {
    event.preventDefault();

    const sellAmount = event.shiftKey ? null : 1;

    inventory.sell(slotNum, sellAmount);
  });
}
