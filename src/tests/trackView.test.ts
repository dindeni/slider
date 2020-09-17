import TrackView from '../slider/views/TrackView/TrackView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('TrackView', () => {
  let options;
  let trackView;
  let $element;

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
    const event = {
      target: trackElement,
      pageX: 100,
      pageY: 0,
    };
    trackView.handleSliderElementClick({
      event, trackElement, isVertical: false, isRange: true,
    });
    expect(trackView.thumbElement.style.left).toBe('100px');
  });

  it('should get track size', () => {
    $('.js-slider__track').css({ width: '300px' });
    const trackSize = trackView.getTrackSize();
    expect(trackSize).toBe(300);
  });
});
