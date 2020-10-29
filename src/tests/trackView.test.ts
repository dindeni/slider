import TrackView from '../slider/views/TrackView/TrackView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('TrackView', () => {
  let trackView: TrackView;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
    $element.appendTo(document.body);
    const options = {
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
    trackView = controller.view.trackView;
  });

  it('should get track size', () => {
    expect(trackView.size).toBe(200);
  });

  it('should make vertical', () => {
    const $track = $('.js-slider__track');
    const trackWidth = $track.width();
    trackView.makeVertical();
    expect($track.height()).toBe(trackWidth);
  });
});
