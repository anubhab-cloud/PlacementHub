// Content script for LeetCode & Codeforces
console.log('[PlacementHub Sync] Content script loaded on:', window.location.href);

// Observer for LeetCode "Accepted" modal or result text
const observer = new MutationObserver((mutations) => {
  for (const mutation of mutations) {
    const text = document.body.innerText || '';
    if (text.includes('Accepted') && text.includes('Runtime')) {
      // Avoid duplicate triggers
      if (window.placementHubSynced) return;
      window.placementHubSynced = true;

      // Extract problem title
      const titleEl = document.querySelector('span.text-title-large, h4[data-cy="question-title"]');
      const title = titleEl ? titleEl.innerText : document.title.split('-')[0].trim();

      // Extract code from page or editor
      const codeLines = document.querySelectorAll('.view-lines .view-line');
      let code = Array.from(codeLines).map(l => l.innerText).join('\n');

      if (!code || code.length < 10) {
        code = '// Auto-synced solution from LeetCode\n// Verified Accepted Solution';
      }

      console.log('[PlacementHub Sync] Success detected! Syncing:', title);

      chrome.runtime.sendMessage({
        action: 'SYNC_SUBMISSION',
        data: {
          title,
          code,
          language: 'cpp',
          platform: 'LeetCode',
        },
      });

      break;
    }
  }
});

observer.observe(document.body, { childList: true, subtree: true });
