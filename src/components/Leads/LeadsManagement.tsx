// src/components/Leads/LeadsManagement.tsx
import React from 'react';

const LeadsManagement = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Leads Management</h2>
      <button className="bg-blue-500 text-white p-2 rounded mt-4">Upload CSV</button>
      <div className="mt-4">
        <p>No leads uploaded yet.</p>
      </div>
    </div>
  );
};

export default LeadsManagement;