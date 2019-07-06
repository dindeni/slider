import {View} from "../blocks/view/view";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";
import {dispatchMove} from "./_serviceFunctions";

describe('Vertical option', ()=>{
    let divTrack;
    let divThumb;
    let divThumbLeft;
    let divThumbTop;
    let divLabel;
    const moveDistanceX = 0;
    const moveDistanceY = 50;

    const viewOptional = new ViewOptional();

    const createElements = ()=>{
        const view = new View();


        view.createSlider($('body'));
        viewOptional.createLabel(0);

        /*const viewOptional = new ViewOptional();
        viewOptional.createProgress();
        viewOptional.createLabel(0);
        viewOptional.createScale([100, 200, 300, 400, 500],
            [0, 65, 130, 195, 260]);*/
    };

    const addDnd = ()=>{
        const presenter = new Presenter();
        presenter.addDnD(undefined, true);
        presenter.getMinMax(100, 500);
    };

    const findElements = ()=>{
        /*divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;*/
        divTrack = document.querySelector('.slider-track');
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divLabel = document.querySelector('.slider-label');
        /*divScale = document.querySelector('.slider-scale');*/

        divTrack.style.width = '260px';
        divTrack.style.height = '5px';
    };

    const makeVertical = ()=>{
        viewOptional.makeVertical(true);
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
