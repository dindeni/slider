const $  =require('jquery');
import '../blocks/view/view.ts';
import {View} from "../blocks/view/view.ts";

describe('View', ()=>{
    beforeAll(()=>{
        const view = new View();
        view.createSlider($('main'));
    });

    it('should div thumb exists',  ()=> {
        expect($('.slider-thumb')).not.toBeNull();
    });
    it('should div track exists',  ()=> {
        expect($('.slider-track')).not.toBeNull();
    });
});