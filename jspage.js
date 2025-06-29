const apiKey = 'dfd9670cabf340358de846adf0f3f112'; // Replace with your actual API key

let currentCategory = 'general';

async function fetchNews(category) {
  const url = https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey};

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayArticles(data.articles, No news found for category "${category}".);
  } catch (err) {
    console.error('Error fetching news:', err);
    document.getElementById('news-container').innerHTML = <p>Failed to load news. Please try again later.</p>;
  }
}

async function searchNews(query) {
  const url = https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey};

  try {
    const res = await fetch(url);
    const data = await res.json();

    displayArticles(data.articles, No news found for "${query}".);
  } catch (err) {
    console.error('Error searching news:', err);
    document.getElementById('news-container').innerHTML = <p>Search failed. Try again later.</p>;
  }
}

function displayArticles(articles, emptyMessage) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '';

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = <p>${emptyMessage}</p>;
    return;
  }

  articles.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    newsCard.innerHTML = `
      ${article.urlToImage ? <img src="${article.urlToImage}" alt="News Image" /> : ''}
      <h2>${article.title}</h2>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank">Read more →</a>
    `;

    newsContainer.appendChild(newsCard);
  });
}

// 📰 Load default category
fetchNews(currentCategory);

// 📂 Category button listeners
document.querySelectorAll('nav button').forEach(button => {
  button.addEventListener('click', () => {
    currentCategory = button.getAttribute('data-category');
    fetchNews(currentCategory);
  });
});

// 🔍 Search button listener
document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  if (query) {
    searchNews(query);
  }
});

// 🔄 Auto-refresh news every 5 minutes (300,000 ms)
setInterval(() => {
  if (document.getElementById('search-input').value.trim()) {
    // If search is active, refresh search
    searchNews(document.getElementById('search-input').value.trim());
  } else {
    // Otherwise, refresh current category
    fetchNews(currentCategory);
  }
}, 300000); // 5 minutes

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
