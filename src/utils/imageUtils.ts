/**
 * Convert Google Drive sharing links of format /file/d/FILE_ID/view into direct-rendering URLs.
 * That way, images from Google Drive load correctly in standard <img> tags.
 */
export function cleanGoogleDriveUrl(url: string | undefined | null): string {
  if (!url) return '';
  const trimmed = url.trim();

  // 1. Check for standard file/d/ FILE_ID match
  // e.g., https://drive.google.com/file/d/129_wWtg-on_some_id/view?usp=sharing
  const fileIdMatch = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch && fileIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${fileIdMatch[1]}`;
  }

  // 2. Check for open?id= FILE_ID match
  // e.g., https://drive.google.com/open?id=129_wWtg-on_some_id
  const openIdMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && openIdMatch && openIdMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${openIdMatch[1]}`;
  }

  // 3. Fallback for any other drive.google.com link containing /d/FILE_ID
  const dMatch = trimmed.match(/\/d\/([a-zA-Z0-9_-]+)/);
  if (trimmed.includes('drive.google.com') && dMatch && dMatch[1]) {
    return `https://lh3.googleusercontent.com/d/${dMatch[1]}`;
  }

  return trimmed;
}
