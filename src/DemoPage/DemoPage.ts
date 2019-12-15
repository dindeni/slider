import Presenter from '../slider/Presenter/Presenter';
import ViewUpdating from '../slider/views/ViewUpdating/ViewUpdating';

interface Slider {
    progress: boolean;
    min: number;
    max: number;
    vertical: boolean;
    range: boolean;
    step?: number;
}

class DemoPage {
    sliderSettings: [Slider, Slider, Slider, Slider];

    settingsKeys = ['progress', 'min', 'max', 'vertical', 'range', 'step'];

    errorElement: HTMLElement;

    rem = 0.077;

    viewUpdating: ViewUpdating = new ViewUpdating();

    loadSliders(): void {
      this.sliderSettings = [
        {
          progress: true, min: 100, max: 500, vertical: false, range: false,
        }, {
          progress: true, min: 0, max: 100, vertical: true, range: true,
        }, {
          progress: true, min: 0, max: 500, vertical: false, range: true, step: 100,
        }, {
          progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250,
        },
      ];

      Array.from(document.querySelectorAll('.js-index__wrapper'))
        .map((formWrapper, index) => {
          const scale = this.sliderSettings[index].step !== undefined;

          const optionsForElements = {
            settings: this.sliderSettings[index],
            form: ((formWrapper as HTMLElement).children[0]) as HTMLElement,
            scale,
          };
          DemoPage.createElements(optionsForElements);
          $(formWrapper).slider(this.sliderSettings[index]);
          DemoPage.setInputValue({
            element: formWrapper as HTMLElement,
            settings: this.sliderSettings[index],
          });

          const optionsForInput = {
            element: formWrapper as HTMLElement,
            range: this.sliderSettings[index].range,
            min: this.sliderSettings[index].min,
            max: this.sliderSettings[index].max,
            vertical: this.sliderSettings[index].vertical,
            step: this.sliderSettings[index].step,
            progress: this.sliderSettings[index].progress,
          };
          DemoPage.observeLabel({
            element: formWrapper as HTMLElement,
            range: this.sliderSettings[index].range,
          });
          return this.observeInput(optionsForInput);
        });
    }

    observeInput(options: {element: HTMLElement; range: boolean; min: number; max: number;
      vertical: boolean; step: number | undefined; progress: boolean;}): void {
      const {
        element, range, min, max, vertical, step, progress,
      } = options;

      let trackWidth: number;
      let trackHeight;
      let thumbMin: HTMLElement;
      let thumbMax: HTMLElement;
      let thumb;

      const formElement = element.querySelector('.js-demo') as HTMLElement;

      const handleDemoChange = (event: MouseEvent): void => {
        trackWidth = (element.querySelector('.js-slider__track') as HTMLElement).clientWidth;
        trackHeight = (element.querySelector('.js-slider__track') as HTMLElement).clientHeight;

        if (range) {
          thumbMin = element.querySelector('.js-slider__thumb_min') as HTMLElement;
          thumbMax = element.querySelector('.js-slider__thumb_max') as HTMLElement;
        } else thumb = element.querySelector('.js-slider__thumb');

        if ((event.target as HTMLElement).classList.contains('js-demo__field-value')) {
          const optionsForDistance = {
            value: parseInt((event.target as HTMLInputElement).value, 10),
            min,
            max,
            trackSize: vertical ? trackHeight : trackWidth,
          };
          const distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);

          const optionsForValue = {
            element: event.target as HTMLInputElement,
            value: (event.target as HTMLInputElement).value,
            min,
            max,
            step,
            range,
            wrapper: event.currentTarget as HTMLElement,
          };
          const inputValue: number | undefined = this.validateValue(optionsForValue);
          const inputValueCondition = inputValue || inputValue === 0;

          if (inputValueCondition) {
            if (!range) {
              const optionsForThumbPosition = {
                value: vertical ? parseInt((event.target as HTMLInputElement).value, 10)
                  : inputValue || 0,
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
              };
              !vertical ? (thumb as HTMLElement).style.left = `${Presenter.calculateFromValueToCoordinates(optionsForThumbPosition)}rem`
                : (thumb as HTMLElement).style.top = `${Presenter.calculateFromValueToCoordinates(optionsForThumbPosition)}rem`;
              const optionsForData = {
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
                distance,
                vertical,
                thumbElement: thumb,
                progress,
                progressSize: distance,
              };
              this.viewUpdating.updateData(optionsForData);
            } else {
              let thumbMinMax: HTMLElement;
              (event.target as HTMLInputElement).classList
                .contains('js-demo__field-value_min') ? thumbMinMax = thumbMin
                : thumbMinMax = thumbMax;
              const optionsForThumbPosition = {
                value: parseInt((event.target as HTMLInputElement).value, 10),
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
              };
              !vertical ? thumbMinMax.style.left = `${Presenter.calculateFromValueToCoordinates(optionsForThumbPosition)}rem`
                : thumbMinMax.style.top = `${Presenter.calculateFromValueToCoordinates(optionsForThumbPosition)}rem`;
              const optionsForData = {
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
                distance,
                vertical,
                thumbElement: thumbMinMax,
                progress,
                progressSize: distance,
              };
              this.viewUpdating.updateData(optionsForData);
            }
          }
        }

        const optionForSetting = {
          value: (event.target as HTMLInputElement).value,
          element: event.target as HTMLElement,
          min,
          max,
        };
        const settingValue: boolean | number | undefined | null = this.validateSettings(
          optionForSetting,
        );

        if (settingValue !== null) {
          const scaleElement = element.querySelector('.js-demo__field-scale');

          if (event.target === scaleElement && (event.target as HTMLInputElement).checked) {
            DemoPage.createStepSetting({ form: event.currentTarget as HTMLElement, min, max });
          } else if (event.target === scaleElement && !(event.target as HTMLInputElement).checked) {
            ((event.currentTarget as HTMLElement).querySelector('.js-demo__field-settings_step') as HTMLElement).remove();
          }

          const settings: Slider = {
            progress: true,
            min: 0,
            max: 100,
            vertical: false,
            range: false,
            step: undefined,
          };

          ((event.currentTarget as HTMLElement).nextElementSibling as HTMLElement)
            .remove();

          formElement.removeEventListener('change', handleDemoChange);

          const inputSettings = element.querySelectorAll('.js-demo__field-settings');
          const inputValue = element.querySelectorAll('.js-demo__field-value');
          Array.from(inputSettings).map((input, index) => {
            const key = this.settingsKeys[index];
            let value;

            if ((input as HTMLInputElement).type === 'checkbox') {
              value = (input as HTMLInputElement).checked;
            } else {
              value = DemoPage.convertInputValue((input as HTMLInputElement).value);
            }
            return Object.assign(settings, { [key]: value });
          });

          const sliderValue: {notRange?: number; min?: number; max?: number} = {};
          Array.from(inputValue).map((input) => {
            if (input.classList.contains('js-demo__field-value_min')) {
              sliderValue.min = Number((input as HTMLInputElement).value);
              return undefined;
            }
            if (input.classList.contains('js-demo__field-value_max')) {
              sliderValue.max = Number((input as HTMLInputElement).value);
              return undefined;
            }
            sliderValue.notRange = Number((input as HTMLInputElement).value);
            return undefined;
          });

          while ((event.currentTarget as HTMLElement).firstChild as HTMLElement) {
            ((event.currentTarget as HTMLElement).firstChild as HTMLElement).remove();
          }

          const scale = settings.step !== undefined;
          DemoPage.createElements({ settings, form: event.currentTarget as HTMLElement, scale });
          DemoPage.setInputValue({
            element: event.currentTarget as HTMLElement,
            settings,
            value: sliderValue,
          });

          $(element).slider(settings);

          const optionsForUpdate = {
            ...settings,
            wrapper: element,
            value: sliderValue,
          };
          this.updateValue(optionsForUpdate);

          const optionsForInput = {
            element,
            range: settings.range,
            min: settings.min,
            max: settings.max,
            vertical: settings.vertical,
            step: settings.step,
            progress: settings.progress,
          };
          this.observeInput(optionsForInput);
          DemoPage.observeLabel({ element, range: settings.range });
        }
      };

      formElement.addEventListener('change', handleDemoChange);
    }


    validateValue(options: {element: HTMLElement; value: string; min: number; max: number;
      step: number | undefined; range: boolean; wrapper: HTMLElement;}):
    number | undefined {
      const {
        element, value, min, max, step, range, wrapper,
      } = options;
      const valueToNumber = Number(value);
      let isValueMinMaxValid;

      if (range) {
        const minElement = wrapper.querySelector('.js-demo__field-value_min');
        const maxElement = wrapper.querySelector('.js-demo__field-value_max');
        const valueMin = Number((minElement as HTMLInputElement).value);
        const valueMax = Number((maxElement as HTMLInputElement).value);

        element === minElement ? isValueMinMaxValid = valueToNumber < valueMax
          : isValueMinMaxValid = valueToNumber > valueMin;
      }

      let isValueValid;
      const isValidStepValue = step && (valueToNumber - min) % step === 0;

      !range ? isValueValid = valueToNumber >= min && valueToNumber < max
        : isValueValid = valueToNumber >= min && valueToNumber <= max && isValueMinMaxValid;
      const validation = {
        checkRangeValue: (): number | undefined => {
          if (isValueValid) {
            DemoPage.deleteErrorElement(element);
            return valueToNumber;
          }
          DemoPage.deleteErrorElement(element);
          this.createErrorElement({ element, text: 'invalid value' });
          return undefined;
        },

        checkStepValue: (): number | undefined => {
          if (isValidStepValue) {
            DemoPage.deleteErrorElement(element);
            return valueToNumber;
          }
          DemoPage.deleteErrorElement(element);
          this.createErrorElement({ element, text: 'value must be a multiple of step' });
          return undefined;
        },
      };

      if (step) {
        const resultMinMax = validation.checkRangeValue();
        return resultMinMax || resultMinMax === 0 ? validation.checkStepValue() : undefined;
      } return validation.checkRangeValue();
    }

    validateSettings(options: {value: string; element: HTMLElement; min: number; max: number}):
     boolean | number | undefined | null {
      const {
        value, element, min, max,
      } = options;

      const convertedValue: boolean | number | undefined | null = DemoPage.convertInputValue(value);
      const isMin = element.classList.contains('js-demo__field-settings_min');
      const isMax = element.classList.contains('js-demo__field-settings_max');
      const isCheckbox = (element as HTMLInputElement).type === 'checkbox';
      const isStep = element.classList.contains('js-demo__field-settings_step');
      switch (true) {
        case isMin:
          DemoPage.deleteErrorElement(element);
          return Number(value) < max ? convertedValue
            : this.createErrorElement({ element, text: 'must be less than max' });
        case isMax:
          DemoPage.deleteErrorElement(element);
          return Number(value) > min ? convertedValue
            : this.createErrorElement({ element, text: 'must be greater than min' });
        case isStep: return convertedValue;
        case isCheckbox: return (element as HTMLInputElement).checked;
        default: return null;
      }
    }

    createErrorElement(options: {element: HTMLElement; text: string}): null {
      const {
        element, text,
      } = options;

      this.errorElement = document.createElement('span');
      this.errorElement.textContent = text;
      this.errorElement.classList.add('error');
      ((element as HTMLElement).parentElement as HTMLElement)
        .insertBefore(this.errorElement, null);
      return null;
    }

    static deleteErrorElement(element: HTMLElement): void {
      if (element.nextElementSibling) {
        element.nextElementSibling.remove();
      }
    }

    static observeLabel(options: {element: HTMLElement; range: boolean}): void {
      const {
        element, range,
      } = options;

      if (!range) {
        const label: HTMLElement = element.querySelector('.js-slider__label') as HTMLElement;
        const input: HTMLInputElement = element.querySelector('.js-demo__field-value') as HTMLInputElement;
        const watchLabel = (mutationRecord): void => {
          (input as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const observer = new MutationObserver(watchLabel);
        observer.observe(label as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });
      } else {
        const labelMin: HTMLElement = element.querySelector('.js-slider__label_min') as HTMLElement;
        const inputMin: HTMLInputElement = element.querySelector('.js-demo__field-value_min') as HTMLInputElement;
        const watchLabelMin = (mutationRecord): void => {
          (inputMin as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const labelMax: HTMLElement = element.querySelector('.js-slider__label_max') as HTMLElement;
        const inputMax: HTMLInputElement = element.querySelector('.js-demo__field-value_max') as HTMLInputElement;
        const watchLabelMax = (mutationRecord): void => {
          (inputMax as HTMLInputElement).value = mutationRecord[mutationRecord.length - 1]
            .target.textContent;
        };

        const observerMin = new MutationObserver(watchLabelMin);
        observerMin.observe(labelMin as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });

        const observerMax = new MutationObserver(watchLabelMax);
        observerMax.observe(labelMax as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });
      }
    }

    static createElements(options: {settings: Slider; form: HTMLElement; scale: boolean}): void {
      const {
        settings, form, scale,
      } = options;

      let $inputValue: JQuery;
      let formIndex;
      Array.from(document.querySelectorAll('.js-demo')).map((value, index) => {
        if (form === value) {
          formIndex = index;
        } return undefined;
      });
      !settings.range ? $inputValue = $('<div class="demo__field-wrapper">'
       + '<label class="demo__mark">value<input type="number" class="demo__field-value js-demo__field-value"></label></div>')
        : $inputValue = $('<div class="demo__field-wrapper">'
      + '<label class="demo__mark">value min<input type="number" class="demo__field-value js-demo__field-value demo__field-value_min js-demo__field-value_min"></label></div>'
      + '<div class="demo__field-wrapper"><label class="demo__mark">value max<input type="number" class="demo__field-value js-demo__field-value demo__field-value_max js-demo__field-value_max"></label></div>');

      const $settingsInputs = $(`<div class="demo__field-wrapper demo__field-wrapper_for-checkbox"> progress
       <input type="checkbox" id="progress-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_progress js-demo__field-settings_progress"><label for="progress-${formIndex}" class="demo__mark"></label></div>`
      + '<div class="demo__field-wrapper"><label class="demo__mark">min<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_min js-demo__field-settings_min">'
       + '</label></div><div class="demo__field-wrapper">'
      + '<label class="demo__mark">max<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_max js-demo__field-settings_max"></label></div>'
      + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">vertical<input type="checkbox" id="vertical-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_vertical js-demo__field-settings_vertical"><label for="vertical-${formIndex}" class="demo__mark"></label></div>`
       + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">range<input type="checkbox" id="range-${formIndex}" class="demo__field-settings js-demo__field-settings demo__field-settings_range js-demo__field-settings_range"><label for="range-${formIndex}" class="demo__mark"></label></div>`
        + `<div class="demo__field-wrapper demo__field-wrapper_for-checkbox">scale<input type="checkbox" id="scale-${formIndex}" ${scale ? 'checked=true' : ''} class="demo__field-scale js-demo__field-scale"><label for="scale-${formIndex}" class="demo__mark"></label></div>`);

      const $scaleElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_step js-demo__field-settings_step"></label></div>');

      $inputValue.appendTo($(form));
      $settingsInputs.appendTo($(form));

      if (scale) {
        $scaleElement.appendTo($(form));
      }
    }

    static createStepSetting(options: {form: HTMLElement; min: number; max: number}): void {
      const {
        form, min, max,
      } = options;

      const step = (max - min) / 5;
      const $stepElement = $('<div class="demo__field-wrapper"><label class="demo__mark">step<input type="number" class="demo__field-settings js-demo__field-settings demo__field-settings_step js-demo__field-settings_step"></label></div>');
      $stepElement.find('.js-demo__field-settings_step').val(step);
      $stepElement.appendTo($(form));
    }

    static convertInputValue(value: string):
    boolean | undefined | number | null {
      const valueToNumber = parseInt(value, 10);
      if (!valueToNumber && valueToNumber !== 0) {
        switch (value) {
          case 'true': return true;
          case 'false': return false;
          case 'undefined': return undefined;
          default: return null;
        }
      } return valueToNumber;
    }

    static setInputValue(options: {element: HTMLElement; settings: Slider;
      value?: {notRange?: number; min?: number; max?: number};}): void {
      const {
        element, settings, value,
      } = options;

      const { range, min, max } = settings;

      if (range) {
        const minInput = (element.querySelector('.js-demo__field-value_min') as HTMLInputElement);
        minInput.min = min.toString();
        minInput.max = max.toString();
        if (value && value.notRange) {
          minInput.value = value.notRange.toString();
        } else minInput.value = value && value.min ? value.min.toString() : min.toString();
        const maxInput = (element.querySelector('.js-demo__field-value_max') as HTMLInputElement);
        maxInput.min = min.toString();
        maxInput.max = max.toString();
        maxInput.value = value && value.max ? value.max.toString() : max.toString();
      } else {
        const input = (element.querySelector('.js-demo__field-value') as HTMLInputElement);
        input.min = min.toString();
        input.max = max.toString();
        if (value && value.min) {
          input.value = value.min.toString();
        } else {
          input.value = value && value.notRange ? value.notRange.toString()
            : min.toString();
        }
      }

      Array.from(element.querySelectorAll('.js-demo__field-settings')).map((input, index) => {
        const inputElement = (input as HTMLInputElement);
        if (inputElement.type === 'checkbox') {
          inputElement.checked = Object.values(settings)[index];
          return inputElement;
        }
        inputElement.value = Object.values(settings)[index];
        return inputElement;
      });
    }

    updateValue(options: {range: boolean; min: number; max: number; vertical: boolean;
     progress: boolean; wrapper: HTMLElement;
     value: {notRange?: number; min?: number; max?: number};},
    step?: number | undefined): void {
      const {
        range, min, max, vertical, progress, wrapper, value,
      } = options;

      let thumbMin;
      let thumbMax;
      let thumb;
      let stepCoords;
      let stepIndex;

      const trackWidth = Math.round((wrapper.querySelector('.slider__track') as HTMLElement).getBoundingClientRect().width);
      const trackHeight = Math.round((wrapper.querySelector('.slider__track') as HTMLElement).getBoundingClientRect().height);

      if (range) {
        thumbMin = wrapper.querySelector('.js-slider__thumb_min') as HTMLElement;
        thumbMax = wrapper.querySelector('.js-slider__thumb_max') as HTMLElement;
      } else thumb = wrapper.querySelector('.js-slider__thumb');

      const updatingValues = {
        setDefaultValue: (): void => {
          let validValue = value.notRange;

          if (validValue) {
            if (validValue < min) {
              validValue = min;
            } else if (validValue > max) {
              validValue = max;
            }
            if (step) {
              validValue = updatingValues.validateStep(validValue);
            }

            const input = wrapper.querySelector('.js-demo__field-value');
            (input as HTMLInputElement).value = validValue.toString();

            const optionsForDistance = {
              value: validValue,
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
            };
            const distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);
            vertical ? (thumb as HTMLElement).style.top = `${distance}rem`
              : (thumb as HTMLElement).style.left = `${distance}rem`;
            const optionsForData = {
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
              distance,
              vertical,
              thumbElement: thumb,
              progress,
              progressSize: distance,
            };
            this.viewUpdating.updateData(optionsForData);
          } else if (value.min) {
            const optionsForDistance = {
              value: value.min,
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
            };
            const distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);
            !vertical ? (thumb as HTMLElement).style.left = `${distance}rem`
              : (thumb as HTMLElement).style.top = `${distance}rem`;
            const optionsForData = {
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
              distance,
              vertical,
              thumbElement: thumb,
              progress,
              progressSize: distance,
            };
            this.viewUpdating.updateData(optionsForData);
          }
        },

        validateStep: (checkedValue: number): number => {
          const isNotValidStep = step && (checkedValue - min) % step !== 0;
          const presenter = new Presenter();
          stepCoords = presenter.calculateLeftScaleCoords({
            min,
            max,
            step,
            vertical,
            trackWidth,
            trackHeight,
          });
          /* eslint-disable array-callback-return, consistent-return */
          if (isNotValidStep) {
            return stepCoords.value.find((item: number, index) => {
              const isGreaterValue = item > checkedValue || index === stepCoords.value.length - 1;
              if (isGreaterValue) {
                stepIndex = index;
                return item;
              }
            });
          }
          return stepCoords.value.find((item: number, index) => {
            if (item === checkedValue) {
              stepIndex = index;
              return checkedValue;
            }
          });
          /* eslint-enable array-callback-return, consistent-return */
        },

        setMin: (): void => {
          thumbMin = wrapper.querySelector('.js-slider__thumb_min') as HTMLElement;
          if (value.notRange) {
            const optionsForDistance = {
              value: value.notRange,
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
            };
            const distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);
            !vertical ? (thumbMin as HTMLElement).style.left = `${distance}rem` : (thumbMin as HTMLElement).style.top = `${distance}rem`;
            const optionsForData = {
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
              distance,
              vertical,
              thumbElement: thumbMin,
              progress,
              progressSize: distance,
            };
            this.viewUpdating.updateData(optionsForData);
          }
        },

        setRangeValue: (): void => {
          if (value.min) {
            let distance;
            let validValue = value.min;
            if (validValue < min) {
              validValue = min;
            } else if (validValue > max) {
              validValue = max;
            }

            if (step) {
              validValue = updatingValues.validateStep(validValue);
              distance = stepCoords.coords[stepIndex] * this.rem;
            } else {
              const optionsForDistance = {
                value: validValue,
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
              };
              distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);
            }

            !vertical ? (thumbMin as HTMLElement).style.left = `${distance}rem`
              : (thumbMin as HTMLElement).style.top = `${distance}rem`;
            const optionsForData = {
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
              distance,
              vertical,
              thumbElement: thumbMin,
              progress,
              progressSize: distance,
            };
            this.viewUpdating.updateData(optionsForData);

            const input = wrapper.querySelector('.js-demo__field-value_min');
            (input as HTMLInputElement).value = validValue.toString();
          }
          if (value.max) {
            let validValue = value.max;
            if (validValue < min) {
              validValue = min;
            } else if (validValue > max) {
              validValue = max;
            }
            let distance;
            if (step) {
              validValue = updatingValues.validateStep(validValue);
              distance = stepCoords.coords[stepIndex] * this.rem;
            } else {
              const optionsForDistance = {
                value: validValue,
                min,
                max,
                trackSize: vertical ? trackHeight : trackWidth,
              };
              distance = Presenter.calculateFromValueToCoordinates(optionsForDistance);
            }

            !vertical ? (thumbMax as HTMLElement).style.left = `${distance}rem`
              : (thumbMax as HTMLElement).style.top = `${distance}rem`;
            const optionsForData = {
              min,
              max,
              trackSize: vertical ? trackHeight : trackWidth,
              distance,
              vertical,
              thumbElement: thumbMax,
              progress,
              progressSize: distance,
            };
            this.viewUpdating.updateData(optionsForData);

            const input = wrapper.querySelector('.js-demo__field-value_max');
            (input as HTMLInputElement).value = validValue.toString();
          }
        },
      };

      switch (true) {
        case !range: updatingValues.setDefaultValue();
          break;
        case value.notRange && range: updatingValues.setMin();
          break;
        default: updatingValues.setRangeValue();
      }
    }
}

export default DemoPage;
