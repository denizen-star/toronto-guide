"""
Analytics engine for LifePlanner usage patterns and insights
"""

import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from pathlib import Path
import statistics

from ...shared.logging import get_logger


class AnalyticsEngine:
    """Analytics engine for generating insights from LifePlanner usage"""
    
    def __init__(self, data_dir: str = "data"):
        self.data_dir = Path(data_dir)
        self.logger = get_logger(__name__)
        
        # Load data
        self.interaction_history = self._load_interaction_history()
        self.schedule_history = self._load_schedule_history()
        self.user_profiles = self._load_user_profiles()
    
    def _load_interaction_history(self) -> Dict:
        """Load interaction history data"""
        history_file = self.data_dir / "interaction_history.json"
        if history_file.exists():
            with open(history_file, 'r') as f:
                return json.load(f)
        return {"user_activities": {}, "activity_ratings": {}, "session_data": []}
    
    def _load_schedule_history(self) -> List[Dict]:
        """Load schedule generation history"""
        schedule_file = self.data_dir / "schedule_history.json"
        if schedule_file.exists():
            with open(schedule_file, 'r') as f:
                return json.load(f).get("schedules", [])
        return []
    
    def _load_user_profiles(self) -> Dict:
        """Load user profile data"""
        profiles_file = self.data_dir / "personas.json"
        if profiles_file.exists():
            with open(profiles_file, 'r') as f:
                data = json.load(f)
                return {p["id"]: p for p in data.get("personas", [])}
        return {}
    
    def generate_usage_analytics(self, user_id: Optional[str] = None, 
                                time_window_days: int = 30) -> Dict[str, Any]:
        """Generate comprehensive usage analytics"""
        cutoff_date = datetime.now() - timedelta(days=time_window_days)
        
        # Filter sessions by time window and user
        relevant_sessions = []
        for session in self.interaction_history.get("session_data", []):
            session_date = datetime.fromisoformat(session["timestamp"])
            if session_date >= cutoff_date:
                if user_id is None or session.get("user_id") == user_id:
                    relevant_sessions.append(session)
        
        analytics = {
            "time_period": {
                "start_date": cutoff_date.isoformat(),
                "end_date": datetime.now().isoformat(),
                "days": time_window_days
            },
            "user_id": user_id,
            "total_interactions": len(relevant_sessions),
            "activity_analytics": self._analyze_activity_usage(relevant_sessions),
            "temporal_analytics": self._analyze_temporal_patterns(relevant_sessions),
            "engagement_analytics": self._analyze_engagement_patterns(relevant_sessions),
            "preference_analytics": self._analyze_user_preferences(relevant_sessions, user_id),
            "goal_analytics": self._analyze_goal_progress(relevant_sessions, user_id),
            "recommendation_analytics": self._analyze_recommendation_effectiveness(relevant_sessions)
        }
        
        self.logger.info(
            f"Generated usage analytics for {time_window_days} days",
            user_id=user_id,
            total_interactions=analytics["total_interactions"]
        )
        
        return analytics
    
    def _analyze_activity_usage(self, sessions: List[Dict]) -> Dict[str, Any]:
        """Analyze activity usage patterns"""
        activity_counts = Counter()
        activity_ratings = defaultdict(list)
        activity_types = Counter()
        
        for session in sessions:
            activity_name = session.get("activity_name")
            if activity_name:
                activity_counts[activity_name] += 1
                
                # Collect ratings
                rating = session.get("rating")
                if rating is not None:
                    activity_ratings[activity_name].append(rating)
        
        # Load activity data to get types
        activities_file = self.data_dir / "activities.json"
        activity_type_map = {}
        if activities_file.exists():
            with open(activities_file, 'r') as f:
                activities_data = json.load(f)
                for activity in activities_data.get("activities", []):
                    activity_type_map[activity["name"]] = activity.get("activity_type", "unknown")
        
        # Count by type
        for activity_name, count in activity_counts.items():
            activity_type = activity_type_map.get(activity_name, "unknown")
            activity_types[activity_type] += count
        
        # Calculate average ratings
        avg_ratings = {}
        for activity, ratings in activity_ratings.items():
            if ratings:
                avg_ratings[activity] = statistics.mean(ratings)
        
        return {
            "most_popular_activities": activity_counts.most_common(10),
            "activity_type_distribution": dict(activity_types),
            "average_ratings": avg_ratings,
            "total_unique_activities": len(activity_counts),
            "activities_with_ratings": len(activity_ratings)
        }
    
    def _analyze_temporal_patterns(self, sessions: List[Dict]) -> Dict[str, Any]:
        """Analyze temporal usage patterns"""
        daily_usage = defaultdict(int)
        hourly_usage = defaultdict(int)
        weekly_usage = defaultdict(int)
        
        for session in sessions:
            timestamp = datetime.fromisoformat(session["timestamp"])
            
            # Daily usage
            date_key = timestamp.date().isoformat()
            daily_usage[date_key] += 1
            
            # Hourly usage
            hour_key = timestamp.hour
            hourly_usage[hour_key] += 1
            
            # Weekly usage (Monday = 0)
            weekday_key = timestamp.weekday()
            weekly_usage[weekday_key] += 1
        
        # Calculate patterns
        peak_hour = max(hourly_usage, key=hourly_usage.get) if hourly_usage else 12
        peak_day = max(weekly_usage, key=weekly_usage.get) if weekly_usage else 0
        
        # Convert weekday number to name
        weekday_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        peak_day_name = weekday_names[peak_day] if 0 <= peak_day < 7 else "Unknown"
        
        # Calculate usage consistency
        daily_counts = list(daily_usage.values())
        usage_consistency = statistics.stdev(daily_counts) if len(daily_counts) > 1 else 0
        
        return {
            "daily_usage": dict(daily_usage),
            "hourly_distribution": dict(hourly_usage),
            "weekly_distribution": {weekday_names[i]: weekly_usage.get(i, 0) for i in range(7)},
            "peak_usage_hour": peak_hour,
            "peak_usage_day": peak_day_name,
            "usage_consistency_score": 1.0 / (1.0 + usage_consistency),  # Higher = more consistent
            "total_active_days": len(daily_usage)
        }
    
    def _analyze_engagement_patterns(self, sessions: List[Dict]) -> Dict[str, Any]:
        """Analyze user engagement patterns"""
        session_lengths = []
        interaction_types = Counter()
        user_retention = defaultdict(set)
        
        # Group sessions by day to calculate session lengths
        daily_sessions = defaultdict(list)
        for session in sessions:
            timestamp = datetime.fromisoformat(session["timestamp"])
            date_key = timestamp.date().isoformat()
            daily_sessions[date_key].append(timestamp)
            
            # Count interaction types
            interaction_type = session.get("interaction_type", "unknown")
            interaction_types[interaction_type] += 1
            
            # Track user retention
            user_id = session.get("user_id", "unknown")
            user_retention[user_id].add(date_key)
        
        # Calculate average session length (time between first and last interaction per day)
        for date, timestamps in daily_sessions.items():
            if len(timestamps) > 1:
                timestamps.sort()
                session_length = (timestamps[-1] - timestamps[0]).total_seconds() / 60  # minutes
                session_lengths.append(session_length)
        
        # Calculate retention metrics
        retention_days = [len(days) for days in user_retention.values()]
        avg_retention = statistics.mean(retention_days) if retention_days else 0
        
        return {
            "average_session_length_minutes": statistics.mean(session_lengths) if session_lengths else 0,
            "interaction_type_distribution": dict(interaction_types),
            "user_retention_days": retention_days,
            "average_retention_days": avg_retention,
            "total_users": len(user_retention),
            "engagement_score": self._calculate_engagement_score(sessions)
        }
    
    def _calculate_engagement_score(self, sessions: List[Dict]) -> float:
        """Calculate overall engagement score (0-1)"""
        if not sessions:
            return 0.0
        
        # Factors for engagement score
        factors = []
        
        # Frequency factor (sessions per day)
        time_span = (datetime.now() - datetime.fromisoformat(sessions[0]["timestamp"])).days
        frequency_factor = min(1.0, len(sessions) / max(1, time_span))
        factors.append(frequency_factor)
        
        # Diversity factor (unique activities)
        unique_activities = len(set(s.get("activity_name") for s in sessions if s.get("activity_name")))
        diversity_factor = min(1.0, unique_activities / 20)  # Normalize to 20 activities
        factors.append(diversity_factor)
        
        # Rating factor (average rating)
        ratings = [s.get("rating") for s in sessions if s.get("rating") is not None]
        if ratings:
            rating_factor = statistics.mean(ratings) / 5.0  # Normalize to 5-star scale
            factors.append(rating_factor)
        
        # Consistency factor (regular usage)
        daily_sessions = defaultdict(int)
        for session in sessions:
            date_key = datetime.fromisoformat(session["timestamp"]).date().isoformat()
            daily_sessions[date_key] += 1
        
        active_days = len(daily_sessions)
        consistency_factor = min(1.0, active_days / 30)  # Normalize to 30 days
        factors.append(consistency_factor)
        
        return statistics.mean(factors) if factors else 0.0
    
    def _analyze_user_preferences(self, sessions: List[Dict], user_id: Optional[str]) -> Dict[str, Any]:
        """Analyze user preference patterns"""
        if not user_id or user_id not in self.user_profiles:
            return {"error": "User profile not found"}
        
        user_profile = self.user_profiles[user_id]
        
        # Analyze activity type preferences vs usage
        preferred_types = set(user_profile.get("preferred_activities", []))
        
        # Count actual usage by type
        actual_usage = Counter()
        activities_file = self.data_dir / "activities.json"
        activity_type_map = {}
        
        if activities_file.exists():
            with open(activities_file, 'r') as f:
                activities_data = json.load(f)
                for activity in activities_data.get("activities", []):
                    activity_type_map[activity["name"]] = activity.get("activity_type", "unknown")
        
        for session in sessions:
            activity_name = session.get("activity_name")
            if activity_name and activity_name in activity_type_map:
                activity_type = activity_type_map[activity_name]
                actual_usage[activity_type] += 1
        
        # Calculate preference alignment
        alignment_score = 0.0
        if preferred_types and actual_usage:
            preferred_usage = sum(actual_usage[ptype] for ptype in preferred_types)
            total_usage = sum(actual_usage.values())
            alignment_score = preferred_usage / total_usage if total_usage > 0 else 0.0
        
        return {
            "preferred_activity_types": list(preferred_types),
            "actual_usage_by_type": dict(actual_usage),
            "preference_alignment_score": alignment_score,
            "personality_type": user_profile.get("personality_type"),
            "networking_priority": user_profile.get("networking_priority", 0),
            "budget_utilization": self._analyze_budget_utilization(sessions, user_profile)
        }
    
    def _analyze_budget_utilization(self, sessions: List[Dict], user_profile: Dict) -> Dict[str, Any]:
        """Analyze budget utilization patterns"""
        max_daily_budget = user_profile.get("max_daily_budget", 0)
        
        # Load activity costs
        activities_file = self.data_dir / "activities.json"
        activity_costs = {}
        if activities_file.exists():
            with open(activities_file, 'r') as f:
                activities_data = json.load(f)
                for activity in activities_data.get("activities", []):
                    activity_costs[activity["name"]] = activity.get("cost_cad", 0)
        
        # Calculate daily spending
        daily_spending = defaultdict(float)
        for session in sessions:
            activity_name = session.get("activity_name")
            if activity_name and activity_name in activity_costs:
                date_key = datetime.fromisoformat(session["timestamp"]).date().isoformat()
                daily_spending[date_key] += activity_costs[activity_name]
        
        spending_amounts = list(daily_spending.values())
        
        return {
            "max_daily_budget": max_daily_budget,
            "average_daily_spending": statistics.mean(spending_amounts) if spending_amounts else 0,
            "total_spending": sum(spending_amounts),
            "budget_utilization_rate": statistics.mean(spending_amounts) / max_daily_budget if max_daily_budget > 0 else 0,
            "days_over_budget": len([s for s in spending_amounts if s > max_daily_budget]),
            "spending_consistency": statistics.stdev(spending_amounts) if len(spending_amounts) > 1 else 0
        }
    
    def _analyze_goal_progress(self, sessions: List[Dict], user_id: Optional[str]) -> Dict[str, Any]:
        """Analyze progress toward user goals"""
        if not user_id or user_id not in self.user_profiles:
            return {"error": "User profile not found"}
        
        user_profile = self.user_profiles[user_id]
        primary_goals = user_profile.get("primary_goals", [])
        
        # Map goals to activity types
        goal_activity_mapping = {
            "fitness": ["fitness", "sports", "outdoor"],
            "networking": ["social", "professional"],
            "learning": ["cultural", "creative", "professional"],
            "relationships": ["couple_quality_time", "couple_emotional_safety"]
        }
        
        goal_progress = {}
        
        # Load activity data
        activities_file = self.data_dir / "activities.json"
        activity_data = {}
        if activities_file.exists():
            with open(activities_file, 'r') as f:
                activities_json = json.load(f)
                for activity in activities_json.get("activities", []):
                    activity_data[activity["name"]] = activity
        
        for goal in primary_goals:
            goal_lower = goal.lower()
            relevant_types = goal_activity_mapping.get(goal_lower, [goal_lower])
            
            # Count activities related to this goal
            goal_activities = 0
            goal_hours = 0.0
            
            for session in sessions:
                activity_name = session.get("activity_name")
                if activity_name and activity_name in activity_data:
                    activity = activity_data[activity_name]
                    activity_type = activity.get("activity_type", "")
                    
                    if any(rtype in activity_type for rtype in relevant_types):
                        goal_activities += 1
                        goal_hours += activity.get("duration_hours", 0)
            
            goal_progress[goal] = {
                "related_activities": goal_activities,
                "total_hours": goal_hours,
                "weekly_average": goal_hours / 4 if goal_hours > 0 else 0,  # Assume 4-week period
                "progress_score": min(1.0, goal_activities / 10)  # Normalize to 10 activities
            }
        
        return goal_progress
    
    def _analyze_recommendation_effectiveness(self, sessions: List[Dict]) -> Dict[str, Any]:
        """Analyze how effective recommendations are"""
        recommendation_sessions = [s for s in sessions if s.get("interaction_type") == "recommendation_accepted"]
        total_recommendations = len([s for s in sessions if s.get("interaction_type") == "recommendation_shown"])
        
        acceptance_rate = len(recommendation_sessions) / total_recommendations if total_recommendations > 0 else 0
        
        # Analyze ratings of recommended activities
        rec_ratings = [s.get("rating") for s in recommendation_sessions if s.get("rating") is not None]
        avg_rec_rating = statistics.mean(rec_ratings) if rec_ratings else 0
        
        # Compare with non-recommended activities
        non_rec_sessions = [s for s in sessions if s.get("interaction_type") != "recommendation_accepted"]
        non_rec_ratings = [s.get("rating") for s in non_rec_sessions if s.get("rating") is not None]
        avg_non_rec_rating = statistics.mean(non_rec_ratings) if non_rec_ratings else 0
        
        return {
            "recommendation_acceptance_rate": acceptance_rate,
            "total_recommendations_shown": total_recommendations,
            "total_recommendations_accepted": len(recommendation_sessions),
            "average_recommended_rating": avg_rec_rating,
            "average_non_recommended_rating": avg_non_rec_rating,
            "recommendation_improvement": avg_rec_rating - avg_non_rec_rating if avg_rec_rating and avg_non_rec_rating else 0
        }
    
    def generate_insights(self, analytics: Dict[str, Any]) -> List[Dict[str, str]]:
        """Generate actionable insights from analytics"""
        insights = []
        
        # Activity insights
        activity_analytics = analytics.get("activity_analytics", {})
        most_popular = activity_analytics.get("most_popular_activities", [])
        
        if most_popular:
            top_activity, count = most_popular[0]
            insights.append({
                "type": "activity_preference",
                "title": "Favorite Activity Identified",
                "description": f"Your most popular activity is '{top_activity}' with {count} interactions.",
                "recommendation": "Consider exploring similar activities to diversify your routine."
            })
        
        # Temporal insights
        temporal_analytics = analytics.get("temporal_analytics", {})
        peak_day = temporal_analytics.get("peak_usage_day")
        peak_hour = temporal_analytics.get("peak_usage_hour")
        
        if peak_day and peak_hour:
            insights.append({
                "type": "temporal_pattern",
                "title": "Peak Usage Pattern",
                "description": f"You're most active on {peak_day} around {peak_hour}:00.",
                "recommendation": "Schedule important activities during your peak engagement times."
            })
        
        # Engagement insights
        engagement_analytics = analytics.get("engagement_analytics", {})
        engagement_score = engagement_analytics.get("engagement_score", 0)
        
        if engagement_score < 0.5:
            insights.append({
                "type": "engagement",
                "title": "Low Engagement Detected",
                "description": f"Your engagement score is {engagement_score:.2f}, indicating room for improvement.",
                "recommendation": "Try exploring new activity types or setting specific goals to increase engagement."
            })
        elif engagement_score > 0.8:
            insights.append({
                "type": "engagement",
                "title": "High Engagement Achieved",
                "description": f"Excellent engagement score of {engagement_score:.2f}!",
                "recommendation": "Keep up the great work! Consider sharing your approach with others."
            })
        
        # Preference insights
        preference_analytics = analytics.get("preference_analytics", {})
        alignment_score = preference_analytics.get("preference_alignment_score", 0)
        
        if alignment_score < 0.6:
            insights.append({
                "type": "preference_alignment",
                "title": "Preference Misalignment",
                "description": f"Only {alignment_score:.1%} of your activities match your stated preferences.",
                "recommendation": "Review your preferences or try activities that better align with your interests."
            })
        
        # Budget insights
        budget_util = preference_analytics.get("budget_utilization", {})
        utilization_rate = budget_util.get("budget_utilization_rate", 0)
        
        if utilization_rate < 0.3:
            insights.append({
                "type": "budget",
                "title": "Low Budget Utilization",
                "description": f"You're only using {utilization_rate:.1%} of your daily budget.",
                "recommendation": "Consider exploring higher-value activities or increasing your activity frequency."
            })
        elif utilization_rate > 0.9:
            insights.append({
                "type": "budget",
                "title": "High Budget Utilization",
                "description": f"You're using {utilization_rate:.1%} of your daily budget.",
                "recommendation": "Great budget utilization! Monitor for any overspending patterns."
            })
        
        return insights
    
    def export_analytics_report(self, analytics: Dict[str, Any], 
                              insights: List[Dict[str, str]], 
                              format: str = "json") -> str:
        """Export analytics report in specified format"""
        report = {
            "report_generated": datetime.now().isoformat(),
            "analytics": analytics,
            "insights": insights,
            "summary": {
                "total_interactions": analytics.get("total_interactions", 0),
                "engagement_score": analytics.get("engagement_analytics", {}).get("engagement_score", 0),
                "preference_alignment": analytics.get("preference_analytics", {}).get("preference_alignment_score", 0),
                "total_insights": len(insights)
            }
        }
        
        if format.lower() == "json":
            return json.dumps(report, indent=2)
        elif format.lower() == "markdown":
            return self._format_markdown_report(report)
        else:
            return str(report)
    
    def _format_markdown_report(self, report: Dict) -> str:
        """Format report as Markdown"""
        md = f"""# LifePlanner Analytics Report

**Generated:** {report['report_generated']}

## Summary
- **Total Interactions:** {report['summary']['total_interactions']}
- **Engagement Score:** {report['summary']['engagement_score']:.2f}/1.0
- **Preference Alignment:** {report['summary']['preference_alignment']:.1%}
- **Insights Generated:** {report['summary']['total_insights']}

## Key Insights
"""
        
        for insight in report['insights']:
            md += f"""
### {insight['title']}
**Type:** {insight['type']}

{insight['description']}

**Recommendation:** {insight['recommendation']}
"""
        
        return md

