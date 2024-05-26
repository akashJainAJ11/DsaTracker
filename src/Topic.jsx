import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from './Footer';

const Topic = ({ data, updateData, topicPosition }) => {
  const handleToggleDone = (questionIndex) => {
    const updatedQuestions = data.questions.map((question, index) => {
      if (index === questionIndex) {
        const newDoneStatus = !question.Done;
        toast(newDoneStatus ? 'Marked as Done' : 'Marked as Not Done', {
          type: newDoneStatus ? 'success' : 'info',
        });
        return { ...question, Done: newDoneStatus };
      }
      return question;
    });

    const sortedQuestions = updatedQuestions.sort((a, b) => {
      if (a.Done && !b.Done) return 1;
      if (!a.Done && b.Done) return -1;
      return 0;
    });

    const updatedTopic = { ...data, questions: sortedQuestions };
    updateData(updatedTopic, topicPosition);
  };

  const handleToggleImportant = (questionIndex) => {
    const updatedQuestions = data.questions.map((question, index) => {
      if (index === questionIndex) {
        const newImportantStatus = !question.Important;
        toast(newImportantStatus ? 'Marked as Important' : 'Unmarked as Important', {
          type: newImportantStatus ? 'warning' : 'info',
        });
        return { ...question, Important: newImportantStatus };
      }
      return question;
    });

    const updatedTopic = { ...data, questions: updatedQuestions };
    updateData(updatedTopic, topicPosition);
  };

  const handlePickRandom = () => {
    const notDoneQuestions = data.questions.filter((question) => !question.Done);
    if (notDoneQuestions.length === 0) {
      toast('All problems are marked as done!', { type: 'info' });
      return;
    }
    const randomQuestion = notDoneQuestions[Math.floor(Math.random() * notDoneQuestions.length)];
    window.open(randomQuestion.URL, '_blank');
  };

  const completedCount = data.questions.filter((question) => question.Done).length;
  const totalCount = data.questions.length;
  const progress = Math.round((completedCount / totalCount) * 100);

  return (
    <div>
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">{data.topicName}</h2>
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 rounded-full border-2 border-blue-500 flex items-center justify-center mr-4">
            <span className="text-blue-500 text-lg font-bold">{progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div className="bg-blue-500 h-4 rounded-full" style={{ width: `${progress}%` }}></div>
          </div>
        </div>
        <button
          onClick={handlePickRandom}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Pick a Random Not Done Problem
        </button>
        <ul className="space-y-4">
          {data.questions.map((question, index) => (
            <li key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{question.Problem}</p>
                <div className="flex space-x-4 mt-2">
                  <a href={question.URL} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Link 1
                  </a>
                  <a href={question.URL2} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Link 2
                  </a>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  onClick={() => handleToggleDone(index)}
                  className={`ml-4 px-4 py-2 rounded ${
                    question.Done ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  } hover:opacity-80`}
                >
                  {question.Done ? 'Done' : 'Not Done'}
                </button>
                <button
                  onClick={() => handleToggleImportant(index)}
                  className={`ml-4 p-2 rounded-full ${
                    question.Important ? 'bg-yellow-500 text-white' : 'bg-gray-300 text-gray-700'
                  } hover:opacity-80`}
                >
                  ★
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default Topic;
