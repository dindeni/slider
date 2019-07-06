
class View {
    private divTrack: JQuery;
    private divThumb: JQuery;
    private divWrapper: JQuery;
    private divThumbMin: JQuery;
    private divThumbMax: JQuery;

    createElements(element: JQuery, range: boolean){
        this.divWrapper = $('<div class="slider-wrapper"></div>').
        appendTo(element);
        this.divTrack = $('<div class="slider-track"></div>').
        appendTo(this.divWrapper);
        /*this.divThumb = $('<div class="slider-thumb" draggable="true"></div>').appendTo(divWrapper);*/
    }
    createThumb(range: boolean){
        if (!range){
            this.divThumb = $('<div class="slider-thumb" draggable="true"></div>').
            appendTo(this.divWrapper);
        }else {
            this.divThumbMin = $('<div class="slider-thumb" id="thumb-min" draggable="true">' +
                '</div>').
            appendTo(this.divWrapper);
            this.divThumbMax = $('<div class="slider-thumb" id="thumb-max" draggable="true">' +
                '</div>').
            appendTo(this.divWrapper);
        }

    }
    stylingElements(range: boolean){
        if (!range){
            this.divThumb.css({
                /*width: '21px',
                height: '21px',
                background: '#e75735',
                borderRadius: '50%',
                position: 'absolute',
                top: '12px',*/
                left: 0
            });
        }else {
            this.divThumbMin.css({
                left: 0
            });
            this.divThumbMax.css({
                left: this.divTrack.width() +'px'
            });
        }

    }

    async createSlider(element: JQuery, range: boolean){
        await this.createElements(element, range);
        await this.createThumb(range);
        await this.stylingElements(range);
    }
}

export {View}

