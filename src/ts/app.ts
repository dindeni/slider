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
    min?: number,
    label?: boolean
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

const createLabel = (label: boolean, initValue: number)=>{
    if (label){
        viewOptional.createLabel(initValue)
    }
};

const initSlider = async (element: JQuery, progress: boolean, min: number,
                          max: number, label: boolean):Promise<void> =>{

    await view.createSlider(element);
    await presenter.getMinMax(min, max);
    await createLabel(label, min);
    await presenter.addDnD();

    await createProgress(progress);

};

(function ($){
    $.fn.slider =  function(options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false,
            min: 0,
            max: 100,
            label: true
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress, config.min, config.max, config.label);

        return this;
    };

}(jQuery));

$('main').slider({progress: true, min: 100, max: 500});

