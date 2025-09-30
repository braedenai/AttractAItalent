// ============================================
// Contact Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactFormSubmit();
        });
    }
});

function handleContactFormSubmit() {
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        reason: document.getElementById('reason').value,
        message: document.getElementById('message').value,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage (in a real app, this would be sent to a server)
    try {
        const submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
        submissions.push(formData);
        localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
        
        // Show success message
        form.style.display = 'none';
        formSuccess.style.display = 'flex';
        formError.style.display = 'none';
        
        // Log to console for demo purposes
        console.log('Contact form submitted:', formData);
        
        // Reset form after a delay
        setTimeout(() => {
            form.reset();
            form.style.display = 'flex';
            formSuccess.style.display = 'none';
        }, 5000);
        
    } catch (error) {
        // Show error message
        formError.style.display = 'flex';
        formSuccess.style.display = 'none';
        console.error('Error submitting form:', error);
    }
}

// Helper function to retrieve contact submissions (for demo purposes)
function getContactSubmissions() {
    return JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
}
