const $  = require('jquery');
import {View} from "../blocks/view/view";
import {Presenter} from "../blocks/presenter/presenter";

describe('Presenter', ()=>{

    let divThumb;
    let divThumbTop;
    let divThumbWidth;
    let divThumbLeft;
    let presenter;

    const createElements = ()=>{
        const view = new View();
        view.createElements($('body'), false, 0,
            false, 500);

    };

    const findElements = ()=>{
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divThumbWidth = divThumb.getBoundingClientRect().width;
    };

    beforeAll(  async ()=>{
        document.body.innerHTML = '';

        await createElements();
        await findElements();
        presenter = new Presenter();

    });

    it('should calculate slider value percent', ()=> {
        expect(presenter.calculateSliderMovePercent(100, 50,)).
        toBe(50);
    });

    it('should calculate slider value', ()=>{
        expect(presenter.calculateSliderValue(100, 500, 260,
            131)).
        toBe(300);
    })


});
