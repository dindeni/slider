import DemoPage from '../blocks/demoPage/demoPage';
import '../blocks/slider/slider';

import style from '../blocks/view/view.scss';


import {dispatchMove} from "./_serviceFunctions";

describe('DemoPage', async ()=>{
    const sliderSettings = [
        {progress: true, min: 100, max: 500, vertical: false, range: false},
        {progress: true, min: 0, max: 100, vertical: true, range: true},
        {progress: true, min: 0, max: 500, vertical: false, range: true, step: 100},
        {progress: false, min: 0, max: 1000, vertical: true, range: false, step: 250}
    ];

    let sliderWrapper, formsList, sliderTrack;

    const createHtml = () => {
        const htmlElements = '<div class="main__form-wrapper">' +
            '<form class="main__form form"></form>' +
            '</div>';
        const main = document.querySelector('body');

        for (let i =0; i <= 3; i++){
            main.insertAdjacentHTML('afterbegin', htmlElements);
        }

        const styleElement = document.createElement('style');
        styleElement.innerHTML = style;
        document.head.appendChild(styleElement);
    };

    beforeAll(async ()=>{
        document.body.innerHTML = '';

        const demoPage = new DemoPage();

        await createHtml();
        await demoPage.initSliders();

        sliderWrapper = document.querySelectorAll('.slider-wrapper');
        sliderTrack = document.querySelectorAll('.slider-track');
        formsList = document.querySelectorAll('.form');
    });

    describe('Before dispatch', ()=>{
        it('should form elements exist',  ()=> {
            const formElements = document.querySelectorAll('.form');
            Array.from(formElements).map((value)=>{
                expect(value).not.toBeNull()
            })
        });

        it('should sliders exist',  ()=> {

            const sliders = document.querySelectorAll('.slider-wrapper');
            Array.from(sliders).map((value)=>{
                expect(value).not.toBeNull()
            });
        });

        it('should set input value',  ()=> {
            const inputValueElement = document.querySelectorAll(
                '.form');
            Array.from(inputValueElement).map((form, index)=>{
                if (sliderSettings[index].range){
                    expect(form.querySelector('.form__input-value--min').value &&
                        form.querySelector('.form__input-value--max').value).
                    toBe(sliderSettings[index].min.toString() &&
                        sliderSettings[index].max.toString())
                }else {
                    expect(form.querySelector('.form__input-value').value).
                    toBe(sliderSettings[index].min.toString())
                }
            })
        });
    });

    it('should inputs settings exist', ()=> {
        Array.from(formsList).map((wrapper)=>{
            expect(wrapper.querySelector('.form__input-settings--progress')).not.toBeNull();
            expect(wrapper.querySelector('.form__input-settings--min')).not.toBeNull();
            expect(wrapper.querySelector('.form__input-settings--max')).not.toBeNull();
            expect(wrapper.querySelector('.form__input-settings--vertical')).not.toBeNull();
            expect(wrapper.querySelector('.form__input-settings--range')).not.toBeNull();
            expect(wrapper.querySelector('.form__input-settings--step')).not.toBeNull();
        })
    });

    it('should set inputs value', ()=> {
        Array.from(formsList).map((wrapper, index)=>{
            Array.from(wrapper.querySelectorAll('.form__input-settings')).map((input, indexInput)=>{
                let setting = Object.values(sliderSettings[index])[indexInput];
                expect(input.value).toBe(String(setting))
            })
        })
    });

    describe('After dispatch', ()=>{
        let label;
        beforeAll(()=>{
            label = document.querySelectorAll('.slider-label');
            let thumbX, thumbY, thumbMin, thumbMinX, thumbMinY, thumbMax, thumbMaxX,
                thumbMaxY;
            Array.from(document.querySelectorAll('.main__form-wrapper')).
            map((wrapper, index)=>{
                const thumb = wrapper.querySelectorAll('.slider-thumb');
                switch (index) {
                    case 0:
                        thumbX = thumb[0].getBoundingClientRect().left;
                        thumbY = thumb[0].getBoundingClientRect().top;
                        dispatchMove(thumb[0], thumbX, thumbY, 50, 0);
                        break;
                    case 1:
                        thumbMin = thumb[0];
                        thumbMinX = thumbMin.getBoundingClientRect().left;
                        thumbMinY = thumbMin.getBoundingClientRect().top;
                        dispatchMove(thumbMin, thumbMinX, thumbMinY, 0, 50);
                        thumbMax = thumb[1];
                        thumbMaxX = thumbMax.getBoundingClientRect().left;
                        thumbMaxY = thumbMax.getBoundingClientRect().top;
                        dispatchMove(thumbMax, thumbMinX, thumbMinY, 0, -50);
                        break;
                    case 2:
                        thumbMin = thumb[0];
                        thumbMinX = thumbMin.getBoundingClientRect().left;
                        thumbMinY = thumbMin.getBoundingClientRect().top;
                        dispatchMove(thumbMin, thumbMinX, thumbMinY, 50, 0);
                        thumbMax = thumb[1];
                        thumbMaxX = thumbMax.getBoundingClientRect().left;
                        thumbMaxY = thumbMax.getBoundingClientRect().top;
                        dispatchMove(thumbMax, thumbMinX, thumbMinY, -50, 0);
                        break;
                    case 3:
                        thumbX = thumb[0].getBoundingClientRect().left;
                        thumbY = thumb[0].getBoundingClientRect().top;
                        dispatchMove(thumb[0], thumbX, thumbY, 0, 50);
                        break;
                }

            });
        });

        it('should first slider input value to be equal label value',
            ()=> {
            const input = formsList[0].querySelector('.form__input-value');
            expect(input.value).toBe(label[0].textContent)
        });

        it('should second slider input min value to be equal label value',
            ()=> {
            const input = formsList[1].querySelector('.form__input-value--min');
            expect(input.value).toBe(label[1].textContent)
        });

        it('should second slider input max value to be equal label value',
            ()=> {
            const input = formsList[1].querySelector('.form__input-value--max');
            expect(input.value).toBe(label[2].textContent)
        });

        it('third slider input min value to be equal label value',
            ()=>{
            const input = formsList[2].querySelector('.form__input-value--min');
            expect(input.value).toBe(label[3].textContent)
        });

        it('third slider input max value to be equal label value',
            ()=> {
            const input = formsList[2].querySelector('.form__input-value--max');
            expect(input.value).toBe(label[4].textContent)
        });

        it('should fourth slider input value to be equal label value',
            ()=> {
            const input = formsList[3].querySelector('.form__input-value');
            expect(input.value).toBe(label[5].textContent)
        });
    });

   /* it('should change slider value after change input value',
        ()=>{
            Array.from(document.querySelectorAll('.main__form-wrapper')).
            map((wrapper, index)=>{
                if (!sliderSettings[index].range){
                    const event = new Event('change');
                    const input = wrapper.querySelector('.form__input-value');
                    input.value =  parseInt(input.value, 10) + 100;
                    const form = wrapper.querySelector('.form');
                    Object.defineProperty(event, 'target', {writable: false, value: input});
                    form.dispatchEvent(event);
                    const labelValue = wrapper.querySelector('.slider-label').textContent;
                    expect(labelValue).toBe(input.value);
                }else {
                    const eventMin = new Event('change');
                    const eventMax = new Event('change');
                    const inputMin = wrapper.querySelector('.form__input-value--min');
                    const inputMax = wrapper.querySelector('.form__input-value--max');
                    inputMin.value =  parseInt(inputMin.value, 10) + 50;
                    inputMax.value =  parseInt(inputMax.value, 10) - 50;
                    const form = wrapper.querySelector('.form');
                    Object.defineProperty(eventMin, 'target', {writable: false, value: inputMin});
                    form.dispatchEvent(eventMin);
                    Object.defineProperty(eventMax, 'target', {writable: false, value: inputMax});
                    form.dispatchEvent(eventMax);
                    const labelValueMin = wrapper.querySelector('#label-min').textContent;
                    const labelValueMax = wrapper.querySelector('#label-max').textContent;
                    expect(labelValueMin).toBe(inputMin.value);
                    expect(labelValueMax).toBe(inputMax.value);
                }
            })
    });

    it('should change first slider from horizontal to vertical' +
        ' after change input vertical',  ()=> {
        const inputVertical = formsList[0].querySelector('.form__input-settings--vertical');
        inputVertical.value = true;
        const event = new Event('change');
        Object.defineProperty(event, 'target', {writable: false, value: inputVertical});
        formsList[0].dispatchEvent(event);
        expect(sliderTrack[0].clientWidth).not.toBe(260)

    });

    it('after change input value more than max value should show error',
         ()=> {
        const form = formsList[0];
        const input = form.querySelector('.form__input-value');
        input.value = sliderSettings.max + 100;
        const event = new Event('change');
        Object.defineProperty(event, 'target', {writable: false, value: input});
        formsList[0].dispatchEvent(event);
        expect(form.querySelector('.error')).not.toBeNull();
    });*/

    /*it('after change input setting progress should show error',
        ()=> {
            const form = formsList[1];
            const input = form.querySelector('.form__input-value');
            input.value = 100;
            const event = new Event('change');
            Object.defineProperty(event, 'target', {writable: false, value: input});
            form.dispatchEvent(event);
            expect(form.querySelector('.error')).not.toBeNull();
        });*/
});