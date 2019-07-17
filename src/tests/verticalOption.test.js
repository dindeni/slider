import {View} from "../blocks/view/view";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";
import {dispatchMove} from "./_serviceFunctions";


describe('Vertical option', ()=>{
    let divTrack, divThumb, divThumbLeft, divThumbTop, divLabel;
    const moveDistanceX = 0;
    const moveDistanceY = 50;



    const createElements = ()=>{
        const view = new View();
        view.createElements($('body'), false, 100,
            true, 500);
        /*viewOptional.createLabel(0);*/
    };

    const addDnd = ()=>{
        const presenter = new Presenter();
        presenter.addDnD(undefined, true, false, true);
        presenter.getMinMax(100, 500);
    };

    const findElements = ()=>{
        divTrack = document.querySelector('.slider-track');
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divLabel = document.querySelector('.slider-label');

        divTrack.style.width = '260px';
        divTrack.style.height = '5px';
    };

    const makeVertical = ()=>{
        const viewOptional = new ViewOptional();
        viewOptional.makeVertical(false, $('.slider-wrapper'));
    };

    beforeAll(async ()=>{
        document.body.innerHTML = '';
        await createElements();
        await findElements();
        await makeVertical();
        await addDnd();
        await dispatchMove(divThumb, divThumbLeft, divThumbTop, moveDistanceX,
            moveDistanceY);
    });

    it('should track height to be 260px', function () {
        expect(divTrack.style.height).toBe('260px')
    });

    it('should div thumb move a distance', function () {
        expect(parseInt(divThumb.style.top)).toBe(moveDistanceY);
    });
    it('should label value to be 176', ()=> {
        expect(divLabel.textContent).toBe('176')
    });
});
