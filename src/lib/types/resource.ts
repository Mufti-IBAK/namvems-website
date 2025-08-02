export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'handbook' | 'guide' | 'video' | 'image' | 'research' | 'other';
  category: 'academic' | 'career' | 'professional' | 'personal' | 'other';
  fileSize?: string;
  downloadUrl: string;
  thumbnailUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  views: number;
  downloads: number;
}

export interface ResourceFormData {
  title: string;
  description: string;
  type: 'handbook' | 'guide' | 'video' | 'image' | 'research' | 'other';
  category: 'academic' | 'career' | 'professional' | 'personal' | 'other';
  downloadUrl: string;
  thumbnailUrl?: string;
  fileSize?: string;
}