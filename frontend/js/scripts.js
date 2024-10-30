// Accessibility Functions

// Adjust Font Size
function adjustFontSize(size) {
    document.body.style.fontSize = size + 'px';
  }
  
  // Toggle Dark Mode
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
  }
  
  // Toggle Dyslexia-Friendly Font
  function toggleDyslexiaFont() {
    document.body.classList.toggle('dyslexia-font');
  }
  
  // Toggle High Contrast Mode
  function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
  }
  
  // Event Listener Setup for Accessibility Toggles
  document.addEventListener('DOMContentLoaded', () => {
    const increaseFontBtn = document.getElementById('increaseFont');
    const decreaseFontBtn = document.getElementById('decreaseFont');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const dyslexiaFontToggle = document.getElementById('dyslexiaFontToggle');
    const highContrastToggle = document.getElementById('highContrastToggle');
  
    increaseFontBtn.addEventListener('click', () => adjustFontSize(18));
    decreaseFontBtn.addEventListener('click', () => adjustFontSize(14));
    darkModeToggle.addEventListener('click', toggleDarkMode);
    dyslexiaFontToggle.addEventListener('click', toggleDyslexiaFont);
    highContrastToggle.addEventListener('click', toggleHighContrast);
  });
  
  // Fetch and Display Tutors (Mock Data for Demonstration)
  document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.getElementById('searchForm');
    const tutorResults = document.getElementById('tutorResults');
  
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
  
      // Get form data
      const subject = document.getElementById('subject').value.toLowerCase();
      const availability = document.getElementById('availability').value;
      const accessibilityNeeds = Array.from(document.querySelectorAll('input[name="accessibilityNeeds"]:checked')).map(cb => cb.value);
  
      // Mock Data: Replace with actual API call if available
      const tutors = [
        {
          name: 'Alice Smith',
          subjects: ['math', 'science'],
          accessibilityOptions: ['screenReader'],
          availability: '2024-09-25T10:00',
          rating: 4.5
        },
        {
          name: 'Bob Johnson',
          subjects: ['math'],
          accessibilityOptions: ['signLanguage'],
          availability: '2024-09-26T14:00',
          rating: 4.8
        }
        // Add more mock tutors as needed
      ];
  
      // Filter Tutors Based on Search Criteria
      const filteredTutors = tutors.filter(tutor => {
        const matchesSubject = tutor.subjects.includes(subject);
        const matchesAccessibility = accessibilityNeeds.every(need => tutor.accessibilityOptions.includes(need));
        const matchesAvailability = !availability || tutor.availability.startsWith(availability);
  
        return matchesSubject && matchesAccessibility && matchesAvailability;
      });
  
      // Display Tutors
      tutorResults.innerHTML = '';
      if (filteredTutors.length > 0) {
        filteredTutors.forEach(tutor => {
          const tutorCard = document.createElement('div');
          tutorCard.classList.add('tutor-card');
          tutorCard.innerHTML = `
            <h3>${tutor.name}</h3>
            <p>Subjects: ${tutor.subjects.join(', ')}</p>
            <p>Accessibility Options: ${tutor.accessibilityOptions.join(', ')}</p>
            <p>Rating: ${tutor.rating}</p>
            <button onclick="bookSession('${tutor.name}')">Book Session</button>
          `;
          tutorResults.appendChild(tutorCard);
        });
      } else {
        tutorResults.innerHTML = '<p>No tutors found matching your criteria.</p>';
      }
    });
  });
  
  // Function to Book a Session (Placeholder)
  function bookSession(tutorName) {
    alert(`Session booked with ${tutorName}!`);
  }
  