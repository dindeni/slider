const $  = require('jquery');
import {View} from "../blocks/view/view.ts";
import {ViewDnD} from "../blocks/view/viewDnD";

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
        view.createElements($('body'), false, false,
            100, 500, undefined);
    };

    const turnOnProgress = ()=>{
        divProgress = document.querySelector('.slider-progress');
        divProgress.style.width = 0;
    };

    const findElements = ()=>{
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divTrack = document.querySelector('.slider-track');
        divLabel = document.querySelector('.slider-label');
        divScale = document.querySelector('.slider-scale');

        divTrack.style.width = '260px';
        divThumb.style.left = '0px';
    };

    beforeAll(async ()=>{
        document.body.innerHTML = '';
        await createElements();
        await turnOnProgress();
        await findElements();

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

    it('should div thumb to be draggable',  ()=> {
        expect(divThumb.hasAttribute('draggable')).toBeTruthy();
    });

    describe('After dispatch', ()=>{
        beforeAll(()=>{
            const wrapper = $('.slider-wrapper');
            const viewDnd = new ViewDnD();
            viewDnd.addDnD(undefined, false, false, true,
                100, 500, wrapper);
            dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
                moveDistanceY);
        });

        it('should div thumb move a distance', ()=>{
            expect(parseInt(divThumb.style.left)).toBe(moveDistanceX)
        });

        it('should label value to be 176', ()=> {
            expect(divLabel.textContent).toBe('176')
        });
    });
});
