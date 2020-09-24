import TrackView from '../slider/views/TrackView/TrackView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';

describe('TrackView', () => {
  let options: SliderElementOptions;
  let trackView: TrackView;
  let $element: JQuery;

  beforeAll(() => {
    $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    options = {
      isRange: true,
      isVertical: false,
      min: 100,
      max: 500,
      withProgress: true,
      withLabel: true,
      step: undefined,
      $element,
    };
    const model = new Model();
    const controller = new Controller(model);
    model.getSliderOptions(options);
    controller.init();
    const { view } = controller;
    trackView = new TrackView(view);
    view.trackSize = 300;
  });

  it('should move thumb after click on track', () => {
    const trackElement = $('.js-slider__track')[0];
    const event: MouseEvent = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: 100,
      clientY: 0,
    });
    trackElement.dispatchEvent(event);
    const { min, max, withProgress } = options;

    trackView.handleSliderElementClick({
      event, trackElement, isVertical: false, isRange: true, min, max, withProgress,
    });
    expect($('.js-slider__thumb')[0].style.left).toBe('100px');
  });

  it('should get track size', () => {
    $('.js-slider__track').css({ width: '300px' });
    const trackSize = trackView.getTrackSize();
    expect(trackSize).toBe(300);
  });
});
