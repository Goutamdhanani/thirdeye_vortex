// src/pages/SequencesPage.tsx
import React from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import SequenceEditor from '../components/Sequence/SequenceEditor';

const SequencesPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Header />
        <SequenceEditor />
      </div>
    </div>
  );
};

export default SequencesPage;