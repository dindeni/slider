
class View {
    private divTrack: JQuery;
    private divThumb: JQuery;

    createElements(element: JQuery){
        const divWrapper: JQuery = $('<div class="slider-wrapper"></div>').appendTo(element);
        this.divTrack = $('<div class="slider-track"></div>').appendTo(divWrapper);
        this.divThumb = $('<div class="slider-thumb" draggable="true"></div>').appendTo(divWrapper);
    }
    stylingElements(){
        this.divThumb.css({
            width: '21px',
            height: '21px',
            background: '#e75735',
            borderRadius: '50%',
            position: 'absolute',
            top: '12px',
            left: 0
        });

    }

    async createSlider(element: JQuery){
        await this.createElements(element);
        await this.stylingElements();
    }
}

export {View}

