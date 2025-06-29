const apiKey = 'dfd9670cabf340358de846adf0f3f112'; // Replace with secure method in production

let currentCategory = 'general';

async function fetchNews(category) {
  const url = `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayArticles(data.articles, `No news found for category "${category}".`);
  } catch (err) {
    console.error('Error fetching news:', err);
    document.getElementById('news-container').innerHTML = '<p>Failed to load news. Please try again later.</p>';
  }
}

async function searchNews(query) {
  const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    displayArticles(data.articles, `No news found for "${query}".`);
  } catch (err) {
    console.error('Error searching news:', err);
    document.getElementById('news-container').innerHTML = '<p>Search failed. Try again later.</p>';
  }
}

function displayArticles(articles, emptyMessage) {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '';

  if (!articles || articles.length === 0) {
    newsContainer.innerHTML = `<p>${emptyMessage}</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  articles.forEach(article => {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';

    const imageHTML = article.urlToImage ? `<img src="${article.urlToImage}" alt="News Image" />` : '';
    newsCard.innerHTML = `
      ${imageHTML}
      <h2>${article.title}</h2>
      <p>${article.description || 'No description available.'}</p>
      <a href="${article.url}" target="_blank">Read more →</a>
    `;
    fragment.appendChild(newsCard);
  });

  newsContainer.appendChild(fragment);
}

fetchNews(currentCategory);

document.querySelectorAll('nav button').forEach(button => {
  button.addEventListener('click', () => {
    currentCategory = button.getAttribute('data-category');
    fetchNews(currentCategory);
  });
});

document.getElementById('search-button').addEventListener('click', () => {
  const query = document.getElementById('search-input').value.trim();
  if (query) searchNews(query);
});

setInterval(() => {
  const input = document.getElementById('search-input');
  if (document.activeElement === input) return;
  const query = input.value.trim();
  if (query) {
    searchNews(query);
  } else {
    fetchNews(currentCategory);
  }
}, 300000);

document.getElementById('toggle-dark-mode').addEventListener('click', () => {
  document.body.classList.toggle('dark');
});
