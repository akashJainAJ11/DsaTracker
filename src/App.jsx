import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { getData, updateDBData } from './db';
import Topic from './Topic';
import TopicCard from './TopicCard';

function App() {
  const [questionData, setQuestionData] = useState(() => {
    const savedData = localStorage.getItem('questionData');
    return savedData ? JSON.parse(savedData) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (questionData.length === 0) {
      getData((data) => {
        setQuestionData(data);
        localStorage.setItem('questionData', JSON.stringify(data));
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [questionData]);

  const updateData = (key, updatedTopicData, topicPosition) => {
    const updatedData = questionData.map((topic, index) => {
      if (index === topicPosition) {
        updateDBData(key, updatedTopicData);
        return { ...topic, ...updatedTopicData };
      }
      return topic;
    });
    setQuestionData(updatedData);
    localStorage.setItem('questionData', JSON.stringify(updatedData));
  };

  const topicRoutes = questionData.map((topic, index) => {
    let path = `/${topic.topicName.toLowerCase().replace(/\s+/g, '_')}`;
    path = path.replace(/search_&_sort/g, 'search_sort').replace(/stacks_&_queue/g, 'stacks_queue');
    return (
      <BrowserRouter basename="/subdirectory">
        <Routes>
        <Route
        key={topic.topicName}
        path={path}
        element={
          <Topic
            data={topic}
            updateData={(updatedTopicData) => updateData(topic.topicName, updatedTopicData, index)}
            topicPosition={index}
          />
        }
      />
        </Routes>
      </BrowserRouter>
    );
  });

  return (
    <BrowserRouter basename="/subdirectory">
      <Routes>
        <Route path="/" element={<TopicCard questionData={questionData} />} />
        {topicRoutes}
      </Routes>
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-xl font-semibold text-blue-500 mt-4">Loading...</p>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
