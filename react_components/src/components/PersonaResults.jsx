/**
 * PersonaResults - Results display component
 * Shows persona match results with detailed breakdown
 */

import React from 'react';

const PersonaResults = ({ result, onRetake, onContinue }) => {
  const personaName = result.primary_persona === 'working_kevin' ? 'Working Kevin' : 'Job Searching Kevin';
  const confidencePercent = Math.round(result.confidence_score * 100);
  
  const getPersonaDescription = () => {
    if (result.primary_persona === 'working_kevin') {
      return "You're a working professional focused on strategic career growth and networking.";
    } else {
      return "You're in career transition mode, focused on finding new opportunities and building connections.";
    }
  };

  const getPersonaEmoji = () => {
    return result.primary_persona === 'working_kevin' ? '🏢' : '🔍';
  };

  const getPersonaColor = () => {
    return result.primary_persona === 'working_kevin' ? 'from-blue-600 to-blue-800' : 'from-purple-600 to-purple-800';
  };

  const renderCharacteristics = () => {
    if (!result.characteristics) return null;

    const characteristics = result.primary_persona === 'working_kevin' ? {
      'Budget Range': '$150-200/day',
      'Time Commitment': '2-4 hours/week',
      'Networking Style': 'Strategic, industry-focused',
      'Primary Focus': 'Career advancement',
      'Stress Level': 'Moderate, manageable',
      'Schedule': 'Structured with limited flexibility'
    } : {
      'Budget Range': '$50-100/day',
      'Time Commitment': '5-10+ hours/week',
      'Networking Style': 'Broad, opportunity-focused',
      'Primary Focus': 'Finding new opportunities',
      'Stress Level': 'High due to uncertainty',
      'Schedule': 'Flexible with urgent timeline'
    };

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {Object.entries(characteristics).map(([key, value]) => (
          <div key={key} className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-sm font-medium text-blue-600 mb-1">{key}</div>
            <div className="text-gray-800">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderPersonaScores = () => {
    const workingKevinScore = result.persona_scores?.working_kevin || 0;
    const jobSearchingKevinScore = result.persona_scores?.job_searching_kevin || 0;
    const maxScore = Math.max(workingKevinScore, jobSearchingKevinScore);

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Detailed Scores</h4>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">🏢 Working Kevin</span>
              <span className="font-medium">{workingKevinScore.toFixed(1)} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${maxScore > 0 ? (workingKevinScore / maxScore) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">🔍 Job Searching Kevin</span>
              <span className="font-medium">{jobSearchingKevinScore.toFixed(1)} points</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${maxScore > 0 ? (jobSearchingKevinScore / maxScore) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSupportingFactors = () => {
    if (!result.supporting_factors || result.supporting_factors.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">✅ Key Supporting Factors</h4>
        <ul className="space-y-2">
          {result.supporting_factors.slice(0, 5).map((factor, index) => (
            <li key={index} className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span className="text-gray-700">{factor}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderRecommendations = () => {
    if (!result.recommendations || result.recommendations.length === 0) return null;

    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-8">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">💡 Personalized Recommendations</h4>
        <ul className="space-y-3">
          {result.recommendations.map((recommendation, index) => (
            <li key={index} className="flex items-start">
              <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium mr-3 mt-0.5">
                {index + 1}
              </span>
              <span className="text-gray-700">{recommendation}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderPersonaSummary = () => {
    if (result.primary_persona === 'working_kevin') {
      return (
        <div className="bg-blue-50 rounded-lg p-6 border-l-4 border-blue-500">
          <h4 className="text-lg font-semibold text-blue-800 mb-3">🏢 You're a Working Professional</h4>
          <p className="text-blue-700 mb-4">
            Your LifePlanner will emphasize strategic career growth and work-life balance.
          </p>
          <ul className="text-blue-700 space-y-1">
            <li>• Industry networking events and professional development</li>
            <li>• Work-life balance activities</li>
            <li>• Strategic relationship building</li>
            <li>• Moderate budget activities ($150-200/day)</li>
          </ul>
        </div>
      );
    } else {
      return (
        <div className="bg-purple-50 rounded-lg p-6 border-l-4 border-purple-500">
          <h4 className="text-lg font-semibold text-purple-800 mb-3">🔍 You're in Career Transition</h4>
          <p className="text-purple-700 mb-4">
            Your LifePlanner will focus on opportunity creation and stress management.
          </p>
          <ul className="text-purple-700 space-y-1">
            <li>• Job search networking and informational interviews</li>
            <li>• Stress management and positive activities</li>
            <li>• Budget-conscious networking ($50-100/day)</li>
            <li>• High-impact opportunity creation</li>
          </ul>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="text-6xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Persona Match</h1>
        </div>

        {/* Main Result Card */}
        <div className={`bg-gradient-to-r ${getPersonaColor()} rounded-xl p-8 text-white mb-8 shadow-xl`}>
          <div className="text-center">
            <div className="text-6xl mb-4">{getPersonaEmoji()}</div>
            <h2 className="text-4xl font-bold mb-2">{personaName}</h2>
            <div className="text-xl mb-4 opacity-90">
              {confidencePercent}% Match Confidence
            </div>
            <p className="text-lg opacity-90 max-w-2xl mx-auto">
              {getPersonaDescription()}
            </p>
          </div>
        </div>

        {/* Characteristics */}
        {renderCharacteristics()}

        {/* Detailed Scores */}
        {renderPersonaScores()}

        {/* Supporting Factors */}
        {renderSupportingFactors()}

        {/* Recommendations */}
        {renderRecommendations()}

        {/* Persona Summary */}
        {renderPersonaSummary()}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
          <button
            onClick={onContinue}
            className={`px-8 py-4 bg-gradient-to-r ${getPersonaColor()} text-white rounded-lg font-semibold text-lg hover:opacity-90 transition-all duration-200 shadow-lg transform hover:scale-105`}
          >
            🚀 Continue to LifePlanner
          </button>
          <button
            onClick={onRetake}
            className="px-8 py-4 bg-gray-200 text-gray-700 rounded-lg font-semibold text-lg hover:bg-gray-300 transition-all duration-200"
          >
            🔄 Retake Assessment
          </button>
        </div>

        {/* Footer Note */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Ready to start planning with your {personaName} persona!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PersonaResults;
