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
    
    // Update canonical URL
    const currentUrl = `${window.location.origin}/post.html?id=${post.id}`;
    document.getElementById('canonicalUrl').href = currentUrl;
    
    // Update Open Graph tags
    document.getElementById('ogTitle').content = post.title;
    document.getElementById('ogDescription').content = post.metaDescription;
    document.getElementById('ogUrl').content = currentUrl;
    document.getElementById('ogImageAlt').content = post.title;
    document.getElementById('articlePublishedTime').content = post.date;
    document.getElementById('articleModifiedTime').content = post.date;
    
    // Update Twitter Card tags
    document.getElementById('twitterTitle').content = post.title;
    document.getElementById('twitterDescription').content = post.metaDescription;
    document.getElementById('twitterImageAlt').content = post.title;
    
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
            <h1 class="post-title" itemprop="headline">${escapeHtml(post.title)}</h1>
            <div class="post-meta">
                <time datetime="${post.date}" itemprop="datePublished">${formatDate(post.date)}</time>
                <meta itemprop="author" content="Your Name">
                <meta itemprop="inLanguage" content="en-US">
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
    // Add BlogPosting structured data
    const blogPostingScript = document.createElement('script');
    blogPostingScript.type = 'application/ld+json';
    blogPostingScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.metaDescription,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Person",
            "name": "Your Name",
            "url": window.location.origin,
            "sameAs": [
                "https://www.linkedin.com/in/yourprofile",
                "https://twitter.com/yourhandle"
            ]
        },
        "publisher": {
            "@type": "Person",
            "name": "Your Name",
            "url": window.location.origin
        },
        "keywords": post.keywords,
        "articleBody": post.content,
        "inLanguage": "en-US",
        "url": `${window.location.origin}/post.html?id=${post.id}`,
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `${window.location.origin}/post.html?id=${post.id}`
        },
        "wordCount": post.content.split(/\s+/).length
    });
    document.head.appendChild(blogPostingScript);
    
    // Add Breadcrumb structured data
    const breadcrumbScript = document.createElement('script');
    breadcrumbScript.type = 'application/ld+json';
    breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": window.location.origin
            },
            {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": `${window.location.origin}/blog.html`
            },
            {
                "@type": "ListItem",
                "position": 3,
                "name": post.title,
                "item": `${window.location.origin}/post.html?id=${post.id}`
            }
        ]
    });
    document.head.appendChild(breadcrumbScript);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
