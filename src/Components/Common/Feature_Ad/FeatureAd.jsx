import React from 'react';
import './FeatureAd.css'; // Import your CSS for styling

const FeatureAd = () => {
  const features = [
    {
      icon: 'ad1.png', // Path to the image in your Images folder
      title: 'Best prices & offers',
      description: 'Orders now'
    },
    {
      icon: 'ad2.png',
      title: 'Free delivery',
      description: '24/7 amazing services'
    },
    {
      icon: 'ad3.png',
      title: 'Great daily deal',
      description: 'When you sign up'
    },
    {
      icon: 'ad4.png',
      title: 'Wide assortment',
      description: 'Mega Discounts'
    },
    {
      icon: 'ad5.png',
      title: 'Easy returns',
      description: 'Within 30 days'
    }
  ];

  return (
    <div className="feature-ad-container">
      {features.map((feature, index) => (
        <div key={index} className="feature-card">
          <div className="feature-icon">
            {/* Replace the icon with an image */}
            <img src={`/Images/ad/${feature.icon}`} alt={feature.title} />
          </div>
          <div className="feature-info">
            <h4 className="feature-title">{feature.title}</h4>
            <p className="feature-description">{feature.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureAd;
