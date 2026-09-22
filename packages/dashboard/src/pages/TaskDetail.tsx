import React from 'react';

const TaskDetail: React.FC = () => {
  const id = window.location.pathname.split('/').filter(Boolean).pop() || 'unknown';
  return <div className="task-detail"><h1>Task {id}</h1></div>;
};

export default TaskDetail;
