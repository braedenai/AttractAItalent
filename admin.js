// ============================================
// Admin Page Logic
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const loginSection = document.getElementById('loginSection');
    const adminDashboard = document.getElementById('adminDashboard');
    const loginForm = document.getElementById('loginForm');
    const postForm = document.getElementById('postForm');
    const logoutBtn = document.getElementById('logoutBtn');
    
    // Check if already logged in
    if (isAdmin()) {
        loginSection.style.display = 'none';
        adminDashboard.style.display = 'block';
        loadPosts();
        checkEditMode();
    } else {
        loginSection.style.display = 'block';
        adminDashboard.style.display = 'none';
    }
    
    // Login form handler
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('adminPassword').value;
            const loginError = document.getElementById('loginError');
            
            if (login(password)) {
                loginSection.style.display = 'none';
                adminDashboard.style.display = 'block';
                loadPosts();
            } else {
                loginError.style.display = 'block';
            }
        });
    }
    
    // Logout handler
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            logout();
        });
    }
    
    // Post form handler
    if (postForm) {
        postForm.addEventListener('submit', function(e) {
            e.preventDefault();
            savePost();
        });
    }
    
    // Auto-generate slug from title
    const postTitle = document.getElementById('postTitle');
    const postSlug = document.getElementById('postSlug');
    if (postTitle && postSlug) {
        postTitle.addEventListener('input', function() {
            if (!postSlug.dataset.modified) {
                postSlug.value = createSlug(this.value);
            }
        });
        
        postSlug.addEventListener('input', function() {
            this.dataset.modified = 'true';
        });
    }
    
    // Cancel edit button
    const cancelEdit = document.getElementById('cancelEdit');
    if (cancelEdit) {
        cancelEdit.addEventListener('click', function() {
            resetForm();
            window.history.replaceState({}, document.title, 'admin.html');
        });
    }
});

function checkEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    
    if (editId) {
        const post = getBlogPostById(editId);
        if (post) {
            loadPostForEdit(post);
        }
    }
}

function loadPostForEdit(post) {
    document.getElementById('formTitle').textContent = 'Edit Blog Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postSlug').value = post.slug;
    document.getElementById('postSlug').dataset.modified = 'true';
    document.getElementById('postExcerpt').value = post.excerpt;
    document.getElementById('postContent').value = post.content;
    document.getElementById('postKeywords').value = post.keywords;
    document.getElementById('postMetaDescription').value = post.metaDescription;
    document.getElementById('postFeatured').checked = post.featured || false;
    document.getElementById('cancelEdit').style.display = 'inline-block';
    
    // Scroll to form
    document.querySelector('.admin-form-container').scrollIntoView({ behavior: 'smooth' });
}

function savePost() {
    const postId = document.getElementById('postId').value;
    const postData = {
        title: document.getElementById('postTitle').value,
        slug: document.getElementById('postSlug').value,
        excerpt: document.getElementById('postExcerpt').value,
        content: document.getElementById('postContent').value,
        keywords: document.getElementById('postKeywords').value,
        metaDescription: document.getElementById('postMetaDescription').value,
        featured: document.getElementById('postFeatured').checked
    };
    
    if (postId) {
        // Update existing post
        updateBlogPost(postId, postData);
    } else {
        // Add new post
        addBlogPost(postData);
    }
    
    resetForm();
    loadPosts();
    
    // Show success message
    alert('Post saved successfully!');
    
    // Clear URL parameter
    window.history.replaceState({}, document.title, 'admin.html');
}

function resetForm() {
    document.getElementById('formTitle').textContent = 'Add New Blog Post';
    document.getElementById('postForm').reset();
    document.getElementById('postId').value = '';
    document.getElementById('postSlug').dataset.modified = '';
    document.getElementById('cancelEdit').style.display = 'none';
}

function loadPosts() {
    const posts = getBlogPosts();
    const postsList = document.getElementById('postsList');
    
    if (!postsList) return;
    
    if (posts.length === 0) {
        postsList.innerHTML = '<p class="no-posts">No posts yet. Create your first post above!</p>';
        return;
    }
    
    postsList.innerHTML = '';
    
    posts.forEach(post => {
        const postItem = createPostItem(post);
        postsList.appendChild(postItem);
    });
}

function createPostItem(post) {
    const div = document.createElement('div');
    div.className = 'admin-post-item';
    
    const featuredBadge = post.featured ? 
        '<span style="background: var(--primary-color); color: white; padding: 0.25rem 0.5rem; border-radius: 0.25rem; font-size: 0.75rem; margin-left: 0.5rem;">Featured</span>' : '';
    
    div.innerHTML = `
        <div class="admin-post-info">
            <h3>${escapeHtml(post.title)}${featuredBadge}</h3>
            <p>${escapeHtml(post.excerpt)}</p>
            <div class="admin-post-meta">
                <span>Slug: /${post.slug}</span>
                <span>•</span>
                <span>Published: ${formatDate(post.date)}</span>
            </div>
        </div>
        <div class="admin-post-actions">
            <button onclick="editPostFromList('${post.id}')" class="btn btn-secondary btn-small">Edit</button>
            <button onclick="deletePostFromList('${post.id}')" class="btn btn-danger btn-small">Delete</button>
        </div>
    `;
    
    return div;
}

function editPostFromList(id) {
    const post = getBlogPostById(id);
    if (post) {
        loadPostForEdit(post);
        window.history.replaceState({}, document.title, `admin.html?edit=${id}`);
    }
}

function deletePostFromList(id) {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
        deleteBlogPost(id);
        loadPosts();
        alert('Post deleted successfully!');
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
