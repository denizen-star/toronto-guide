#!/usr/bin/env python3
"""
Interactive Onboarding Flow Demo
Test the persona matching system with real user input
"""

import sys
import os
from datetime import datetime

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from core.persona_matcher import PersonaMatcher, QuestionResponse, PersonaType
except ImportError as e:
    print(f"❌ Import error: {e}")
    print("Make sure you're running this from the LifePlanner root directory")
    sys.exit(1)


class OnboardingFlowDemo:
    """Interactive demo of the onboarding questionnaire"""
    
    def __init__(self):
        self.matcher = PersonaMatcher()
        self.responses = []
        self.user_answers = {}
    
    def run_interactive_onboarding(self):
        """Run the complete interactive onboarding flow"""
        print("🎯 LifePlanner Persona Matching - Interactive Demo")
        print("=" * 60)
        print()
        
        print("Welcome! I'll ask you 10 questions to find your perfect persona match.")
        print("Answer honestly based on your current situation.")
        print()
        
        input("Press Enter to begin... ")
        print()
        
        # Get questions from matcher
        questions = self.matcher.get_questions()
        
        # Ask each question
        for i, question in enumerate(questions, 1):
            print(f"\n{'='*60}")
            print(f"Question {i} of {len(questions)}")
            print(f"{'='*60}")
            
            response = self.ask_question(question)
            if response:
                self.responses.append(response)
                self.user_answers[question['id']] = response.selected_option
        
        # Calculate and display results
        self.show_results()
    
    def ask_question(self, question):
        """Ask a single question and get user response"""
        print(f"\n📋 {question['text']}")
        print("-" * 50)
        
        if question['type'] == 'single_choice':
            return self.ask_multiple_choice(question)
        elif question['type'] == 'scale':
            return self.ask_scale_question(question)
        else:
            print(f"❌ Unknown question type: {question['type']}")
            return None
    
    def ask_multiple_choice(self, question):
        """Handle multiple choice questions"""
        options = question['options']
        
        # Display options
        for i, option in enumerate(options, 1):
            print(f"  {i}. {option['text']}")
        
        # Get user choice
        while True:
            try:
                print()
                choice = input(f"Enter your choice (1-{len(options)}): ").strip()
                choice_num = int(choice)
                
                if 1 <= choice_num <= len(options):
                    selected_option = options[choice_num - 1]
                    
                    print(f"✅ You selected: {selected_option['text']}")
                    
                    return QuestionResponse(
                        question_id=question['id'],
                        question_text=question['text'],
                        selected_option=selected_option['id'],
                        option_text=selected_option['text']
                    )
                else:
                    print(f"❌ Please enter a number between 1 and {len(options)}")
                    
            except ValueError:
                print("❌ Please enter a valid number")
    
    def ask_scale_question(self, question):
        """Handle scale questions (1-10)"""
        scale_range = question.get('scale_range', [1, 10])
        min_val, max_val = scale_range
        
        print(f"  Rate from {min_val} (Very Low) to {max_val} (Very High)")
        
        while True:
            try:
                print()
                choice = input(f"Enter your rating ({min_val}-{max_val}): ").strip()
                rating = int(choice)
                
                if min_val <= rating <= max_val:
                    print(f"✅ You rated: {rating}/{max_val}")
                    
                    return QuestionResponse(
                        question_id=question['id'],
                        question_text=question['text'],
                        selected_option=str(rating),
                        option_text=f"{rating}/{max_val}"
                    )
                else:
                    print(f"❌ Please enter a number between {min_val} and {max_val}")
                    
            except ValueError:
                print("❌ Please enter a valid number")
    
    def show_results(self):
        """Calculate and display persona matching results"""
        print("\n" + "="*60)
        print("🧮 CALCULATING YOUR PERSONA MATCH...")
        print("="*60)
        
        # Simulate processing time
        import time
        for i in range(3):
            print("⏳ Analyzing responses" + "." * (i + 1))
            time.sleep(0.5)
        
        # Calculate match
        result = self.matcher.calculate_persona_match(self.responses)
        
        # Display results
        print("\n" + "🎉" * 20)
        print("YOUR PERSONA MATCH RESULTS")
        print("🎉" * 20)
        
        # Primary persona
        persona_name = "Working Kevin" if result.primary_persona == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
        confidence_percent = int(result.confidence_score * 100)
        
        print(f"\n🎯 PRIMARY PERSONA: {persona_name}")
        print(f"📊 CONFIDENCE SCORE: {confidence_percent}%")
        print(f"📝 DESCRIPTION: {self.get_persona_description(result.primary_persona)}")
        
        # Detailed scores
        print(f"\n📈 DETAILED SCORES:")
        for persona_type, score in result.persona_scores.items():
            name = "Working Kevin" if persona_type == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
            print(f"   {name}: {score:.1f} points")
        
        # Supporting factors
        if result.supporting_factors:
            print(f"\n✅ KEY SUPPORTING FACTORS:")
            for factor in result.supporting_factors[:5]:  # Show top 5
                print(f"   • {factor}")
        
        # Characteristics
        characteristics = self.matcher.get_persona_characteristics(result.primary_persona)
        if characteristics:
            print(f"\n📋 YOUR PERSONA CHARACTERISTICS:")
            print(f"   💰 Budget Range: {characteristics.get('budget_range', 'N/A')}")
            print(f"   ⏰ Time Commitment: {characteristics.get('time_commitment', 'N/A')}")
            print(f"   😰 Stress Level: {characteristics.get('stress_level', 'N/A')}")
            
            if 'primary_goals' in characteristics:
                print(f"   🎯 Primary Goals:")
                for goal in characteristics['primary_goals'][:3]:
                    print(f"      • {goal}")
        
        # Recommendations
        if result.recommendations:
            print(f"\n💡 PERSONALIZED RECOMMENDATIONS:")
            for i, rec in enumerate(result.recommendations, 1):
                print(f"   {i}. {rec}")
        
        # Summary
        print(f"\n" + "="*60)
        print("SUMMARY")
        print("="*60)
        
        if result.primary_persona == PersonaType.WORKING_KEVIN:
            print("🏢 You're a WORKING PROFESSIONAL focused on strategic career growth.")
            print("   Your LifePlanner will emphasize:")
            print("   • Industry networking events and professional development")
            print("   • Work-life balance activities")
            print("   • Strategic relationship building")
            print("   • Moderate budget activities ($150-200/day)")
        else:
            print("🔍 You're in CAREER TRANSITION mode focused on new opportunities.")
            print("   Your LifePlanner will emphasize:")
            print("   • Job search networking and informational interviews")
            print("   • Stress management and positive activities")
            print("   • Budget-conscious networking ($50-100/day)")
            print("   • High-impact opportunity creation")
        
        print(f"\n🚀 Ready to start planning with your {persona_name} persona!")
        
        # Ask what to do next
        print(f"\n" + "="*60)
        self.ask_next_steps(result)
    
    def get_persona_description(self, persona_type):
        """Get description for persona type"""
        if persona_type == PersonaType.WORKING_KEVIN:
            return "Employed professional focused on career advancement and strategic networking"
        else:
            return "Professional in career transition focused on finding new opportunities"
    
    def ask_next_steps(self, result):
        """Ask user what they want to do next"""
        print("What would you like to do next?")
        print("1. View detailed persona characteristics")
        print("2. See sample activities for your persona")
        print("3. Retake the assessment")
        print("4. Save results and continue to LifePlanner")
        print("5. Exit")
        
        while True:
            try:
                choice = input("\nEnter your choice (1-5): ").strip()
                choice_num = int(choice)
                
                if choice_num == 1:
                    self.show_detailed_characteristics(result.primary_persona)
                    break
                elif choice_num == 2:
                    self.show_sample_activities(result.primary_persona)
                    break
                elif choice_num == 3:
                    print("\n🔄 Restarting assessment...")
                    self.responses = []
                    self.user_answers = {}
                    self.run_interactive_onboarding()
                    break
                elif choice_num == 4:
                    self.save_results(result)
                    break
                elif choice_num == 5:
                    print("\n👋 Thanks for trying the persona matcher!")
                    break
                else:
                    print("❌ Please enter a number between 1 and 5")
                    
            except ValueError:
                print("❌ Please enter a valid number")
    
    def show_detailed_characteristics(self, persona_type):
        """Show detailed characteristics for the persona"""
        characteristics = self.matcher.get_persona_characteristics(persona_type)
        
        print(f"\n📊 DETAILED CHARACTERISTICS")
        print("="*50)
        
        for key, value in characteristics.items():
            if key == 'key_traits':
                print(f"\n🔑 Key Traits:")
                for trait in value:
                    print(f"   • {trait}")
            elif key == 'typical_activities':
                print(f"\n🎯 Typical Activities:")
                for activity in value:
                    print(f"   • {activity}")
            elif key == 'primary_goals':
                print(f"\n🏆 Primary Goals:")
                for goal in value:
                    print(f"   • {goal}")
            elif isinstance(value, str):
                print(f"\n{key.replace('_', ' ').title()}: {value}")
    
    def show_sample_activities(self, persona_type):
        """Show sample activities for the persona"""
        print(f"\n🎯 SAMPLE ACTIVITIES FOR YOUR PERSONA")
        print("="*50)
        
        if persona_type == PersonaType.WORKING_KEVIN:
            activities = [
                "🏢 Toronto Data Science Meetup (Tuesday 6:30 PM)",
                "☕ Professional breakfast networking (Friday 8:00 AM)",
                "🎓 Industry workshop: 'Advanced Analytics' (Saturday 2:00 PM)",
                "🤝 After-work networking mixer (Thursday 6:00 PM)",
                "📚 Skill-building course: 'Leadership Development' (Online)",
                "🍽️ Industry dinner with colleagues (Monthly)",
                "🏃 Running club with professionals (Sunday morning)",
                "🎨 Cultural event: AGO exhibition (Weekend)"
            ]
        else:
            activities = [
                "🔍 Job search networking event (Wednesday 6:00 PM)",
                "☕ Informational interview with industry contact",
                "📝 Career transition workshop (Saturday 10:00 AM)",
                "🤝 Recruiter meetup and coffee chat",
                "💼 LinkedIn networking strategy session",
                "🧘 Stress management yoga class (Tuesday 7:00 PM)",
                "📚 Resume and interview prep workshop",
                "🎯 Career coaching session (Bi-weekly)"
            ]
        
        for activity in activities:
            print(f"   {activity}")
        
        print(f"\n💡 These activities are tailored to your persona's goals and constraints!")
    
    def save_results(self, result):
        """Save results to file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"persona_match_result_{timestamp}.json"
        
        # Create results data
        results_data = {
            "timestamp": timestamp,
            "primary_persona": result.primary_persona.value,
            "confidence_score": result.confidence_score,
            "persona_scores": {k.value: v for k, v in result.persona_scores.items()},
            "supporting_factors": result.supporting_factors,
            "recommendations": result.recommendations,
            "user_responses": self.user_answers
        }
        
        try:
            import json
            with open(filename, 'w') as f:
                json.dump(results_data, f, indent=2)
            
            print(f"\n✅ Results saved to: {filename}")
            print("🚀 You can now integrate these results into your LifePlanner!")
            
        except Exception as e:
            print(f"❌ Error saving results: {e}")
            print("Results displayed above can be used manually.")


def run_quick_demo():
    """Run a quick demo with pre-selected answers"""
    print("🚀 Quick Demo - Working Kevin Scenario")
    print("="*50)
    
    matcher = PersonaMatcher()
    
    # Simulate Working Kevin responses
    demo_responses = [
        QuestionResponse("employment_status", "Employment Status", "employed_satisfied", "Employed and satisfied"),
        QuestionResponse("job_satisfaction", "Job Satisfaction", "8", "8/10"),
        QuestionResponse("career_goal", "Career Goal", "excel_current", "Excel in current role"),
        QuestionResponse("schedule_flexibility", "Schedule", "very_structured", "Very structured"),
        QuestionResponse("networking_time", "Networking Time", "2_4_hours", "2-4 hours per week"),
        QuestionResponse("financial_situation", "Financial", "stable_comfortable", "Stable and comfortable")
    ]
    
    result = matcher.calculate_persona_match(demo_responses)
    
    persona_name = "Working Kevin" if result.primary_persona == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
    print(f"✅ Demo Result: {persona_name} ({int(result.confidence_score * 100)}% confidence)")
    print(f"📊 Scores: Working Kevin: {result.persona_scores.get(PersonaType.WORKING_KEVIN, 0):.1f}")
    
    print("\n🚀 Full interactive demo starting in 3 seconds...")
    import time
    time.sleep(3)


def main():
    """Main function"""
    print("Choose demo mode:")
    print("1. Interactive onboarding (full experience)")
    print("2. Quick demo (pre-filled answers)")
    
    while True:
        try:
            choice = input("\nEnter choice (1-2): ").strip()
            if choice == "1":
                demo = OnboardingFlowDemo()
                demo.run_interactive_onboarding()
                break
            elif choice == "2":
                run_quick_demo()
                demo = OnboardingFlowDemo()
                demo.run_interactive_onboarding()
                break
            else:
                print("Please enter 1 or 2")
        except KeyboardInterrupt:
            print("\n\n👋 Demo cancelled. Thanks for trying the persona matcher!")
            break
        except Exception as e:
            print(f"❌ Error: {e}")
            break


if __name__ == "__main__":
    main()
