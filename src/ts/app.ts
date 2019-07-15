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
    vertical?: boolean,
    range?: boolean
}

declare global {
    interface JQuery {
        slider(options?: sliderOptions): JQuery
    }
}

const createProgress = (progress: boolean, range: boolean)=>{
    if (progress){
        /*viewOptional.createProgress(range);*/
        presenter.optionProgress = true;
    }
};

const createLabel = (label: boolean, initValue: number, vertical: boolean,
                     range: boolean, max: number)=>{
    if (label){
        /*view.createLabel(initValue, vertical, range, max)*/
    }
};

const createScale = (min: number, max: number, step: number | undefined,
                     vertical: boolean)=>{
    presenter.calculateLeftScaleCoords(min, max, step, vertical);
};

const makeVertical = (vertical: boolean, range: boolean)=>{
    vertical ? viewOptional.makeVertical(vertical, range) : null;
};

const initSlider = async (element: JQuery, progress: boolean, min: number,
                          max: number, label: boolean,
                          step: number | undefined, vertical: boolean,
                          range: boolean):Promise<void> =>{

    await view.createElements(element,range, min, vertical, max);
    await makeVertical(vertical, range);
    await presenter.getMinMax(min, max);
    await createLabel(label, min, vertical, range, max);
    await presenter.addDnD(step, vertical, range, progress);
    await createProgress(progress, range);
    createScale(min, max, step, vertical)


};

(function ($){
    $.fn.slider =  function(options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false,
            min: 0,
            max: 100,
            label: true,
            step: undefined,
            vertical: false,
            range: false
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress, config.min, config.max, config.label,
            config.step, config.vertical, config.range);

        return this;
    };

}(jQuery));

$('main').slider({progress: true, min: 100, max: 500, vertical: false,
range: false});

$('main').slider({progress: true, min: 100, max: 500, vertical: false,
    range: true});

