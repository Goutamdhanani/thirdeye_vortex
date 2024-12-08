// src/components/Leads/LeadItem.tsx
import React from 'react';

const LeadItem = () => {
  return (
    <div className="p-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold">Lead Name</h3>
      <p>Email: lead@example.com</p>
    </div>
  );
};

export default LeadItem;