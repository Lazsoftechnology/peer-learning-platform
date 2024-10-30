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

  if (increaseFontBtn) {
    increaseFontBtn.addEventListener('click', () => adjustFontSize(18));
  }
  if (decreaseFontBtn) {
    decreaseFontBtn.addEventListener('click', () => adjustFontSize(14));
  }
  if (darkModeToggle) {
    darkModeToggle.addEventListener('click', toggleDarkMode);
  }
  if (dyslexiaFontToggle) {
    dyslexiaFontToggle.addEventListener('click', toggleDyslexiaFont);
  }
  if (highContrastToggle) {
    highContrastToggle.addEventListener('click', toggleHighContrast);
  }
});

// Form Submission Handling
async function submitForm(formId, url) {
  const form = document.getElementById(formId);
  if (!form) return; // Prevents errors if the form is not found

  const formData = new FormData(form);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    alert(result.message || 'Form submitted successfully');
  } catch (error) {
    console.error('Error submitting form:', error);
    alert('Error submitting form');
  }
}

// Fetch and Display Tutors (Mock Data for Demonstration)
document.addEventListener('DOMContentLoaded', () => {
  const searchForm = document.getElementById('searchForm');
  const tutorResults = document.getElementById('tutorResults');

  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Get form data
      const subject = document.getElementById('subject').value.toLowerCase();
      const availability = document.getElementById('availability').value;
      const accessibilityNeeds = Array.from(document.querySelectorAll('input[name="accessibilityNeeds"]:checked')).map(cb => cb.value);

      // Mock Data: Replace with actual API call if available
      const tutors = [
        {
          name: 'Abasifreke Lazarus',
          subjects: ['math', 'science'],
          accessibilityOptions: ['screenReader'],
          availability: '2024-09-25T10:00',
          rating: 4.5
        },
        {
          name: 'Mwalimu Raila',
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
  }
});

// Function to Book a Session (Placeholder)
function bookSession(tutorName) {
  alert(`Session booked with ${tutorName}!`);
}

// Add event listeners for each form on their respective pages
document.addEventListener('DOMContentLoaded', () => {
  // Register form submission
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm('registerForm', '/register');
    });
  }

  // Login form submission
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm('loginForm', '/login');
    });
  }

  // Profile form submission
  const profileForm = document.getElementById('profileForm');
  if (profileForm) {
    profileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitForm('profileForm', '/profile');
    });
  }
});
