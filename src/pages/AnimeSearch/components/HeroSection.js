import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const length = slides ? slides.length : 0;

  useEffect(() => {
    if (length === 0) return;
    const timer = setInterval(() => {
      setCurrent(current === length - 1 ? 0 : current + 1);
    }, 7000);
    return () => clearInterval(timer);
  }, [current, length]);

  const moveDot = (index) => {
    setCurrent(index);
  };

  if (!Array.isArray(slides) || slides.length <= 0) {
    return null;
  }

  return (
    <div className="hero-slider">
      {slides.map((slide, index) => (
        <div
          className={index === current ? 'slide active' : 'slide'}
          key={slide.id}
        >
          {index === current && (
            <>
              <div className="hero-background">
                <img src={slide.bannerUrl} alt={slide.title} />
                <div className="hero-overlay"></div>
              </div>

              <div className="hero-content container">
                <h1 className="hero-title">{slide.title}</h1>
                <p className="hero-description">{slide.description}</p>
                
                <div className="hero-actions">
                  <Link 
                    to={`/anime/${slide.id}`} 
                    className="btn btn-primary"
                    style={{ textDecoration: 'none' }}
                  >
                    <i className="fas fa-play"></i> See details
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      ))}

      <div className="slider-dots">
        {slides.map((item, index) => (
          <div
            key={index}
            onClick={() => moveDot(index)}
            className={current === index ? "dot active" : "dot"}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeroSection;