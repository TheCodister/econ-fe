// CreatePromotion.jsx
import React, { useState } from "react";
import "./CreatePromotion.scss";

const CreatePromotion = () => {
  const [promotionData, setPromotionData] = useState({
    PromotionID: "",
    Discount: "",
    Name: "",
    Description: "",
    StartDay: "",
    EndDay: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPromotionData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add promotion function (to be implemented)
    console.log(promotionData);
  };

  return (
    <div className="create-promotion">
      <h1>Create Promotion</h1>
      <form onSubmit={handleSubmit} className="promotion-form">
        <div className="form-group">
          <label>Promotion ID</label>
          <input
            type="text"
            name="PromotionID"
            value={promotionData.PromotionID}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Discount (%)</label>
          <input
            type="number"
            name="Discount"
            value={promotionData.Discount}
            onChange={handleInputChange}
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label>Promotion Name</label>
          <input
            type="text"
            name="Name"
            value={promotionData.name}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="Description"
            value={promotionData.Description}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Start Date</label>
          <input
            type="date"
            name="StartDay"
            value={promotionData.StartDay}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="form-group">
          <label>End Date</label>
          <input
            type="date"
            name="EndDay"
            value={promotionData.EndDay}
            onChange={handleInputChange}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Add Promotion
        </button>
      </form>
    </div>
  );
};

export default CreatePromotion;
