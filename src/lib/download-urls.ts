const RELEASES_API = 'https://api.github.com/repos/bayernjf/soft-desk/releases/latest';
export const FALLBACK_URL = 'https://github.com/bayernjf/soft-desk/releases';

interface ReleaseAsset {
  name: string;
  browser_download_url: string;
  size: number;
}

export interface DownloadInfo {
  url: string;
  size: number;
}

export interface DownloadUrlsState {
  mac: DownloadInfo | null;
  win: DownloadInfo | null;
  version: string | null;
  publishedAt: string | null;
  loading: boolean;
  error: boolean;
}

export function formatBytes(bytes: number): string {
  if (!bytes || bytes <= 0) return '';
  const mb = bytes / (1024 * 1024);
  if (mb >= 1024) return `${(mb / 1024).toFixed(2)} GB`;
  return `${mb.toFixed(1)} MB`;
}

export function detectPlatform(): 'mac' | 'win' | 'unknown' {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent.toLowerCase();
  if (ua.includes('mac os x') || ua.includes('macintosh')) return 'mac';
  if (ua.includes('windows')) return 'win';
  return 'unknown';
}

export async function fetchDownloadUrls(): Promise<DownloadUrlsState> {
  try {
    const res = await fetch(RELEASES_API, {
      headers: { Accept: 'application/vnd.github+json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const release = await res.json();

    const assets: ReleaseAsset[] = release?.assets || [];
    const macAsset = assets.find((a) => a.name.endsWith('.dmg'));
    const winAsset = assets.find((a) => a.name.endsWith('.exe'));

    return {
      mac: macAsset ? { url: macAsset.browser_download_url, size: macAsset.size } : null,
      win: winAsset ? { url: winAsset.browser_download_url, size: winAsset.size } : null,
      version: release?.tag_name ?? null,
      publishedAt: release?.published_at ?? null,
      loading: false,
      error: false,
    };
  } catch {
    return { mac: null, win: null, version: null, publishedAt: null, loading: false, error: true };
  }
}
