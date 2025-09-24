export type Visibility = 'public' | 'unlisted' | 'private' | 'direct';
export type MediaDisplay = 'show_all' | 'hide_all' | 'default';
export type LanguageCode = string | null;

export interface UserPreferences {
  'posting:default:visibility': Visibility;
  'posting:default:sensitive': boolean;
  'posting:default:language': LanguageCode;
  'reading:expand:media': MediaDisplay;
  'reading:expand:spoilers': boolean;
}

export interface PreferencesResponse {
  message?: string;
  data: UserPreferences;
}

export interface ApiError {
  message: string;
  code?: number;
  details?: any;
}