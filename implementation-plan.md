# LOTUS Poetry Website - Implementation Plan

**Goal:** Transform the frontend prototype into a fully functional poetry platform
**Timeline:** 6-8 weeks (estimated for a small team)
**Priority:** Backend Integration → Core Features → Advanced Features

---

## Phase 1: Backend Foundation (Week 1-2)

### 1.1 Database Setup & Design
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **Database Choice & Setup**
  - Choose database (PostgreSQL recommended for relational data)
  - Set up database hosting (Supabase, PlanetScale, or Railway)
  - Configure connection strings and environment variables

- [ ] **Schema Design**
  ```sql
  -- Users table
  CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    bio TEXT,
    avatar_url VARCHAR,
    website VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

  -- Poems table
  CREATE TABLE poems (
    id UUID PRIMARY KEY,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR NOT NULL,
    author_id UUID REFERENCES users(id),
    published_at TIMESTAMP,
    reading_time INTEGER,
    status VARCHAR DEFAULT 'published',
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

  -- Tags table
  CREATE TABLE tags (
    id UUID PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
  );

  -- Poem_tags junction table
  CREATE TABLE poem_tags (
    poem_id UUID REFERENCES poems(id),
    tag_id UUID REFERENCES tags(id),
    PRIMARY KEY (poem_id, tag_id)
  );

  -- Comments table
  CREATE TABLE comments (
    id UUID PRIMARY KEY,
    content TEXT NOT NULL,
    author_id UUID REFERENCES users(id),
    poem_id UUID REFERENCES poems(id),
    created_at TIMESTAMP,
    updated_at TIMESTAMP
  );

  -- Likes table
  CREATE TABLE likes (
    user_id UUID REFERENCES users(id),
    poem_id UUID REFERENCES poems(id),
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, poem_id)
  );

  -- Contact submissions table
  CREATE TABLE contact_submissions (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    subject VARCHAR NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR DEFAULT 'unread',
    created_at TIMESTAMP
  );

  -- Feedback table
  CREATE TABLE feedback (
    id UUID PRIMARY KEY,
    name VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    rating INTEGER NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP
  );
  ```

- [ ] **Database Migration System**
  - Set up Prisma or Drizzle ORM
  - Create migration files
  - Set up database seeding with initial data

### 1.2 Authentication System
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **NextAuth.js Setup**
  - Install and configure NextAuth.js
  - Set up JWT and session handling
  - Configure environment variables for auth secrets

- [ ] **Authentication Providers**
  - Email/password authentication
  - Google OAuth (optional)
  - GitHub OAuth (optional)

- [ ] **Auth API Routes**
  ```typescript
  // app/api/auth/[...nextauth]/route.ts
  // app/api/auth/register/route.ts
  // app/api/auth/verify-email/route.ts
  ```

- [ ] **Auth Middleware**
  - Protected route middleware
  - User session management
  - Role-based access control (user, admin)

### 1.3 Core API Endpoints
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **User Management APIs**
  ```typescript
  // app/api/users/route.ts - GET, PUT (profile updates)
  // app/api/users/[id]/route.ts - GET user profile
  // app/api/users/[id]/poems/route.ts - GET user's poems
  ```

- [ ] **Poem Management APIs**
  ```typescript
  // app/api/poems/route.ts - GET (list), POST (create)
  // app/api/poems/[id]/route.ts - GET, PUT, DELETE
  // app/api/poems/[id]/like/route.ts - POST, DELETE
  // app/api/poems/search/route.ts - GET with query params
  ```

- [ ] **Comment APIs**
  ```typescript
  // app/api/poems/[id]/comments/route.ts - GET, POST
  // app/api/comments/[id]/route.ts - PUT, DELETE
  // app/api/comments/[id]/like/route.ts - POST, DELETE
  ```

---

## Phase 2: Convert Mockups to Functional Features (Week 3-4)

### 2.1 Authentication Integration
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **Update Login Page**
  - Replace setTimeout with actual API calls
  - Add proper error handling and validation
  - Implement redirect after successful login
  - Add "forgot password" functionality

- [ ] **Update Register Page**
  - Connect to registration API
  - Add email verification flow
  - Implement proper error messages
  - Auto-login after registration

- [ ] **User Session Management**
  - Update header to show logged-in state
  - Add user menu with profile/logout options
  - Protect authenticated routes
  - Add loading states for auth checks

### 2.2 Poem Submission System
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **Connect Submit Form to API**
  - Replace setTimeout with actual poem creation API
  - Add image upload for poem illustrations (optional)
  - Implement draft saving functionality
  - Add moderation workflow (admin approval)

- [ ] **Rich Text Editor (Optional Enhancement)**
  - Add markdown support for poem formatting
  - Preview functionality
  - Auto-save drafts

### 2.3 Comments System Backend Integration
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Real Comments API**
  - Connect comment form to backend
  - Implement real-time comment updates
  - Add comment editing and deletion
  - Add comment moderation tools

- [ ] **Comment Notifications**
  - Email notifications for new comments
  - In-app notification system

### 2.4 Contact & Feedback Systems
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Contact Form Integration**
  - Connect to database storage
  - Add email sending (SendGrid/Resend)
  - Admin dashboard for contact submissions
  - Auto-reply functionality

- [ ] **Feedback System**
  - Store feedback in database
  - Display testimonials dynamically
  - Admin moderation for feedback display

---

## Phase 3: Missing Core Features (Week 4-5)

### 3.1 Authors Section
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **Authors Listing Page**
  ```typescript
  // app/authors/page.tsx
  // Grid of author cards with bio, poem count, recent poems
  // Search and filter functionality
  ```

- [ ] **Individual Author Pages**
  ```typescript
  // app/authors/[id]/page.tsx
  // Author profile with full bio
  // List of all author's poems
  // Follow/unfollow functionality (future)
  ```

- [ ] **Author Profile Management**
  - Author can edit their profile
  - Upload profile picture
  - Manage bio and social links

### 3.2 User Dashboard
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **User Dashboard Page**
  ```typescript
  // app/dashboard/page.tsx
  // User's submitted poems
  // Draft poems
  // Liked poems
  // Comment activity
  ```

- [ ] **Poem Management**
  - Edit published poems
  - Delete poems
  - View poem statistics (likes, comments, views)

### 3.3 Advanced Search & Filtering
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Enhanced Search**
  - Full-text search in poem content
  - Advanced filters (date range, popularity)
  - Sort options (newest, popular, trending)
  - Search result highlighting

- [ ] **Search API Optimization**
  - Implement pagination
  - Add search result caching
  - Search analytics

---

## Phase 4: Advanced Features (Week 5-6)

### 4.1 Social Features
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Follow System**
  - Follow/unfollow authors
  - Following feed
  - Follower notifications

- [ ] **Poem Collections**
  - Users can create poetry collections
  - Curated theme-based collections
  - Share collections publicly

- [ ] **Social Sharing**
  - Real social media sharing (Twitter, Facebook)
  - Generate poem images for sharing
  - Copy poem link functionality

### 4.2 Admin Panel
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Admin Dashboard**
  ```typescript
  // app/admin/page.tsx
  // Site statistics
  // Recent submissions
  // Moderation queue
  ```

- [ ] **Content Moderation**
  - Approve/reject submitted poems
  - Manage reported content
  - User management (ban, warnings)

- [ ] **Analytics**
  - Track poem views and engagement
  - User activity analytics
  - Popular content reports

### 4.3 Enhanced User Experience
**Priority: LOW** 🟢

#### Tasks:
- [ ] **Bookmarking System**
  - Save favorite poems
  - Reading lists
  - Export saved poems

- [ ] **Reading Experience**
  - Poem reading history
  - Reading time tracking
  - Personalized recommendations

- [ ] **Email Notifications**
  - Weekly poetry digest
  - New poems from followed authors
  - Comment replies
  - Admin announcements

---

## Phase 5: Performance & Polish (Week 6-8)

### 5.1 Performance Optimization
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **Database Optimization**
  - Add proper indexes
  - Query optimization
  - Connection pooling

- [ ] **Frontend Performance**
  - Implement pagination for poem lists
  - Add lazy loading for images
  - Optimize bundle size

- [ ] **Caching Strategy**
  - Redis for frequently accessed data
  - CDN for static assets
  - API response caching

### 5.2 SEO & Accessibility
**Priority: MEDIUM** 🟡

#### Tasks:
- [ ] **SEO Optimization**
  - Dynamic meta tags for poems
  - Sitemap generation
  - Schema.org markup for poems
  - Open Graph tags

- [ ] **Accessibility**
  - Screen reader compatibility
  - Keyboard navigation
  - Color contrast improvements
  - Alt tags for images

### 5.3 Testing & Quality Assurance
**Priority: HIGH** 🔴

#### Tasks:
- [ ] **Unit Testing**
  - API endpoint testing
  - Component testing with Jest/Testing Library
  - Database function testing

- [ ] **Integration Testing**
  - End-to-end testing with Playwright
  - Authentication flow testing
  - Form submission testing

- [ ] **Security Audit**
  - Input validation review
  - SQL injection prevention
  - Rate limiting implementation
  - CORS configuration

---

## Technical Implementation Checklist

### Environment Setup
- [ ] Set up environment variables for all services
- [ ] Configure development, staging, and production environments
- [ ] Set up CI/CD pipeline (GitHub Actions)

### Third-Party Services
- [ ] **Database:** Supabase or PlanetScale
- [ ] **Authentication:** NextAuth.js
- [ ] **Email:** SendGrid or Resend
- [ ] **File Storage:** Cloudinary or AWS S3 (for avatars/images)
- [ ] **Analytics:** Google Analytics or Plausible
- [ ] **Error Tracking:** Sentry

### API Design Patterns
- [ ] Implement consistent error handling
- [ ] Add request/response validation with Zod
- [ ] Implement rate limiting
- [ ] Add API documentation (OpenAPI/Swagger)

---

## Priority Order for Implementation

### Week 1-2: Must-Have (🔴)
1. Database setup and schema
2. Authentication system
3. Core API endpoints
4. Basic user management

### Week 3-4: High Priority (🔴)
1. Convert login/register mockups
2. Poem submission functionality
3. Comments backend integration
4. Authors section

### Week 5-6: Medium Priority (🟡)
1. User dashboard
2. Enhanced search
3. Contact/feedback backend
4. Basic admin panel

### Week 7-8: Nice-to-Have (🟢)
1. Social features
2. Advanced admin tools
3. Performance optimization
4. Testing and polish

---

## Success Metrics

### Technical Goals
- [ ] All mockup features are fully functional
- [ ] Database handles 1000+ poems efficiently
- [ ] Page load times under 2 seconds
- [ ] 95%+ uptime
- [ ] Mobile-responsive on all features

### User Experience Goals
- [ ] Users can register, submit, and publish poems
- [ ] Comments and interactions work in real-time
- [ ] Search finds relevant content quickly
- [ ] Admin can moderate content effectively

### Business Goals
- [ ] Platform ready for public launch
- [ ] User onboarding flow is smooth
- [ ] Content moderation system prevents spam
- [ ] Analytics track user engagement

---

This plan transforms your beautiful prototype into a production-ready poetry platform. Start with Phase 1 to establish the backend foundation, then systematically work through each phase to add functionality while maintaining the excellent design you've already created.