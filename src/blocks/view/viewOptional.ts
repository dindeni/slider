
class ViewOptional{
    private divProgress: JQuery;
    private divTrack: JQuery;

    createProgress(){
        this.divTrack = $('.slider-track');

        $('<div class="slider-progress"></div>').appendTo(this.divTrack);
        this.divProgress = $('.slider-progress');
    }
    stylingProgress(divProgressWidth: number){
        !this.divProgress ?
            this.divProgress = $('.slider-progress') : null;
        this.divProgress.css({
            width: divProgressWidth + 'px'
        });
    }
}

export {ViewOptional};
