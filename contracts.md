"# Backend Integration Contracts

## Overview
Convert the 3D portfolio from mock data to a full-stack application with MongoDB backend.

## Database Collections

### 1. **portfolio_info** (Single Document)
Stores personal information, social links, and about section.
```json
{
  \"_id\": ObjectId,
  \"name\": \"Alex Morgan\",
  \"title\": \"Software Developer & Data Science Enthusiast\",
  \"tagline\": \"Building intelligent solutions through code and data\",
  \"email\": \"alex.morgan@example.com\",
  \"phone\": \"+1 (555) 123-4567\",
  \"location\": \"San Francisco, CA\",
  \"resumeLink\": \"https://...\",
  \"social\": {
    \"github\": \"https://github.com/...\",
    \"linkedin\": \"https://linkedin.com/in/...\",
    \"twitter\": \"https://twitter.com/...\"
  },
  \"about\": \"I'm a passionate software developer...\",
  \"stats\": {
    \"yearsExperience\": \"5+\",
    \"projectsCompleted\": \"50+\",
    \"usersImpacted\": \"2M+\"
  }
}
```

### 2. **projects**
Stores portfolio projects.
```json
{
  \"_id\": ObjectId,
  \"title\": \"AI-Powered Code Reviewer\",
  \"description\": \"Intelligent code review system...\",
  \"image\": \"https://images.unsplash.com/...\",
  \"techStack\": [\"React\", \"Python\", \"FastAPI\", \"OpenAI API\", \"MongoDB\"],
  \"category\": \"AI/ML\",
  \"demoLink\": \"https://...\",
  \"githubLink\": \"https://github.com/...\",
  \"color\": \"#3b82f6\",
  \"order\": 1,
  \"featured\": true,
  \"createdAt\": DateTime
}
```

### 3. **experiences**
Stores work experience entries.
```json
{
  \"_id\": ObjectId,
  \"company\": \"Tech Innovations Inc.\",
  \"position\": \"Senior Software Engineer\",
  \"period\": \"Jan 2022 - Present\",
  \"location\": \"San Francisco, CA\",
  \"description\": [\"Led development...\", \"Implemented ML...\"],
  \"technologies\": [\"React\", \"Python\", \"AWS\", \"PostgreSQL\"],
  \"order\": 1,
  \"current\": true,
  \"startDate\": DateTime,
  \"endDate\": DateTime | null
}
```

### 4. **skills**
Stores technical skills with proficiency levels.
```json
{
  \"_id\": ObjectId,
  \"category\": \"frontend\",
  \"categoryLabel\": \"Frontend\",
  \"categoryColor\": \"#22d3ee\",
  \"skills\": [
    { \"name\": \"React\", \"level\": 95 },
    { \"name\": \"JavaScript/TypeScript\", \"level\": 90 }
  ],
  \"order\": 1
}
```

### 5. **contact_messages**
Stores contact form submissions.
```json
{
  \"_id\": ObjectId,
  \"name\": \"John Doe\",
  \"email\": \"john@example.com\",
  \"subject\": \"Project Inquiry\",
  \"message\": \"I'd like to discuss...\",
  \"status\": \"unread\",
  \"createdAt\": DateTime,
  \"readAt\": DateTime | null
}
```

## API Endpoints

### Portfolio Info
- `GET /api/portfolio` - Get portfolio information
- `PUT /api/portfolio` - Update portfolio information (admin)

### Projects
- `GET /api/projects` - Get all projects (with optional ?category=AI/ML filter)
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project (admin)
- `PUT /api/projects/:id` - Update project (admin)
- `DELETE /api/projects/:id` - Delete project (admin)

### Experiences
- `GET /api/experiences` - Get all experiences (sorted by order)
- `POST /api/experiences` - Create experience (admin)
- `PUT /api/experiences/:id` - Update experience (admin)
- `DELETE /api/experiences/:id` - Delete experience (admin)

### Skills
- `GET /api/skills` - Get all skill categories with skills
- `PUT /api/skills/:category` - Update skills for a category (admin)

### Contact
- `POST /api/contact` - Submit contact form message
- `GET /api/contact/messages` - Get all messages (admin)
- `PUT /api/contact/messages/:id/read` - Mark message as read (admin)

## Frontend Integration Changes

### Files to Update
1. **Remove mockData.js** - Replace with API calls
2. **Create src/services/api.js** - API client functions
3. **Update Components:**
   - Hero.jsx - Fetch portfolio info
   - About.jsx - Fetch portfolio info & stats
   - Projects.jsx - Fetch projects from API
   - Experience.jsx - Fetch experiences from API
   - Skills.jsx - Fetch skills from API
   - Contact.jsx - POST form to API, show success toast
   - Navigation.jsx & Footer.jsx - Use portfolio info from context

### Implementation Strategy
1. Create API service layer in frontend
2. Add React Context for portfolio data
3. Replace mock data imports with API calls
4. Add loading states and error handling
5. Keep same UI/UX - seamless transition

## Mock Data Location
Currently in: `/app/frontend/src/mockData.js`
- personalInfo → portfolio_info collection
- projects → projects collection
- experiences → experiences collection
- skills → skills collection

## Backend Implementation Order
1. Create MongoDB models (Pydantic schemas)
2. Implement GET endpoints first (read operations)
3. Seed database with initial mock data
4. Test GET endpoints
5. Implement POST/PUT/DELETE endpoints (write operations)
6. Add basic validation and error handling
7. Frontend integration - replace mock with API calls

## Notes
- No authentication for MVP (admin endpoints will be added later)
- All data publicly accessible for portfolio viewing
- Contact form submissions stored but no email notifications yet
- Images hosted on external services (Unsplash) - no file upload needed initially
"