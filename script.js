// ============================================
// Global Configuration
// ============================================
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// ============================================
// Navigation Toggle (Mobile)
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
        });
    });

    // Check if user is logged in and show admin link
    checkAdminStatus();
});

// ============================================
// Admin Authentication
// ============================================
function checkAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminNavItem = document.getElementById('adminNavItem');
    const adminControls = document.getElementById('adminControls');
    
    if (isAdmin && adminNavItem) {
        adminNavItem.style.display = 'block';
    }
    
    if (isAdmin && adminControls) {
        adminControls.style.display = 'block';
    }
}

function login(password) {
    if (password === ADMIN_PASSWORD) {
        localStorage.setItem('isAdmin', 'true');
        return true;
    }
    return false;
}

function logout() {
    localStorage.removeItem('isAdmin');
    window.location.href = 'index.html';
}

function isAdmin() {
    return localStorage.getItem('isAdmin') === 'true';
}

// ============================================
// Blog Post Management
// ============================================
function getBlogPosts() {
    const posts = localStorage.getItem('blogPosts');
    return posts ? JSON.parse(posts) : [];
}

function saveBlogPosts(posts) {
    localStorage.setItem('blogPosts', JSON.stringify(posts));
}

function addBlogPost(post) {
    const posts = getBlogPosts();
    post.id = Date.now().toString();
    post.date = new Date().toISOString();
    posts.unshift(post);
    saveBlogPosts(posts);
    return post.id;
}

function updateBlogPost(id, updatedPost) {
    const posts = getBlogPosts();
    const index = posts.findIndex(p => p.id === id);
    if (index !== -1) {
        posts[index] = { ...posts[index], ...updatedPost, id, date: posts[index].date };
        saveBlogPosts(posts);
        return true;
    }
    return false;
}

function deleteBlogPost(id) {
    const posts = getBlogPosts();
    const filteredPosts = posts.filter(p => p.id !== id);
    saveBlogPosts(filteredPosts);
}

function getBlogPostById(id) {
    const posts = getBlogPosts();
    return posts.find(p => p.id === id);
}

function getFeaturedPosts(limit = 3) {
    const posts = getBlogPosts();
    return posts.filter(p => p.featured).slice(0, limit);
}

// ============================================
// Social Share Functions
// ============================================
function shareOnLinkedIn(title, url) {
    const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareOnTwitter(title, url) {
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
    window.open(shareUrl, '_blank', 'width=600,height=400');
}

function shareViaEmail(title, url) {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check out this article: ${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

// ============================================
// Utility Functions
// ============================================
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

function createSlug(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
}

// ============================================
// Initialize Sample Data (First Visit Only)
// ============================================
function initializeSampleData() {
    const posts = getBlogPosts();
    if (posts.length === 0) {
        const samplePosts = [
            {
                id: Date.now().toString(),
                title: 'The Future of AI-Driven Business Innovation',
                slug: 'ai-driven-business-innovation',
                excerpt: 'Discover how artificial intelligence is reshaping business strategies and creating unprecedented opportunities for growth and innovation.',
                content: 'Artificial intelligence is no longer a futuristic concept—it\'s here, and it\'s transforming how businesses operate, compete, and grow. From predictive analytics to automated customer service, AI is enabling companies to make smarter decisions faster.\n\nIn this article, we explore the key areas where AI is making the biggest impact:\n\n1. **Data-Driven Decision Making**: AI algorithms can analyze vast amounts of data in seconds, uncovering patterns and insights that humans might miss.\n\n2. **Customer Experience**: Personalized recommendations, chatbots, and predictive support are revolutionizing how businesses interact with customers.\n\n3. **Operational Efficiency**: Automation and intelligent systems are streamlining operations, reducing costs, and improving productivity.\n\n4. **Innovation Acceleration**: AI tools are enabling rapid prototyping, testing, and iteration, speeding up the innovation cycle.\n\nThe businesses that embrace AI today will be the leaders of tomorrow. The question is not whether to adopt AI, but how quickly you can integrate it into your strategy.',
                keywords: 'AI in business, business innovation, AI-driven growth, artificial intelligence, digital transformation',
                metaDescription: 'Explore how AI is reshaping business strategies and creating unprecedented opportunities for growth and innovation in the modern enterprise.',
                featured: true,
                date: new Date().toISOString()
            },
            {
                id: (Date.now() + 1).toString(),
                title: 'Ethics in AI: Building Responsible Technology',
                slug: 'ethics-in-ai-responsible-technology',
                excerpt: 'Exploring the critical importance of ethical considerations in AI development and deployment for sustainable business success.',
                content: 'As AI becomes more powerful and pervasive, the ethical implications of its use become increasingly important. Building responsible AI isn\'t just about avoiding harm—it\'s about creating systems that enhance human potential while respecting fundamental values.\n\n**Key Ethical Considerations:**\n\n1. **Transparency**: Users should understand how AI systems make decisions that affect them.\n\n2. **Fairness**: AI systems must be designed to avoid bias and discrimination.\n\n3. **Privacy**: Protecting user data and respecting privacy rights is paramount.\n\n4. **Accountability**: Clear lines of responsibility must exist when AI systems fail or cause harm.\n\n5. **Human-Centered Design**: AI should augment human capabilities, not replace human judgment in critical decisions.\n\n**Building Ethical AI:**\n\n- Diverse development teams that bring multiple perspectives\n- Regular audits for bias and fairness\n- Clear documentation and explainability\n- Stakeholder engagement throughout the development process\n- Commitment to ongoing improvement and adaptation\n\nThe future of AI depends on our ability to build it responsibly. Companies that prioritize ethics will not only avoid risks but also build stronger, more trusted relationships with their customers.',
                keywords: 'AI ethics, responsible AI, ethical technology, AI governance, fairness in AI',
                metaDescription: 'Discover the critical importance of ethical considerations in AI development and how to build responsible technology for sustainable success.',
                featured: true,
                date: new Date().toISOString()
            },
            {
                id: (Date.now() + 2).toString(),
                title: 'AI Tools Revolutionizing Modern Entrepreneurship',
                slug: 'ai-tools-modern-entrepreneurship',
                excerpt: 'A deep dive into the AI-powered tools and platforms that are empowering entrepreneurs to scale faster and smarter.',
                content: 'The entrepreneurial landscape has been transformed by AI-powered tools that level the playing field and enable small teams to compete with large enterprises. Here\'s a look at the categories of AI tools making the biggest impact:\n\n**1. Content Creation & Marketing**\n- AI writing assistants for blogs, social media, and marketing copy\n- Automated design tools for graphics and branding\n- Video editing and production assistants\n- SEO optimization and content strategy tools\n\n**2. Business Operations**\n- Intelligent CRM systems that predict customer needs\n- Automated bookkeeping and financial forecasting\n- Smart scheduling and calendar management\n- Workflow automation platforms\n\n**3. Customer Service**\n- Advanced chatbots for 24/7 support\n- Sentiment analysis for customer feedback\n- Automated ticket routing and prioritization\n- Personalized customer engagement\n\n**4. Data & Analytics**\n- Predictive analytics for business planning\n- Market research and competitive intelligence\n- Real-time dashboards and reporting\n- A/B testing and optimization tools\n\n**5. Product Development**\n- Rapid prototyping tools\n- User testing and feedback analysis\n- Code generation and debugging assistants\n- Design iteration and optimization\n\n**The Impact:**\n\nThese tools are enabling entrepreneurs to:\n- Launch products faster with smaller teams\n- Make data-driven decisions without hiring analysts\n- Scale customer service without proportional cost increases\n- Compete with established players on innovation speed\n\nThe key is not to use every tool, but to strategically select the ones that address your biggest bottlenecks and multiply your team\'s impact.',
                keywords: 'AI tools, entrepreneurship, business automation, AI platforms, startup tools',
                metaDescription: 'Explore the AI-powered tools and platforms revolutionizing entrepreneurship and enabling small teams to scale faster and smarter.',
                featured: true,
                date: new Date().toISOString()
            }
        ];
        
        saveBlogPosts(samplePosts);
    }
}

// Initialize sample data on first load
if (typeof window !== 'undefined') {
    initializeSampleData();
}
