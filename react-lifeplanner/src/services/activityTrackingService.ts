import { Activity } from '../types';

export interface ActivityUsage {
  activityId: string;
  usageCount: number;
  lastUsed: string;
  averageRating: number;
  totalDuration: number;
}

export interface ActivityStats {
  totalActivities: number;
  mostUsedActivity: ActivityUsage;
  leastUsedActivity: ActivityUsage;
  averageCost: number;
  totalCost: number;
  networkingScore: number;
  categoryBreakdown: Record<string, number>;
  weeklyTrends: Record<string, number>;
}

export class ActivityTrackingService {
  private static readonly STORAGE_KEY = 'lifeplanner_activity_usage';
  private static readonly ROTATION_THRESHOLD = 3; // Max times to use activity before rotation

  static getActivityUsage(): Record<string, ActivityUsage> {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  }

  static saveActivityUsage(usage: Record<string, ActivityUsage>): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(usage));
  }

  static trackActivityUsage(activity: Activity, rating: number = 5): void {
    const usage = this.getActivityUsage();
    const activityId = activity.id;
    
    if (usage[activityId]) {
      usage[activityId].usageCount++;
      usage[activityId].lastUsed = new Date().toISOString();
      usage[activityId].averageRating = 
        (usage[activityId].averageRating + rating) / 2;
      usage[activityId].totalDuration += activity.duration_minutes;
    } else {
      usage[activityId] = {
        activityId,
        usageCount: 1,
        lastUsed: new Date().toISOString(),
        averageRating: rating,
        totalDuration: activity.duration_minutes
      };
    }
    
    this.saveActivityUsage(usage);
  }

  static getSmartActivityRecommendations(
    availableActivities: Activity[],
    category?: string
  ): Activity[] {
    const usage = this.getActivityUsage();
    
    // Filter by category if specified
    let filteredActivities = category 
      ? availableActivities.filter(act => act.category === category)
      : availableActivities;

    // Sort by usage count (ascending) and rating (descending)
    return filteredActivities.sort((a, b) => {
      const aUsage = usage[a.id]?.usageCount || 0;
      const bUsage = usage[b.id]?.usageCount || 0;
      const aRating = usage[a.id]?.averageRating || 5;
      const bRating = usage[b.id]?.averageRating || 5;
      
      // Prefer less used activities
      if (aUsage !== bUsage) {
        return aUsage - bUsage;
      }
      
      // If usage is equal, prefer higher rated
      return bRating - aRating;
    });
  }

  static shouldRotateActivity(activity: Activity): boolean {
    const usage = this.getActivityUsage();
    const activityUsage = usage[activity.id];
    
    if (!activityUsage) return false;
    
    return activityUsage.usageCount >= this.ROTATION_THRESHOLD;
  }

  static getActivityStats(activities: Activity[]): ActivityStats {
    const usage = this.getActivityUsage();
    const usageArray = Object.values(usage);
    
    if (usageArray.length === 0) {
      return {
        totalActivities: 0,
        mostUsedActivity: {
          activityId: '',
          usageCount: 0,
          lastUsed: '',
          averageRating: 0,
          totalDuration: 0
        },
        leastUsedActivity: {
          activityId: '',
          usageCount: 0,
          lastUsed: '',
          averageRating: 0,
          totalDuration: 0
        },
        averageCost: 0,
        totalCost: 0,
        networkingScore: 0,
        categoryBreakdown: {},
        weeklyTrends: {}
      };
    }

    const mostUsed = usageArray.reduce((max, current) => 
      current.usageCount > max.usageCount ? current : max
    );
    
    const leastUsed = usageArray.reduce((min, current) => 
      current.usageCount < min.usageCount ? current : min
    );

    const totalCost = activities.reduce((sum, act) => {
      const actUsage = usage[act.id];
      return sum + (actUsage ? act.cost_cad * actUsage.usageCount : 0);
    }, 0);

    const totalUsage = usageArray.reduce((sum, usage) => sum + usage.usageCount, 0);
    const averageCost = totalUsage > 0 ? totalCost / totalUsage : 0;

    const networkingScore = activities.reduce((sum, act) => {
      const actUsage = usage[act.id];
      return sum + (actUsage ? act.networking_potential * actUsage.usageCount : 0);
    }, 0) / totalUsage || 0;

    const categoryBreakdown = activities.reduce((breakdown, act) => {
      const actUsage = usage[act.id];
      if (actUsage) {
        breakdown[act.category] = (breakdown[act.category] || 0) + actUsage.usageCount;
      }
      return breakdown;
    }, {} as Record<string, number>);

    // Weekly trends (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const weeklyTrends = usageArray.reduce((trends, usage) => {
      const lastUsed = new Date(usage.lastUsed);
      if (lastUsed >= weekAgo) {
        const dayName = lastUsed.toLocaleDateString('en-US', { weekday: 'long' });
        trends[dayName] = (trends[dayName] || 0) + 1;
      }
      return trends;
    }, {} as Record<string, number>);

    return {
      totalActivities: totalUsage,
      mostUsedActivity: mostUsed,
      leastUsedActivity: leastUsed,
      averageCost,
      totalCost,
      networkingScore,
      categoryBreakdown,
      weeklyTrends
    };
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

  static resetUsageData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}
