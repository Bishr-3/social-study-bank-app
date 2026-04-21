export type ResourceType = 'pdf' | 'ppt' | 'video'
export type EducationLevel = 'primary' | 'middle' | 'high' | 'university'

export interface Profile {
  id: string
  username: string | null
  full_name: string | null
  avatar_url: string | null
  role: 'student' | 'teacher' | 'admin'
  education_level: EducationLevel | null
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  name_ar: string
  slug: string
  icon: string
  color: string
  education_level: EducationLevel
  created_at: string
}

export interface Resource {
  id: string
  title: string
  title_ar: string | null
  description: string | null
  type: ResourceType
  file_url: string | null
  youtube_url: string | null
  thumbnail_url: string | null
  subject_id: string
  uploaded_by: string
  views: number
  downloads: number
  likes: number
  is_approved: boolean
  created_at: string
  updated_at: string
  subject?: Subject
  uploader?: Profile
}

export interface Collection {
  id: string
  title: string
  description: string | null
  user_id: string
  is_public: boolean
  created_at: string
  resources?: Resource[]
}

export interface Tag {
  id: string
  name: string
  slug: string
}
