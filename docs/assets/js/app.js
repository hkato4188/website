// assets/js/app.js

const username = 'hkato4188';
const featuredRepos = [
  'hkato4188/triangulation_physics_I',
  'hkato4188/StarMap-',
  'hkato4188/Self-driving-car-neural-network-demo',
  'hkato4188/3D-Scrollable-Animations',
  'hkato4188/pear-programmers',
  'hkato4188/catfriends',
  'hkato4188/optical-illusions',
  'hkato4188/ajax-ron-swanson-quotes',
];
const recentLimit = 2;

// Dynamic copyright
(function setCopyright() {
  const year = new Date().getFullYear();
  const el = document.getElementById('copyright');
  if (el) {
    el.textContent = `© ${year} Hiroki Kato`;
  }
})();

function createRepoCard(repo) {
  const card = document.createElement('article');
  card.className =
    'bg-white rounded-2xl border border-[#efefef] shadow-soft p-4 flex flex-col hover:border-brand-accent/70 hover:-translate-y-[1px] hover:shadow-lg transition';

  const name = document.createElement('h3');
  name.className = 'text-sm font-semibold text-[#2d4263] mb-1';
  name.textContent = repo.name;

  const desc = document.createElement('p');
  desc.className = 'text-xs text-[#495464] mb-3';
  desc.textContent = repo.description || 'No description provided.';

  const meta = document.createElement('div');
  meta.className =
    'flex justify-between items-center text-[0.7rem] text-[#9aa5b1] mb-3';

  const lang = document.createElement('span');
  lang.textContent = repo.language || 'Unknown';

  const updated = document.createElement('span');
  const updatedDate = new Date(repo.updated_at);
  updated.textContent = `Updated ${updatedDate.toLocaleDateString()}`;

  meta.append(lang, updated);

  const link = document.createElement('a');
  link.href = repo.html_url;
  link.target = '_blank';
  link.rel = 'noreferrer';
  link.className =
    'mt-auto inline-flex items-center text-[0.75rem] text-[#f66b0e] hover:underline';
  link.textContent = 'View on GitHub';

  card.append(name, desc, meta, link);
  return card;
}

async function loadFeaturedRepos() {
  const grid = document.getElementById('repo-grid');
  const empty = document.getElementById('repo-empty');
  if (!grid) return;

  try {
    console.log('Loading featured repos:', featuredRepos.join(', '));
    const repos = await Promise.all(
      featuredRepos.map(async (fullName) => {
        try {
          const res = await fetch(`https://api.github.com/repos/${fullName}`);
          if (!res.ok) {
            console.warn(`Repo fetch failed for ${fullName}: ${res.status}`);
            return null;
          }
          return res.json();
        } catch (err) {
          console.warn(`Repo fetch error for ${fullName}:`, err);
          return null;
        }
      })
    );

    const filtered = repos
      .filter(Boolean)
      .filter((repo) => !repo.fork && !repo.archived);

    if (!filtered.length) {
      if (empty) empty.classList.remove('hidden');
      return;
    }

    filtered.forEach((repo) => {
      grid.appendChild(createRepoCard(repo));
    });
  } catch (err) {
    console.error('Error loading featured repos:', err);
    if (empty) {
      empty.textContent = 'Unable to load repositories right now.';
      empty.classList.remove('hidden');
    }
  }
}

async function loadRecentRepos() {
  const grid = document.getElementById('recent-grid');
  const empty = document.getElementById('recent-empty');
  if (!grid) return;

  try {
    console.log('Loading recent repos for', username);
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=${recentLimit}`
    );
    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();
    const featuredSet = new Set(featuredRepos.map((r) => r.toLowerCase()));

    const filtered = repos
      .filter((repo) => !repo.fork && !repo.archived)
      .filter((repo) => !featuredSet.has(`${repo.owner.login}/${repo.name}`.toLowerCase()));

    if (!filtered.length) {
      if (empty) empty.classList.remove('hidden');
      return;
    }

    filtered.forEach((repo) => {
      grid.appendChild(createRepoCard(repo));
    });
  } catch (err) {
    console.error('Error loading recent repos:', err);
    if (empty) {
      empty.textContent = 'Unable to load recent repositories right now.';
      empty.classList.remove('hidden');
    }
  }
}

function loadRepos() {
  loadFeaturedRepos();
  loadRecentRepos();
}

document.addEventListener('DOMContentLoaded', loadRepos);
