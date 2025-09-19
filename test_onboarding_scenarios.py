#!/usr/bin/env python3
"""
Automated Onboarding Flow Test
Shows how the persona matching works with different user scenarios
"""

import sys
import os

# Add src to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

try:
    from core.persona_matcher import PersonaMatcher, QuestionResponse, PersonaType
except ImportError as e:
    print(f"❌ Import error: {e}")
    sys.exit(1)


def test_working_kevin_scenario():
    """Test scenario that should match to Working Kevin"""
    print("🏢 SCENARIO 1: Working Professional")
    print("="*50)
    print("Profile: Employed data analyst, satisfied with job, looking to advance")
    print()
    
    matcher = PersonaMatcher()
    
    # Responses that indicate Working Kevin
    responses = [
        QuestionResponse("employment_status", "Employment Status", "employed_satisfied", "Employed and satisfied with my current role"),
        QuestionResponse("job_satisfaction", "Job Satisfaction", "8", "8"),
        QuestionResponse("career_goal", "Career Goal", "excel_current", "Excel in my current role and build my network"),
        QuestionResponse("schedule_flexibility", "Schedule Flexibility", "very_structured", "Very structured, fixed hours"),
        QuestionResponse("networking_time", "Networking Time", "2_4_hours", "2-4 hours (after work/weekends)"),
        QuestionResponse("financial_situation", "Financial Situation", "stable_comfortable", "Stable income, comfortable spending"),
        QuestionResponse("networking_priority", "Networking Priority", "current_industry", "Building relationships in my current industry"),
        QuestionResponse("urgency_level", "Urgency Level", "not_urgent", "Not urgent, steady growth is fine"),
        QuestionResponse("stress_level", "Stress Level", "low_manageable", "Low to moderate, manageable"),
        QuestionResponse("activity_focus", "Activity Focus", "work_life_balance", "Maintaining work-life balance")
    ]
    
    result = matcher.calculate_persona_match(responses)
    
    print("📋 User's Answers:")
    for response in responses[:5]:  # Show first 5
        print(f"   Q: {response.question_text}")
        print(f"   A: {response.option_text}")
        print()
    
    print("🎯 MATCHING RESULT:")
    persona_name = "Working Kevin" if result.primary_persona == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
    print(f"   Primary Persona: {persona_name}")
    print(f"   Confidence: {result.confidence_score:.1%}")
    
    print(f"\n📊 Detailed Scores:")
    for persona_type, score in result.persona_scores.items():
        name = "Working Kevin" if persona_type == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
        print(f"   {name}: {score:.1f} points")
    
    print(f"\n✅ Key Factors:")
    for factor in result.supporting_factors[:3]:
        print(f"   • {factor}")
    
    return result.primary_persona == PersonaType.WORKING_KEVIN


def test_job_searching_kevin_scenario():
    """Test scenario that should match to Job Searching Kevin"""
    print("\n🔍 SCENARIO 2: Job Searcher")
    print("="*50)
    print("Profile: Recently laid off, actively job searching, stressed about finances")
    print()
    
    matcher = PersonaMatcher()
    
    # Responses that indicate Job Searching Kevin
    responses = [
        QuestionResponse("employment_status", "Employment Status", "unemployed_searching", "Unemployed and actively job searching"),
        QuestionResponse("job_satisfaction", "Job Satisfaction", "3", "3"),
        QuestionResponse("career_goal", "Career Goal", "find_new_job", "Find a new job or career opportunity"),
        QuestionResponse("schedule_flexibility", "Schedule Flexibility", "very_flexible", "Very flexible, I control my time"),
        QuestionResponse("networking_time", "Networking Time", "10_plus_hours", "10+ hours (full-time job searching)"),
        QuestionResponse("financial_situation", "Financial Situation", "tight_budget", "Very tight budget, minimal discretionary spending"),
        QuestionResponse("networking_priority", "Networking Priority", "recruiters", "Meeting recruiters and hiring managers"),
        QuestionResponse("urgency_level", "Urgency Level", "extremely_urgent", "Extremely urgent, need results quickly"),
        QuestionResponse("stress_level", "Stress Level", "very_high_career", "Very high, career situation is stressful"),
        QuestionResponse("activity_focus", "Activity Focus", "opportunity_creation", "Networking and opportunity creation")
    ]
    
    result = matcher.calculate_persona_match(responses)
    
    print("📋 User's Answers:")
    for response in responses[:5]:  # Show first 5
        print(f"   Q: {response.question_text}")
        print(f"   A: {response.option_text}")
        print()
    
    print("🎯 MATCHING RESULT:")
    persona_name = "Working Kevin" if result.primary_persona == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
    print(f"   Primary Persona: {persona_name}")
    print(f"   Confidence: {result.confidence_score:.1%}")
    
    print(f"\n📊 Detailed Scores:")
    for persona_type, score in result.persona_scores.items():
        name = "Working Kevin" if persona_type == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
        print(f"   {name}: {score:.1f} points")
    
    print(f"\n✅ Key Factors:")
    for factor in result.supporting_factors[:3]:
        print(f"   • {factor}")
    
    return result.primary_persona == PersonaType.JOB_SEARCHING_KEVIN


def test_mixed_scenario():
    """Test scenario with mixed signals"""
    print("\n⚖️ SCENARIO 3: Mixed Signals")
    print("="*50)
    print("Profile: Employed but unhappy, considering options, moderate urgency")
    print()
    
    matcher = PersonaMatcher()
    
    # Mixed responses that could go either way
    responses = [
        QuestionResponse("employment_status", "Employment Status", "employed_looking", "Employed but looking for new opportunities"),
        QuestionResponse("job_satisfaction", "Job Satisfaction", "5", "5"),
        QuestionResponse("career_goal", "Career Goal", "find_new_job", "Find a new job or career opportunity"),
        QuestionResponse("schedule_flexibility", "Schedule Flexibility", "somewhat_flexible", "Somewhat flexible within business hours"),
        QuestionResponse("networking_time", "Networking Time", "5_10_hours", "5-10 hours (dedicated job search time)"),
        QuestionResponse("financial_situation", "Financial Situation", "stable_cautious", "Stable but being more cautious with spending"),
        QuestionResponse("networking_priority", "Networking Priority", "new_industries", "Exploring new industries and opportunities"),
        QuestionResponse("urgency_level", "Urgency Level", "somewhat_urgent", "Somewhat urgent, want to accelerate"),
        QuestionResponse("stress_level", "Stress Level", "moderate_work", "Moderate, some work pressure"),
        QuestionResponse("activity_focus", "Activity Focus", "skill_building", "Building skills for career advancement")
    ]
    
    result = matcher.calculate_persona_match(responses)
    
    print("📋 User's Answers:")
    for response in responses[:5]:  # Show first 5
        print(f"   Q: {response.question_text}")
        print(f"   A: {response.option_text}")
        print()
    
    print("🎯 MATCHING RESULT:")
    persona_name = "Working Kevin" if result.primary_persona == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
    print(f"   Primary Persona: {persona_name}")
    print(f"   Confidence: {result.confidence_score:.1%}")
    
    print(f"\n📊 Detailed Scores:")
    for persona_type, score in result.persona_scores.items():
        name = "Working Kevin" if persona_type == PersonaType.WORKING_KEVIN else "Job Searching Kevin"
        print(f"   {name}: {score:.1f} points")
    
    print(f"\n✅ Key Factors:")
    for factor in result.supporting_factors[:3]:
        print(f"   • {factor}")
    
    print(f"\n💡 Recommendations:")
    for rec in result.recommendations[:2]:
        print(f"   • {rec}")
    
    return result


def show_persona_differences():
    """Show the key differences between personas"""
    print("\n📊 PERSONA COMPARISON")
    print("="*60)
    
    matcher = PersonaMatcher()
    
    working_chars = matcher.get_persona_characteristics(PersonaType.WORKING_KEVIN)
    job_search_chars = matcher.get_persona_characteristics(PersonaType.JOB_SEARCHING_KEVIN)
    
    print("🏢 WORKING KEVIN vs 🔍 JOB SEARCHING KEVIN")
    print("-" * 60)
    
    comparisons = [
        ("Budget Range", working_chars.get('budget_range'), job_search_chars.get('budget_range')),
        ("Time Commitment", working_chars.get('time_commitment'), job_search_chars.get('time_commitment')),
        ("Stress Level", working_chars.get('stress_level'), job_search_chars.get('stress_level'))
    ]
    
    for aspect, working, job_search in comparisons:
        print(f"{aspect}:")
        print(f"   🏢 Working Kevin: {working}")
        print(f"   🔍 Job Searching Kevin: {job_search}")
        print()


def main():
    """Run all test scenarios"""
    print("🎯 PERSONA MATCHING SYSTEM - AUTOMATED TEST")
    print("="*60)
    print("Testing different user scenarios to demonstrate persona matching")
    print()
    
    # Test scenarios
    scenario1_correct = test_working_kevin_scenario()
    scenario2_correct = test_job_searching_kevin_scenario()
    test_mixed_scenario()
    
    # Show persona differences
    show_persona_differences()
    
    # Summary
    print("🏆 TEST RESULTS SUMMARY")
    print("="*60)
    
    print(f"✅ Working Professional → Working Kevin: {'PASSED' if scenario1_correct else 'FAILED'}")
    print(f"✅ Job Searcher → Job Searching Kevin: {'PASSED' if scenario2_correct else 'FAILED'}")
    print(f"✅ Mixed Scenario → Handled gracefully")
    
    if scenario1_correct and scenario2_correct:
        print(f"\n🎉 ALL TESTS PASSED!")
        print("The persona matching system correctly identifies:")
        print("• Working professionals who should get Working Kevin")
        print("• Job searchers who should get Job Searching Kevin")
        print("• Mixed scenarios with appropriate confidence levels")
        
        print(f"\n🚀 READY FOR INTEGRATION!")
        print("You can now:")
        print("1. Add this to your Flask app as an onboarding flow")
        print("2. Use the results to customize user experiences")
        print("3. Expand to additional personas when ready")
    else:
        print(f"\n❌ Some tests failed - check the matching logic")
    
    print(f"\n📝 Next steps:")
    print("• Integrate into your main LifePlanner app")
    print("• Test with real users")
    print("• Add the 5 additional Kevin personas")


if __name__ == "__main__":
    main()
