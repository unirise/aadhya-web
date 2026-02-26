/**
 * Shared layout configuration for all activity pages.
 * Changing values here affects Activities, AssessmentStart, and any future activity screens.
 */

/** Header / content / footer panel split (percentages, must sum to 100) */
export const ACTIVITY_FLUID_SIZES: [number, number, number] = [10, 75, 15]

/** Minimum sizes for the three vertical panels */
export const ACTIVITY_FLUID_MIN_SIZES: [number, number, number] = [5, 40, 5]

/** Main content / side panel split inside the content area */
export const ACTIVITY_CONTENT_SIZES: [number, number] = [80, 20]

/** Minimum sizes for the horizontal content/panel split */
export const ACTIVITY_CONTENT_MIN_SIZES: [number, number] = [30, 10]

/** Outer padding applied to the FluidLayout wrapper */
export const ACTIVITY_LAYOUT_PADDING = 'p-2 sm:p-4'

/** Gap between stacked items in mobile layout */
export const ACTIVITY_MOBILE_GAP = 'gap-2 sm:gap-4'

/** Border radius applied to the main content card */
export const ACTIVITY_CONTENT_RADIUS = 'rounded-2xl'

/** Shared localStorage key for the media/text split inside DotXl.
 *  All activities use this so the split position is consistent when navigating. */
export const ACTIVITY_MEDIA_STORAGE_ID = 'activity'
