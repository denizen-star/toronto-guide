/**
 * PersonaQuestionCard - Individual question component
 * Handles rendering different question types (single choice, scale)
 */

import React from 'react';

const PersonaQuestionCard = ({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswer,
}) => {
  const handleOptionClick = (optionId) => {
    onAnswer(question.id, optionId);
  };

  const handleScaleClick = (value) => {
    onAnswer(question.id, value.toString());
  };

  const renderSingleChoice = () => {
    return (
      <div className="space-y-4">
        {question.options.map((option, index) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
              selectedAnswer === option.id
                ? 'border-green-500 bg-green-50 shadow-lg'
                : 'border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 hover:shadow-md'
            }`}
          >
            <div className="flex items-center">
              <div
                className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                  selectedAnswer === option.id
                    ? 'border-green-500 bg-green-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedAnswer === option.id && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <p className="text-lg font-medium text-gray-800">{option.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderScale = () => {
    const [min, max] = question.scale_range || [1, 10];
    const scaleValues = Array.from({ length: max - min + 1 }, (_, i) => min + i);

    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center space-x-3 flex-wrap">
          {scaleValues.map((value) => (
            <button
              key={value}
              onClick={() => handleScaleClick(value)}
              className={`w-12 h-12 rounded-full border-2 font-semibold text-lg transition-all duration-200 ${
                selectedAnswer === value.toString()
                  ? 'border-green-500 bg-green-500 text-white shadow-lg transform scale-110'
                  : 'border-gray-300 bg-white text-gray-700 hover:border-blue-400 hover:bg-blue-50'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
        
        <div className="flex justify-between text-sm text-gray-500 px-2">
          <span>Very Low</span>
          <span>Very High</span>
        </div>
        
        {selectedAnswer && (
          <div className="text-center">
            <p className="text-lg font-medium text-gray-800">
              You rated: {selectedAnswer}/{max}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto">
      {/* Question Header */}
      <div className="flex items-center mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mr-4">
          {questionNumber}
        </div>
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-800 leading-tight">
            {question.text}
          </h2>
          {question.required && (
            <p className="text-sm text-red-500 mt-1">* Required</p>
          )}
        </div>
      </div>

      {/* Question Content */}
      <div className="mb-8">
        {question.type === 'single_choice' && renderSingleChoice()}
        {question.type === 'scale' && renderScale()}
      </div>

      {/* Question Info */}
      <div className="flex justify-between items-center text-sm text-gray-500 pt-4 border-t border-gray-100">
        <span>Question {questionNumber} of {totalQuestions}</span>
        {question.weight && (
          <span className="bg-gray-100 px-2 py-1 rounded">
            Weight: {question.weight}
          </span>
        )}
      </div>
    </div>
  );
};

export default PersonaQuestionCard;
