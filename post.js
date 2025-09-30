// ============================================
// Individual Post Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    loadPost();
});

function loadPost() {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');
    
    const postLoading = document.getElementById('postLoading');
    const postNotFound = document.getElementById('postNotFound');
    const postArticle = document.getElementById('postArticle');
    
    if (!postId) {
        postLoading.style.display = 'none';
        postNotFound.style.display = 'block';
        return;
    }
    
    const post = getBlogPostById(postId);
    
    if (!post) {
        postLoading.style.display = 'none';
        postNotFound.style.display = 'block';
        return;
    }
    
    // Update page title and meta tags
    document.getElementById('pageTitle').textContent = `${post.title} | Your Name`;
    document.getElementById('metaDescription').content = post.metaDescription;
    document.getElementById('metaKeywords').content = post.keywords;
    
    // Update Open Graph tags
    document.getElementById('ogTitle').content = post.title;
    document.getElementById('ogDescription').content = post.metaDescription;
    const currentUrl = `${window.location.origin}/post.html?id=${post.id}`;
    document.getElementById('ogUrl').content = currentUrl;
    
    // Render post content
    postLoading.style.display = 'none';
    postArticle.style.display = 'block';
    postArticle.innerHTML = renderPost(post, currentUrl);
    
    // Add schema.org JSON-LD
    addStructuredData(post);
}

function renderPost(post, url) {
    const contentHtml = post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br>');
    
    return `
        <div class="post-header">
            <h1 class="post-title">${escapeHtml(post.title)}</h1>
            <div class="post-meta">
                <time datetime="${post.date}">${formatDate(post.date)}</time>
            </div>
            <div class="post-share">
                <button onclick="shareOnLinkedIn('${escapeHtml(post.title)}', '${url}')" class="btn btn-secondary btn-small">
                    Share on LinkedIn
                </button>
                <button onclick="shareOnTwitter('${escapeHtml(post.title)}', '${url}')" class="btn btn-secondary btn-small">
                    Share on Twitter
                </button>
                <button onclick="shareViaEmail('${escapeHtml(post.title)}', '${url}')" class="btn btn-secondary btn-small">
                    Share via Email
                </button>
            </div>
        </div>
        
        <div class="post-body">
            <p>${contentHtml}</p>
        </div>
        
        <div class="post-back">
            <a href="blog.html" class="btn btn-primary">← Back to Blog</a>
        </div>
    `;
}

function addStructuredData(post) {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.metaDescription,
        "datePublished": post.date,
        "author": {
            "@type": "Person",
            "name": "Your Name",
            "url": window.location.origin
        },
        "publisher": {
            "@type": "Person",
            "name": "Your Name"
        },
        "keywords": post.keywords,
        "articleBody": post.content
    });
    document.head.appendChild(script);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
