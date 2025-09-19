/**
 * PersonaContext - Global state management for persona data
 * Provides persona state throughout the React application
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import PersonaService from '../services/PersonaService';

const PersonaContext = createContext();

// Action types
const PERSONA_ACTIONS = {
  SET_PERSONA: 'SET_PERSONA',
  SET_ONBOARDING_COMPLETE: 'SET_ONBOARDING_COMPLETE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_PERSONA: 'CLEAR_PERSONA',
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_RESPONSES: 'SET_RESPONSES',
  UPDATE_RESPONSE: 'UPDATE_RESPONSE',
};

// Initial state
const initialState = {
  currentPersona: null,
  onboardingComplete: false,
  loading: false,
  error: null,
  questions: [],
  responses: {},
  personaResult: null,
};

// Reducer function
const personaReducer = (state, action) => {
  switch (action.type) {
    case PERSONA_ACTIONS.SET_PERSONA:
      return {
        ...state,
        currentPersona: action.payload,
        personaResult: action.payload,
        onboardingComplete: true,
        error: null,
      };

    case PERSONA_ACTIONS.SET_ONBOARDING_COMPLETE:
      return {
        ...state,
        onboardingComplete: action.payload,
      };

    case PERSONA_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case PERSONA_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case PERSONA_ACTIONS.CLEAR_PERSONA:
      return {
        ...initialState,
      };

    case PERSONA_ACTIONS.SET_QUESTIONS:
      return {
        ...state,
        questions: action.payload,
        error: null,
      };

    case PERSONA_ACTIONS.SET_RESPONSES:
      return {
        ...state,
        responses: action.payload,
      };

    case PERSONA_ACTIONS.UPDATE_RESPONSE:
      return {
        ...state,
        responses: {
          ...state.responses,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    default:
      return state;
  }
};

// Context Provider Component
export const PersonaProvider = ({ children }) => {
  const [state, dispatch] = useReducer(personaReducer, initialState);

  // Load saved persona result on initialization
  useEffect(() => {
    const savedResult = PersonaService.getSavedPersonaResult();
    if (savedResult) {
      dispatch({
        type: PERSONA_ACTIONS.SET_PERSONA,
        payload: savedResult,
      });
    }
  }, []);

  // Action creators
  const actions = {
    // Load questions from API
    loadQuestions: async () => {
      dispatch({ type: PERSONA_ACTIONS.SET_LOADING, payload: true });
      try {
        const data = await PersonaService.getQuestions();
        dispatch({ type: PERSONA_ACTIONS.SET_QUESTIONS, payload: data.questions });
      } catch (error) {
        dispatch({ type: PERSONA_ACTIONS.SET_ERROR, payload: error.message });
      } finally {
        dispatch({ type: PERSONA_ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Submit responses and get persona match
    submitResponses: async (responses) => {
      dispatch({ type: PERSONA_ACTIONS.SET_LOADING, payload: true });
      try {
        const result = await PersonaService.submitResponses(responses);
        
        // Save result to localStorage
        PersonaService.savePersonaResult(result);
        
        dispatch({ type: PERSONA_ACTIONS.SET_PERSONA, payload: result });
        return result;
      } catch (error) {
        dispatch({ type: PERSONA_ACTIONS.SET_ERROR, payload: error.message });
        throw error;
      } finally {
        dispatch({ type: PERSONA_ACTIONS.SET_LOADING, payload: false });
      }
    },

    // Update a single response
    updateResponse: (questionId, answer) => {
      dispatch({
        type: PERSONA_ACTIONS.UPDATE_RESPONSE,
        payload: { questionId, answer },
      });
    },

    // Set all responses
    setResponses: (responses) => {
      dispatch({ type: PERSONA_ACTIONS.SET_RESPONSES, payload: responses });
    },

    // Clear all persona data
    clearPersona: () => {
      PersonaService.clearSavedPersonaResult();
      dispatch({ type: PERSONA_ACTIONS.CLEAR_PERSONA });
    },

    // Set loading state
    setLoading: (loading) => {
      dispatch({ type: PERSONA_ACTIONS.SET_LOADING, payload: loading });
    },

    // Set error state
    setError: (error) => {
      dispatch({ type: PERSONA_ACTIONS.SET_ERROR, payload: error });
    },

    // Mark onboarding as complete
    completeOnboarding: () => {
      dispatch({ type: PERSONA_ACTIONS.SET_ONBOARDING_COMPLETE, payload: true });
    },
  };

  const value = {
    ...state,
    ...actions,
  };

  return (
    <PersonaContext.Provider value={value}>
      {children}
    </PersonaContext.Provider>
  );
};

// Custom hook to use persona context
export const usePersona = () => {
  const context = useContext(PersonaContext);
  if (!context) {
    throw new Error('usePersona must be used within a PersonaProvider');
  }
  return context;
};

// Selector hooks for specific data
export const usePersonaResult = () => {
  const { personaResult } = usePersona();
  return personaResult;
};

export const usePersonaType = () => {
  const { personaResult } = usePersona();
  return personaResult?.primary_persona || null;
};

export const useOnboardingComplete = () => {
  const { onboardingComplete } = usePersona();
  return onboardingComplete;
};

export const usePersonaCharacteristics = () => {
  const { personaResult } = usePersona();
  return personaResult?.characteristics || null;
};

export default PersonaContext;
