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
                this.sliderSettings[index].vertical, this.sliderSettings[index].step);
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
                 vertical: boolean, step: number | undefined){
        const presenter = new Presenter();
        const viewDnd = new ViewDnD();
        const viewOptional = new ViewOptional();
        let widthHeightTrack: number, thumbMin: HTMLElement, thumbMax: HTMLElement,
        thumb;

        (element.querySelector('.form') as HTMLElement).
        addEventListener('change', (evt)=>{
            !vertical ? widthHeightTrack = (element.
                querySelector('.slider-track') as HTMLElement).clientWidth :
                widthHeightTrack = widthHeightTrack = (element.
                querySelector('.slider-track') as HTMLElement).clientHeight;

            if(range){
                thumbMin = element.querySelector('#thumb-min') as HTMLElement;
                thumbMax = element.querySelector('#thumb-max') as HTMLElement;
            }else thumb = element.querySelector('.slider-thumb');

            if ((evt.target as HTMLElement).classList.contains('form__input-value')){
                console.log(widthHeightTrack)
                    const distance = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                        min, max, widthHeightTrack);
                    if (!range){
                        !vertical ? (thumb as HTMLElement).style.left = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                            min, max, widthHeightTrack) + 'px' : (thumb as HTMLElement).style.top = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                            min, max, widthHeightTrack) + 'px';
                        viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                            thumb);
                        viewOptional.stylingProgress(distance, vertical, thumb)
                    }else {
                        let thumb: HTMLElement;
                        (evt.target as HTMLInputElement).classList.
                        contains('form__input-value--min') ? thumb = thumbMin :
                            thumb = thumbMax;
                        !vertical ? thumb.style.left = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                            min, max, widthHeightTrack) + 'px' : thumb.style.top = presenter.calculateFromValueToCoordinates(parseInt((evt.target as HTMLInputElement).value, 10),
                            min, max, widthHeightTrack) + 'px';
                        viewDnd.updateData(min, max, widthHeightTrack, distance, vertical,
                            thumb);
                        viewOptional.stylingProgress(distance, vertical, thumb)
                    }
                }
            if ((evt.target as HTMLElement).classList.contains('form__input-settings')){
                const inputSettings = element.querySelectorAll('.form__input-settings')
                let settings: any = {};
                ((evt.currentTarget as HTMLElement).nextElementSibling as HTMLElement).
                     remove();
                console.log((evt.currentTarget as HTMLElement).nextElementSibling);
                Array.from(inputSettings).map((input, index)=>{
                    const key = this.settingsKeys[index];
                    const value = this.convertInputValue((input as HTMLInputElement).value)
                    Object.assign(settings, {[key]: value});
                });
                $(element).slider(settings);
                /*this.observeInput(element, settings.range, settings.min, settings.max,
                    settings.vertical, settings.step);*/
            }
        })
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
}

export {DemoPage}