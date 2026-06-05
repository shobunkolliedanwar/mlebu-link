# 🔗 Mlebu Link - Link Directory Platform

Aplikasi fullstack modern untuk berbagi dan menemukan links terbaik di internet. Dibangun dengan Next.js, Supabase, dan teknologi modern lainnya.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-2.38-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.3-blue?style=flat-square&logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

## ✨ Features

### 👥 User Features
- 🔍 Browse dan cari links dengan powerful search
- 📁 Filter links berdasarkan kategori
- ❤️ Simpan links favorit ke local storage
- 📱 Responsive design untuk semua devices
- 🔐 Secure authentication dengan email

### 👨‍💼 Admin Features
- ➕ Upload dan manage links
- 🖼️ Automatic thumbnail optimization
- 🏷️ Tag dan kategorisasi links
- ✏️ Edit/delete links management
- 📊 View statistik links dan views
- 🔒 Role-based access control

### 🎯 Technical Features
- ⚡ Next.js 14 App Router
- 🔒 Row Level Security (RLS)
- 📦 Image optimization dengan Sharp
- 🎨 Smooth animations dengan Framer Motion
- 🔔 Toast notifications
- 🌙 Dark mode UI
- 📊 Pagination & filtering
- ✅ Type-safe dengan TypeScript

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm atau yarn
- Supabase account (gratis)

### Installation

1. **Clone repository**
```bash
git clone https://github.com/yourusername/mlebu-link.git
cd mlebu-link
```

2. **Install dependencies**
```bash
npm install
```

3. **Setup Supabase**
   - Go to https://supabase.com
   - Create new project
   - Copy API keys

4. **Configure environment variables**
```bash
cp .env.local.example .env.local
# Edit .env.local dengan Supabase credentials Anda
```

5. **Setup database**
   - Go to Supabase SQL Editor
   - Paste dan run script dari `DATABASE_SCHEMA.sql`

6. **Run development server**
```bash
npm run dev
```

Visit `http://localhost:3000` 🎉

## 📚 Documentation

- **[Setup Guide](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[API Documentation](./SETUP_GUIDE.md#api-documentation)** - API endpoints reference
- **[Database Schema](./DATABASE_SCHEMA.sql)** - Database structure

## 🏗️ Project Structure

```
mlebu-link/
├── app/
│   ├── api/                    # API Routes
│   │   ├── auth/               # Authentication
│   │   ├── links/              # Link management
│   │   └── upload/             # File uploads
│   ├── admin/                  # Admin dashboard
│   ├── auth/                   # Auth pages
│   ├── dashboard/              # User dashboard
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/                 # React components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── LinkCard.tsx
│   ├── LinkFormModal.tsx
│   └── Skeleton.tsx
├── lib/                        # Utilities & helpers
│   ├── auth.ts                 # Auth functions
│   ├── supabase.ts             # Supabase client
│   ├── types.ts                # TypeScript types
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
├── .env.local.example          # Environment template
├── DATABASE_SCHEMA.sql         # Database setup
├── SETUP_GUIDE.md              # Setup documentation
├── next.config.js              # Next.js config
├── package.json                # Dependencies
├── postcss.config.js           # PostCSS config
├── tailwind.config.ts          # Tailwind config
└── tsconfig.json               # TypeScript config
```

## 🔑 Key Technologies

- **Frontend**: React 18, Next.js 14, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Image Processing**: Sharp
- **Notifications**: react-hot-toast

## 🔐 Security Features

- ✅ Row Level Security (RLS) di database
- ✅ Admin-only sensitive operations
- ✅ Secure password handling
- ✅ Token-based authentication
- ✅ HTTPS in production
- ✅ Environment variables protection
- ✅ CORS configuration
- ✅ SQL injection prevention

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/signup          - Register new user
POST   /api/auth/signin          - Login user
```

### Links
```
GET    /api/links                - Get all links (paginated)
POST   /api/links/create         - Create new link (admin only)
PUT    /api/links/[id]           - Update link (admin only)
DELETE /api/links/[id]           - Delete link (admin only)
```

### Upload
```
POST   /api/upload               - Upload image (admin only)
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

```bash
# Push code to GitHub
git add .
git commit -m "Initial commit"
git push

# Go to vercel.com and connect your repository
# Add environment variables
# Deploy!
```

### Environment Variables untuk Production
```
NEXT_PUBLIC_SUPABASE_URL = your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key
SUPABASE_SERVICE_ROLE_KEY = your_service_role_key
NEXT_PUBLIC_APP_URL = https://yourdomain.com
```

### Custom Domain
1. Add domain di Vercel dashboard
2. Configure DNS records
3. Update `NEXT_PUBLIC_APP_URL`

## 🎓 Learning Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Framer Motion](https://www.framer.com/motion/)

## 🐛 Troubleshooting

### Environment variables not loading?
- Restart dev server (`npm run dev`)
- Check `.env.local` exists in project root
- Make sure variables don't have spaces

### Supabase connection failed?
- Verify credentials in `.env.local`
- Check Supabase project is active
- Ensure network access is allowed

### Upload not working?
- Check storage bucket `mlebu-link-uploads` exists
- Verify RLS policies allow uploads
- File size must be < 5MB

### Admin role not working?
- Update user role in Supabase:
  ```sql
  UPDATE users SET role = 'admin' WHERE email = 'your@email.com'
  ```

## 📱 Screenshots

### Home Page
- Browse all links dengan thumbnail preview
- Search dan filter functionality
- Responsive grid layout

### Admin Dashboard
- Create/edit/delete links
- Upload dan optimize images
- View statistics

### User Dashboard
- View favorite links
- Search personal collection
- Manage preferences

## 🤝 Contributing

Contributions are welcome! Feel free to:
1. Fork repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - See LICENSE file for details

## 👨‍💻 Author

Developed with ❤️ for the community

## 📞 Support

- 📧 Email: support@mlebulink.com
- 💬 Issues: GitHub Issues
- 📚 Docs: Read SETUP_GUIDE.md

## 🎯 Roadmap

- [ ] Dark/Light mode toggle
- [ ] User profiles
- [ ] Share collections
- [ ] Analytics dashboard
- [ ] Social features
- [ ] Mobile app
- [ ] API webhooks
- [ ] Export/Import

## 🙏 Acknowledgments

- Supabase untuk amazing backend
- Vercel untuk hosting
- Tailwind CSS community
- Next.js team
- Semua contributors

---

Made with 🚀 using Next.js, Supabase & Tailwind CSS

**Ready to get started?** See [SETUP_GUIDE.md](./SETUP_GUIDE.md) for detailed instructions!
