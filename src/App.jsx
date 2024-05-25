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

  useEffect(() => {
    if (questionData.length === 0) {
      getData((data) => {
        setQuestionData(data);
        localStorage.setItem('questionData', JSON.stringify(data));
      });
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
    );
  });
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TopicCard questionData={questionData} />} />
        {topicRoutes}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
