import {View} from "../blocks/view/view";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";

import '../blocks/view/view.scss';


const view = new View();
const presenter = new Presenter();
const viewOptional = new ViewOptional();

interface sliderOptions {
    progress?: boolean,
    max?: number,
    min?: number
}

declare global {
    interface JQuery {
        slider(options?: sliderOptions): JQuery
    }
}

const createProgress = (progress: boolean)=>{
    if (progress){
        viewOptional.createProgress();
        presenter.optionProgress = true;
    }
};

const initSlider = async (element: JQuery, progress: boolean, min: number,
                          max: number):Promise<void> =>{

    await view.createSlider(element);
    await presenter.getMinMax(min, max);
    await presenter.addDnD();

    await createProgress(progress);

};

(function ($){
    $.fn.slider =  function(options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false,
            min: 0,
            max: 100
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress, config.min, config.max);


        return this;
    };

}(jQuery));

$('main').slider({progress: true, min: 100, max: 500});

