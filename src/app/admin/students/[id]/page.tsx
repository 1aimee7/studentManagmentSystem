import React from 'react';

interface Props {
  params: {
    id: string;
  };
}

export default function StudentDetailPage({ params }: Props) {
  const { id } = params;

  return (
    <div>
      <h1>Student Details</h1>
      <p>Student ID: {id}</p>
    </div>
  );
}