"""
AI-powered recommendation engine for LifePlanner
"""

import json
import numpy as np
from typing import Dict, List, Tuple, Optional, Set
from datetime import datetime, timedelta
from collections import defaultdict
from pathlib import Path

from ...shared.models import Activity, Persona, ActivityType
from ...shared.logging import get_logger


class RecommendationEngine:
    """AI-powered recommendation engine using collaborative filtering and content-based recommendations"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.logger = get_logger(__name__)
        
        # Recommendation models
        self.user_activity_matrix = {}
        self.activity_features = {}
        self.user_preferences = {}
        self.activity_similarity = {}
        
        # Learning parameters
        self.learning_rate = 0.01
        self.regularization = 0.001
        self.min_interactions = 3
        
        self._load_historical_data()
        self._initialize_models()
    
    def _load_historical_data(self):
        """Load historical interaction data"""
        history_file = self.data_dir / "interaction_history.json"
        if history_file.exists():
            with open(history_file, 'r') as f:
                self.interaction_history = json.load(f)
        else:
            self.interaction_history = {
                "user_activities": {},
                "activity_ratings": {},
                "session_data": []
            }
    
    def _initialize_models(self):
        """Initialize recommendation models"""
        self._build_user_activity_matrix()
        self._extract_activity_features()
        self._calculate_activity_similarity()
    
    def _build_user_activity_matrix(self):
        """Build user-activity interaction matrix"""
        for user_id, activities in self.interaction_history.get("user_activities", {}).items():
            self.user_activity_matrix[user_id] = {}
            for activity_name, interactions in activities.items():
                # Calculate implicit rating based on usage frequency and recency
                frequency = interactions.get("count", 0)
                last_used = interactions.get("last_used")
                
                # Recency weight (more recent = higher weight)
                recency_weight = 1.0
                if last_used:
                    days_ago = (datetime.now() - datetime.fromisoformat(last_used)).days
                    recency_weight = max(0.1, 1.0 - (days_ago / 365))  # Decay over a year
                
                # Implicit rating (0-5 scale)
                implicit_rating = min(5.0, frequency * 0.5 * recency_weight)
                self.user_activity_matrix[user_id][activity_name] = implicit_rating
    
    def _extract_activity_features(self):
        """Extract features from activities for content-based filtering"""
        # Load activities
        activities_file = self.data_dir / "activities.json"
        if not activities_file.exists():
            return
        
        with open(activities_file, 'r') as f:
            activities_data = json.load(f)
        
        for activity_data in activities_data.get("activities", []):
            activity_name = activity_data["name"]
            
            # Feature vector
            features = {
                "cost_normalized": min(1.0, activity_data.get("cost_cad", 0) / 200.0),  # Normalize to 0-1
                "duration_normalized": min(1.0, activity_data.get("duration_hours", 0) / 8.0),  # Max 8 hours
                "networking_potential": activity_data.get("networking_potential", 0) / 10.0,
                "energy_level": {"low": 0.2, "medium": 0.6, "high": 1.0}.get(activity_data.get("energy_level", "medium"), 0.6),
                "connection_depth": activity_data.get("connection_depth", 0) / 10.0,
                "emotional_safety": activity_data.get("emotional_safety", 0) / 10.0,
                "indoor": 1.0 if activity_data.get("indoor", True) else 0.0,
                "weather_dependent": 1.0 if activity_data.get("weather_dependent", False) else 0.0,
                "requires_planning": 1.0 if activity_data.get("requires_planning", False) else 0.0
            }
            
            # Activity type one-hot encoding
            activity_type = activity_data.get("activity_type", "activity")
            for at in ActivityType:
                features[f"type_{at.value}"] = 1.0 if activity_type == at.value else 0.0
            
            # Tags as binary features
            tags = set(activity_data.get("tags", []))
            common_tags = ["fitness", "social", "cultural", "professional", "creative", "outdoor", "indoor", "networking"]
            for tag in common_tags:
                features[f"tag_{tag}"] = 1.0 if tag in tags else 0.0
            
            self.activity_features[activity_name] = features
    
    def _calculate_activity_similarity(self):
        """Calculate activity similarity using cosine similarity"""
        activity_names = list(self.activity_features.keys())
        
        for i, activity1 in enumerate(activity_names):
            self.activity_similarity[activity1] = {}
            
            for j, activity2 in enumerate(activity_names):
                if i == j:
                    self.activity_similarity[activity1][activity2] = 1.0
                    continue
                
                # Calculate cosine similarity
                features1 = self.activity_features[activity1]
                features2 = self.activity_features[activity2]
                
                # Get common features
                common_features = set(features1.keys()) & set(features2.keys())
                
                if not common_features:
                    self.activity_similarity[activity1][activity2] = 0.0
                    continue
                
                # Calculate dot product and magnitudes
                dot_product = sum(features1[f] * features2[f] for f in common_features)
                magnitude1 = np.sqrt(sum(features1[f] ** 2 for f in common_features))
                magnitude2 = np.sqrt(sum(features2[f] ** 2 for f in common_features))
                
                if magnitude1 == 0 or magnitude2 == 0:
                    similarity = 0.0
                else:
                    similarity = dot_product / (magnitude1 * magnitude2)
                
                self.activity_similarity[activity1][activity2] = similarity
    
    def get_personalized_recommendations(self, persona: Persona, 
                                       exclude_activities: Set[str] = None,
                                       num_recommendations: int = 10) -> List[Dict]:
        """Get personalized activity recommendations for a persona"""
        if exclude_activities is None:
            exclude_activities = set()
        
        recommendations = []
        
        # Content-based recommendations
        content_recs = self._get_content_based_recommendations(persona, exclude_activities)
        
        # Collaborative filtering recommendations
        collab_recs = self._get_collaborative_recommendations(persona.id, exclude_activities)
        
        # Combine recommendations with weights
        combined_scores = defaultdict(float)
        
        # Weight content-based recommendations (60%)
        for activity_name, score in content_recs:
            combined_scores[activity_name] += score * 0.6
        
        # Weight collaborative recommendations (40%)
        for activity_name, score in collab_recs:
            combined_scores[activity_name] += score * 0.4
        
        # Sort by combined score
        sorted_activities = sorted(combined_scores.items(), key=lambda x: x[1], reverse=True)
        
        # Format recommendations
        for activity_name, score in sorted_activities[:num_recommendations]:
            if activity_name not in exclude_activities:
                recommendation = {
                    "activity_name": activity_name,
                    "score": score,
                    "reason": self._generate_recommendation_reason(activity_name, persona, score),
                    "confidence": min(1.0, score),
                    "recommendation_type": "hybrid"
                }
                recommendations.append(recommendation)
        
        self.logger.info(
            f"Generated {len(recommendations)} recommendations for persona {persona.id}",
            persona_id=persona.id,
            recommendation_count=len(recommendations)
        )
        
        return recommendations
    
    def _get_content_based_recommendations(self, persona: Persona, 
                                         exclude_activities: Set[str]) -> List[Tuple[str, float]]:
        """Get content-based recommendations based on persona preferences"""
        recommendations = []
        
        # Create persona feature vector
        persona_features = self._create_persona_feature_vector(persona)
        
        # Calculate similarity with each activity
        for activity_name, activity_features in self.activity_features.items():
            if activity_name in exclude_activities:
                continue
            
            # Calculate similarity score
            similarity = self._calculate_feature_similarity(persona_features, activity_features)
            
            # Apply persona-specific boosts
            boost = self._calculate_persona_boost(activity_name, persona)
            final_score = similarity * boost
            
            recommendations.append((activity_name, final_score))
        
        return sorted(recommendations, key=lambda x: x[1], reverse=True)
    
    def _get_collaborative_recommendations(self, user_id: str, 
                                         exclude_activities: Set[str]) -> List[Tuple[str, float]]:
        """Get collaborative filtering recommendations"""
        if user_id not in self.user_activity_matrix:
            return []
        
        recommendations = []
        user_ratings = self.user_activity_matrix[user_id]
        
        # Find similar users
        similar_users = self._find_similar_users(user_id)
        
        # Get recommendations from similar users
        activity_scores = defaultdict(float)
        activity_weights = defaultdict(float)
        
        for similar_user_id, similarity in similar_users[:5]:  # Top 5 similar users
            similar_user_ratings = self.user_activity_matrix.get(similar_user_id, {})
            
            for activity_name, rating in similar_user_ratings.items():
                if activity_name not in exclude_activities and activity_name not in user_ratings:
                    activity_scores[activity_name] += similarity * rating
                    activity_weights[activity_name] += similarity
        
        # Normalize scores
        for activity_name in activity_scores:
            if activity_weights[activity_name] > 0:
                normalized_score = activity_scores[activity_name] / activity_weights[activity_name]
                recommendations.append((activity_name, normalized_score))
        
        return sorted(recommendations, key=lambda x: x[1], reverse=True)
    
    def _create_persona_feature_vector(self, persona: Persona) -> Dict[str, float]:
        """Create feature vector from persona preferences"""
        features = {}
        
        # Budget preference
        features["cost_normalized"] = 1.0 - min(1.0, persona.max_daily_budget / 500.0)  # Inverse: lower cost preferred
        
        # Networking preference
        features["networking_potential"] = persona.networking_priority / 10.0
        
        # Energy level preference (assume based on personality)
        if persona.personality_type.value == "extrovert":
            features["energy_level"] = 0.8  # Prefer higher energy
        elif persona.personality_type.value == "introvert":
            features["energy_level"] = 0.3  # Prefer lower energy
        else:
            features["energy_level"] = 0.6  # Balanced
        
        # Activity type preferences
        for at in ActivityType:
            features[f"type_{at.value}"] = 1.0 if at.value in persona.preferred_activities else 0.0
        
        # Social style preferences
        if persona.social_style == "networker":
            features["networking_potential"] = max(features.get("networking_potential", 0), 0.8)
        elif persona.social_style == "selective":
            features["connection_depth"] = 0.8
            features["emotional_safety"] = 0.8
        
        return features
    
    def _calculate_feature_similarity(self, persona_features: Dict[str, float], 
                                    activity_features: Dict[str, float]) -> float:
        """Calculate similarity between persona and activity features"""
        common_features = set(persona_features.keys()) & set(activity_features.keys())
        
        if not common_features:
            return 0.0
        
        # Calculate weighted cosine similarity
        dot_product = sum(persona_features[f] * activity_features[f] for f in common_features)
        magnitude1 = np.sqrt(sum(persona_features[f] ** 2 for f in common_features))
        magnitude2 = np.sqrt(sum(activity_features[f] ** 2 for f in common_features))
        
        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0
        
        return dot_product / (magnitude1 * magnitude2)
    
    def _calculate_persona_boost(self, activity_name: str, persona: Persona) -> float:
        """Calculate persona-specific boost for an activity"""
        boost = 1.0
        
        # Load activity data
        activities_file = self.data_dir / "activities.json"
        if not activities_file.exists():
            return boost
        
        with open(activities_file, 'r') as f:
            activities_data = json.load(f)
        
        # Find activity
        activity_data = None
        for act in activities_data.get("activities", []):
            if act["name"] == activity_name:
                activity_data = act
                break
        
        if not activity_data:
            return boost
        
        # Budget constraint boost/penalty
        if activity_data.get("cost_cad", 0) > persona.max_daily_budget:
            boost *= 0.1  # Heavy penalty for over-budget activities
        
        # Location preference boost
        activity_location = activity_data.get("location", "")
        if any(loc in activity_location for loc in persona.preferred_locations):
            boost *= 1.3
        
        # Day preference boost
        day_pref = activity_data.get("day_preference")
        if day_pref and day_pref in persona.available_days:
            boost *= 1.2
        
        return boost
    
    def _find_similar_users(self, user_id: str) -> List[Tuple[str, float]]:
        """Find users similar to the given user"""
        if user_id not in self.user_activity_matrix:
            return []
        
        user_ratings = self.user_activity_matrix[user_id]
        similarities = []
        
        for other_user_id, other_ratings in self.user_activity_matrix.items():
            if other_user_id == user_id:
                continue
            
            # Calculate Pearson correlation
            similarity = self._calculate_user_similarity(user_ratings, other_ratings)
            if similarity > 0.1:  # Minimum similarity threshold
                similarities.append((other_user_id, similarity))
        
        return sorted(similarities, key=lambda x: x[1], reverse=True)
    
    def _calculate_user_similarity(self, ratings1: Dict[str, float], 
                                 ratings2: Dict[str, float]) -> float:
        """Calculate Pearson correlation between two users"""
        common_activities = set(ratings1.keys()) & set(ratings2.keys())
        
        if len(common_activities) < self.min_interactions:
            return 0.0
        
        # Calculate means
        mean1 = sum(ratings1[act] for act in common_activities) / len(common_activities)
        mean2 = sum(ratings2[act] for act in common_activities) / len(common_activities)
        
        # Calculate Pearson correlation
        numerator = sum((ratings1[act] - mean1) * (ratings2[act] - mean2) for act in common_activities)
        
        sum_sq1 = sum((ratings1[act] - mean1) ** 2 for act in common_activities)
        sum_sq2 = sum((ratings2[act] - mean2) ** 2 for act in common_activities)
        
        denominator = np.sqrt(sum_sq1 * sum_sq2)
        
        if denominator == 0:
            return 0.0
        
        return numerator / denominator
    
    def _generate_recommendation_reason(self, activity_name: str, persona: Persona, score: float) -> str:
        """Generate human-readable reason for recommendation"""
        reasons = []
        
        # Load activity data
        activities_file = self.data_dir / "activities.json"
        if activities_file.exists():
            with open(activities_file, 'r') as f:
                activities_data = json.load(f)
            
            for act in activities_data.get("activities", []):
                if act["name"] == activity_name:
                    # Budget-friendly
                    if act.get("cost_cad", 0) <= persona.max_daily_budget * 0.5:
                        reasons.append("budget-friendly")
                    
                    # High networking potential
                    if act.get("networking_potential", 0) >= persona.networking_priority:
                        reasons.append("great for networking")
                    
                    # Matches preferred locations
                    activity_location = act.get("location", "")
                    if any(loc in activity_location for loc in persona.preferred_locations):
                        reasons.append("in your preferred area")
                    
                    # Matches activity type preferences
                    if act.get("activity_type") in persona.preferred_activities:
                        reasons.append("matches your interests")
                    
                    break
        
        # High confidence
        if score > 0.8:
            reasons.append("highly recommended")
        elif score > 0.6:
            reasons.append("good match")
        
        if not reasons:
            reasons = ["recommended for you"]
        
        return ", ".join(reasons[:3])  # Limit to 3 reasons
    
    def record_interaction(self, user_id: str, activity_name: str, 
                          interaction_type: str = "selected", rating: float = None):
        """Record user interaction with an activity"""
        timestamp = datetime.now().isoformat()
        
        # Update user activities
        if "user_activities" not in self.interaction_history:
            self.interaction_history["user_activities"] = {}
        
        if user_id not in self.interaction_history["user_activities"]:
            self.interaction_history["user_activities"][user_id] = {}
        
        if activity_name not in self.interaction_history["user_activities"][user_id]:
            self.interaction_history["user_activities"][user_id][activity_name] = {
                "count": 0,
                "last_used": None
            }
        
        # Update interaction data
        self.interaction_history["user_activities"][user_id][activity_name]["count"] += 1
        self.interaction_history["user_activities"][user_id][activity_name]["last_used"] = timestamp
        
        # Record explicit rating if provided
        if rating is not None:
            if "activity_ratings" not in self.interaction_history:
                self.interaction_history["activity_ratings"] = {}
            
            if user_id not in self.interaction_history["activity_ratings"]:
                self.interaction_history["activity_ratings"][user_id] = {}
            
            self.interaction_history["activity_ratings"][user_id][activity_name] = rating
        
        # Record session data
        session_data = {
            "timestamp": timestamp,
            "user_id": user_id,
            "activity_name": activity_name,
            "interaction_type": interaction_type,
            "rating": rating
        }
        self.interaction_history["session_data"].append(session_data)
        
        # Save to file
        self._save_interaction_history()
        
        # Update models
        self._build_user_activity_matrix()
        
        self.logger.info(
            f"Recorded interaction: {user_id} -> {activity_name} ({interaction_type})",
            user_id=user_id,
            activity_name=activity_name,
            interaction_type=interaction_type
        )
    
    def _save_interaction_history(self):
        """Save interaction history to file"""
        history_file = self.data_dir / "interaction_history.json"
        self.data_dir.mkdir(exist_ok=True)
        
        with open(history_file, 'w') as f:
            json.dump(self.interaction_history, f, indent=2)
    
    def get_trending_activities(self, time_window_days: int = 30) -> List[Dict]:
        """Get trending activities based on recent interactions"""
        cutoff_date = datetime.now() - timedelta(days=time_window_days)
        
        activity_counts = defaultdict(int)
        
        for session in self.interaction_history.get("session_data", []):
            session_date = datetime.fromisoformat(session["timestamp"])
            if session_date >= cutoff_date:
                activity_counts[session["activity_name"]] += 1
        
        # Sort by popularity
        trending = sorted(activity_counts.items(), key=lambda x: x[1], reverse=True)
        
        return [
            {
                "activity_name": activity_name,
                "interaction_count": count,
                "trend_score": count / time_window_days
            }
            for activity_name, count in trending[:10]
        ]

