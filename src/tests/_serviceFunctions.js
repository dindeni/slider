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

  divThumb.dispatchEvent(evtDown);
  divThumb.dispatchEvent(evtMove);
};

export default dispatchMove;
