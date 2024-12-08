// src/components/Sequence/SequenceEditor.tsx
import React from 'react';

const SequenceEditor = () => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">Sequence Editor</h2>
      <div className="mt-4">
        <p>Step 1: Email Subject</p>
        <textarea className="w-full p-2 border border-gray-300 rounded" rows={4}></textarea>
        <button className="bg-blue-500 text-white p-2 rounded mt-4">Save Sequence</button>
      </div>
    </div>
  );
};

export default SequenceEditor;