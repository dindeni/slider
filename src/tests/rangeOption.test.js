import {View} from "../blocks/view/view";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";
import {dispatchMove} from "./_serviceFunctions";

describe('Range', ()=>{
    let divThumbMin,  divThumbMax, divTrack, divThumbLeftMin, divThumbTopMin,
        divThumbLeftMax, divThumbTopMax, divLabelMin, divLabelMax, divProgressMin,
        divProgressMax;
    const moveDistanceX = 50;
    const moveDistanceY = 0;

    const viewOptional = new ViewOptional();

    const createElements = ()=>{
        const view = new View();
        view.createSlider($('body'), true);
        viewOptional.createLabel(0, false, true, 500);
        viewOptional.createProgress(true);

        /*viewOptional.createLabel(0);*/

        /*const viewOptional = new ViewOptional();
        viewOptional.createProgress();
        viewOptional.createLabel(0);
        viewOptional.createScale([100, 200, 300, 400, 500],
            [0, 65, 130, 195, 260]);*/
    };

    const addDnd = ()=>{
        const presenter = new Presenter();
        presenter.addDnD(undefined, false, true, true);
        presenter.getMinMax(100, 500);
    };

    const findElements = ()=>{
        /*divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;*/
       /* divTrack = document.querySelector('.slider-track');
        divThumb = document.querySelector('.slider-thumb');
        divThumbLeft = divThumb.getBoundingClientRect().left;
        divThumbTop = divThumb.getBoundingClientRect().top;
        divLabel = document.querySelector('.slider-label');*/
        /*divScale = document.querySelector('.slider-scale');*/
        divThumbMin = document.querySelector('#thumb-min');
        divThumbMax = document.querySelector('#thumb-max');
        divThumbLeftMin = divThumbMin.getBoundingClientRect().left;
        divThumbTopMin = divThumbMin.getBoundingClientRect().top;
        divThumbLeftMax = divThumbMax.getBoundingClientRect().left;
        divThumbTopMax = divThumbMax.getBoundingClientRect().top;
        divTrack = document.querySelector('.slider-track');
        divLabelMin = document.querySelector('#label-min');
        divLabelMax = document.querySelector('#label-max');
        divProgressMin = document.querySelector('#progress-min');
        divProgressMax = document.querySelector('#progress-max');

        divTrack.style.width = '260px';
        divTrack.style.height = '5px';

    };

    beforeAll(async ()=>{
        document.body.innerHTML = '';
        await createElements();
        await findElements();
        await addDnd();

    });

    it('should thumb min and max exist', ()=> {
        expect(divThumbMin && divThumbMax).not.toBeNull();
    });
    it('should label min and max exists',  ()=> {
        expect(divLabelMin && divLabelMax).not.toBeNull();
    });
    it('should progress bar min and max exist',  ()=> {
        expect(divProgressMin && divProgressMax).not.toBeNull();
    });

    describe('After dispatch max', ()=>{
        beforeAll(()=>{
            dispatchMove(divThumbMax, divThumbLeftMax, divThumbTopMax, -moveDistanceX,
                moveDistanceY);
        });

        it('should div thumb max move a distance', ()=>{
            expect(parseInt(divThumbMax.style.left)).
            toBe(parseInt(divTrack.style.width) - moveDistanceX)
        });
        it('should label max value to be 432', ()=> {
            expect(divLabelMax.textContent).toBe('420')
        });
        it('should progress max width to be equal thumb max coordinates left', ()=> {
            const progressWidth = parseInt(divTrack.style.width, 10) -
               parseInt(divThumbMax.style.left, 10) + 'px';
            expect(divProgressMax.style.width).toBe(progressWidth)
        });

    });

    describe('After dispatch min', ()=>{
        beforeAll(()=>{
            dispatchMove(divThumbMin, divThumbLeftMin, divThumbTopMin, moveDistanceX,
                moveDistanceY);
        });

        it('should div thumb min move a distance', ()=>{
            expect(parseInt(divThumbMin.style.left)).toBe(moveDistanceX)
        });
        it('should label min value to be 176', ()=> {
            expect(divLabelMin.textContent).toBe('176')
        });
        it('should progress min width to be equal thumb min coordinates left', ()=> {
            expect(divProgressMin.style.width).toBe(divThumbMin.style.left)
        });

    });

});
