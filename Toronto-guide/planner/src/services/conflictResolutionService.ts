import { ScheduleItem } from '../types';

export interface ConflictResolution {
  hasConflicts: boolean;
  conflicts: Conflict[];
  resolvedSchedule: ScheduleItem[];
  resolutionLog: string[];
}

export interface Conflict {
  id: string;
  type: 'time_overlap' | 'travel_time' | 'energy_conflict' | 'budget_conflict';
  severity: 'low' | 'medium' | 'high';
  activities: ScheduleItem[];
  description: string;
  suggestedResolution: string;
}

export class ConflictResolutionService {
  private static readonly TIME_BUFFER_MINUTES = 15;
  private static readonly TRAVEL_TIME_BUFFER = 30; // minutes

  static resolveScheduleConflicts(schedule: ScheduleItem[]): ConflictResolution {
    const conflicts: Conflict[] = [];
    const resolutionLog: string[] = [];
    let resolvedSchedule = [...schedule];

    // Sort activities by start time
    resolvedSchedule.sort((a, b) => 
      this.timeToMinutes(a.start_time) - this.timeToMinutes(b.start_time)
    );

    // 1. Detect time overlaps
    const timeConflicts = this.detectTimeOverlaps(resolvedSchedule);
    conflicts.push(...timeConflicts);

    // 2. Resolve time conflicts
    if (timeConflicts.length > 0) {
      const { resolved, log } = this.resolveTimeConflicts(resolvedSchedule, timeConflicts);
      resolvedSchedule = resolved;
      resolutionLog.push(...log);
    }

    // 3. Check travel time feasibility
    const travelConflicts = this.detectTravelTimeConflicts(resolvedSchedule);
    conflicts.push(...travelConflicts);

    // 4. Check energy level flow
    const energyConflicts = this.detectEnergyConflicts(resolvedSchedule);
    conflicts.push(...energyConflicts);

    // 5. Check budget constraints
    const budgetConflicts = this.detectBudgetConflicts(resolvedSchedule);
    conflicts.push(...budgetConflicts);

    return {
      hasConflicts: conflicts.length > 0,
      conflicts,
      resolvedSchedule,
      resolutionLog
    };
  }

  private static detectTimeOverlaps(schedule: ScheduleItem[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i];
      const next = schedule[i + 1];
      
      const currentEnd = this.timeToMinutes(current.end_time);
      const nextStart = this.timeToMinutes(next.start_time);
      
      if (currentEnd > nextStart) {
        conflicts.push({
          id: `time_overlap_${i}`,
          type: 'time_overlap',
          severity: 'high',
          activities: [current, next],
          description: `${current.activity.name} ends at ${current.end_time} but ${next.activity.name} starts at ${next.start_time}`,
          suggestedResolution: `Move ${next.activity.name} to ${this.minutesToTime(currentEnd + this.TIME_BUFFER_MINUTES)}`
        });
      }
    }
    
    return conflicts;
  }

  private static resolveTimeConflicts(
    schedule: ScheduleItem[], 
    conflicts: Conflict[]
  ): { resolved: ScheduleItem[], log: string[] } {
    const resolved = [...schedule];
    const log: string[] = [];

    conflicts.forEach(conflict => {
      if (conflict.type === 'time_overlap') {
        const [first, second] = conflict.activities;
        const firstIndex = resolved.findIndex(item => item.activity.id === first.activity.id);
        const secondIndex = resolved.findIndex(item => item.activity.id === second.activity.id);
        
        if (firstIndex !== -1 && secondIndex !== -1) {
          const firstEndMinutes = this.timeToMinutes(resolved[firstIndex].end_time);
          const newStartTime = this.minutesToTime(firstEndMinutes + this.TIME_BUFFER_MINUTES);
          const newEndTime = this.minutesToTime(
            firstEndMinutes + this.TIME_BUFFER_MINUTES + resolved[secondIndex].activity.duration_minutes
          );
          
          resolved[secondIndex] = {
            ...resolved[secondIndex],
            start_time: newStartTime,
            end_time: newEndTime
          };
          
          log.push(`Moved ${second.activity.name} from ${second.start_time} to ${newStartTime} to resolve conflict`);
        }
      }
    });

    return { resolved, log };
  }

  private static detectTravelTimeConflicts(schedule: ScheduleItem[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i];
      const next = schedule[i + 1];
      
      if (current.activity.location !== next.activity.location && 
          current.activity.location !== 'Home' && 
          next.activity.location !== 'Home') {
        
        const timeBetween = this.timeToMinutes(next.start_time) - this.timeToMinutes(current.end_time);
        
        if (timeBetween < this.TRAVEL_TIME_BUFFER) {
          conflicts.push({
            id: `travel_time_${i}`,
            type: 'travel_time',
            severity: 'medium',
            activities: [current, next],
            description: `Only ${timeBetween} minutes to travel from ${current.activity.location} to ${next.activity.location}`,
            suggestedResolution: `Add ${this.TRAVEL_TIME_BUFFER - timeBetween} minutes buffer time`
          });
        }
      }
    }
    
    return conflicts;
  }

  private static detectEnergyConflicts(schedule: ScheduleItem[]): Conflict[] {
    const conflicts: Conflict[] = [];
    
    for (let i = 0; i < schedule.length - 1; i++) {
      const current = schedule[i];
      const next = schedule[i + 1];
      
      const currentEnergy = this.getEnergyLevel(current);
      const nextEnergy = this.getEnergyLevel(next);
      
      if (currentEnergy === 'high' && nextEnergy === 'high') {
        const timeBetween = this.timeToMinutes(next.start_time) - this.timeToMinutes(current.end_time);
        
        if (timeBetween < 60) { // Less than 1 hour between high-energy activities
          conflicts.push({
            id: `energy_conflict_${i}`,
            type: 'energy_conflict',
            severity: 'low',
            activities: [current, next],
            description: `Two high-energy activities scheduled close together`,
            suggestedResolution: `Add rest period or swap one activity for lower energy`
          });
        }
      }
    }
    
    return conflicts;
  }

  private static detectBudgetConflicts(schedule: ScheduleItem[]): Conflict[] {
    const conflicts: Conflict[] = [];
    const dailyBudgetLimit = 200; // Kevin's daily budget
    
    const dailyTotal = schedule.reduce((sum, item) => sum + item.activity.cost_cad, 0);
    
    if (dailyTotal > dailyBudgetLimit) {
      conflicts.push({
        id: 'budget_exceeded',
        type: 'budget_conflict',
        severity: 'high',
        activities: schedule.filter(item => item.activity.cost_cad > 0),
        description: `Daily cost $${dailyTotal} exceeds budget limit $${dailyBudgetLimit}`,
        suggestedResolution: `Reduce costs by $${dailyTotal - dailyBudgetLimit} or choose free alternatives`
      });
    }
    
    return conflicts;
  }

  private static getEnergyLevel(activity: ScheduleItem): 'low' | 'medium' | 'high' {
    if (activity.activity.tags.includes('running') || 
        activity.activity.tags.includes('fitness') ||
        activity.activity.tags.includes('networking')) {
      return 'high';
    }
    if (activity.activity.tags.includes('meal') || 
        activity.activity.tags.includes('relaxation')) {
      return 'low';
    }
    return 'medium';
  }

  private static timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  private static minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }
}
