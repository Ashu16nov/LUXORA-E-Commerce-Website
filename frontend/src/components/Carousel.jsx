import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './Carousel.css';

const slides = [
  {
    id: 1,
    title: 'SUMMER EDIT',
    subtitle: 'UP TO 50% OFF',
    cta: 'SHOP SALE',
    link: '/offers',
    bg: '#f8f4f0'
  },
  {
    id: 2,
    title: 'NEW SEASON',
    subtitle: 'NEW ATTITUDE',
    cta: 'EXPLORE COLLECTION',
    link: '/products',
    bg: '#e9ebee'
  },
  {
    id: 3,
    title: 'EXTRA 20% OFF',
    subtitle: 'ON SELECTED STYLES',
    cta: 'SHOP NOW',
    link: '/products?category=Men',
    bg: '#f0ece9'
  }
];

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const length = slides.length;

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 5000);
    return () => clearTimeout(timer);
  }, [current, length]);

  const nextSlide = () => {
    setCurrent(current === length - 1 ? 0 : current + 1);
  };

  const prevSlide = () => {
    setCurrent(current === 0 ? length - 1 : current - 1);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <section className="carousel-section">
      <button className="carousel-btn left" onClick={prevSlide}><ChevronLeft size={30} /></button>
      <button className="carousel-btn right" onClick={nextSlide}><ChevronRight size={30} /></button>
      
      {slides.map((slide, index) => {
        return (
          <div
            className={index === current ? 'slide active' : 'slide'}
            key={slide.id}
            style={{ backgroundColor: slide.bg }}
          >
            {index === current && (
              <div className="slide-content">
                <h2>{slide.title}</h2>
                <p>{slide.subtitle}</p>
                <Link to={slide.link} className="btn btn-primary">{slide.cta}</Link>
              </div>
            )}
          </div>
        );
      })}
      
      <div className="carousel-indicators">
        {slides.map((_, index) => (
          <div 
            key={index} 
            className={`indicator ${index === current ? 'active' : ''}`}
            onClick={() => setCurrent(index)}
          ></div>
        ))}
      </div>
    </section>
  );
};

export default Carousel;
