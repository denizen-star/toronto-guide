/**
 * PersonaOnboarding - Main onboarding questionnaire component
 * Handles the complete persona matching flow
 */

import React, { useState, useEffect } from 'react';
import { usePersona } from '../context/PersonaContext';
import PersonaQuestionCard from './PersonaQuestionCard';
import PersonaResults from './PersonaResults';
import ProgressBar from './ProgressBar';
import LoadingSpinner from './LoadingSpinner';

const PersonaOnboarding = ({ onComplete }) => {
  const {
    questions,
    responses,
    personaResult,
    loading,
    error,
    loadQuestions,
    updateResponse,
    submitResponses,
    completeOnboarding,
  } = usePersona();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Load questions on component mount
  useEffect(() => {
    if (questions.length === 0) {
      loadQuestions();
    }
  }, [questions.length, loadQuestions]);

  // Check if we have a result to show
  useEffect(() => {
    if (personaResult) {
      setShowResults(true);
      setShowIntro(false);
    }
  }, [personaResult]);

  const handleStartQuestionnaire = () => {
    setShowIntro(false);
    setCurrentQuestionIndex(0);
  };

  const handleAnswerQuestion = (questionId, answer) => {
    updateResponse(questionId, answer);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmitResponses();
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitResponses = async () => {
    try {
      await submitResponses(responses);
      setShowResults(true);
    } catch (error) {
      console.error('Error submitting responses:', error);
    }
  };

  const handleRetakeAssessment = () => {
    setShowResults(false);
    setShowIntro(true);
    setCurrentQuestionIndex(0);
  };

  const handleContinueToApp = () => {
    completeOnboarding();
    if (onComplete) {
      onComplete(personaResult);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const currentAnswer = currentQuestion ? responses[currentQuestion.id] : null;
  const canProceed = currentAnswer !== undefined && currentAnswer !== null && currentAnswer !== '';

  if (loading) {
    return <LoadingSpinner message="Loading questionnaire..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showResults && personaResult) {
    return (
      <PersonaResults
        result={personaResult}
        onRetake={handleRetakeAssessment}
        onContinue={handleContinueToApp}
      />
    );
  }

  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="bg-white rounded-lg p-8 shadow-xl max-w-2xl w-full mx-4">
          <div className="text-center">
            <div className="text-6xl mb-6">🎯</div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Persona
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              Answer 10 quick questions to discover which LifePlanner persona matches your current situation
            </p>
            <p className="text-gray-500 mb-8">
              We'll match you to either <strong>Working Kevin</strong> (employed professional) or 
              <strong> Job Searching Kevin</strong> (career transition) to provide the most relevant recommendations.
            </p>
            <button
              onClick={handleStartQuestionnaire}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              🚀 Start Assessment
            </button>
            <p className="text-sm text-gray-400 mt-4">Takes about 2-3 minutes</p>
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return <LoadingSpinner message="Loading questions..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Progress Bar */}
      <div className="sticky top-0 z-10 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <ProgressBar progress={progress} />
        </div>
      </div>

      {/* Question Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <PersonaQuestionCard
          question={currentQuestion}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={currentAnswer}
          onAnswer={handleAnswerQuestion}
        />

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            ← Previous
          </button>

          <button
            onClick={handleNextQuestion}
            disabled={!canProceed}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              !canProceed
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg'
            }`}
          >
            {isLastQuestion ? 'Finish Assessment' : 'Next'} →
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            {!canProceed && 'Please select an answer to continue'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaOnboarding;
