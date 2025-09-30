// ============================================
// Blog Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadBlogPosts();
});

function loadBlogPosts() {
    const posts = getBlogPosts();
    const blogGrid = document.getElementById('blogGrid');
    const noPosts = document.getElementById('noPosts');
    
    if (!blogGrid) return;
    
    if (posts.length === 0) {
        if (noPosts) noPosts.style.display = 'block';
        return;
    }
    
    if (noPosts) noPosts.style.display = 'none';
    
    // Clear existing content except "no posts" message
    blogGrid.innerHTML = '';
    
    posts.forEach(post => {
        const card = createBlogCard(post);
        blogGrid.appendChild(card);
    });
}

function createBlogCard(post) {
    const card = document.createElement('article');
    card.className = 'blog-card';
    card.setAttribute('itemscope', '');
    card.setAttribute('itemtype', 'https://schema.org/BlogPosting');
    
    const currentUrl = `${window.location.origin}/blog/${post.slug}`;
    
    card.innerHTML = `
        <div class="blog-card-content">
            <h3 class="blog-card-title" itemprop="headline">${escapeHtml(post.title)}</h3>
            <p class="blog-card-excerpt" itemprop="description">${escapeHtml(post.excerpt)}</p>
            <div class="blog-card-meta">
                <time itemprop="datePublished" datetime="${post.date}">${formatDate(post.date)}</time>
            </div>
            <div class="blog-card-footer">
                <a href="post.html?id=${post.id}" class="read-more">Read More →</a>
                <div class="share-buttons">
                    <button class="share-btn" onclick="shareOnLinkedIn('${escapeHtml(post.title)}', '${currentUrl}')" aria-label="Share on LinkedIn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                    </button>
                    <button class="share-btn" onclick="shareOnTwitter('${escapeHtml(post.title)}', '${currentUrl}')" aria-label="Share on Twitter">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
        ${isAdmin() ? `
            <div style="padding: 1rem; border-top: 1px solid var(--border-color); display: flex; gap: 0.5rem;">
                <button onclick="editPost('${post.id}')" class="btn btn-secondary btn-small">Edit</button>
                <button onclick="deletePost('${post.id}')" class="btn btn-danger btn-small">Delete</button>
            </div>
        ` : ''}
    `;
    
    // Add schema.org JSON-LD
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "Your Name"
        },
        "keywords": post.keywords
    });
    card.appendChild(script);
    
    return card;
}

function editPost(id) {
    window.location.href = `admin.html?edit=${id}`;
}

function deletePost(id) {
    if (confirm('Are you sure you want to delete this post?')) {
        deleteBlogPost(id);
        loadBlogPosts();
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add meta tag helper
const blogCardMeta = `
<style>
.blog-card-meta {
    font-size: 0.875rem;
    color: var(--text-light);
    margin-bottom: 1rem;
}
</style>
`;
document.head.insertAdjacentHTML('beforeend', blogCardMeta);
