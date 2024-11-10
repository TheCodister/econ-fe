import React from 'react';
import './InfoForm.scss';

const InfoForm = ( { title = "Billing Details" } ) => {
  return (
    <div className="billing-details">
      <h2>
        {title}
      </h2>
      <form className="billing-form">
        <div className="form-row">
          <div className="form-group">
            <input type="text" placeholder="First name *" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Last name *" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="text" placeholder="Address *" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <select required>
              <option>Country *</option>
              {/* Options here */}
            </select>
          </div>
          <div className="form-group">
            <input type="text" placeholder="City / Town *" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="text" placeholder="Postcode / ZIP *" required />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Phone *" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <input type="email" placeholder="Email address *" required />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <textarea placeholder="Additional information"></textarea>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InfoForm;
