import React from 'react';
import {render, renderComponent} from 'Dep/turboRender';

import ScrollReveal from 'scrollreveal';
const sr = ScrollReveal();

import {Carousel} from 'react-bootstrap';

let carousel = (<Carousel pauseOnHover={false} interval={3000}  prevIcon={null} nextIcon={null}>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/cleaning00.jpg')"}} />
</Carousel.Item>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/cleaning01.jpg')"}} />
</Carousel.Item>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/nannies00.jpg')"}} />
</Carousel.Item>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/nannies01.jpg')"}} />
</Carousel.Item>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/nannies02.jpg')"}} />
</Carousel.Item>
<Carousel.Item>
    <div className="fill" style={{backgroundImage: "url('/img/backgrounds/nannies03.jpg')"}} />
</Carousel.Item>
</Carousel>);

renderComponent((id) => {
    render(carousel, 'carousel');

    sr.reveal('.section2', {duration: 1500});
    sr.reveal('.connection-item', {
        duration: 2000
    }, 70);
    sr.reveal('.mb-30', {
        duration: 2000
    }, 70);
}, 'About');
