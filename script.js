document.addEventListener('DOMContentLoaded', function() {
    const usersList = document.getElementById('users-list');
    const userPosts = document.getElementById('user-posts');
    const loaderContainer = document.querySelector('.loader-container');
    let currentUserId = null;

    // Function to show loader
    function showLoader() {
        loaderContainer.style.display = 'flex';
    }

    // Function to hide loader
    function hideLoader() {
        loaderContainer.style.display = 'none';
    }

    // Function to fetch users
    function fetchUsers() {
        showLoader();
        return fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => response.json())
            .finally(hideLoader);
    }

    // Function to fetch posts of a specific user
    function fetchUserPosts(userId) {
        showLoader();
        return fetch(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`)
            .then(response => response.json())
            .finally(hideLoader);
    }

    // Function to display users in the list
    function displayUsers(users) {
        users.forEach(user => {
            const li = document.createElement('li');
            li.innerHTML = `
                <i class="fas fa-user"></i>
                <strong>${user.name}</strong>
                <span>${user.email}</span>
            `;
            li.dataset.userId = user.id;
            li.addEventListener('click', () => {
                document.querySelectorAll('li').forEach(item => item.classList.remove('active'));
                li.classList.add('active');
                showUserPosts(user.id);
            });
            usersList.appendChild(li);
        });

        // Show first user's posts by default
        if (users.length > 0) {
            showUserPosts(users[0].id);
            usersList.firstChild.classList.add('active');
        }
    }

    // Function to display posts of a specific user
    function showUserPosts(userId) {
        if (userId === currentUserId) return;
        currentUserId = userId;
        userPosts.innerHTML = '<div class="loader">Loading...</div>';
        fetchUserPosts(userId)
            .then(posts => {
                userPosts.innerHTML = '';
                posts.forEach(post => {
                    const postDiv = document.createElement('div');
                    postDiv.classList.add('post');
                    postDiv.innerHTML = `
                        <h3>${post.title}</h3>
                        <p>${post.body}</p>
                    `;
                    userPosts.appendChild(postDiv);
                });
            });
    }

    // Initialize the app by fetching and displaying users
    fetchUsers().then(displayUsers);
});
