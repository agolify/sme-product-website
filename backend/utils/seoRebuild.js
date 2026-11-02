const triggerSeoRebuild = async () => {
  const hookUrl = process.env.VERCEL_SEO_DEPLOY_HOOK_URL;
  if (!hookUrl) return;

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      signal: AbortSignal.timeout(5000)
    });
    if (!response.ok) {
      console.error(`SEO rebuild hook returned status ${response.status}`);
    }
  } catch (error) {
    console.error('Unable to trigger SEO rebuild:', error.message);
  }
};

module.exports = triggerSeoRebuild;
