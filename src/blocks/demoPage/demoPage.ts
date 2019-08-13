import {Presenter} from "../presenter/presenter";
import {ViewDnD} from "../view/viewDnD";
import {ViewOptional} from "../view/viewOptional";

interface Slider {
    progress: boolean, min: number, max: number, vertical: boolean,
        range: boolean, step?: number
}

class DemoPage {
    sliderSettings: [Slider, Slider, Slider, Slider];
    settingsKeys = ['progress', 'min', 'max', 'vertical', 'range', 'step'];
    errorElement: HTMLElement;

    initSliders(){
        this.sliderSettings = [
            {progress: true, min: 100, max: 500, vertical: false, range: false},
            {progress: true, min: 0, max: 100, vertical: true, range: true},
            {progress: true, min: 0, max: 500, vertical: false, range: true, step: 100},
            {progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250}
        ];

        Array.from(document.querySelectorAll('.main__form-wrapper')).
        map((formWrapper, index)=>{
            this.createElements(this.sliderSettings[index], ((formWrapper as HTMLElement).
                children[0])as HTMLElement);
            $(formWrapper).slider(this.sliderSettings[index]);
            this.setInputValue(formWrapper as HTMLElement, this.sliderSettings[index].min,
                this.sliderSettings[index].max, this.sliderSettings[index].range,
                this.sliderSettings[index]);

            this.observeLabel(formWrapper as HTMLElement, this.sliderSettings[index].range);
            this.observeInput(formWrapper as HTMLElement, this.sliderSettings[index].range,
                this.sliderSettings[index].min, this.sliderSettings[index].max,
                this.sliderSettings[index].vertical, this.sliderSettings[index].step,
                this.sliderSettings[index].progress);
        });
    }

    createElements(setting: Slider, form: HTMLElement){

        let inputValue: JQuery;
        !setting.range ? inputValue = $('<div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-value">value</label><input class="form__input-value"' +
            ' id="input-value"></div>') : inputValue = $('<div class="form__input-wrapper">' +
            '<label class="form__label-input" for="input-value-min">value min</label>' +
            '<input class="form__input-value form__input-value--min" id="input-value-min"></div>' +
            '<div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-value-max">value max</label><input class="form__input-value' +
            ' form__input-value--max" id="input-value-min"></div>');

        const settingsInputs = $('<div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-progress">progress(true or false)</label><input class="form__input-settings' +
            ' form__input-settings--progress" id="input-progress"></div>' +
            '<div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-min">min(number)</label><input class="form__input-settings' +
            ' form__input-settings--min" id="input-min"></div><div class="form__input-wrapper">' +
            '<label class="form__label-input" for="input-max">max(number)</label>' +
            '<input class="form__input-settings form__input-settings--max" id="input-max"></div>' +
            '<div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-vertical">vertical(true or false)</label><input class="form__input-settings' +
            ' form__input-settings--vertical" id="input-vertical"></div><div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-range">range(true or false)</label><input class="form__input-settings' +
            ' form__input-settings--range" id="input-range"></div><div class="form__input-wrapper"><label class="form__label-input"' +
            ' for="input-step">step(number)</label><input class="form__input-settings' +
            ' form__input-settings--step" id="input-step"></div>');

        inputValue.appendTo($(form));
        settingsInputs.appendTo($(form));

    }

    setInputValue(element: HTMLElement, min: number, max: number, range: boolean,
                  settings: Slider){
        if (range){
            (element.querySelector('.form__input-value--min') as HTMLInputElement).
                value = min.toString();
            (element.querySelector('.form__input-value--max') as HTMLInputElement).
                value = max.toString();
        }else {
            (element.querySelector('.form__input-value') as HTMLInputElement).
                value = min.toString();
        }

        Array.from(element.querySelectorAll('.form__input-settings')).map((input, index)=>{
            (input as HTMLInputElement).value = Object.values(settings)[index]
        })
    }

    observeLabel(element: HTMLElement, range: boolean){
        if (!range){
            const label: HTMLElement = element.querySelector('.slider-label') as HTMLElement;
            const input: HTMLInputElement = element.querySelector('.form__input-value') as HTMLInputElement;
            const mutations = (mutationRecord)=>{
                (input as HTMLInputElement).value = mutationRecord[mutationRecord.length-1].
                    target.textContent;
            };

            const observer = new MutationObserver(mutations);
            observer.observe(label as HTMLElement, {childList: true, attributes: true,
                characterData: true});
        }else {
            const labelMin: HTMLElement = element.querySelector('#label-min') as HTMLElement;
            const inputMin: HTMLInputElement = element.querySelector('.form__input-value--min') as HTMLInputElement;
            const mutationsMin = (mutationRecord)=>{
                (inputMin as HTMLInputElement).value = mutationRecord[mutationRecord.length-1].
                    target.textContent;
            };

            const labelMax: HTMLElement = element.querySelector('#label-max') as HTMLElement;
            const inputMax: HTMLInputElement = element.querySelector('.form__input-value--max') as HTMLInputElement;
            const mutationsMax = (mutationRecord)=>{
                (inputMax as HTMLInputElement).value = mutationRecord[mutationRecord.length-1].
                    target.textContent;
            };

            const observerMin = new MutationObserver(mutationsMin);
            observerMin.observe(labelMin as HTMLElement, {childList: true, attributes: true,
                characterData: true});

            const observerMax = new MutationObserver(mutationsMax);
            observerMax.observe(labelMax as HTMLElement, {childList: true, attributes: true,
                characterData: true});
        }
    };

    observeInput(element: HTMLElement, range: boolean, min: number, max: number,
                 vertical: boolean, step: number | undefined, progress: boolean){
        const presenter = new Presenter();
        const viewDnd = new ViewDnD();
        const viewOptional = new ViewOptional();
        let widthHeightTrack: number, thumbMin: HTMLElement, thumbMax: HTMLElement,
        thumb;

        const changeSlider = (evt: MouseEvent)=>{
            !vertical ? widthHeightTrack = (element.
                querySelector('.slider-track') as HTMLElement).clientWidth :
                widthHeightTrack = widthHeightTrack = (element.
                querySelector('.slider-track') as HTMLElement).clientHeight;

            if(range){
                thumbMin = element.querySelector('#thumb-min') as HTMLElement;
                thumbMax = element.querySelector('#thumb-max') as HTMLElement;
            }else thumb = element.querySelector('.slider-thumb');

            if ((evt.target as HTMLElement).classList.contains('form__input-value')){
                const distance = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                    min, max, widthHeightTrack);
                const evtValue: number | undefined = parseInt((evt.target as HTMLInputElement).value, 10);
                const inputValue: number | undefined = this.validateValue(evt.target as HTMLElement, element,'value', evtValue,
                    min, max, range, step);
                if (!range && inputValue){
                    !vertical ? (thumb as HTMLElement).style.left = presenter.calculateFromValueToCoordinates(inputValue,
                        min, max, widthHeightTrack) + 'px' : (thumb as HTMLElement).style.top = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                        min, max, widthHeightTrack) + 'px';
                    viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                        thumb, progress);
                }else if (inputValue){
                    let thumb: HTMLElement;
                    (evt.target as HTMLInputElement).classList.
                    contains('form__input-value--min') ? thumb = thumbMin :
                        thumb = thumbMax;
                    !vertical ? thumb.style.left = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                        min, max, widthHeightTrack) + 'px' : thumb.style.top = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                        min, max, widthHeightTrack) + 'px';
                    viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                        thumb, progress);
                }
            }

            const settingValue: boolean | number | undefined =
                this.validateValue(evt.target as HTMLElement, element,'settings', (evt.target as HTMLInputElement).value,
                min, max, range, step);
            if ((evt.target as HTMLElement).classList.contains('form__input-settings') && settingValue){
                const inputSettings = element.querySelectorAll('.form__input-settings')
                let settings: any = {};
                ((evt.currentTarget as HTMLElement).nextElementSibling as HTMLElement).
                remove();
                (element.querySelector('.form') as HTMLElement).removeEventListener('change', changeSlider);

                Array.from(inputSettings).map((input, index)=>{
                    const key = this.settingsKeys[index];
                    const value = this.convertInputValue((input as HTMLInputElement).value)
                    Object.assign(settings, {[key]: value});
                });
                $(element).slider(settings);
                this.observeInput(element, settings.range, settings.min, settings.max,
                    settings.vertical, settings.step, settings.progress);
                this.observeLabel(element, settings.range);
            }
        };

        (element.querySelector('.form') as HTMLElement).
        addEventListener('change', changeSlider);
    }

    convertInputValue(value: boolean | number | string | undefined){
       if (typeof value !== 'number'){
           switch (value) {
               case 'true': return true;
               case 'false': return false;
               case 'undefined': return undefined;
               default: return Number(value)
           }
       }

    }

    validateValue(elementTarget: HTMLElement, elementParent: HTMLElement, type: 'value' | 'settings',
                  value: any, min:number, max: number,
                  range: boolean, step:number | undefined){
        const validate = {
            deleteError: ()=>{
                elementTarget.nextElementSibling ? elementTarget.nextElementSibling.remove() : null;
            },
            value: ()=>{
                if (typeof value === 'number' && (value >= min && value <= max)){
                    validate.deleteError();
                    return value;


                }else{
                    this.createErrorElement(elementTarget, 'invalid value');
                }
            },
            step: ()=>{
                const stepValue: number | undefined = validate.value();
                if (stepValue){
                    validate.deleteError();
                    let currentValue;
                    Array.from(elementParent.querySelectorAll('.slider__scale-item')).
                    map(item=>{
                        if (item.textContent && stepValue === parseInt(item.textContent, 10)){
                            currentValue = value
                        }
                    });
                    !currentValue ? this.createErrorElement(elementTarget, 'invalid step value') : null;
                    return currentValue
                }
            },
            settings: ()=> {
                switch (true) {
                    case elementTarget.classList.contains('form__input-settings--progress') ||
                    elementTarget.classList.contains('form__input-settings--vertical') ||
                    elementTarget.classList.contains('form__input-settings--range'):
                        validate.deleteError();
                        return typeof this.convertInputValue(value) === 'boolean' ? value :
                            this.createErrorElement(elementTarget, 'value should to be boolean');
                    case elementTarget.classList.contains('form__input-settings--min') ||
                    elementTarget.classList.contains('form__input-settings--max'):
                        validate.deleteError();
                        return typeof Number(value) === 'number' && !isNaN(Number(value)) ? value :
                            this.createErrorElement(elementTarget, 'value should to be number');
                    case elementTarget.classList.contains('form__input-settings--step'):
                        validate.deleteError();
                        return value === 'undefined' || typeof Number(value) === 'number' && !isNaN(Number(value)) ? value :
                            this.createErrorElement(elementTarget, 'value should to be number or undefined');
                }
            }

        };

        switch (type) {
            case 'value': return step ? validate.step() : validate.value();
            case 'settings': return validate.settings()
        }
    };

    createErrorElement(element: HTMLElement, text: string){
        this.errorElement = document.createElement('span');
        this.errorElement.textContent = text;
        this.errorElement.classList.add('error');
        ((element as HTMLElement).parentElement as HTMLElement).
        insertBefore(this.errorElement, null);
    }
}

export {DemoPage}