export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  banner_url: string | null;
  is_creator: boolean | null;
  bio: string | null;
  website: string | null;
}

export interface Content {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string | null;
  content_image_url: string | null;
  is_premium: boolean | null;
  published_at: string | null;
}