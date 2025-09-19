import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { WeeklySchedule, ScheduleItem } from '../types';
import { format } from 'date-fns';

export class ExportService {
  static async exportToPDF(schedule: WeeklySchedule, elementId: string): Promise<void> {
    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error('Element not found for PDF export');
      }

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `kevin_schedule_${schedule.week_start}.pdf`;
      pdf.save(filename);
    } catch (error) {
      console.error('PDF export failed:', error);
      throw new Error('Failed to export PDF');
    }
  }

  static exportToMarkdown(schedule: WeeklySchedule): void {
    const markdown = this.generateMarkdown(schedule);
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const filename = `kevin_schedule_${schedule.week_start}.md`;
    saveAs(blob, filename);
  }

  static exportToCSV(schedule: WeeklySchedule): void {
    const csv = this.generateCSV(schedule);
    const blob = new Blob([csv], { type: 'text/csv' });
    const filename = `kevin_schedule_${schedule.week_start}.csv`;
    saveAs(blob, filename);
  }

  static exportToJSON(schedule: WeeklySchedule): void {
    const json = JSON.stringify(schedule, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const filename = `kevin_schedule_${schedule.week_start}.json`;
    saveAs(blob, filename);
  }

  private static generateMarkdown(schedule: WeeklySchedule): string {
    let markdown = `# Kevin's Weekly Schedule\n\n`;
    markdown += `**Week of:** ${format(new Date(schedule.week_start), 'MMMM dd, yyyy')} - ${format(new Date(schedule.week_end), 'MMMM dd, yyyy')}\n\n`;
    
    // Weekly Summary
    markdown += `## 📊 Weekly Summary\n\n`;
    markdown += `- **Total Activities:** ${schedule.weekly_summary.total_activities}\n`;
    markdown += `- **Individual Activities:** ${schedule.weekly_summary.individual_activities}\n`;
    markdown += `- **Networking Activities:** ${schedule.weekly_summary.networking_activities}\n`;
    markdown += `- **Couple Activities:** ${schedule.weekly_summary.couple_activities}\n`;
    markdown += `- **Total Cost:** $${schedule.weekly_summary.total_cost} CAD\n\n`;

    // Daily Schedules
    schedule.days.forEach(day => {
      const dayName = format(new Date(day.date), 'EEEE, MMMM dd, yyyy');
      markdown += `## 📅 ${dayName}\n\n`;
      markdown += `**Daily Cost:** $${day.daily_summary.total_cost} CAD | **Networking Potential:** ${day.daily_summary.total_networking_potential}/10\n\n`;
      
      day.time_slots.forEach(slot => {
        const typeIcon = slot.type === 'individual' ? '🏃' : slot.type === 'networking' ? '🤝' : '💕';
        markdown += `### ${typeIcon} ${slot.start_time} - ${slot.end_time}: ${slot.activity.name}\n\n`;
        markdown += `- **Location:** ${slot.activity.location}\n`;
        markdown += `- **Cost:** $${slot.activity.cost_cad} CAD\n`;
        markdown += `- **Networking Potential:** ${slot.activity.networking_potential}/10\n`;
        markdown += `- **Description:** ${slot.activity.description}\n`;
        markdown += `- **Tags:** ${slot.activity.tags.join(', ')}\n`;
        if (slot.activity.requirements.length > 0) {
          markdown += `- **Requirements:** ${slot.activity.requirements.join(', ')}\n`;
        }
        markdown += `\n`;
      });
      
      markdown += `---\n\n`;
    });

    return markdown;
  }

  private static generateCSV(schedule: WeeklySchedule): string {
    let csv = 'Date,Day,Start Time,End Time,Activity,Category,Type,Location,Cost CAD,Networking Potential,Duration Minutes,Description,Tags\n';
    
    schedule.days.forEach(day => {
      const dayName = format(new Date(day.date), 'EEEE');
      day.time_slots.forEach(slot => {
        const row = [
          day.date,
          dayName,
          slot.start_time,
          slot.end_time,
          `"${slot.activity.name}"`,
          slot.activity.category,
          slot.type,
          `"${slot.activity.location}"`,
          slot.activity.cost_cad,
          slot.activity.networking_potential,
          slot.activity.duration_minutes,
          `"${slot.activity.description}"`,
          `"${slot.activity.tags.join(', ')}"`
        ].join(',');
        csv += row + '\n';
      });
    });
    
    return csv;
  }
}
