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
    label?: boolean,
    step?: number,
    vertical?: boolean
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

const createScale = (min: number, max: number, step: number | undefined)=>{
    presenter.calculateLeftScaleCoords(min, max, step);
};

const makeVertical = (vartical: boolean)=>{
    vartical ? viewOptional.makeVertical(vartical) : null;
};

const initSlider = async (element: JQuery, progress: boolean, min: number,
                          max: number, label: boolean,
                          step: number | undefined, vertical: boolean):Promise<void> =>{

    await view.createSlider(element);
    await makeVertical(vertical);
    await presenter.getMinMax(min, max);
    await createLabel(label, min);
    await presenter.addDnD(step, vertical);
    await createProgress(progress);
    createScale(min, max, step)


};

(function ($){
    $.fn.slider =  function(options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false,
            min: 0,
            max: 100,
            label: true,
            step: undefined,
            vertical: false
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress, config.min, config.max, config.label,
            config.step, config.vertical);

        return this;
    };

}(jQuery));

$('main').slider({progress: true, min: 100, max: 500, vertical: true});

