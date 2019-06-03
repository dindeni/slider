
class View {
    createElements(element: JQuery){
        const divWrapper: JQuery = $('<div class="slider-wrapper"></div>').appendTo(element);
        $('<div class="slider-track"></div>').appendTo(divWrapper);
        $('<div class="slider-thumb" draggable="true"></div>').appendTo(divWrapper);
    }
    stylingElements(){
        const divThumb: JQuery = $('.slider-thumb');
        const divTrack: JQuery = $('.slider-track');

    }
    async createSlider(element: JQuery){
        await this.createElements(element);
        await this.stylingElements();
    }



}

export {View}

