// ============================================================
//  Site configuration
// ============================================================

// Hidden admin page for viewing contact-form submissions.
// It's a hash route, so it works on any static host with no
// server config. Keep it secret-ish and hard to guess.
//
// Full URL:  https://your-site.com/#/vault-9f3a7c2e8b41-d6k2p8x
//
// Change the slug below to your own random string.
export const ADMIN_PATH = '#/vault-9f3a7c2e8b41-d6k2p8x'

// localStorage key where submissions are stored as a JSON array.
export const SUBMISSIONS_KEY = 'portfolio.submissions.v1'
