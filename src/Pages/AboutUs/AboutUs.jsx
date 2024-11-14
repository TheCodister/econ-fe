import React from 'react';
import { Header, Footer } from "../../Components";
import FeatureAd from '../../Components/Common/Feature_Ad/FeatureAd';
import './AboutUs.scss'; // Create this CSS file for styling

const AboutUs = () => {
  return (
    <div className="about-us">
        <Header />
        <div className="about-us-container">
          <div className="about-us-content">
            {/* Left-side image */}
            <div className="about-us-image">
              <img src="/Images/about-us/img0.jpg" alt="About Us" />
            </div>

            {/* Right-side text */}
            <div className='about-us-rightside'>
                <div className="about-us-text">
                  <h1>Welcome to IUFC</h1>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    Duis aute irure dolor in reprehenderit in voluptate id est laborum.
                  </p>
                  <p>
                    Ius ferri velit sanctus cu, sed at soleat accusata. Dictas prompta et ut placerat legendos interpre.Donec vitae sapien ut libero venenatis faucibus.
                    Nulla quis ante Etiam sit amet orci eget. Quis commodo odio aenean sed adipiscing. Turpis massa tincidunt dui ut ornare lectus. 
                    Auctor elit sed vulputate mi sit amet. Duis aute irure dolor in reprehenderit in voluptate id est laborum.
                  </p>
                </div>
                <div className="about-us-carousel">
                    <button className="carousel-arrow left-arrow">{'<'}</button>
                    <div className="carousel-images">
                      <img src="/Images/about-us/caro1.png" alt="carousel 1" />
                      <img src="/Images/about-us/caro2.png" alt="carousel 2" />
                      <img src="/Images/about-us/caro3.png" alt="carousel 3" />
                    </div>
                    <button className="carousel-arrow right-arrow">{'>'}</button>
                </div>
            </div>
          </div>

          {/* Bottom image carousel */}
          
        </div>
        <FeatureAd />
        <Footer />
    </div>
  );
};

export default AboutUs;
