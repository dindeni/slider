import { SliderElementOptions, ValueAndType } from '../../../types/types';
import Observable from '../../Observable/Observable';
import EventTypes from '../../constants';

class Label extends Observable {
  private $element: JQuery<HTMLElement>;

  private $elementMin: JQuery<HTMLElement>;

  private $elementMax: JQuery<HTMLElement>;

  private valueMin: number | undefined;

  private valueMax: number | undefined;

  private readonly settings: SliderElementOptions;

  constructor(settings: SliderElementOptions) {
    super();
    this.settings = settings;
    this.valueMin = settings.valueMin;
    this.valueMax = settings.valueMax;
  }

  public createElements(): void {
    const {
      isRange, isVertical, value, min, $element,
    } = this.settings;

    const thumbSet = $element.children('.js-slider__thumb');
    if (isRange) {
      this.createRangeLabel(thumbSet);
    } else {
      this.$element = $('<div class="slider__label js-slider__label"></div>').appendTo(thumbSet[0]);
      this.$element.text(value || min);
      if (isVertical) {
        this.$element.addClass('slider__label_type_vertical');
      }
    }
  }

  public updateValue(options: ValueAndType): void {
    const { value, type } = options;
    const { withLabel } = this.settings;

    const labelElement = this.getCurrentElement(type);
    const isValueAndWithLabel = (updatedValue?: number | null): updatedValue is
      number => updatedValue !== undefined && withLabel === true;
    if (isValueAndWithLabel(value)) {
      labelElement.text(value);
    }
    this.updateOptions(options);
  }

  private getCurrentElement(type?: 'min' | 'max'): JQuery<HTMLElement> {
    const { isRange } = this.settings;

    if (isRange) {
      return type === 'min' ? this.$elementMin : this.$elementMax;
    }
    return this.$element;
  }

  private createRangeLabel(thumbSet: JQuery<HTMLElement>): void {
    const {
      isVertical, min, max, valueMin, valueMax,
    } = this.settings;

    this.$elementMin = $('<div class="slider__label js-slider__label slider__label_type_min js-slider__label_type_min"></div>')
      .appendTo(thumbSet[0]);
    if (isVertical) {
      this.$elementMin.addClass('slider__label_type_vertical');
    }
    this.$elementMin.text(valueMin || min);

    this.$elementMax = $('<div class="slider__label js-slider__label slider__label_type_max js-slider__label_type_max"></div>')
      .appendTo(thumbSet[1]);
    this.$elementMax.text(valueMax || valueMax === 0 ? valueMax : max);
  }

  private updateOptions(options: ValueAndType): void {
    const { isRange } = this.settings;
    const { UPDATE_OPTIONS } = EventTypes;

    if (isRange) {
      const { valueMin, valueMax } = this.getValue(options);
      this.valueMin = valueMin;
      this.valueMax = valueMax;
      this.notifyAll({
        value: {
          ...this.settings,
          valueMin,
          valueMax,
        },
        type: UPDATE_OPTIONS,
      });
    } else {
      this.notifyAll({ value: { ...this.settings, value: options.value }, type: UPDATE_OPTIONS });
    }
  }

  private getValue(options: ValueAndType): { valueMin?: number; valueMax?: number } {
    const { type, value } = options;
    const {
      withLabel, valueMin, valueMax,
    } = this.settings;

    if (withLabel) {
      return {
        valueMin: parseFloat(this.$elementMin.text()),
        valueMax: parseFloat(this.$elementMax.text()),
      };
    }
    const isTypeAndValue = (data: ValueAndType): data is { type: 'min' | 'max'; value: number } => (
      data.type !== undefined && data.value !== undefined
    );
    if (isTypeAndValue({ type, value })) {
      return {
        valueMin: type === 'min' ? (value || this.valueMin) : this.valueMin,
        valueMax: type === 'max' ? (value || this.valueMin) : this.valueMax,
      };
    }
    return { valueMin, valueMax };
  }
}

export default Label;
