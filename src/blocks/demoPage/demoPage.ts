import {Presenter} from "../presenter/presenter";
import {ViewDnD} from "../view/viewDnD";
import {ViewOptional} from "../view/viewOptional";

interface Slider {
    progress: boolean, min: number, max: number, vertical: boolean,
        range: boolean, step?: number
}

class DemoPage {
    initSliders(){
        const sliderSettings: [Slider, Slider, Slider, Slider] = [
            {progress: true, min: 100, max: 500, vertical: false, range: false},
            {progress: true, min: 0, max: 100, vertical: true, range: true},
            {progress: true, min: 0, max: 500, vertical: false, range: true, step: 100},
            {progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250}
        ];

        Array.from(document.querySelectorAll('.main__form-wrapper')).
        map((formWrapper, index)=>{
            this.createElements(sliderSettings[index], ((formWrapper as HTMLElement).
                children[0])as HTMLElement);
            $(formWrapper).slider(sliderSettings[index]);
            this.setInputValue(formWrapper as HTMLElement, sliderSettings[index].min, sliderSettings[index].max,
                sliderSettings[index].range);

            this.observeLabel(formWrapper as HTMLElement, sliderSettings[index].range);
            this.observeInput(formWrapper as HTMLElement, sliderSettings[index].range,
                sliderSettings[index].min, sliderSettings[index].max,
                sliderSettings[index].vertical, sliderSettings[index].step);
        });
    }

    createElements(setting: Slider, form: HTMLElement){

        let inputValue: JQuery;
        !setting.range ? inputValue = $('<label class="form__label-input"' +
            ' for="input-value">value</label><input class="form__input-value"' +
            ' id="input-value">') : inputValue = $('<label class="form__label-input"' +
            ' for="input-value-min">value min</label><input class="form__input-value' +
            ' form__input-value--min" id="input-value-min"><label class="form__label-input"' +
            ' for="input-value-max">value max</label><input class="form__input-value' +
            ' form__input-value--max" id="input-value-min">');

        inputValue.appendTo($(form))
    }

    setInputValue(element: HTMLElement, min: number, max: number, range: boolean){
        if (range){
            (element.querySelector('.form__input-value--min') as HTMLInputElement).
                value = min.toString();
            (element.querySelector('.form__input-value--max') as HTMLInputElement).
                value = max.toString();
        }else {
            (element.querySelector('.form__input-value') as HTMLInputElement).
                value = min.toString();
        }
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
        !vertical ? widthHeightTrack = (element.
            querySelector('.slider-track') as HTMLElement).clientWidth :
            widthHeightTrack = widthHeightTrack = (element.
            querySelector('.slider-track') as HTMLElement).clientHeight;
        if(range){
           thumbMin = element.querySelector('#thumb-min') as HTMLElement;
           thumbMax = element.querySelector('#thumb-max') as HTMLElement;
        }else thumb = element.querySelector('.slider-thumb');

        (element.querySelector('.form') as HTMLElement).
        addEventListener('change', (evt)=>{
            if ((evt.target as HTMLElement).classList.contains('form__input-value')){
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
        })
    }
}

export {DemoPage}