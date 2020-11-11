import ThumbView from '../slider/views/ThumbView/ThumbView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('ThumbView', () => {
  let options: SliderElementOptions;
  let thumbView: ThumbView;
  let $element: JQuery<HTMLElement>;
  let controller: Controller;

  const simulateGetBounding = (settings: { element: HTMLElement; left: number }): void => {
    const { element, left } = settings;
    element.getBoundingClientRect = jest.fn((): DOMRect => ({
      top: 0,
      bottom: 0,
      left,
      right: 0,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      toJSON: (): void => {},
    }));
  };

  beforeAll(() => {
    $element = $('<div class="slider js-slider"></div>');
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
    model.setSliderOptions(options);
    controller.init();
    thumbView = controller.view.thumbView;
  });

  it('should create elements', () => {
    $('.js-slider__thumb_type_max').remove();
    thumbView.create(200);
    expect($('.js-slider__thumb_type_max').length).toBe(1);
  });

  it('should set thumb position', () => {
    const thumbElement = $('.js-slider__thumb_type_min')[0];
    thumbView.updatePosition({ thumbElement, shift: 150, trackSize: 300 });
    expect(thumbElement.style.left).toBe('150px');
  });

  it('should change thumb zIndex min', () => {
    const $thumb = $('.js-slider__thumb_type_min');
    $thumb.css({ zIndex: '500' });
    simulateGetBounding({ element: $thumb[0], left: 150 });
    thumbView.changeZIndex({ thumbElement: $thumb[0], trackSize: 200 });
    expect($thumb.css('zIndex')).toBe('200');
  });

  it('should change thumb zIndex max', () => {
    const $thumb = $('.js-slider__thumb_type_max');
    $thumb.css({ zIndex: '500' });
    simulateGetBounding({ element: $thumb[0], left: 200 });
    thumbView.changeZIndex({ thumbElement: $thumb[0], trackSize: 200 });
    expect($thumb.css('zIndex')).toBe('100');
  });

  it('should create vertical thumb', () => {
    controller.reloadSlider({ ...options, isVertical: true });
    const thumbElement = $('.js-slider__thumb_type_max')[0];
    expect(thumbElement.style.top).toBe('200px');
  });
});
