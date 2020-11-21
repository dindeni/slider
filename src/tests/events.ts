interface EventOptions {
  type: 'click' | 'mousedown' | 'mousemove';
  clientX: number;
  clientY: number;
}

const createEvent = (options: EventOptions): MouseEvent => {
  const { type, clientX, clientY } = options;
  return new MouseEvent(type, {
    view: window,
    bubbles: true,
    clientX,
    clientY,
    cancelable: true,
  });
};

export default createEvent;
