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
    const moveDistance = 50;
    let divLabel;
    let divScale;

    const createElements = ()=>{
        const view = new View();
        view.createSlider($('body'));

        const viewOptional = new ViewOptional();
        viewOptional.createProgress();
        viewOptional.createLabel(0);
        viewOptional.createScale([100, 200, 300, 400, 500],
            [0, 65, 130, 195, 260]);
    };

    const turnOnProgress = ()=>{
        const presenter = new Presenter();
        presenter.optionProgress = true;
        divProgress = document.querySelector('.slider-progress');
        divProgress.style.width = 0;
        presenter.getMinMax(100, 500);
        presenter.addDnD();
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
       await createElements();
       await turnOnProgress();
       await findElements();
       await dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistance);

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
        expect(divProgress.getBoundingClientRect().width).toBe(divThumb.getBoundingClientRect().left)
    });

    it('should label exists',  ()=> {
        expect(divLabel).not.toBeNull();
    });

    it('should label value to be 188', ()=> {
        expect(divLabel.textContent).toBe('188')
    });

    it('should scale exist', ()=>{
        expect(divScale).not.toBeNull();
    });
});
