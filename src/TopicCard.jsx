import React from "react";
import { Link } from "react-router-dom";
import Footer from "./Footer";

export default function TopicCard({ questionData }) {
  const findPercentage = (doneQuestions, totalQuestions) => {
    return Math.round((doneQuestions / totalQuestions) * 100);
  };

  if (!questionData) {
    return <div>Loading...</div>;
  }

  let totalSolved = 0;
  let totalQuestions = 0;

  const topicCard = questionData.map((topic, index) => {
    const { topicName, questions, started } = topic;
    const doneQuestions = questions.filter(q => q.Done).length;
    const percentDone = findPercentage(doneQuestions, questions.length);
    const questionsRemaining = questions.length - doneQuestions;

    totalSolved += doneQuestions;
    totalQuestions += questions.length;

    return (
      <div className="col mb-4" key={index}>
        <Link
          to={`/${topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase()}`}
          style={{ textDecoration: "none" }}
        >
          <div
            className={`mb-3 p-4 rounded-lg shadow-lg transform ${
              "bg-white text-gray-800"
            } ${started ? "border-green-500" : "border-blue-500"} border-2`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-bold">{topicName}</h2>
              <span
                className={`px-2 py-1 rounded-full text-sm font-medium ${
                  questionsRemaining === 0
                    ? "bg-green-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {questionsRemaining === 0 ? "Done 👏🏻" : "Solve Now 🙇🏻‍♂️"}
              </span>
            </div>
            <p className="mb-2">
              Total Questions {questions.length} <br />
              {`${questionsRemaining}`} More to go
            </p>
            {started ? (
              <>
                <p className="mb-1">
                  <b>{percentDone}% Done</b>
                </p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full"
                    style={{ width: `${percentDone}%` }}
                  ></div>
                </div>
              </>
            ) : (
              <p className="mb-1">
                <b>
                  <i>{percentDone > 0 ? `In Progress: ${percentDone}%` : "Not yet started"}</i>
                </b>
              </p>
            )}
          </div>
        </Link>
      </div>
    );
  });

  const overallPercentDone = findPercentage(totalSolved, totalQuestions);

  return (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Overall Progress</h2>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-green-500 h-4 rounded-full"
            style={{ width: `${overallPercentDone}%` }}
          ></div>
        </div>
        <p className="text-center mt-2">{overallPercentDone}% Done</p>
      </div>
      <div className="row">{topicCard}</div>
      <Footer/>
    </div>
  );
}
