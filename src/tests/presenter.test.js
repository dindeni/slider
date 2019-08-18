const $  = require('jquery');
import View from "../blocks/view/view";
import Presenter from "../blocks/presenter/presenter";

describe('Presenter', ()=>{

    let divThumb;
    let divThumbTop;
    let divThumbWidth;
    let divThumbLeft;
    let presenter;

    const createElements = ()=>{
        const view = new View();
        view.createElements($('body'), false, false,
            100, 500, undefined);

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
    });

    it('should calculate value to coordinates', ()=> {
        const oldCoord = parseInt(divThumb.style.left, 10);
        const coordinates = Presenter.calculateFromValueToCoordinates(400,
             100, 500, 260);
        expect(coordinates).toBe(195);
    });


});
