import { fetchLatestAssets, releasesUrl } from '@bay/landing-ui/lib/releases';

export { formatBytes, detectPlatform } from '@bay/landing-ui/lib/releases';

const REPO = 'bayernjf/soft-desk';

export const FALLBACK_URL = releasesUrl(REPO);

export const fetchDownloadUrls = () => fetchLatestAssets(REPO, { mac: '.dmg', win: '.exe' });
