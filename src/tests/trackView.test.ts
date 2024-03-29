import Track from '../slider/views/Track/Track';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';
import { SliderElementOptions } from '../types/types';
import createEvent from './events';
import Main from '../slider/views/Main/Main';

describe('Track', () => {
  let trackView: Track;
  let view: Main;
  let controller: Controller;
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
    controller = new Controller(model);
    model.setSettings(options);
    controller.init();
    trackView = controller.view.trackView;
    view = controller.view;
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

  it('should move min thumb after click', () => {
    const event = createEvent({ type: 'click', clientX: 50, clientY: 0 });
    $('.js-slider__track')[0].dispatchEvent(event);
    expect($('.js-slider__thumb_type_min').css('left')).toBe('50px');
  });

  it('should move min thumb after click(negative coordinate)', () => {
    const event = createEvent({ type: 'click', clientX: -50, clientY: 0 });
    $('.js-slider__track')[0].dispatchEvent(event);
    expect($('.js-slider__thumb_type_min').css('left')).toBe('0px');
  });

  it('should move max thumb after click', () => {
    const event = createEvent({ type: 'click', clientX: 150, clientY: 0 });
    $('.js-slider__track')[0].dispatchEvent(event);
    expect($('.js-slider__thumb_type_max').css('left')).toBe('150px');
  });

  it('should not move thumb after click', () => {
    const event = createEvent({ type: 'click', clientX: 150, clientY: 0 });
    const $thumb = $('.js-slider__thumb_type_max');
    const coordinate = $thumb.css('left');
    $thumb[0].dispatchEvent(event);
    expect(coordinate).toBe($thumb.css('left'));
  });

  it('should remove click event', () => {
    const spy = jest.spyOn(trackView, 'removeEvent');
    view.reloadSlider(options);
    expect(spy).toHaveBeenCalled();
  });

  describe('Vertical', () => {
    beforeAll(() => {
      view.reloadSlider({ ...options, isVertical: true });
    });

    it('should move min thumb after click', () => {
      const event = createEvent({ type: 'click', clientX: 0, clientY: 50 });
      $('.js-slider__track')[0].dispatchEvent(event);
      expect($('.js-slider__thumb').css('top')).toBe('50px');
    });
  });

  describe('With scale', () => {
    it('should move min thumb after click', () => {
      controller.reloadSlider({
        ...options, step: 100, isRange: false, isVertical: true, withScale: true,
      });
      const event = createEvent({ type: 'click', clientX: 0, clientY: 0 });
      $('.js-slider__scale-item')[1].dispatchEvent(event);
      expect($('.js-slider__thumb').css('top')).toBe('50px');
    });
  });
});
