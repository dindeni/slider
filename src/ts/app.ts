// @ts-ignore
import {View} from "../blocks/view/view.ts";
//@ts-ignore

import '../blocks/view/view.scss';

const view = new View();


interface FooOptions {
    color: string
}

declare global {
    interface JQuery {
        foo(options?: FooOptions): JQuery
    }
}

(function ($){
    $.fn.foo= function(this: JQuery, options?: FooOptions): JQuery {
        const settings: FooOptions= {
            color: 'blue'
        };

        view.createSlider(this);

        return this;
    };

}(jQuery));

$('main').foo();

