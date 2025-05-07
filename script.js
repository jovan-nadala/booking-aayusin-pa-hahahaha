document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const steps = document.querySelectorAll('.step');
    const bookingSteps = document.querySelectorAll('.booking-step');
    const specialtyCards = document.querySelectorAll('.specialty-card');
    const doctorCards = document.querySelectorAll('.doctor-card');
    const timeSlots = document.querySelectorAll('.time-slot');
    const nextButtons = document.querySelectorAll('.btn-next');
    const backButtons = document.querySelectorAll('.btn-back');
    const searchInput = document.querySelector('.search-box input');
    
    // Current step tracking
    let currentStep = 1;
    
    // Initialize the form
    initForm();
    
    function initForm() {
        // Show first step
        showStep(currentStep);
        
        // Set up step navigation
        steps.forEach(step => {
            step.addEventListener('click', function() {
                const stepNumber = parseInt(this.getAttribute('data-step'));
                if (stepNumber < currentStep) {
                    currentStep = stepNumber;
                    showStep(currentStep);
                }
            });
        });
        
        // Specialty selection
        specialtyCards.forEach(card => {
            card.addEventListener('click', function() {
                specialtyCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
                document.querySelector('#step1 .btn-next').disabled = false;
            });
        });
        
        // Doctor selection
        doctorCards.forEach(card => {
            card.addEventListener('click', function() {
                doctorCards.forEach(c => c.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Time slot selection
        timeSlots.forEach(slot => {
            slot.addEventListener('click', function() {
                timeSlots.forEach(s => s.classList.remove('selected'));
                this.classList.add('selected');
            });
        });
        
        // Next button functionality
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (currentStep < 5) {
                    currentStep++;
                    showStep(currentStep);
                } else {
                    // Submit form
                    alert('Appointment booked successfully!');
                }
            });
        });
        
        // Back button functionality
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                if (currentStep > 1) {
                    currentStep--;
                    showStep(currentStep);
                }
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            
            specialtyCards.forEach(card => {
                const specialtyName = card.getAttribute('data-specialty');
                const cardText = card.textContent.toLowerCase();
                
                if (cardText.includes(searchTerm) || specialtyName.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    }
    
    function showStep(stepNumber) {
        // Update progress steps
        steps.forEach((step, index) => {
            if (index + 1 <= stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Show the corresponding step content
        bookingSteps.forEach(step => {
            if (parseInt(step.id.replace('step', '')) === stepNumber) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Scroll to top of the form
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    // Form validation would go here
    function validateStep(stepNumber) {
        // Implementation would validate each step before proceeding
        return true;
    }
});

//calendar//
document.addEventListener('DOMContentLoaded', function() {
    const calendar = {
      currentDate: new Date(2025, 4, 1), // May 2025 (months are 0-indexed)
      daysGrid: document.querySelector('.days-grid'),
      monthYearDisplay: document.querySelector('.month-year'),
      
      init() {
        this.renderCalendar();
        this.setupEventListeners();
        this.restoreSelection();
      },
      
      renderCalendar() {
        // Clear previous days
        this.daysGrid.innerHTML = '';
        
        // Set month/year display
        this.monthYearDisplay.textContent = this.getMonthYearString();
        
        // Get first day of month and total days
        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const totalDays = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();
        
        // Get day of week for first day (0-6 where 0 is Sunday)
        const startDay = firstDay.getDay();
        
        // Add empty cells for days before first day of month
        for (let i = 0; i < startDay; i++) {
          this.daysGrid.appendChild(this.createDayElement(''));
        }
        
        // Add days of month
        const today = new Date();
        for (let day = 1; day <= totalDays; day++) {
          const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
          const dayElement = this.createDayElement(day);
          
          // Mark today
          if (date.toDateString() === today.toDateString()) {
            dayElement.classList.add('today');
          }
          
          // Mark weekends differently (optional)
          if (date.getDay() === 0 || date.getDay() === 6) {
            dayElement.classList.add('weekend');
          }
      
          // Example availability logic (customize as needed)
          if (day % 4 !== 0) { // Example: 3 out of 4 days are available
            dayElement.classList.add('available');
          } else {
            dayElement.classList.add('available');
          }
          
          this.daysGrid.appendChild(dayElement);
        }
      },
      
      createDayElement(day) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        if (day) {
          dayElement.textContent = day;
          dayElement.addEventListener('click', () => this.selectDay(dayElement, day));
        } else {
          dayElement.classList.add('disabled');
        }
        return dayElement;
      },
      
      selectDay(dayElement, day) {
        if (dayElement.classList.contains('unavailable')) return;
        
        document.querySelectorAll('.day.selected').forEach(el => el.classList.remove('selected'));
        dayElement.classList.add('selected');
        
        // Store selected date
        const selectedDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth(),
          day
        );
        localStorage.setItem('selectedAppointmentDate', selectedDate.toISOString());
      },
      
      getMonthYearString() {
        return this.currentDate.toLocaleString('default', { 
          month: 'long', 
          year: 'numeric' 
        });
      },
      
      changeMonth(offset) {
        this.currentDate = new Date(
          this.currentDate.getFullYear(),
          this.currentDate.getMonth() + offset,
          1
        );
        this.renderCalendar();
      },
      
      restoreSelection() {
        const savedDate = localStorage.getItem('selectedAppointmentDate');
        if (savedDate) {
          const date = new Date(savedDate);
          if (date.getMonth() === this.currentDate.getMonth() && 
              date.getFullYear() === this.currentDate.getFullYear()) {
            const days = document.querySelectorAll('.day');
            days.forEach(day => {
              if (day.textContent === date.getDate().toString()) {
                day.classList.add('selected');
              }
            });
          }
        }
      },
      
      setupEventListeners() {
        document.querySelector('.prev-month').addEventListener('click', () => this.changeMonth(-1));
        document.querySelector('.next-month').addEventListener('click', () => this.changeMonth(1));
      }
    };
    
    calendar.init();
  });
  


