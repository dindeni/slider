import ThumbView from '../slider/views/ThumbView/ThumbView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';
import createEvent from './events';
import View from '../slider/views/View/View';

describe('ThumbView', () => {
  let view: View;
  let options: SliderElementOptions;
  let thumbView: ThumbView;
  let controller: Controller;
  let $thumbMin: JQuery<HTMLElement>;
  let $thumbMax: JQuery<HTMLElement>;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      $element,
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
    };
    const model = new Model();
    controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    view = controller.view;
    thumbView = view.thumbView;
    thumbView.setStartPosition(300);
    $thumbMin = $('.js-slider__thumb_type_min');
    $thumbMax = $('.js-slider__thumb_type_max');
  });

  it('should create elements', () => {
    expect($('.js-slider__thumb').length).toBe(2);
  });

  it('should move thumb min(clientX: 50)', () => {
    const mousedown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
    const mousemove = createEvent({ type: 'mousemove', clientX: 50, clientY: 0 });
    const mouseup = createEvent({ type: 'mouseup', clientX: 50, clientY: 0 });
    $thumbMin[0].dispatchEvent(mousedown);
    $thumbMin[0].dispatchEvent(mousemove);
    $thumbMin[0].dispatchEvent(mouseup);
    expect(parseInt($thumbMin.css('left'), 10)).toBe(50);
  });

  it('should move thumb max', () => {
    const mousedown = createEvent({ type: 'mousedown', clientX: 300, clientY: 0 });
    const mousemove = createEvent({ type: 'mousemove', clientX: 200, clientY: 0 });
    $thumbMax[0].dispatchEvent(mousedown);
    $thumbMax[0].dispatchEvent(mousemove);
    expect(parseInt($thumbMax.css('left'), 10)).toBe(200);
  });

  it('should create vertical thumb', () => {
    controller.reloadSlider({ ...options, isVertical: true });
    const thumbElement = $('.js-slider__thumb_type_max')[0];
    expect(parseInt(thumbElement.style.top, 10)).toBe(133);
  });

  describe('Vertical', () => {
    let $thumb: JQuery<HTMLElement>;

    beforeAll(() => {
      view.reloadSlider({
        ...options, isVertical: true, isRange: false,
      });
      $thumb = $('.js-slider__thumb');
    });

    it('should move thumb min(negative coordinate)', () => {
      const mousedown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
      const mousemove = createEvent({ type: 'mousemove', clientX: 0, clientY: -50 });
      const mouseup = createEvent({ type: 'mouseup', clientX: 0, clientY: -50 });
      $thumb[0].dispatchEvent(mousedown);
      $thumb[0].dispatchEvent(mousemove);
      $thumb[0].dispatchEvent(mouseup);
      expect(parseInt($thumb.css('top'), 10)).toBe(0);
    });

    it('should move thumb min', () => {
      const mousedown = createEvent({ type: 'mousedown', clientX: 0, clientY: 0 });
      const mousemove = createEvent({ type: 'mousemove', clientX: 0, clientY: 50 });
      const mouseup = createEvent({ type: 'mouseup', clientX: 0, clientY: 50 });
      $thumb[0].dispatchEvent(mousedown);
      $thumb[0].dispatchEvent(mousemove);
      $thumb[0].dispatchEvent(mouseup);
      expect(parseInt($thumb.css('top'), 10)).toBe(50);
    });
  });
});
