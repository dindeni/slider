class Presenter {
    private coordXStart: number;
    private shift: number;

    addDnD(){
        const  divThumb = document.querySelector('.slider-thumb') as HTMLElement;
        const  divTrack = document.querySelector('.slider-track') as HTMLElement;
        const thumbWidth = divThumb.getBoundingClientRect().width;

        const moveThumb = (evt: MouseEvent)=>{
            evt.preventDefault();

            const thumbDistance: number = evt.screenX - this.shift;
            const trackWidth = divTrack.getBoundingClientRect().width;

            switch (true) {
                case thumbDistance > trackWidth:
                    divThumb.style.left = trackWidth - thumbWidth + 'px';
                    break;
                case thumbDistance  < 0 : divThumb.style.left = 0 + 'px';
                break;
                default: divThumb.style.left = thumbDistance + 'px';
            }
        };

        const getDownCoord = (evt: MouseEvent)=>{
            evt.preventDefault();

            if (evt.target === divThumb){
                this.coordXStart = evt.screenX;

                this.shift = evt.screenX - divThumb.getBoundingClientRect().left
                    + thumbWidth;

                document.addEventListener('mousemove', moveThumb);
            }

        };

        document.addEventListener('mousedown', getDownCoord);

        document.addEventListener('mouseup', ()=>{
            document.removeEventListener('mousemove', moveThumb);
        });

    }
}

export {Presenter};