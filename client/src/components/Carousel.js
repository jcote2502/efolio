import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';


const AppCarousel = ({ isImages, children }) => {

    const responsive = {
        desktop: {
            breakpoint: { max: 3000, min: 1024 },
            items: isImages ? 1:3,
            slidesToSlide: 1,
        },
        tablet: {
            breakpoint: { max: 1024, min: 464 },
            items: isImages ? 1:2,
            slidesToSlide: 1,
        },
        mobile: {
            breakpoint: { max: 464, min: 0 },
            items: 1,
            slidesToSlide: 1,
        },
    };

    return (
        <Carousel
            responsive={responsive}
            autoPlay={isImages? true: false}
            infinite={false}
            interval={8000}
            transitionTime={600}
            keyBoardControl={true}
            containerClass="carousel-container"
            itemClass="carousel-item-padding-40-px"
            sliderClass="carousel-slider"
            removeArrowOnDeviceType={["mobile"]}
            showDots={isImages? true: false}
        >{children}</Carousel>
    )
}

export default AppCarousel;