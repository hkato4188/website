// assets/js/app.js

const username = 'hkato4188';

// Dynamic copyright
(function setCopyright() {
  const year = new Date().getFullYear();
  const el = document.getElementById('copyright');
  if (el) {
    el.textContent = `© ${year} Hiroki Kato`;
  }
})();

// Load GitHub repos into the Projects section
async function loadRepos() {
  const grid = document.getElementById('repo-grid');
  const empty = document.getElementById('repo-empty');

  if (!grid) return;

  try {
    console.log('Loading repos for', username);
    const res = await fetch(
      `https://api.github.com/users/${username}/repos?sort=updated&per_page=8`
    );

    if (!res.ok) {
      throw new Error(`GitHub API error: ${res.status}`);
    }

    const repos = await res.json();

    // Filter out forks / archived
    const filtered = repos.filter((repo) => !repo.fork && !repo.archived);

    if (!filtered.length) {
      if (empty) empty.classList.remove('hidden');
      return;
    }

    filtered.forEach((repo) => {
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
      grid.appendChild(card);
    });
  } catch (err) {
    console.error('Error loading repos:', err);
    if (empty) {
      empty.textContent = 'Unable to load repositories right now.';
      empty.classList.remove('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', loadRepos);
