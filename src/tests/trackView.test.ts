import TrackView from '../slider/views/TrackView/TrackView';
import HandleView from '../slider/views/HandleView/HandleView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';
import createEvent from './events';

describe('TrackView', () => {
  let trackView: TrackView;
  let handleView: HandleView;
  let options: SliderElementOptions;

  beforeAll(() => {
    const $element = $('<div class="slider js-slider"></div>');
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
    model.setSettings(options);
    controller.init();
    trackView = controller.view.trackView;
    handleView = controller.view.handleView;
  });

  it('should create track', () => {
    expect($('.js-slider__track').length).toBe(1);
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

  it('should move thumb after click', () => {
    const event = createEvent({ type: 'click', clientX: 50, clientY: 0 });
    $('.js-slider__track')[0].dispatchEvent(event);
    expect($('.js-slider__thumb_type_min').css('left')).toBe('50px');
  });

  it('should remove click event', () => {
    const spy = jest.spyOn(trackView, 'removeEvent');
    handleView.reloadSlider(options);
    expect(spy).toHaveBeenCalled();
  });
});
