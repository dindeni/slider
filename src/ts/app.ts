
import {View} from "../blocks/view/view";
import {ViewOptional} from "../blocks/view/viewOptional";
import {Presenter} from "../blocks/presenter/presenter";

import '../blocks/view/view.scss';


const view = new View();
const presenter = new Presenter();
const viewOptional = new ViewOptional();


interface sliderOptions {
    progress: boolean
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

const initSlider = async (element: JQuery, progress: boolean):Promise<void> =>{
    await view.createSlider(element);
    await presenter.addDnD();
    await createProgress(progress)
};

(function ($){
    $.fn.slider =  function(/*this: JQuery,*/ options?: sliderOptions): JQuery {
        const optionsDefault= {
            progress: false
        };

        const config = $.extend({}, optionsDefault, options);

        initSlider(this, config.progress);

        return this;
    };

}(jQuery));

$('main').slider({progress: true});

