const $  = require('jquery');
import '../blocks/view/view.ts';
import {View} from "../blocks/view/view.ts";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";
/*import '../blocks/view/view.scss';*/

describe('View', ()=>{
    let divThumb;
    let divTrack;
    let divProgress;
    let divThumbWidth;
    let divThumbLeft;
    let divThumbTop;
    const moveDistance = 50;

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
    };

    beforeAll(async ()=>{
       await createElements();
       await turnOnProgress();
       await findElements();
       await dispatchMove();

    });

    it('should div thumb exists',  ()=> {
        expect(divThumb).not.toBeUndefined();
    });

    it('should div track exists',  ()=> {
        expect(divTrack).not.toBeUndefined();
    });

    it('should track progress exists',  ()=> {
        expect(divProgress).not.toBeUndefined();
    });

    it('should track progress width to be equal thumb coordinates left',  ()=> {
        console.log(divProgress.getBoundingClientRect().width);
        expect(divProgress.getBoundingClientRect().width).toBe(divThumb.getBoundingClientRect().left)
    });
});
