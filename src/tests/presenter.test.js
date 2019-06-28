const $  = require('jquery');

import {View} from "../blocks/view/view";
import {Presenter} from "../blocks/presenter/presenter";

import {dispatchMove} from "./_serviceFunctions";

describe('Presenter', ()=>{

    let divThumb;
    let divThumbTop;
    let divThumbWidth;
    let divThumbLeft;
    const moveDistance = 50;
    let presenter;

    const createElements = ()=>{
        const view = new View();
        view.createSlider($('body'));

    };
    const addDnd = ()=>{
        presenter = new Presenter();
        presenter.addDnD();
    };

    const findElements = ()=>{
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divThumbWidth = divThumb.getBoundingClientRect().width;
    };

    beforeAll(  async ()=>{

        await createElements();
        await addDnd();
        await findElements();
        await dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistance);

    });

    it('should div thumb to be draggable',  ()=> {
        expect(divThumb.hasAttribute('draggable')).toBeTruthy();
    });

    it('should div thumb move a distance', ()=>{
        divThumbLeft = divThumb.getBoundingClientRect().left;
        expect(divThumbLeft).toBe(moveDistance - divThumbWidth)
    });

    it('should calculate slider value percent', ()=> {
        expect(presenter.calculateSliderMovePercent(100, 50,)).
        toBe(50);
    });

    it('should calculate slider value', ()=>{
        expect(presenter.calculateSliderValue(100, 500, 50)).
        toBe(300);
    })


});
