// src/components/Campaign/CampaignItem.tsx
import React from 'react';

const CampaignItem = () => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold">Campaign Name</h3>
      <p>Status: Active</p>
      <p>Progress: 50%</p>
    </div>
  );
};

export default CampaignItem;