/* eslint-disable  @typescript-eslint/explicit-function-return-type */
const dispatchMove = (divThumb, coordX, coordY, moveDistanceX, moveDistanceY) => {
  const evtDown = new MouseEvent('mousedown', {
    view: window,
    bubbles: true,
    screenX: coordX,
    screenY: coordY,
    cancelable: true,
  });

  const evtMove = new MouseEvent('mousemove', {
    view: window,
    screenX: coordX + moveDistanceX,
    screenY: coordY + moveDistanceY,
    bubbles: true,
    cancelable: true,
  });

  const evtUp = new MouseEvent('mouseup', {
    view: window,
    bubbles: true,
    screenX: coordX + moveDistanceX,
    screenY: coordY + moveDistanceY,
    cancelable: true,
  });

  divThumb.dispatchEvent(evtDown);
  divThumb.dispatchEvent(evtMove);
  divThumb.dispatchEvent(evtUp);
};

const dispatchClick = (element, coordX, coordY) => {
  const evtClick = new MouseEvent('click', {
    view: window,
    bubbles: true,
    screenX: coordX,
    screenY: coordY,
    cancelable: true,
  });

  element.dispatchEvent(evtClick);
};

export { dispatchMove, dispatchClick };
