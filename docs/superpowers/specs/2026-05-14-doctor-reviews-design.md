# Doctor Reputation Review Platform — Design Spec

**Status:** Approved
**Date:** 2026-05-14
**Stack:** uni-app (Vue 3) → WeChat Mini Program
**Data:** Static JSON (doctors, reviews, departments, rankings) + localStorage for user-generated content

---

## Overview

A WeChat mini program for browsing doctor ratings, reviews, and rankings. Pure review/reputation platform — no appointments, no consultations, no medical treatment functions.

**Visual identity:** Forest green low-saturation palette, high-end relaxed aesthetic inspired by Xiaohongshu/Dianping种草 style. No hospital crosses, no medical equipment imagery.

---

## Color System

| Role | Hex | Usage |
|------|-----|-------|
| Primary green | `#3A7D6A` | Buttons, nav selection, title emphasis |
| Page background | `#F6FAF8` | Global page background (milky green) |
| Card background | `#FFFFFF` | All cards |
| Accent warm | `#E6A268` | Star ratings, hot tags, TOP badges |
| Body text | `#2D3731` | Main text color |
| Secondary text | `#7A8480` | Subtle gray text |
| Divider | `#EEF2F0` | Separators |

---

## Page Architecture

### Tab Bar Pages (always visible)

1. **Home** (`pages/index/index`) — Search, department tags, TOP rankings, recommended doctors
2. **Departments** (`pages/departments/departments`) — 4-column grid of department categories
3. **Rankings** (`pages/rankings/rankings`) — Standalone rankings/leaderboard page
4. **Profile** (`pages/profile/profile`) — User center (favorites, reviews, history, settings)

### Sub Pages (navigateTo)

5. **Doctor List** (`pages/doctor-list/doctor-list`) — Filterable doctor list for a department
6. **Doctor Detail** (`pages/doctor-detail/doctor-detail`) — Full doctor profile with ratings and reviews
7. **Write Review** (`pages/write-review/write-review`) — Submit a review with stars, tags, and text

---

## Page Details

### Home Page
- Top: Title bar "医生口碑点评" with message/settings icons
- Search bar: full-width rounded, light green border, placeholder "搜索医生姓名/科室"
- Horizontal scrollable department tags (white rounded pills, selected = green fill)
- Module 1: TOP doctor rankings — section title + "查看全部" link, horizontal scrollable cards
- Module 2: High-rated doctors — vertical card list, each a white rounded card with shadow
- No scroll-view nesting issues — use `scroll-view` with explicit height where needed

### Departments Page
- Top: Navigation bar "全部科室"
- 4-column grid of rounded square cards, each with a small icon + department name
- Clicking enters the doctor list for that department
- No appointment entry points

### Rankings Page
- Top: Navigation bar "口碑榜单"
- List of ranking categories (e.g., overall rating, most reviewed, etc.)
- Each ranking shows top doctors with rank numbers and ratings

### Doctor List Page
- Top: Title bar + filter bar (综合排序/评分最高/评价最多), selected = primary green
- Doctor cards: left circular avatar, middle: name + title + hospital, right: star rating + review count
- Below card: skill tags in light green pills
- White cards, rounded corners, subtle shadow

### Doctor Detail Page
- Top: Large profile header with light green gradient background, large circular avatar, name, title, hospital
- Prominent overall rating with full star display
- Sub-rating bars: 医术印象/耐心程度/沟通感受 — each a green progress bar
- Skill tags: flowing rounded pills, light green background
- Review section: title "用户真实点评", filter tabs: 全部/好评/中评/差评
- Review cards: anonymous nickname, date, stars, full review text, emotion tags (很耐心, 讲解清晰, etc.)
- Bottom: two large rounded buttons — 收藏医生 (outlined) and 写点评 (filled green)
- No booking, consultation, or registration buttons anywhere

### Write Review Page
- Top: Title "给医生写口碑评价"
- Section 1: 5-star tap selector, selected stars = warm orange (#E6A268)
- Section 2: Quick tag multi-select (耐心亲和, 专业靠谱, 沟通顺畅, etc.)
- Section 3: Large textarea with generous padding, placeholder "分享你的真实感受即可"
- Bottom: Fixed submit button, green rounded, prominent

### Profile Page
- Top: Light green background personal info area — avatar, nickname, bio
- Menu list: 我的收藏/我的评价/浏览记录/账号设置/帮助反馈
- Each row with right arrow chevron, minimal dividers
- Clean, no clutter

---

## Component Library

All components are custom-built, no third-party UI framework.

| Component | Description |
|-----------|-------------|
| `StarRating` | Hollow gray + filled warm-orange stars, integer stars, rounded style |
| `DoctorCard` | Reusable doctor card (avatar, name, title, hospital, rating, tags) |
| `ReviewCard` | Review display card (nickname, date, stars, text, emotion tags) |
| `SearchBar` | Rounded search input with icon |
| `DepartmentGrid` | 4-column grid of department items |
| `FilterBar` | Horizontal sort/filter tabs |
| `TagPill` | Small rounded pill for skill tags and emotion tags |
| `RatingBar` | Horizontal progress bar for sub-ratings (label + green bar) |

### Component Specs
- **Buttons:** Large border-radius, primary = green bg + white text, secondary = white bg + green border
- **Cards:** 16rpx border-radius, white bg, subtle shadow (no heavy elevation)
- **Stars:** Hollow light gray default, filled warm orange (#E6A268) on selection
- **Tags:** 8rpx border-radius, light green bg + dark green text
- **Typography:** Bold titles, regular body, generous line-height for comfortable reading

---

## Data Model

### doctors.json
```json
[
  {
    "id": "d001",
    "name": "张明远",
    "title": "主任医师",
    "hospital": "北京协和医院",
    "departmentId": "dept-01",
    "avatar": "/static/avatars/default.png",
    "rating": 4.8,
    "reviewCount": 326,
    "subRatings": { "skill": 4.9, "patience": 4.7, "communication": 4.8 },
    "tags": ["冠心病", "高血压", "心律失常"],
    "bio": "从事心血管内科临床工作30余年..."
  }
]
```

### reviews.json
```json
[
  {
    "id": "r001",
    "doctorId": "d001",
    "userName": "匿名用户",
    "date": "2026-05-10",
    "rating": 5,
    "content": "张医生非常耐心...",
    "emotionTags": ["很耐心", "讲解清晰"],
    "sentiment": "positive"
  }
]
```

### departments.json
```json
[
  { "id": "dept-01", "name": "内科", "icon": "/static/icons/neike.png" }
]
```

### rankings.json
```json
[
  { "category": "综合评价TOP10", "doctorIds": ["d001", "d003", ...] }
]
```

---

## Data Flow

1. Static data loaded from `data/*.json` at app init or page onLoad
2. User-written reviews stored in `uni.setStorageSync('userReviews', [])`
3. Favorites stored in `uni.setStorageSync('favorites', [])`
4. Browse history stored in `uni.setStorageSync('history', [])`
5. On page render, merge static data with localStorage data for display
6. Future: swap JSON loading for API calls when backend is ready

---

## Technical Notes

- Use `scroll-view` with explicit height for scrollable areas within pages (avoid nesting issues)
- Tab bar uses uni-app native `tabBar` config in `pages.json`
- Page transitions default to `navigateTo` / `switchTab` / `navigateBack`
- Static data imports: `import doctors from '@/data/doctors.json'`
- Images and icons in `static/` directory
- Global theme variables in `uni.scss` and `styles/theme.css`
- No third-party component libraries — all components custom-built

---

## Out of Scope

- Appointment booking
- Online consultation
- Medical treatment functions
- Backend API (future phase)
- User authentication (future phase)
- Payment integration
- Hospital crosses, medical imagery, white/green "hospital" aesthetic
