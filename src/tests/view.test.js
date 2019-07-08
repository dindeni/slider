const $  = require('jquery');
import {View} from "../blocks/view/view.ts";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";

import {dispatchMove} from "./_serviceFunctions";

describe('View', ()=>{
    let divThumb;
    let divTrack;
    let divProgress;
    let divThumbLeft;
    let divThumbTop;
    const moveDistanceX = 50;
    const moveDistanceY = 0;
    let divLabel;
    let divScale;

    const createElements = ()=>{
        const view = new View();
        view.createSlider($('body'), false);

        const viewOptional = new ViewOptional();
        viewOptional.createProgress(false);
        viewOptional.createLabel(0);
        viewOptional.createScale([100, 200, 300, 400, 500],
            [0, 65, 130, 195, 260], false);
    };

    const turnOnProgress = ()=>{
        const presenter = new Presenter();
        presenter.optionProgress = true;
        divProgress = document.querySelector('.slider-progress');
        divProgress.style.width = 0;
        presenter.getMinMax(100, 500);
        presenter.addDnD(undefined, false, false, true);
    };

    const findElements = ()=>{
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divTrack = document.querySelector('.slider-track');
        divLabel = document.querySelector('.slider-label');
        divScale = document.querySelector('.slider-scale');

        divTrack.style.width = '260px';
    };

    beforeAll(async ()=>{
        document.body.innerHTML = '';
       await createElements();
       await turnOnProgress();
       await findElements();
       await dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
           moveDistanceY);

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
        expect(divProgress.style.width).toBe(divThumb.style.left);
    });

    it('should label exists',  ()=> {
        expect(divLabel).not.toBeNull();
    });

    it('should label value to be 176', ()=> {
        expect(divLabel.textContent).toBe('176')
    });

    it('should scale exist', ()=>{
        expect(divScale).not.toBeNull();
    });
});
