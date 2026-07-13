// PlacementHub Auto-Sync Engine — Background Worker
console.log('[PlacementHub Sync] Background Worker Initialized.');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'SYNC_SUBMISSION') {
    console.log('[PlacementHub Sync] Intercepted successful submission:', request.data);
    
    // Send Webhook to PlacementHub Backend
    fetch('http://localhost:3001/api/github/push', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: request.data.code,
        language: request.data.language,
        problemTitle: request.data.title,
        topic: request.data.platform || 'LeetCode',
      }),
    })
      .then(res => res.json())
      .then(result => {
        console.log('[PlacementHub Sync] Webhook success:', result);
        sendResponse({ success: true, result });
      })
      .catch(err => {
        console.error('[PlacementHub Sync] Webhook error:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // async response
  }
});
