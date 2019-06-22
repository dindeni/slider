const $  = require('jquery');
import {View} from "../blocks/view/view.ts";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";

describe('View', ()=>{
    let divThumb;
    let divTrack;
    let divProgress;
    let divThumbWidth;
    let divThumbLeft;
    let divThumbTop;
    const moveDistance = 50;
    let divLabel;

    const dispatchMove = ()=>{
        divThumbWidth = divThumb.getBoundingClientRect().width;
        const evtDown = new MouseEvent('mousedown', {
            'view': window,
            'bubbles': true,
            'screenX': divThumbLeft,
            'screenY': divThumbTop,
            'cancelable': true
        });

        const evtMove = new MouseEvent('mousemove', {
            'view': window,
            'screenX': divThumbLeft + moveDistance,
            'screenY': divThumbTop,
            'bubbles': true,
            'cancelable': true
        });

        divThumb.dispatchEvent(evtDown);
        divThumb.dispatchEvent(evtMove);
    };

    const createElements = ()=>{
        const view = new View();
        view.createSlider($('body'));

        const viewOptional = new ViewOptional();
        viewOptional.createProgress();
        viewOptional.createLabel(0);
        viewOptional.updateLabelValue(50, 50)
    };

    const turnOnProgress = ()=>{
        const presenter = new Presenter();
        presenter.optionProgress = true;
        divProgress = document.querySelector('.slider-progress');
        divProgress.style.width = 0;
    };

    const findElements = ()=>{
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divTrack = document.querySelector('.slider-track');
        divLabel = document.querySelector('.slider-label');
    };

    beforeAll(async ()=>{
       await createElements();
       await turnOnProgress();
       await findElements();
       await dispatchMove();

    });

    it('should div thumb exists',  ()=> {
        expect(divThumb).not.toBeNull();
    });

    it('should div track exists',  ()=> {
        expect(divTrack).not.toBeNull();
    });

    it('should track progress exists',  ()=> {
        expect(divProgress).not.toBeNull();
    });

    it('should track progress width to be equal thumb coordinates left',  ()=> {
        console.log(divProgress.getBoundingClientRect().width);
        expect(divProgress.getBoundingClientRect().width).toBe(divThumb.getBoundingClientRect().left)
    });

    it('should label exists',  ()=> {
        expect(divLabel).not.toBeNull();
    });

    it('should label value to be 42', ()=> {
        expect(divLabel.textContent).toBe('50')
    });
});
