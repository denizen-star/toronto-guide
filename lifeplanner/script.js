// Kevin's Time Allocation Tuner - JavaScript

class TimeAllocationTuner {
    constructor() {
        this.chart = null;
        this.currentAllocation = null;
        this.isUpdating = false;
        this.init();
    }

    async init() {
        await this.loadAllocation();
        this.setupEventListeners();
        this.updateVisualization();
    }

    async loadAllocation() {
        try {
            const response = await fetch('/api/allocation');
            this.currentAllocation = await response.json();
            this.updateUI();
        } catch (error) {
            console.error('Error loading allocation:', error);
            this.showError('Failed to load current allocation');
        }
    }

    setupEventListeners() {
        // Preset buttons
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const preset = e.target.dataset.preset;
                this.applyPreset(preset);
            });
        });

        // Main category sliders
        document.querySelectorAll('.main-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleMainSliderChange(e.target);
            });
        });

        // Subcategory sliders
        document.querySelectorAll('.sub-slider').forEach(slider => {
            slider.addEventListener('input', (e) => {
                this.handleSubSliderChange(e.target);
            });
        });

        // Action buttons
        document.getElementById('export-schedule').addEventListener('click', () => {
            this.exportSchedule();
        });

        document.getElementById('reset-defaults').addEventListener('click', () => {
            this.resetToDefaults();
        });
    }

    async applyPreset(presetName) {
        this.showLoading();
        try {
            const response = await fetch(`/api/preset/${presetName}`);
            const result = await response.json();
            
            if (result.success) {
                this.currentAllocation = result.allocation;
                this.updateUI();
                this.updateVisualization();
                this.showSuccess(`Applied ${presetName.replace('_', ' ')} preset`);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Error applying preset:', error);
            this.showError('Failed to apply preset');
        } finally {
            this.hideLoading();
        }
    }

    async handleMainSliderChange(slider) {
        if (this.isUpdating) return;
        
        const category = slider.id.replace('-slider', '');
        const percentage = parseFloat(slider.value);
        
        // Update UI immediately
        this.updateCategoryDisplay(category, percentage);
        
        // Rebalance other categories to maintain 100% total
        this.rebalanceCategories(category, percentage);
        
        // Debounce API call
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateAllocation(category, percentage);
        }, 300);
    }

    async handleSubSliderChange(slider) {
        if (this.isUpdating) return;
        
        const subcategory = slider.dataset.subcategory;
        const percentage = parseFloat(slider.value);
        
        // Update UI immediately
        const statsContainer = slider.parentElement.querySelector('.sub-stats');
        if (statsContainer) {
            const percentageElement = statsContainer.querySelector('.sub-percentage');
            if (percentageElement) {
                percentageElement.textContent = `${percentage.toFixed(1)}%`;
            }
        }
        
        // Calculate and update hours for this subcategory
        this.updateSubcategoryHoursImmediate(subcategory, percentage);
        
        // Debounce API call
        clearTimeout(this.updateTimeout);
        this.updateTimeout = setTimeout(() => {
            this.updateSubcategoryAllocation(subcategory, percentage);
        }, 300);
    }

    async updateAllocation(category, percentage) {
        this.showLoading();
        try {
            // Get current values from all sliders
            const individualSlider = document.getElementById('individual-slider');
            const networkingSlider = document.getElementById('networking-slider');
            const coupleSlider = document.getElementById('couple-slider');
            
            const data = {
                individual_activities_percent: parseFloat(individualSlider.value),
                networking_social_percent: parseFloat(networkingSlider.value),
                couple_activities_percent: parseFloat(coupleSlider.value)
            };
            
            const response = await fetch('/api/allocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentAllocation = result.allocation;
                this.updateUI();
                this.updateVisualization();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Error updating allocation:', error);
            this.showError('Failed to update allocation');
        } finally {
            this.hideLoading();
        }
    }

    async updateSubcategoryAllocation(subcategory, percentage) {
        this.showLoading();
        try {
            // Determine which category this subcategory belongs to
            let category = 'individual';
            let breakdownKey = 'individual_breakdown';
            
            if (['professional_networking', 'social_activities', 'professional_dev_networking', 'other_social'].includes(subcategory)) {
                category = 'networking';
                breakdownKey = 'networking_breakdown';
            } else if (['daily_meals', 'evening_together', 'weekend_activities', 'breakfast_together', 'household_together'].includes(subcategory)) {
                category = 'couple';
                breakdownKey = 'couple_breakdown';
            }
            
            const data = {};
            data[breakdownKey] = {};
            data[breakdownKey][`${subcategory}_percent`] = percentage;
            
            const response = await fetch('/api/allocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            const result = await response.json();
            
            if (result.success) {
                this.currentAllocation = result.allocation;
                this.updateUI();
                this.updateVisualization();
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Error updating subcategory allocation:', error);
            this.showError('Failed to update subcategory allocation');
        } finally {
            this.hideLoading();
        }
    }

    updateUI() {
        if (!this.currentAllocation) return;
        
        this.isUpdating = true;
        
        // Update main categories
        const categories = this.currentAllocation.categories;
        
        // Individual Activities
        this.updateCategoryDisplay('individual', categories.individual_activities.percentage);
        
        // Networking & Social
        this.updateCategoryDisplay('networking', categories.networking_social.percentage);
        
        // Couple Activities
        this.updateCategoryDisplay('couple', categories.couple_activities.percentage);
        
        // Update summary stats
        this.updateSummaryStats();
        
        // Update total percentage
        this.updateTotalPercentage();
        
        this.isUpdating = false;
    }

    updateCategoryDisplay(category, percentage) {
        const percentageElement = document.getElementById(`${category}-percentage`);
        const hoursElement = document.getElementById(`${category}-hours`);
        const slider = document.getElementById(`${category}-slider`);
        
        if (percentageElement) {
            percentageElement.textContent = `${percentage.toFixed(1)}%`;
        }
        
        if (hoursElement && this.currentAllocation) {
            const hours = this.currentAllocation.categories[`${category}_activities`].hours;
            hoursElement.textContent = this.formatHours(hours);
        }
        
        if (slider) {
            slider.value = percentage;
        }
        
        // Update subcategory hours
        this.updateSubcategoryHours(category);
    }

    formatHours(hours) {
        const wholeHours = Math.floor(hours);
        const minutes = Math.round((hours - wholeHours) * 60);
        return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
    }

    updateSubcategoryHours(category) {
        if (!this.currentAllocation) return;
        
        const categoryData = this.currentAllocation.categories[`${category}_activities`];
        if (!categoryData || !categoryData.breakdown) return;
        
        const breakdown = categoryData.breakdown;
        
        // Update each subcategory hours display
        Object.keys(breakdown).forEach(subcategory => {
            const hoursElement = document.getElementById(`${subcategory}-hours`);
            if (hoursElement) {
                const hours = breakdown[subcategory];
                hoursElement.textContent = this.formatHours(hours);
            }
        });
    }

    rebalanceCategories(changedCategory, newPercentage) {
        if (!this.currentAllocation) return;
        
        const categories = ['individual', 'networking', 'couple'];
        const otherCategories = categories.filter(cat => cat !== changedCategory);
        
        if (otherCategories.length === 0) return;
        
        // Calculate current percentages
        let currentPercentages = {};
        categories.forEach(cat => {
            const slider = document.getElementById(`${cat}-slider`);
            if (slider) {
                currentPercentages[cat] = parseFloat(slider.value);
            }
        });
        
        // Set the new percentage for the changed category
        currentPercentages[changedCategory] = newPercentage;
        
        // Calculate remaining percentage to distribute
        const remainingPercentage = 100 - newPercentage;
        
        // Calculate total of other categories
        let otherTotal = 0;
        otherCategories.forEach(cat => {
            otherTotal += currentPercentages[cat];
        });
        
        // Redistribute remaining percentage proportionally
        if (otherTotal > 0) {
            otherCategories.forEach(cat => {
                const proportion = currentPercentages[cat] / otherTotal;
                const newValue = remainingPercentage * proportion;
                
                // Update slider and display
                const slider = document.getElementById(`${cat}-slider`);
                if (slider) {
                    slider.value = newValue;
                    this.updateCategoryDisplay(cat, newValue);
                }
            });
        } else {
            // If other categories are 0, distribute evenly
            const evenDistribution = remainingPercentage / otherCategories.length;
            otherCategories.forEach(cat => {
                const slider = document.getElementById(`${cat}-slider`);
                if (slider) {
                    slider.value = evenDistribution;
                    this.updateCategoryDisplay(cat, evenDistribution);
                }
            });
        }
        
        // Update total percentage indicator
        this.updateTotalPercentage();
    }

    updateTotalPercentage() {
        const individualSlider = document.getElementById('individual-slider');
        const networkingSlider = document.getElementById('networking-slider');
        const coupleSlider = document.getElementById('couple-slider');
        
        if (!individualSlider || !networkingSlider || !coupleSlider) return;
        
        const total = parseFloat(individualSlider.value) + 
                     parseFloat(networkingSlider.value) + 
                     parseFloat(coupleSlider.value);
        
        const totalElement = document.getElementById('total-value');
        const totalContainer = document.getElementById('total-percentage');
        
        if (totalElement && totalContainer) {
            totalElement.textContent = `${total.toFixed(1)}%`;
            
            // Update styling based on total
            totalContainer.classList.remove('warning', 'success');
            if (Math.abs(total - 100) < 0.1) {
                totalContainer.classList.add('success');
            } else {
                totalContainer.classList.add('warning');
            }
        }
    }

    updateSubcategoryHoursImmediate(subcategory, percentage) {
        if (!this.currentAllocation) return;
        
        // Find which category this subcategory belongs to
        let category = 'individual';
        if (['professional_networking', 'social_activities', 'professional_dev_networking', 'other_social'].includes(subcategory)) {
            category = 'networking';
        } else if (['daily_meals', 'evening_together', 'weekend_activities', 'breakfast_together', 'household_together'].includes(subcategory)) {
            category = 'couple';
        }
        
        const categoryData = this.currentAllocation.categories[`${category}_activities`];
        if (!categoryData) return;
        
        // Calculate hours based on percentage of category total
        const categoryHours = categoryData.hours;
        const subcategoryHours = (categoryHours * percentage) / 100;
        
        // Update the hours display
        const hoursElement = document.getElementById(`${subcategory}-hours`);
        if (hoursElement) {
            hoursElement.textContent = this.formatHours(subcategoryHours);
        }
    }

    updateSummaryStats() {
        if (!this.currentAllocation) return;
        
        document.getElementById('total-hours').textContent = this.formatHours(this.currentAllocation.total_weekly_hours);
        document.getElementById('fixed-hours').textContent = 
            `${this.formatHours(this.currentAllocation.fixed_time)} (${(this.currentAllocation.fixed_time / this.currentAllocation.total_weekly_hours * 100).toFixed(1)}%)`;
        document.getElementById('available-hours').textContent = 
            `${this.formatHours(this.currentAllocation.available_time)} (${(this.currentAllocation.available_time / this.currentAllocation.total_weekly_hours * 100).toFixed(1)}%)`;
    }

    updateVisualization() {
        this.updatePieChart();
        this.updateTimeline();
    }

    updatePieChart() {
        if (!this.currentAllocation) return;
        
        const ctx = document.getElementById('pieChart').getContext('2d');
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        const categories = this.currentAllocation.categories;
        
        this.chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Individual Activities', 'Networking & Social', 'Couple Activities'],
                datasets: [{
                    data: [
                        categories.individual_activities.hours,
                        categories.networking_social.hours,
                        categories.couple_activities.hours
                    ],
                    backgroundColor: [
                        '#4CAF50',
                        '#2196F3',
                        '#E91E63'
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const label = context.label || '';
                                const value = context.parsed;
                                const percentage = ((value / context.dataset.data.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
                                return `${label}: ${this.formatHours(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    updateTimeline() {
        if (!this.currentAllocation) return;
        
        const timelineContainer = document.getElementById('timeline-container');
        const categories = this.currentAllocation.categories;
        
        const timelineData = [
            { label: 'Individual Activities', hours: categories.individual_activities.hours, color: '#4CAF50' },
            { label: 'Networking & Social', hours: categories.networking_social.hours, color: '#2196F3' },
            { label: 'Couple Activities', hours: categories.couple_activities.hours, color: '#E91E63' }
        ];
        
        timelineContainer.innerHTML = timelineData.map(item => `
            <div class="timeline-item">
                <div class="timeline-color" style="background-color: ${item.color}"></div>
                <div class="timeline-label">${item.label}</div>
                <div class="timeline-value">${this.formatHours(item.hours)}</div>
            </div>
        `).join('');
    }

    async exportSchedule() {
        this.showLoading();
        try {
            const response = await fetch('/api/export');
            const result = await response.json();
            
            if (result.success) {
                this.showSuccess(`Schedule exported to ${result.filename}`);
            } else {
                this.showError(result.error);
            }
        } catch (error) {
            console.error('Error exporting schedule:', error);
            this.showError('Failed to export schedule');
        } finally {
            this.hideLoading();
        }
    }

    async resetToDefaults() {
        if (confirm('Are you sure you want to reset to default values?')) {
            this.showLoading();
            try {
                await this.loadAllocation();
                this.updateUI();
                this.updateVisualization();
                this.showSuccess('Reset to default values');
            } catch (error) {
                console.error('Error resetting to defaults:', error);
                this.showError('Failed to reset to defaults');
            } finally {
                this.hideLoading();
            }
        }
    }

    showLoading() {
        document.getElementById('loading-overlay').classList.add('show');
    }

    hideLoading() {
        document.getElementById('loading-overlay').classList.remove('show');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    showError(message) {
        this.showToast(message, 'error');
    }

    showToast(message, type) {
        // Create toast element
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
            animation: slideIn 0.3s ease-out;
        `;
        
        // Add animation keyframes
        if (!document.getElementById('toast-styles')) {
            const style = document.createElement('style');
            style.id = 'toast-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(toast);
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TimeAllocationTuner();
});
