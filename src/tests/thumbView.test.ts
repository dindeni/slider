import ThumbView from '../slider/views/ThumbView/ThumbView';
import Controller from '../slider/Controller/Controller';
import Model from '../slider/Model/Model';

describe('ThumbView', () => {
  let options;
  let elementOptions;
  let thumbView: ThumbView;
  let $element;
  let view;
  let controller: Controller;

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
    };
    elementOptions = { ...options, $element };
    const model = new Model();
    controller = new Controller(model);
    model.getSliderOptions(elementOptions);
    controller.init();
    view = controller.view;
    thumbView = new ThumbView(view);
    view.trackSize = 300;
  });

  it('should create thumb', () => {
    $('.js-slider__thumb_type_max').remove();
    thumbView.createThumb();
    expect($('.js-slider__thumb_type_min').length).toBe(1);
    expect($('.js-slider__thumb_type_max').length).toBe(1);
  });

  it('should set thumb position', () => {
    const thumbElement = $('.js-slider__thumb')[0];
    thumbView.setThumbPosition({ thumbElement, distance: 150 });
    expect(thumbElement.style.left).toBe('150px');
  });

  it('should get thumb size', () => {
    const $thumbElement = $('.js-slider__thumb');
    $thumbElement.css({ width: '20px' });
    const thumbSize = thumbView.getThumbSize();
    expect(thumbSize).toBe(20);
  });

  it('should calculate distance', () => {
    thumbView.calculateDistance({ coordinateStart: 50, coordinateMove: 100 });
    expect(view.distance).toBe(50);
  });

  it('should change thumb zIndex', () => {
    const $thumb = $('.js-slider__thumb_type_min');
    thumbView.changeZIndex($thumb[0]);
    expect($thumb.css('zIndex')).toBe('100');
  });

  it('should get coordinate of middle', () => {
    const coordinate = ThumbView.getCoordinatesOfMiddle({ start: 0, itemSize: 300 });
    expect(coordinate).toBe(150);
  });

  it('should get thumb coordinate', () => {
    const coordinate = thumbView.getThumbCoordinate(300);
    expect(coordinate).toBe(150);
  });

  it('should set vertical thumb position', () => {
    controller.reloadSlider({ ...elementOptions, isVertical: true });
    view.trackSize = 300;
    const thumbElement = $('.js-slider__thumb_type_max')[0];
    thumbView.setThumbPosition({ thumbElement, distance: 150 });
    expect(thumbElement.style.top).toBe('150px');
  });
});
