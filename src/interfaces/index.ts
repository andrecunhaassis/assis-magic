export interface MessageProps {
  content: string,
  role: string
}

export interface UserDataProps {
  name: string,
  bio: string,
  insta_bio: string,
  img: string,
  nick: string,
  color: string,
  company: string | null,
  category: string,
  links: {
    href: string,
    title: string,
    imageUrl?: string
  }[]
}

export interface UserFromSheetProps {
  row_index: number,
  full_name: string,
  description_profile: string,
  bio_insta: string,
  username_insta: string,
  profile_pic_url: string,
  links: string,
  email: string,
  company_name: string,
  business_vertical: string,
  secondary_color: string,
  gpt_success: string,
  gpt_count_usage: string,
  profile_count_generated: string,
  has_clicked_to_signin: string,
  date_created: string,
  date_updated: string
}

export interface InstagramDataProps {
  full_name: string,
  profile_pic_url: string,
  is_verified?: boolean,
}