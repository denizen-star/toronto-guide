#!/usr/bin/env python3
"""
Goal and Outcome Tracking Database
SQLite database for storing goals, completions, and outcome tracking
"""

import sqlite3
import json
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Tuple, Any
from pathlib import Path

from .outcome_system import GoalDefinition, ActionOutcomeMapping, OutcomeTrackingRecord, OutcomeDefinition
from .rating_system import ActivityPerformanceData, RatingResult

class GoalTrackingDatabase:
    """Database for tracking goals, completions, and outcomes"""
    
    def __init__(self, db_path: str = "data/goal_tracking.db"):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self.init_database()
    
    def init_database(self):
        """Initialize database tables"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Goals table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS goals (
                    goal_id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    category TEXT NOT NULL,
                    frequency TEXT NOT NULL,
                    duration_weeks INTEGER NOT NULL,
                    target_completion_rate REAL NOT NULL,
                    rating_weight REAL NOT NULL,
                    created_date TEXT NOT NULL,
                    is_active BOOLEAN DEFAULT 1,
                    actions_json TEXT NOT NULL,
                    success_metrics_json TEXT NOT NULL
                )
            """)
            
            # Daily completions table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS daily_completions (
                    completion_id TEXT PRIMARY KEY,
                    goal_id TEXT NOT NULL,
                    action_id TEXT NOT NULL,
                    completion_date TEXT NOT NULL,
                    completed BOOLEAN NOT NULL,
                    completion_time TEXT,
                    duration_minutes INTEGER,
                    effort_level INTEGER,
                    mood_before INTEGER,
                    mood_after INTEGER,
                    notes TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (goal_id) REFERENCES goals (goal_id)
                )
            """)
            
            # Outcome tracking table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS outcome_tracking (
                    record_id TEXT PRIMARY KEY,
                    goal_id TEXT NOT NULL,
                    action_id TEXT NOT NULL,
                    completion_date TEXT NOT NULL,
                    predicted_outcomes_json TEXT NOT NULL,
                    actual_outcomes_json TEXT,
                    user_rating INTEGER,
                    outcome_accuracy REAL,
                    notes TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (goal_id) REFERENCES goals (goal_id)
                )
            """)
            
            # Streaks table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS streaks (
                    streak_id TEXT PRIMARY KEY,
                    goal_id TEXT NOT NULL,
                    action_id TEXT NOT NULL,
                    current_streak INTEGER DEFAULT 0,
                    longest_streak INTEGER DEFAULT 0,
                    last_completion_date TEXT,
                    streak_milestones_json TEXT,
                    updated_at TEXT NOT NULL,
                    FOREIGN KEY (goal_id) REFERENCES goals (goal_id)
                )
            """)
            
            # Performance metrics table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS performance_metrics (
                    metric_id TEXT PRIMARY KEY,
                    goal_id TEXT NOT NULL,
                    action_id TEXT NOT NULL,
                    week_start_date TEXT NOT NULL,
                    completion_rate REAL NOT NULL,
                    consistency_score REAL NOT NULL,
                    average_effort REAL,
                    average_satisfaction REAL,
                    total_completions INTEGER,
                    rating_score REAL,
                    rating_grade TEXT,
                    created_at TEXT NOT NULL,
                    FOREIGN KEY (goal_id) REFERENCES goals (goal_id)
                )
            """)
            
            # Weekly reports table
            cursor.execute("""
                CREATE TABLE IF NOT EXISTS weekly_reports (
                    report_id TEXT PRIMARY KEY,
                    week_start_date TEXT NOT NULL,
                    week_end_date TEXT NOT NULL,
                    total_goals INTEGER,
                    total_completions INTEGER,
                    overall_completion_rate REAL,
                    overall_rating REAL,
                    achievements_json TEXT,
                    insights_json TEXT,
                    recommendations_json TEXT,
                    created_at TEXT NOT NULL
                )
            """)
            
            conn.commit()
    
    def add_goal(self, goal: GoalDefinition) -> bool:
        """Add a new goal to the database"""
        try:
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT INTO goals (
                        goal_id, name, category, frequency, duration_weeks,
                        target_completion_rate, rating_weight, created_date,
                        actions_json, success_metrics_json
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    goal.goal_id,
                    goal.name,
                    goal.category,
                    goal.frequency,
                    goal.duration_weeks,
                    goal.target_completion_rate,
                    goal.rating_weight,
                    goal.created_date.isoformat(),
                    json.dumps([self._serialize_action_mapping(action) for action in goal.actions]),
                    json.dumps(goal.success_metrics)
                ))
                
                # Initialize streaks for each action
                for action in goal.actions:
                    self._init_streak_record(goal.goal_id, action.action_id)
                
                conn.commit()
                return True
        except Exception as e:
            print(f"Error adding goal: {e}")
            return False
    
    def record_completion(
        self, 
        goal_id: str, 
        action_id: str, 
        completion_date: date,
        completed: bool,
        completion_time: Optional[datetime] = None,
        duration_minutes: Optional[int] = None,
        effort_level: Optional[int] = None,
        mood_before: Optional[int] = None,
        mood_after: Optional[int] = None,
        notes: Optional[str] = None
    ) -> bool:
        """Record a daily completion"""
        try:
            completion_id = f"{goal_id}_{action_id}_{completion_date.isoformat()}"
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                cursor.execute("""
                    INSERT OR REPLACE INTO daily_completions (
                        completion_id, goal_id, action_id, completion_date,
                        completed, completion_time, duration_minutes,
                        effort_level, mood_before, mood_after, notes, created_at
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    completion_id,
                    goal_id,
                    action_id,
                    completion_date.isoformat(),
                    completed,
                    completion_time.isoformat() if completion_time else None,
                    duration_minutes,
                    effort_level,
                    mood_before,
                    mood_after,
                    notes,
                    datetime.now().isoformat()
                ))
                
                # Update streak
                if completed:
                    self._update_streak(goal_id, action_id, completion_date)
                else:
                    self._break_streak(goal_id, action_id, completion_date)
                
                conn.commit()
                return True
        except Exception as e:
            print(f"Error recording completion: {e}")
            return False
    
    def get_performance_data(self, goal_id: str, action_id: str, weeks_back: int = 8) -> Optional[ActivityPerformanceData]:
        """Get performance data for rating calculations"""
        try:
            end_date = date.today()
            start_date = end_date - timedelta(weeks=weeks_back)
            
            with sqlite3.connect(self.db_path) as conn:
                cursor = conn.cursor()
                
                # Get completions in date range
                cursor.execute("""
                    SELECT completed, effort_level, mood_after, completion_date
                    FROM daily_completions
                    WHERE goal_id = ? AND action_id = ? 
                    AND completion_date BETWEEN ? AND ?
                    ORDER BY completion_date
                """, (goal_id, action_id, start_date.isoformat(), end_date.isoformat()))
                
                completions = cursor.fetchall()
                if not completions:
                    return None
                
                # Calculate metrics
                total_days = (end_date - start_date).days
                completed_count = sum(1 for c in completions if c[0])
                completion_rate = completed_count / len(completions) if completions else 0
                
                # Calculate consistency (how evenly distributed completions are)
                consistency_score = self._calculate_consistency(completions, start_date, end_date)
                
                # Get current streak
                cursor.execute("""
                    SELECT current_streak FROM streaks
                    WHERE goal_id = ? AND action_id = ?
                """, (goal_id, action_id))
                
                streak_result = cursor.fetchone()
                current_streak = streak_result[0] if streak_result else 0
                
                # Calculate average satisfaction
                satisfactions = [c[2] for c in completions if c[2] is not None]
                avg_satisfaction = sum(satisfactions) / len(satisfactions) if satisfactions else 3.0
                
                # Get goal info for frequency
                cursor.execute("""
                    SELECT frequency, actions_json FROM goals WHERE goal_id = ?
                """, (goal_id,))
                
                goal_result = cursor.fetchone()
                if not goal_result:
                    return None
                
                frequency = goal_result[0]
                
                return ActivityPerformanceData(
                    action_id=action_id,
                    frequency=frequency,
                    duration_minutes=self._get_action_duration(goal_result[1], action_id),
                    completion_rate=completion_rate,
                    current_streak=current_streak,
                    total_completions=completed_count,
                    consistency_score=consistency_score,
                    user_satisfaction=avg_satisfaction,
                    weeks_active=weeks_back
                )
                
        except Exception as e:
            print(f"Error getting performance data: {e}")
            return None
    
    def get_weekly_summary(self, week_start: date) -> Dict[str, Any]:
        """Get weekly summary for analytics"""
        week_end = week_start + timedelta(days=6)
        
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Get all completions for the week
            cursor.execute("""
                SELECT g.name, g.category, dc.action_id, dc.completed, dc.effort_level, dc.mood_after
                FROM daily_completions dc
                JOIN goals g ON dc.goal_id = g.goal_id
                WHERE dc.completion_date BETWEEN ? AND ?
            """, (week_start.isoformat(), week_end.isoformat()))
            
            completions = cursor.fetchall()
            
            # Calculate summary metrics
            total_activities = len(completions)
            completed_activities = sum(1 for c in completions if c[3])  # c[3] is completed
            completion_rate = completed_activities / total_activities if total_activities > 0 else 0
            
            # Group by category
            category_stats = {}
            for completion in completions:
                category = completion[1]
                if category not in category_stats:
                    category_stats[category] = {"total": 0, "completed": 0}
                category_stats[category]["total"] += 1
                if completion[3]:  # completed
                    category_stats[category]["completed"] += 1
            
            return {
                "week_start": week_start.isoformat(),
                "week_end": week_end.isoformat(),
                "total_activities": total_activities,
                "completed_activities": completed_activities,
                "completion_rate": completion_rate,
                "category_breakdown": category_stats,
                "average_effort": self._calculate_average([c[4] for c in completions if c[4]]),
                "average_satisfaction": self._calculate_average([c[5] for c in completions if c[5]])
            }
    
    def _init_streak_record(self, goal_id: str, action_id: str):
        """Initialize streak record for an action"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                INSERT OR IGNORE INTO streaks (
                    streak_id, goal_id, action_id, current_streak, longest_streak,
                    streak_milestones_json, updated_at
                ) VALUES (?, ?, ?, 0, 0, ?, ?)
            """, (
                f"{goal_id}_{action_id}",
                goal_id,
                action_id,
                json.dumps([]),
                datetime.now().isoformat()
            ))
            conn.commit()
    
    def _update_streak(self, goal_id: str, action_id: str, completion_date: date):
        """Update streak for completed activity"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            
            # Get current streak info
            cursor.execute("""
                SELECT current_streak, longest_streak, last_completion_date
                FROM streaks WHERE goal_id = ? AND action_id = ?
            """, (goal_id, action_id))
            
            result = cursor.fetchone()
            if not result:
                return
            
            current_streak, longest_streak, last_completion = result
            
            # Check if this extends the streak
            if last_completion:
                last_date = date.fromisoformat(last_completion)
                days_diff = (completion_date - last_date).days
                
                if days_diff == 1:  # Consecutive day
                    current_streak += 1
                elif days_diff == 0:  # Same day (update)
                    pass  # Keep current streak
                else:  # Gap in streak
                    current_streak = 1
            else:
                current_streak = 1
            
            # Update longest streak if needed
            longest_streak = max(longest_streak, current_streak)
            
            cursor.execute("""
                UPDATE streaks 
                SET current_streak = ?, longest_streak = ?, 
                    last_completion_date = ?, updated_at = ?
                WHERE goal_id = ? AND action_id = ?
            """, (
                current_streak, longest_streak,
                completion_date.isoformat(),
                datetime.now().isoformat(),
                goal_id, action_id
            ))
            conn.commit()
    
    def _break_streak(self, goal_id: str, action_id: str, completion_date: date):
        """Break streak for missed activity"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("""
                UPDATE streaks 
                SET current_streak = 0, updated_at = ?
                WHERE goal_id = ? AND action_id = ?
            """, (datetime.now().isoformat(), goal_id, action_id))
            conn.commit()
    
    def _calculate_consistency(self, completions: List[Tuple], start_date: date, end_date: date) -> float:
        """Calculate consistency score based on completion distribution"""
        if not completions:
            return 0.0
        
        # Create daily completion map
        total_days = (end_date - start_date).days + 1
        daily_completions = {start_date + timedelta(days=i): False for i in range(total_days)}
        
        for completion in completions:
            if completion[0]:  # completed
                comp_date = date.fromisoformat(completion[3])
                daily_completions[comp_date] = True
        
        # Calculate gaps between completions
        completed_dates = [d for d, completed in daily_completions.items() if completed]
        if len(completed_dates) < 2:
            return 1.0 if completed_dates else 0.0
        
        # Measure consistency by gap variance
        gaps = []
        for i in range(1, len(completed_dates)):
            gap = (completed_dates[i] - completed_dates[i-1]).days
            gaps.append(gap)
        
        if not gaps:
            return 1.0
        
        # Lower variance = higher consistency
        avg_gap = sum(gaps) / len(gaps)
        variance = sum((gap - avg_gap) ** 2 for gap in gaps) / len(gaps)
        consistency = max(0.0, 1.0 - (variance / (avg_gap ** 2)) if avg_gap > 0 else 0.0)
        
        return min(consistency, 1.0)
    
    def _get_action_duration(self, actions_json: str, action_id: str) -> int:
        """Extract duration for specific action from JSON"""
        try:
            actions = json.loads(actions_json)
            for action in actions:
                if action.get("action_id") == action_id:
                    return action.get("duration_minutes", 0)
            return 0
        except:
            return 0
    
    def _calculate_average(self, values: List[Optional[float]]) -> float:
        """Calculate average of non-null values"""
        valid_values = [v for v in values if v is not None]
        return sum(valid_values) / len(valid_values) if valid_values else 0.0
    
    def _serialize_action_mapping(self, action: ActionOutcomeMapping) -> Dict[str, Any]:
        """Serialize ActionOutcomeMapping to JSON-compatible dict"""
        return {
            "action_id": action.action_id,
            "action_name": action.action_name,
            "frequency": action.frequency,
            "duration_minutes": action.duration_minutes,
            "evidence_strength": action.evidence_strength,
            "compound_effects": action.compound_effects,
            "primary_outcomes": [self._serialize_outcome(outcome) for outcome in action.primary_outcomes],
            "secondary_outcomes": [self._serialize_outcome(outcome) for outcome in action.secondary_outcomes]
        }
    
    def _serialize_outcome(self, outcome: OutcomeDefinition) -> Dict[str, Any]:
        """Serialize OutcomeDefinition to JSON-compatible dict"""
        return {
            "outcome_id": outcome.outcome_id,
            "name": outcome.name,
            "description": outcome.description,
            "category": outcome.category,
            "measurement_type": outcome.measurement_type,
            "research_evidence": outcome.research_evidence,
            "time_to_manifest": outcome.time_to_manifest,
            "probability": outcome.probability,
            "impact_score": outcome.impact_score
        }

if __name__ == "__main__":
    # Test the database
    db = GoalTrackingDatabase("test_goals.db")
    
    # Test adding a goal
    from outcome_system import ResearchBackedOutcomeDatabase, GoalDefinition
    
    outcome_db = ResearchBackedOutcomeDatabase()
    meditation_action = outcome_db.get_action_outcomes("progressive_meditation")
    
    if meditation_action:
        test_goal = GoalDefinition(
            goal_id="daily_meditation_goal",
            name="Daily Progressive Meditation",
            category="mindfulness",
            frequency="daily",
            duration_weeks=12,
            target_completion_rate=0.90,
            actions=[meditation_action],
            success_metrics=["Stress reduction", "Focus improvement", "Consistency"],
            rating_weight=1.0
        )
        
        success = db.add_goal(test_goal)
        print(f"Goal added: {success}")
        
        # Test recording completions
        today = date.today()
        for i in range(7):
            completion_date = today - timedelta(days=i)
            success = db.record_completion(
                goal_id="daily_meditation_goal",
                action_id="progressive_meditation",
                completion_date=completion_date,
                completed=True,
                effort_level=4,
                mood_after=4,
                notes=f"Day {i+1} meditation completed"
            )
            print(f"Completion recorded for {completion_date}: {success}")
        
        # Test getting performance data
        perf_data = db.get_performance_data("daily_meditation_goal", "progressive_meditation")
        if perf_data:
            print(f"\nPerformance Data:")
            print(f"Completion Rate: {perf_data.completion_rate:.1%}")
            print(f"Current Streak: {perf_data.current_streak} days")
            print(f"Consistency Score: {perf_data.consistency_score:.2f}")
        
        # Test weekly summary
        week_summary = db.get_weekly_summary(today - timedelta(days=6))
        print(f"\nWeekly Summary:")
        print(f"Completion Rate: {week_summary['completion_rate']:.1%}")
        print(f"Total Activities: {week_summary['total_activities']}")
