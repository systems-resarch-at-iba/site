/**
 * The logo files of the site, in public/brand: the wordmark (`full`) and the mark alone (`icon`).
 * The width and height are the sides of the viewBox of each file. The icon is square. The files
 * carry only the shape, and the colour comes from the text colour of the place that draws them
 * (see components/ui/logo).
 */

export type LogoKind = 'full' | 'icon'

export const LOGO_FILES: Record<LogoKind, { src: string; width: number; height: number }> = {
  full: { src: '/brand/wordmark.svg', width: 981, height: 463 },
  icon: { src: '/brand/mark.svg', width: 603, height: 603 },
}
