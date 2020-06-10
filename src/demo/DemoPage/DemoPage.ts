import { Slider, SliderBasicOptions, ExtremumOptions } from '../../types/types';
import Panel from '../Panel/Panel';

interface ObservingInputOptions extends SliderBasicOptions{
  element: HTMLElement;
}

interface ObservingLabelOptions{
  element: HTMLElement;
  range: boolean;
  vertical: boolean;
}

interface DemoElementsAndEventOptions{
  event: Event;
  element: HTMLElement;
  demoElement: HTMLElement;
}

interface DemoElementChangeOptions extends ExtremumOptions, DemoElementsAndEventOptions{
  step: number | undefined;
  range: boolean;
}

interface OptionsForUpdatingSlider extends DemoElementsAndEventOptions{
  settings: Slider;
  sliderValue: {notRange?: number; min?: number; max?: number};
}

interface OptionsForGettingInputValues {
  element: HTMLElement;
  min: number;
}

interface ForMutationRecord {
  mutationRecord: MutationRecord[];
  thumbElement: HTMLElement;
  inputElement: HTMLInputElement;
}

class DemoPage extends Panel {
    private sliderSettings: [Slider, Slider, Slider, Slider];

    private settingsKeys = ['min', 'max', 'progress', 'vertical', 'range', 'label', 'step'];

    private slider;

    public loadSliders(): void {
      this.sliderSettings = [
        {
          min: 100, max: 500, progress: true, vertical: false, range: true, label: true,
        }, {
          min: 0, max: 100, progress: true, vertical: true, range: true, label: true,
        }, {
          min: 0, max: 500, progress: true, vertical: false, range: true, label: true, step: 100,
        }, {
          min: 0, max: 1000, progress: false, vertical: true, range: false, label: true, step: 250,
        },
      ];

      [...document.querySelectorAll('.js-index__wrapper')]
        .forEach((formWrapper, index) => {
          const scale = this.sliderSettings[index].step !== undefined;

          const optionsForElements = {
            settings: this.sliderSettings[index],
            form: ((formWrapper as HTMLElement).children[0]) as HTMLElement,
            scale,
          };
          DemoPage.createElements(optionsForElements);
          this.slider = $(formWrapper).slider(this.sliderSettings[index]);

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

          this.observeThumb({
            element: formWrapper as HTMLElement,
            range: this.sliderSettings[index].range,
            vertical: this.sliderSettings[index].vertical,
          });

          this.observeInput(optionsForInput);
        });
    }

    private observeInput(options: ObservingInputOptions): void {
      const {
        element, range, min, max, step,
      } = options;

      const demoElement = element.querySelector('.js-demo') as HTMLElement;

      demoElement.addEventListener('change', (event) => this.handleDemoElementChange(
        {
          min, max, step, range, event, element, demoElement,
        },
      ));
    }

    private handleDemoElementChange(options: DemoElementChangeOptions): void {
      const {
        min, max, step, range, event, element, demoElement,
      } = options;
      const optionForSetting = {
        value: (event.target as HTMLInputElement),
        element: event.target as HTMLElement,
        min,
        max,
      };

      const optionsForValue = {
        element: event.target as HTMLInputElement,
        value: (event.target as HTMLElement).classList.contains('js-panel__field-value')
          ? (event.target as HTMLInputElement).value
          : 'null',
        min,
        max,
        step,
        range,
        wrapper: event.currentTarget as HTMLElement,
      };

      const isValidValueOrSetting = (event.target as HTMLElement).classList.contains('js-panel__field-value')
        ? this.validateValue(optionsForValue)
        : this.validateSettings(optionForSetting);

      if (isValidValueOrSetting !== null) {
        const target = event.currentTarget as HTMLElement;
        const form = target.cloneNode(true) as HTMLElement;
        (target.parentNode as HTMLElement).replaceChild(form, target);
        (form.nextElementSibling as HTMLElement).remove();

        const { sliderValue, settings } = this.getInputValues({ element, min });
        this.updateSlider({
          event, element, demoElement, sliderValue, settings,
        });
      }
    }

    private updateSlider(options: OptionsForUpdatingSlider): void {
      const { element, settings, sliderValue } = options;

      settings.value = sliderValue.notRange;
      settings.valueMin = sliderValue.min === sliderValue.max
        && sliderValue.min === settings.max
        && settings.step ? sliderValue.min - settings.step : sliderValue.min;

      settings.valueMax = sliderValue.min === sliderValue.max
        && sliderValue.max === settings.min
        && settings.step ? sliderValue.max + settings.step : sliderValue.max;

      const form = element.querySelector('.js-demo') as HTMLElement;
      DemoPage.createElements({ settings, form });
      DemoPage.setInputValue({
        element: form,
        settings,
        value: sliderValue,
      });

      $(element).slider(settings);

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
      this.observeThumb({
        element,
        range: settings.range,
        vertical: settings.vertical,
      });
    }

    private getInputValues(options: OptionsForGettingInputValues): {settings: Slider;
      sliderValue: {notRange?: number; min?: number; max?: number};} {
      const { element, min } = options;

      let settings: Slider = {
        min: 0,
        max: 100,
        progress: true,
        vertical: false,
        range: false,
        label: false,
        step: undefined,
        value: min,
      };
      const inputSettings = element.querySelectorAll('.js-panel__field-settings');
      const inputValueElements = element.querySelectorAll('.js-panel__field-value');
      const inputStep = (element.querySelector('.js-panel__field-step') as HTMLInputElement);
      const inputScale = element.querySelector('.js-panel__field-settings_type_scale') as HTMLInputElement;
      [...inputSettings].map((input, index) => {
        const key = this.settingsKeys[index];

        const setInputValue = (): boolean | string | number | undefined | null => {
          if ((input as HTMLInputElement).type === 'checkbox') {
            return (input as HTMLInputElement).checked;
          }
          return DemoPage.convertInputValue((input as HTMLInputElement).value);
        };
        const value = setInputValue();
        settings = { ...settings, ...{ [key]: value } };
        return settings;
      });

      const checkValue = (checkedValue: number): number => {
        if (checkedValue > settings.max) {
          return settings.max;
        }
        if (checkedValue < settings.min) {
          return settings.min;
        }
        return checkedValue;
      };

      if (inputScale.checked) {
        settings.step = parseFloat(inputStep.value) || (settings.max - settings.min) / 5;
      }

      const sliderValue: {notRange?: number; min?: number; max?: number} = {};
      [...inputValueElements].forEach((input: HTMLElement) => {
        if (input.classList.contains('js-panel__field-value_type_min')) {
          const valueMin = checkValue(Number((input as HTMLInputElement).value));
          sliderValue.min = valueMin;
          sliderValue.notRange = valueMin;
        } else if (input.classList.contains('js-panel__field-value_type_max')) {
          sliderValue.max = checkValue(Number((input as HTMLInputElement).value));
        } else {
          sliderValue.notRange = Number((input as HTMLInputElement).value);
          sliderValue.min = Number((input as HTMLInputElement).value);
        }
      });
      return { sliderValue, settings };
    }

    private observeThumb(options: ObservingLabelOptions): void {
      const {
        element, range, vertical,
      } = options;

      if (range) {
        const thumbElementMin: HTMLElement = element.querySelector('.js-slider__thumb_type_min') as HTMLElement;
        const inputElementMin: HTMLInputElement = element.querySelector('.js-panel__field-value_type_min') as HTMLInputElement;
        const thumbElementMax: HTMLElement = element.querySelector('.js-slider__thumb_type_max') as HTMLElement;
        const inputElementMax: HTMLInputElement = element.querySelector('.js-panel__field-value_type_max') as HTMLInputElement;

        const watchThumb = (recordOptions: ForMutationRecord): void => {
          const { mutationRecord, inputElement, thumbElement } = recordOptions;

          if (mutationRecord[0].oldValue) {
            const oldValue = vertical
              ? (mutationRecord[0].oldValue.match(/(top: )\d+(.\d+)?rem/) || [])[0].trim().replace(/top: /, '')
              : (mutationRecord[0].oldValue.match(/[^left:]*rem/) || [])[0].trim();

            const positionOfThumb = vertical ? thumbElement.style.top : thumbElement.style.left;

            if (parseFloat(positionOfThumb) !== parseFloat(oldValue)) {
              inputElement.value = this.slider();
            }
          }
        };

        const observerMin = new MutationObserver((mutationRecord) => watchThumb(
          { mutationRecord, thumbElement: thumbElementMin, inputElement: inputElementMin },
        ));
        observerMin.observe(thumbElementMin as HTMLElement, {
          attributes: true,
          attributeOldValue: true,
        });
        const observerMax = new MutationObserver((mutationRecord) => watchThumb(
          { mutationRecord, thumbElement: thumbElementMax, inputElement: inputElementMax },
        ));
        observerMax.observe(thumbElementMax as HTMLElement, {
          attributes: true,
          attributeOldValue: true,
        });
      } else {
        const thumbElement: HTMLElement = element.querySelector('.js-slider__thumb') as HTMLElement;
        const inputElement: HTMLInputElement = element.querySelector('.js-panel__field-value') as HTMLInputElement;
        const watchThumb = (): void => {
          inputElement.value = this.slider();
        };

        const observer = new MutationObserver(watchThumb);
        observer.observe(thumbElement as HTMLElement, {
          childList: true,
          attributes: true,
          characterData: true,
        });
      }
    }
}

export default DemoPage;
