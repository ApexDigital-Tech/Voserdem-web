export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Educación' | 'Medio Ambiente' | 'Adulto Mayor' | 'Desarrollo';
  region?: 'Altiplano' | 'Valles' | 'Oriente' | 'Chaco';
  area?: 'Educación' | 'Medio Ambiente' | 'Productivo' | 'Intergeneracional';
  image: string;
  goal: number;
  raised: number;
  location: string;
  impact: string;
  details: string;
}

export interface Donation {
  id: string;
  donorName: string;
  email: string;
  amount: number;
  projectId: string;
  projectTitle: string;
  date: string;
  comment?: string;
}

export interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export interface BlogPost {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  category: 'Ecología' | 'Comunidad' | 'Adulto Mayor' | 'Institucional';
  author: string;
  date: string;
  readTime: string;
  featured: boolean;
  status?: 'draft' | 'published';
}

export interface Bulletin {
  id: string;
  title: string;
  summary: string;
  publishDate: string;
  issueNumber: string;
  downloadUrl?: string;
  image?: string;
  status?: 'draft' | 'published';
}

export interface Subscriber {
  id: string;
  email: string;
  date: string;
}

export interface CarouselSlide {
  id: string;
  image: string;
  badge: string;
  badgeIconName: string; // e.g. "Trees", "Users", "Landmark"
  title: string;
  description: string;
}

export interface LogoDetail {
  brandName: string;
  slogan: string;
  useCustomImage: boolean;
  imageUrl: string;
}

export interface LogoConfig {
  logoColor: LogoDetail;
  logoGold: LogoDetail;
}

