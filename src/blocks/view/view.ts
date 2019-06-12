// @ts-ignore
import {Presenter} from "../presenter/presenter.ts";

const presenter = new Presenter();

class View {
    createElements(element: JQuery){
        const divWrapper: JQuery = $('<div class="slider-wrapper"></div>').appendTo(element);
        $('<div class="slider-track"></div>').appendTo(divWrapper);
        $('<div class="slider-thumb" draggable="true"></div>').appendTo(divWrapper);
    }
    stylingElements(){
        const divThumb: JQuery = $('.slider-thumb');
        const divTrack: JQuery = $('.slider-track');
        divThumb.css({
            width: '21px',
            height: '21px',
            background: '#e75735',
            borderRadius: '50%',
            position: 'absolute',
            top: '-8px',
            left: 0
    })

    }
    async createSlider(element: JQuery){
        await this.createElements(element);
        await this.stylingElements();
        return await presenter.addDnD();
    }

}

export {View}

