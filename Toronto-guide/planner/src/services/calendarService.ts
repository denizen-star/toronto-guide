import { ScheduleItem } from '../types';
import { format, parse } from 'date-fns';

export class CalendarService {
  static generateGoogleCalendarUrl(activity: ScheduleItem): string {
    const startDateTime = this.combineDateTime(activity.date, activity.start_time);
    const endDateTime = this.combineDateTime(activity.date, activity.end_time);
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: activity.activity.name,
      dates: `${this.formatGoogleCalendarDate(startDateTime)}/${this.formatGoogleCalendarDate(endDateTime)}`,
      details: this.formatActivityDetails(activity),
      location: activity.activity.location,
      trp: 'false'
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  }

  static generateICSFile(activity: ScheduleItem): void {
    const startDateTime = this.combineDateTime(activity.date, activity.start_time);
    const endDateTime = this.combineDateTime(activity.date, activity.end_time);
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LifePlanner//Kevin Schedule//EN',
      'BEGIN:VEVENT',
      `UID:${activity.activity.id}-${activity.date}@lifeplanner.app`,
      `DTSTAMP:${this.formatICSDate(new Date())}`,
      `DTSTART:${this.formatICSDate(startDateTime)}`,
      `DTEND:${this.formatICSDate(endDateTime)}`,
      `SUMMARY:${activity.activity.name}`,
      `DESCRIPTION:${this.formatActivityDetails(activity)}`,
      `LOCATION:${activity.activity.location}`,
      `CATEGORIES:${activity.activity.category.toUpperCase()}`,
      'STATUS:CONFIRMED',
      'TRANSP:OPAQUE',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activity.activity.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  static generateWeeklyICS(activities: ScheduleItem[]): void {
    let icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//LifePlanner//Kevin Weekly Schedule//EN'
    ];

    activities.forEach(activity => {
      const startDateTime = this.combineDateTime(activity.date, activity.start_time);
      const endDateTime = this.combineDateTime(activity.date, activity.end_time);
      
      icsContent.push(
        'BEGIN:VEVENT',
        `UID:${activity.activity.id}-${activity.date}@lifeplanner.app`,
        `DTSTAMP:${this.formatICSDate(new Date())}`,
        `DTSTART:${this.formatICSDate(startDateTime)}`,
        `DTEND:${this.formatICSDate(endDateTime)}`,
        `SUMMARY:${activity.activity.name}`,
        `DESCRIPTION:${this.formatActivityDetails(activity)}`,
        `LOCATION:${activity.activity.location}`,
        `CATEGORIES:${activity.activity.category.toUpperCase()}`,
        'STATUS:CONFIRMED',
        'TRANSP:OPAQUE',
        'END:VEVENT'
      );
    });

    icsContent.push('END:VCALENDAR');

    const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `kevin_weekly_schedule.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  private static combineDateTime(date: string, time: string): Date {
    return parse(`${date} ${time}`, 'yyyy-MM-dd HH:mm', new Date());
  }

  private static formatGoogleCalendarDate(date: Date): string {
    return format(date, "yyyyMMdd'T'HHmmss");
  }

  private static formatICSDate(date: Date): string {
    return format(date, "yyyyMMdd'T'HHmmss'Z'");
  }

  private static formatActivityDetails(activity: ScheduleItem): string {
    let details = activity.activity.description;
    
    if (activity.activity.cost_cad > 0) {
      details += `\\n\\nCost: $${activity.activity.cost_cad} CAD`;
    }
    
    if (activity.activity.networking_potential > 0) {
      details += `\\nNetworking Potential: ${activity.activity.networking_potential}/10`;
    }
    
    if (activity.activity.requirements.length > 0) {
      details += `\\nRequirements: ${activity.activity.requirements.join(', ')}`;
    }
    
    if (activity.activity.tags.length > 0) {
      details += `\\nTags: ${activity.activity.tags.join(', ')}`;
    }
    
    return details;
  }
}
