const $  = require('jquery');

import {Presenter} from "../blocks/presenter/presenter.ts";
import {View} from "../blocks/view/view.ts";

describe('Presenter', ()=>{

    let divThumb;
    let divThumbTop;
    let divThumbWidth;
    let divThumbLeft;

    beforeAll(  ()=>{
        const view = new View();
        view.createSlider($('body'));

        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;

    });

    it('should div thumb to be draggable',  ()=> {
        expect(divThumb.hasAttribute('draggable')).toBeTruthy();
    });

    it('should div thumb move a distance', ()=>{
        const moveDistance = 50;
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

        divThumbLeft = divThumb.getBoundingClientRect().left;
        expect(divThumbLeft).toBe(moveDistance - divThumbWidth)
    })

});