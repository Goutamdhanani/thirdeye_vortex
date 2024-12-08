// src/components/Campaign/CampaignList.tsx
import React from 'react';
import CampaignItem from './CampaignItem';

const CampaignList = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Campaigns</h2>
      <button className="bg-blue-500 text-white p-2 rounded mt-4">Add New</button>
      <div className="mt-4">
        {/* Map through campaigns and display CampaignItem components */}
        <CampaignItem />
      </div>
    </div>
  );
};

export default CampaignList;