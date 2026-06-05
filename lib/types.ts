export type User = {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
};

export type Link = {
  id: string;
  title: string;
  url: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  tags: string[];
  user_id: string;
  is_active: boolean;
  views: number;
  created_at: string;
  updated_at: string;
};

export type LinkCategory = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'created_at' | 'updated_at'>;
        Update: Partial<User>;
      };
      links: {
        Row: Link;
        Insert: Omit<Link, 'id' | 'created_at' | 'updated_at' | 'views'>;
        Update: Partial<Link>;
      };
      categories: {
        Row: LinkCategory;
        Insert: Omit<LinkCategory, 'id' | 'created_at'>;
        Update: Partial<LinkCategory>;
      };
    };
  };
};
