import {View} from "../blocks/view/view";
import {dispatchMove} from "./_serviceFunctions";
import {ViewDnD} from "../blocks/view/viewDnD";

describe('Range', ()=>{
    let divThumbMin,  divThumbMax, divTrack, divThumbLeftMin, divThumbTopMin,
        divThumbLeftMax, divThumbTopMax, divLabelMin, divLabelMax, divProgressMin,
        divProgressMax;
    const moveDistanceX = 50;
    const moveDistanceY = 0;

    const createElements = ()=>{
        const view = new View();
        view.createElements($('body'), true, false,
            100, 500, 100, true);
    };

    const addDnd = ()=>{
        const wrapper = $('.slider-wrapper');
        const viewDnd = new ViewDnD();
        viewDnd.addDnD(undefined, false, true, true,
            100, 500, wrapper);
    };


    const findElements = ()=>{
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

            divThumbMax.style.left='260px';
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
