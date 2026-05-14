# Doctor Review Platform — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a WeChat mini program (uni-app + Vue 3) for browsing doctor ratings, reviews, and rankings with a forest-green aesthetic.

**Architecture:** 7 pages (4 tab bar + 3 sub-pages), 7 reusable components, static JSON data with localStorage for user-generated content. Pages.json drives routing and native tab bar. All components custom-built, no UI framework.

**Tech Stack:** uni-app 3 (Vue 3 + Vite), WeChat Mini Program target, SCSS, static JSON data files, uni.Storage API

---

## File Structure Map

```
doctor-reviews/
├── package.json                    # Dependencies
├── vite.config.js                  # Vite + uni-app plugin
├── pages.json                      # Routes, tabBar, window style
├── manifest.json                   # WeChat mp config
├── App.vue                         # Root component
├── main.js                         # Entry point
├── uni.scss                        # Global SCSS variables
├── data/
│   ├── departments.json            # 8 departments
│   ├── doctors.json                # 20 doctors
│   ├── reviews.json                # 40+ reviews
│   └── rankings.json               # 3 ranking categories
├── static/
│   └── tabbar/                     # 8 tab bar icon PNGs (filled + outlined pairs)
├── components/
│   ├── StarRating.vue              # Star display/input
│   ├── TagPill.vue                 # Rounded pill tag
│   ├── SearchBar.vue               # Search input
│   ├── FilterBar.vue               # Sort/filter tabs
│   ├── RatingBar.vue               # Labeled progress bar
│   ├── DoctorCard.vue              # Doctor list item card
│   └── ReviewCard.vue              # Review display card
├── pages/
│   ├── index/index.vue             # Home (Tab 1)
│   ├── departments/departments.vue # Department grid (Tab 2)
│   ├── rankings/rankings.vue       # Rankings (Tab 3)
│   ├── profile/profile.vue         # Profile (Tab 4)
│   ├── doctor-list/doctor-list.vue # Doctor list for a department
│   ├── doctor-detail/doctor-detail.vue # Doctor profile + reviews
│   └── write-review/write-review.vue   # Submit review form
└── utils/
    └── storage.js                  # localStorage helpers (favorites, reviews, history)
```

---

### Task 1: Project Scaffold — package.json and build config

**Files:**
- Create: `package.json`
- Create: `vite.config.js`

- [ ] **Step 1: Write package.json**

```json
{
  "name": "doctor-reviews",
  "version": "1.0.0",
  "description": "医生口碑点评小程序",
  "scripts": {
    "dev:mp-weixin": "uni -p mp-weixin",
    "build:mp-weixin": "uni build -p mp-weixin"
  },
  "dependencies": {
    "vue": "^3.4.0",
    "@dcloudio/uni-app": "3.0.0-alpha-4020420240108001",
    "@dcloudio/uni-mp-weixin": "3.0.0-alpha-4020420240108001",
    "@dcloudio/uni-ui": "^1.5.0"
  },
  "devDependencies": {
    "@dcloudio/vite-plugin-uni": "3.0.0-alpha-4020420240108001",
    "sass": "^1.70.0",
    "vite": "^5.0.0"
  }
}
```

- [ ] **Step 2: Write vite.config.js**

```js
import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'

export default defineConfig({
  plugins: [uni()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  }
})
```

- [ ] **Step 3: Install dependencies**

Run: `cd ~/Desktop/doctor-reviews && npm install`

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json vite.config.js
git commit -m "feat: scaffold uni-app project with package.json and vite config"
```

---

### Task 2: Project Scaffold — uni-app config files

**Files:**
- Create: `main.js`
- Create: `App.vue`
- Create: `pages.json`
- Create: `manifest.json`
- Create: `uni.scss`

- [ ] **Step 1: Write main.js**

```js
import { createSSRApp } from 'vue'
import App from './App.vue'

export function createApp() {
  const app = createSSRApp(App)
  return { app }
}
```

- [ ] **Step 2: Write App.vue**

```vue
<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {
  console.log('医生口碑点评 启动')
})
</script>

<style lang="scss">
@import '@/uni.scss';

page {
  background-color: $bg-page;
  color: $text-primary;
  font-family: -apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', sans-serif;
  font-size: 28rpx;
  line-height: 1.6;
}
</style>
```

- [ ] **Step 3: Write pages.json**

```json
{
  "easycom": {
    "autoscan": true,
    "custom": {
      "^c-(.*)": "@/components/$1.vue"
    }
  },
  "pages": [
    {
      "path": "pages/index/index",
      "style": {
        "navigationBarTitleText": "医生口碑点评",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/departments/departments",
      "style": {
        "navigationBarTitleText": "全部科室",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/rankings/rankings",
      "style": {
        "navigationBarTitleText": "口碑榜单",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/profile/profile",
      "style": {
        "navigationBarTitleText": "个人中心",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/doctor-list/doctor-list",
      "style": {
        "navigationBarTitleText": "医生列表",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/doctor-detail/doctor-detail",
      "style": {
        "navigationBarTitleText": "医生详情",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    },
    {
      "path": "pages/write-review/write-review",
      "style": {
        "navigationBarTitleText": "写口碑评价",
        "navigationBarBackgroundColor": "#F6FAF8",
        "navigationBarTextStyle": "black"
      }
    }
  ],
  "tabBar": {
    "color": "#7A8480",
    "selectedColor": "#3A7D6A",
    "backgroundColor": "#FFFFFF",
    "borderStyle": "white",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "static/tabbar/home.png",
        "selectedIconPath": "static/tabbar/home-active.png"
      },
      {
        "pagePath": "pages/departments/departments",
        "text": "科室分类",
        "iconPath": "static/tabbar/dept.png",
        "selectedIconPath": "static/tabbar/dept-active.png"
      },
      {
        "pagePath": "pages/rankings/rankings",
        "text": "口碑榜单",
        "iconPath": "static/tabbar/rank.png",
        "selectedIconPath": "static/tabbar/rank-active.png"
      },
      {
        "pagePath": "pages/profile/profile",
        "text": "个人中心",
        "iconPath": "static/tabbar/profile.png",
        "selectedIconPath": "static/tabbar/profile-active.png"
      }
    ]
  },
  "globalStyle": {
    "navigationBarBackgroundColor": "#F6FAF8",
    "navigationBarTextStyle": "black",
    "navigationBarTitleText": "医生口碑点评",
    "backgroundColor": "#F6FAF8"
  }
}
```

- [ ] **Step 4: Write manifest.json**

```json
{
  "name": "医生口碑点评",
  "appid": "__UNI__",
  "description": "医生口碑评价平台",
  "versionName": "1.0.0",
  "versionCode": "100",
  "mp-weixin": {
    "appid": "",
    "setting": {
      "urlCheck": true,
      "es6": true,
      "postcss": true,
      "minified": true
    },
    "usingComponents": true,
    "permission": {}
  }
}
```

- [ ] **Step 5: Write uni.scss**

```scss
/* 森系主题全局 SCSS 变量 */
$primary: #3A7D6A;
$primary-light: rgba(58, 125, 106, 0.08);
$primary-light2: rgba(58, 125, 106, 0.15);

$bg-page: #F6FAF8;
$bg-card: #FFFFFF;
$accent: #E6A268;
$accent-light: rgba(230, 162, 104, 0.12);

$text-primary: #2D3731;
$text-secondary: #7A8480;
$divider: #EEF2F0;

$radius-sm: 8rpx;
$radius-md: 16rpx;
$radius-lg: 24rpx;
$radius-round: 100rpx;

$shadow-card: 0 4rpx 16rpx rgba(0, 0, 0, 0.04);
$shadow-hover: 0 8rpx 24rpx rgba(0, 0, 0, 0.08);

$font-title: 36rpx;
$font-body: 28rpx;
$font-sm: 24rpx;
$font-xs: 20rpx;

$btn-height: 88rpx;
```

- [ ] **Step 6: Create page stub files**

Create minimal placeholder for each of the 7 pages so the project compiles. Each file at `pages/<name>/<name>.vue`:

```vue
<template>
  <view class="page">
    <text>Placeholder</text>
  </view>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.page {
  padding: 32rpx;
  background-color: $bg-page;
  min-height: 100vh;
}
</style>
```

Create directories and stubs for: `pages/index/index.vue`, `pages/departments/departments.vue`, `pages/rankings/rankings.vue`, `pages/profile/profile.vue`, `pages/doctor-list/doctor-list.vue`, `pages/doctor-detail/doctor-detail.vue`, `pages/write-review/write-review.vue`.

- [ ] **Step 7: Verify project compiles**

Run: `cd ~/Desktop/doctor-reviews && npx uni build -p mp-weixin`
Expected: Build succeeds, `dist/dev/mp-weixin/` created with compiled pages.

- [ ] **Step 8: Commit**

```bash
git add main.js App.vue pages.json manifest.json uni.scss pages/
git commit -m "feat: add uni-app config files and page stubs"
```

---

### Task 3: Static Data — departments, doctors, rankings

**Files:**
- Create: `data/departments.json`
- Create: `data/doctors.json`
- Create: `data/rankings.json`

- [ ] **Step 1: Write data/departments.json**

```json
[
  { "id": "dept-01", "name": "内科", "icon": "🫀" },
  { "id": "dept-02", "name": "外科", "icon": "🔪" },
  { "id": "dept-03", "name": "儿科", "icon": "👶" },
  { "id": "dept-04", "name": "妇产科", "icon": "🌸" },
  { "id": "dept-05", "name": "骨科", "icon": "🦴" },
  { "id": "dept-06", "name": "皮肤科", "icon": "✨" },
  { "id": "dept-07", "name": "眼科", "icon": "👁" },
  { "id": "dept-08", "name": "口腔科", "icon": "🦷" }
]
```

- [ ] **Step 2: Write data/doctors.json**

```json
[
  { "id": "d001", "name": "张明远", "title": "主任医师", "hospital": "北京协和医院", "departmentId": "dept-01", "avatar": "/static/avatars/d001.png", "rating": 4.8, "reviewCount": 326, "subRatings": { "skill": 4.9, "patience": 4.7, "communication": 4.8 }, "tags": ["冠心病", "高血压", "心律失常"], "bio": "从事心血管内科临床工作30余年，擅长冠心病介入治疗和高血压综合管理。" },
  { "id": "d002", "name": "李雪芳", "title": "副主任医师", "hospital": "北京协和医院", "departmentId": "dept-01", "avatar": "/static/avatars/default.png", "rating": 4.6, "reviewCount": 218, "subRatings": { "skill": 4.5, "patience": 4.8, "communication": 4.7 }, "tags": ["糖尿病", "甲状腺疾病", "内分泌失调"], "bio": "内分泌代谢疾病专家，专注于糖尿病个体化治疗和甲状腺疾病管理。" },
  { "id": "d003", "name": "王志强", "title": "主任医师", "hospital": "上海瑞金医院", "departmentId": "dept-01", "avatar": "/static/avatars/default.png", "rating": 4.9, "reviewCount": 452, "subRatings": { "skill": 4.9, "patience": 4.8, "communication": 4.9 }, "tags": ["消化道疾病", "肝病", "胃肠镜"], "bio": "消化内科资深专家，擅长消化道早期肿瘤筛查和肝病综合诊疗。" },
  { "id": "d004", "name": "陈伟明", "title": "主任医师", "hospital": "北京大学第一医院", "departmentId": "dept-02", "avatar": "/static/avatars/default.png", "rating": 4.7, "reviewCount": 189, "subRatings": { "skill": 4.8, "patience": 4.5, "communication": 4.6 }, "tags": ["腹腔镜手术", "胆囊切除", "疝气修补"], "bio": "普外科专家，擅长腹腔镜微创手术，累计完成手术超过8000台。" },
  { "id": "d005", "name": "赵美玲", "title": "副主任医师", "hospital": "上海瑞金医院", "departmentId": "dept-02", "avatar": "/static/avatars/default.png", "rating": 4.5, "reviewCount": 156, "subRatings": { "skill": 4.6, "patience": 4.4, "communication": 4.5 }, "tags": ["甲状腺手术", "乳腺疾病", "微创手术"], "bio": "甲乳外科专家，专注甲状腺和乳腺疾病的微创手术治疗。" },
  { "id": "d006", "name": "刘小慧", "title": "主任医师", "hospital": "北京儿童医院", "departmentId": "dept-03", "avatar": "/static/avatars/default.png", "rating": 4.9, "reviewCount": 512, "subRatings": { "skill": 4.9, "patience": 5.0, "communication": 4.9 }, "tags": ["小儿呼吸", "哮喘", "过敏性疾病"], "bio": "儿科呼吸专业专家，尤其擅长儿童哮喘规范化治疗和过敏性疾病管理，对待小朋友耐心细致。" },
  { "id": "d007", "name": "孙大伟", "title": "主任医师", "hospital": "复旦大学附属儿科医院", "departmentId": "dept-03", "avatar": "/static/avatars/default.png", "rating": 4.8, "reviewCount": 398, "subRatings": { "skill": 4.8, "patience": 4.9, "communication": 4.7 }, "tags": ["小儿消化", "营养不良", "生长发育"], "bio": "儿科消化与营养专家，帮助数千名儿童改善生长发育问题。" },
  { "id": "d008", "name": "周雅文", "title": "主任医师", "hospital": "北京协和医院", "departmentId": "dept-04", "avatar": "/static/avatars/default.png", "rating": 4.7, "reviewCount": 275, "subRatings": { "skill": 4.8, "patience": 4.6, "communication": 4.7 }, "tags": ["高危妊娠", "产前诊断", "妇科肿瘤"], "bio": "妇产科专家，擅长高危妊娠管理和妇科肿瘤早期筛查。" },
  { "id": "d009", "name": "吴嘉慧", "title": "副主任医师", "hospital": "上海第一妇婴保健院", "departmentId": "dept-04", "avatar": "/static/avatars/default.png", "rating": 4.6, "reviewCount": 198, "subRatings": { "skill": 4.5, "patience": 4.8, "communication": 4.7 }, "tags": ["孕期保健", "自然分娩", "产后康复"], "bio": "产科专家，倡导温柔分娩理念，在产后康复领域有丰富经验。" },
  { "id": "d010", "name": "黄建国", "title": "主任医师", "hospital": "北京大学第三医院", "departmentId": "dept-05", "avatar": "/static/avatars/default.png", "rating": 4.8, "reviewCount": 342, "subRatings": { "skill": 4.9, "patience": 4.7, "communication": 4.6 }, "tags": ["关节置换", "运动损伤", "骨折"], "bio": "骨科关节外科专家，擅长人工关节置换和运动损伤修复，手术技术精湛。" },
  { "id": "d011", "name": "杨建平", "title": "主任医师", "hospital": "上海长征医院", "departmentId": "dept-05", "avatar": "/static/avatars/default.png", "rating": 4.7, "reviewCount": 267, "subRatings": { "skill": 4.8, "patience": 4.5, "communication": 4.6 }, "tags": ["脊柱外科", "椎间盘突出", "微创脊柱"], "bio": "脊柱外科专家，擅长椎间孔镜微创治疗椎间盘突出症。" },
  { "id": "d012", "name": "林美琪", "title": "副主任医师", "hospital": "北京协和医院", "departmentId": "dept-06", "avatar": "/static/avatars/default.png", "rating": 4.6, "reviewCount": 234, "subRatings": { "skill": 4.5, "patience": 4.8, "communication": 4.7 }, "tags": ["痤疮", "色斑", "皮肤美容"], "bio": "皮肤美容专家，擅长痤疮综合治疗和色素性疾病激光治疗，沟通细致温柔。" },
  { "id": "d013", "name": "陈思远", "title": "主任医师", "hospital": "复旦大学附属华山医院", "departmentId": "dept-06", "avatar": "/static/avatars/default.png", "rating": 4.9, "reviewCount": 487, "subRatings": { "skill": 4.9, "patience": 4.8, "communication": 4.9 }, "tags": ["银屑病", "湿疹", "荨麻疹"], "bio": "皮肤免疫性疾病专家，在银屑病生物制剂治疗领域全国领先。" },
  { "id": "d014", "name": "张晓光", "title": "主任医师", "hospital": "北京同仁医院", "departmentId": "dept-07", "avatar": "/static/avatars/default.png", "rating": 4.8, "reviewCount": 315, "subRatings": { "skill": 4.9, "patience": 4.7, "communication": 4.6 }, "tags": ["白内障", "青光眼", "近视手术"], "bio": "眼科专家，擅长白内障超声乳化手术和屈光手术，累计手术过万例。" },
  { "id": "d015", "name": "何小琴", "title": "副主任医师", "hospital": "上海眼病防治中心", "departmentId": "dept-07", "avatar": "/static/avatars/default.png", "rating": 4.5, "reviewCount": 178, "subRatings": { "skill": 4.5, "patience": 4.6, "communication": 4.5 }, "tags": ["儿童近视", "斜视", "弱视"], "bio": "小儿眼科专家，专注儿童近视防控和斜弱视治疗。" },
  { "id": "d016", "name": "马晓东", "title": "主任医师", "hospital": "北京大学口腔医院", "departmentId": "dept-08", "avatar": "/static/avatars/default.png", "rating": 4.7, "reviewCount": 289, "subRatings": { "skill": 4.8, "patience": 4.5, "communication": 4.6 }, "tags": ["种植牙", "牙齿矫正", "口腔修复"], "bio": "口腔种植与修复专家，擅长即刻种植和全口咬合重建。" },
  { "id": "d017", "name": "郑雨桐", "title": "副主任医师", "hospital": "上海第九人民医院", "departmentId": "dept-08", "avatar": "/static/avatars/default.png", "rating": 4.8, "reviewCount": 356, "subRatings": { "skill": 4.8, "patience": 4.9, "communication": 4.8 }, "tags": ["牙齿矫正", "隐形正畸", "儿童齿科"], "bio": "口腔正畸专家，擅长隐形矫正和儿童早期矫治，亲和力强深受患者喜爱。" },
  { "id": "d018", "name": "唐雅琴", "title": "主任医师", "hospital": "北京协和医院", "departmentId": "dept-01", "avatar": "/static/avatars/default.png", "rating": 4.6, "reviewCount": 203, "subRatings": { "skill": 4.7, "patience": 4.5, "communication": 4.6 }, "tags": ["肾病", "透析", "肾移植"], "bio": "肾内科专家，擅长慢性肾病综合管理和血液透析治疗。" },
  { "id": "d019", "name": "许文斌", "title": "主任医师", "hospital": "北京安贞医院", "departmentId": "dept-01", "avatar": "/static/avatars/default.png", "rating": 4.9, "reviewCount": 478, "subRatings": { "skill": 5.0, "patience": 4.7, "communication": 4.8 }, "tags": ["冠心病", "心脏支架", "心脏搭桥"], "bio": "心血管介入专家，年完成PCI手术超千例，技术精湛果断。" },
  { "id": "d020", "name": "沈悦然", "title": "副主任医师", "hospital": "上海儿童医学中心", "departmentId": "dept-03", "avatar": "/static/avatars/default.png", "rating": 4.7, "reviewCount": 245, "subRatings": { "skill": 4.7, "patience": 4.9, "communication": 4.8 }, "tags": ["小儿心脏", "先天性心脏病", "川崎病"], "bio": "小儿心脏内科专家，对先天性心脏病诊断和川崎病治疗有丰富经验，沟通温柔打消家长焦虑。" }
]
```

- [ ] **Step 3: Write data/rankings.json**

```json
[
  { "id": "rank-1", "category": "综合评价TOP10", "doctorIds": ["d019", "d003", "d006", "d013", "d001", "d010", "d014", "d017", "d007", "d008"] },
  { "id": "rank-2", "category": "耐心亲和TOP10", "doctorIds": ["d006", "d017", "d007", "d020", "d012", "d002", "d004", "d009", "d013", "d019"] },
  { "id": "rank-3", "category": "评价最多TOP10", "doctorIds": ["d006", "d013", "d019", "d003", "d007", "d017", "d010", "d001", "d016", "d014"] }
]
```

- [ ] **Step 4: Commit**

```bash
git add data/
git commit -m "feat: add static data for departments, doctors, and rankings"
```

---

### Task 4: Static Data — reviews

**Files:**
- Create: `data/reviews.json`

- [ ] **Step 1: Write data/reviews.json**

```json
[
  { "id": "r001", "doctorId": "d001", "userName": "匿名用户", "date": "2026-05-10", "rating": 5, "content": "张医生非常耐心，详细解释了我的病情和治疗方案，开了药效果很好，下次复查还找他！", "emotionTags": ["很耐心", "讲解清晰"], "sentiment": "positive" },
  { "id": "r002", "doctorId": "d001", "userName": "老王", "date": "2026-05-03", "rating": 5, "content": "父亲冠心病多年，张医生做的手术非常成功，术后恢复也很好。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r003", "doctorId": "d001", "userName": "热心市民小刘", "date": "2026-04-28", "rating": 4, "content": "排队时间有点长，但医生看病质量很高。", "emotionTags": ["等待较久"], "sentiment": "neutral" },
  { "id": "r004", "doctorId": "d002", "userName": "糖友小王", "date": "2026-05-08", "rating": 5, "content": "李医生帮我调整了降糖方案，血糖终于稳定了，太感谢了！", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r005", "doctorId": "d002", "userName": "匿名用户", "date": "2026-04-20", "rating": 4, "content": "医生人很好，态度温柔，就是诊室人多等了一个小时。", "emotionTags": ["等待较久"], "sentiment": "neutral" },
  { "id": "r006", "doctorId": "d003", "userName": "胃病患者老周", "date": "2026-05-12", "rating": 5, "content": "王主任做的胃肠镜一点也不难受，技术太好了，而且全程跟我讲解看到了什么。", "emotionTags": ["专业靠谱", "讲解清晰"], "sentiment": "positive" },
  { "id": "r007", "doctorId": "d003", "userName": "小康", "date": "2026-05-05", "rating": 5, "content": "肝病治了两年终于在王医生这看到了希望，真心推荐。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r008", "doctorId": "d003", "userName": "匿名用户", "date": "2026-04-25", "rating": 5, "content": "医生水平没话说，就是号太难挂了。", "emotionTags": [], "sentiment": "positive" },
  { "id": "r009", "doctorId": "d006", "userName": "果果妈妈", "date": "2026-05-11", "rating": 5, "content": "刘医生是我见过最有耐心的儿科医生！孩子咳嗽两个月没好，她仔细问诊后调整了治疗方案，三天就好转了。", "emotionTags": ["很耐心", "讲解清晰", "专业靠谱"], "sentiment": "positive" },
  { "id": "r010", "doctorId": "d006", "userName": "豆豆爸", "date": "2026-05-06", "rating": 5, "content": "宝宝哮喘控制得很好，刘医生还特意打电话问恢复情况，感动。", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r011", "doctorId": "d006", "userName": "匿名用户", "date": "2026-04-30", "rating": 5, "content": "医者仁心，对小朋友真的温柔又有办法，哄得孩子吃药都不哭了。", "emotionTags": ["很耐心"], "sentiment": "positive" },
  { "id": "r012", "doctorId": "d010", "userName": "运动达人老李", "date": "2026-05-09", "rating": 5, "content": "黄医生做的膝关节置换，术后三个月就能正常走路了，之前疼了五年啊！", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r013", "doctorId": "d010", "userName": "匿名用户", "date": "2026-04-15", "rating": 4, "content": "手术做得好，但术后查房时间有点短，想问的问题没来得及问完。", "emotionTags": [], "sentiment": "neutral" },
  { "id": "r014", "doctorId": "d013", "userName": "银屑病康复者", "date": "2026-05-12", "rating": 5, "content": "十年的银屑病在陈医生这里用了生物制剂好了90%，简直是奇迹！感谢陈医生！", "emotionTags": ["专业靠谱", "讲解清晰"], "sentiment": "positive" },
  { "id": "r015", "doctorId": "d013", "userName": "湿疹宝宝妈", "date": "2026-05-01", "rating": 5, "content": "孩子湿疹终于控制住了，陈医生开的药膏温和有效，还教了很多护理方法。", "emotionTags": ["很耐心", "讲解清晰"], "sentiment": "positive" },
  { "id": "r016", "doctorId": "d017", "userName": "正畸中的小美", "date": "2026-05-10", "rating": 5, "content": "郑医生做隐形矫正一年了，效果很好，每次复诊都很温柔。强烈推荐！", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r017", "doctorId": "d017", "userName": "匿名用户", "date": "2026-04-22", "rating": 4, "content": "矫正效果不错，就是价格有点贵。", "emotionTags": [], "sentiment": "neutral" },
  { "id": "r018", "doctorId": "d019", "userName": "心脏病友老赵", "date": "2026-05-11", "rating": 5, "content": "许主任放支架手艺一流，半个小时就做完了，现在胸口不闷了。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r019", "doctorId": "d019", "userName": "匿名用户", "date": "2026-05-04", "rating": 5, "content": "急诊送进去许主任亲自做的手术，从死神手里把我爸拉了回来，全家感恩不尽。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r020", "doctorId": "d019", "userName": "术后患者", "date": "2026-04-18", "rating": 5, "content": "技术绝对一流，讲解也清楚，就是查房的时候话不多，可能太忙了。", "emotionTags": ["专业靠谱", "讲解清晰"], "sentiment": "positive" },
  { "id": "r021", "doctorId": "d004", "userName": "胆结石康复者", "date": "2026-05-07", "rating": 5, "content": "陈主任做的腹腔镜胆囊切除，三个小孔就解决了，术后第二天就下床了。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r022", "doctorId": "d004", "userName": "匿名用户", "date": "2026-04-10", "rating": 3, "content": "手术做得还行，但术前沟通不够充分，有点紧张。", "emotionTags": [], "sentiment": "negative" },
  { "id": "r023", "doctorId": "d007", "userName": "乐乐妈妈", "date": "2026-05-08", "rating": 5, "content": "孙医生看孩子消化问题很有一套，之前不爱吃饭的孩子现在顿顿光盘。", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r024", "doctorId": "d007", "userName": "匿名用户", "date": "2026-04-25", "rating": 5, "content": "对小朋友很有一套，诊疗像做游戏一样，孩子一点都不抗拒。", "emotionTags": ["很耐心"], "sentiment": "positive" },
  { "id": "r025", "doctorId": "d012", "userName": "痘痘终结者", "date": "2026-05-06", "rating": 5, "content": "林医生开的药膏和口服药配合治疗两个月，脸上痘痘消了八成，而且医生每次都很温柔。", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r026", "doctorId": "d012", "userName": "美容达人", "date": "2026-04-16", "rating": 5, "content": "激光祛斑效果很好，林医生手法轻柔，恢复期护理指导也很仔细。", "emotionTags": ["很耐心", "讲解清晰"], "sentiment": "positive" },
  { "id": "r027", "doctorId": "d014", "userName": "重见光明老徐", "date": "2026-05-05", "rating": 5, "content": "张主任做的白内障手术，五分钟就完事了，第二天视力恢复到1.0，太神奇了。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r028", "doctorId": "d014", "userName": "匿名用户", "date": "2026-04-20", "rating": 4, "content": "手术效果很好，就是术前等待时间太长了。", "emotionTags": ["等待较久"], "sentiment": "neutral" },
  { "id": "r029", "doctorId": "d016", "userName": "种牙大叔", "date": "2026-05-09", "rating": 5, "content": "马主任种的牙用了两年了，跟真牙一样好用，这次又来找他种第二颗。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r030", "doctorId": "d016", "userName": "怕疼的小陈", "date": "2026-04-12", "rating": 4, "content": "技术好但打麻药的时候稍微疼了点，整体体验不错。", "emotionTags": [], "sentiment": "neutral" },
  { "id": "r031", "doctorId": "d008", "userName": "新手妈妈小周", "date": "2026-05-10", "rating": 5, "content": "周医生从我怀孕到生产一路保驾护航，高龄产妇平安生下宝宝。", "emotionTags": ["很耐心", "专业靠谱"], "sentiment": "positive" },
  { "id": "r032", "doctorId": "d009", "userName": "二胎宝妈", "date": "2026-05-03", "rating": 5, "content": "吴医生真的太温柔了，产检每次都很耐心解答问题。", "emotionTags": ["很耐心", "讲解清晰"], "sentiment": "positive" },
  { "id": "r033", "doctorId": "d005", "userName": "甲状腺术后", "date": "2026-04-28", "rating": 4, "content": "赵医生做的甲状腺结节切除，刀口很小恢复快，就是住院期间查房少了点。", "emotionTags": ["专业靠谱"], "sentiment": "neutral" },
  { "id": "r034", "doctorId": "d011", "userName": "腰椎康复者", "date": "2026-05-07", "rating": 5, "content": "杨主任做的椎间孔镜，做完腰就不疼了，之前腿麻的症状也消失了。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r035", "doctorId": "d015", "userName": "近视娃妈", "date": "2026-04-30", "rating": 4, "content": "何医生给孩子配的角膜塑形镜效果不错，近视度数一年没涨。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r036", "doctorId": "d018", "userName": "透析患者家属", "date": "2026-05-02", "rating": 4, "content": "唐医生对肾病管理很专业，透析方案调了好几次找到最适合的。", "emotionTags": ["专业靠谱"], "sentiment": "positive" },
  { "id": "r037", "doctorId": "d020", "userName": "川崎宝宝妈", "date": "2026-05-08", "rating": 5, "content": "沈医生诊断出川崎病很及时，治疗也规范，孩子现在完全康复了。感恩！", "emotionTags": ["很耐心", "专业靠谱", "讲解清晰"], "sentiment": "positive" },
  { "id": "r038", "doctorId": "d020", "userName": "匿名用户", "date": "2026-04-19", "rating": 5, "content": "医生人美心善，跟孩子沟通超有耐心，每次看诊都让孩子先放松下来。", "emotionTags": ["很耐心"], "sentiment": "positive" },
  { "id": "r039", "doctorId": "d001", "userName": "退休教师老陈", "date": "2026-03-15", "rating": 5, "content": "张医生对老年患者特别尊重，每次都用通俗的话讲明白病情。", "emotionTags": ["很耐心", "讲解清晰"], "sentiment": "positive" },
  { "id": "r040", "doctorId": "d006", "userName": "小宇妈妈", "date": "2026-03-20", "rating": 5, "content": "全国最好的儿科医生之一，上次半夜孩子喘不过气，多亏刘医生之前教的应急方法。", "emotionTags": ["很耐心", "专业靠谱", "讲解清晰"], "sentiment": "positive" }
]
```

- [ ] **Step 2: Commit**

```bash
git add data/reviews.json
git commit -m "feat: add 40 sample review records"
```

---

### Task 5: Storage Utility

**Files:**
- Create: `utils/storage.js`

- [ ] **Step 1: Write utils/storage.js**

```js
const FAVORITES_KEY = 'doctor_favorites'
const REVIEWS_KEY = 'user_reviews'
const HISTORY_KEY = 'browse_history'

export function getFavorites() {
  return uni.getStorageSync(FAVORITES_KEY) || []
}

export function addFavorite(doctorId) {
  const favs = getFavorites()
  if (!favs.includes(doctorId)) {
    favs.push(doctorId)
    uni.setStorageSync(FAVORITES_KEY, favs)
  }
}

export function removeFavorite(doctorId) {
  const favs = getFavorites().filter(id => id !== doctorId)
  uni.setStorageSync(FAVORITES_KEY, favs)
}

export function isFavorite(doctorId) {
  return getFavorites().includes(doctorId)
}

export function getUserReviews() {
  return uni.getStorageSync(REVIEWS_KEY) || []
}

export function addUserReview(review) {
  const reviews = getUserReviews()
  reviews.unshift({ ...review, id: `ur${Date.now()}`, date: new Date().toISOString().slice(0, 10) })
  uni.setStorageSync(REVIEWS_KEY, reviews)
}

export function getHistory() {
  return uni.getStorageSync(HISTORY_KEY) || []
}

export function addHistory(doctorId) {
  const history = getHistory().filter(id => id !== doctorId)
  history.unshift(doctorId)
  uni.setStorageSync(HISTORY_KEY, history.slice(0, 20))
}
```

- [ ] **Step 2: Commit**

```bash
git add utils/storage.js
git commit -m "feat: add localStorage utility for favorites, reviews, and history"
```

---

### Task 6: StarRating Component

**Files:**
- Create: `components/StarRating.vue`

- [ ] **Step 1: Write components/StarRating.vue**

```vue
<template>
  <view class="star-rating" :style="{ gap: gap + 'rpx' }">
    <text
      v-for="i in max"
      :key="i"
      class="star"
      :class="{ filled: i <= modelValue, interactive: interactive }"
      :style="{ fontSize: size + 'rpx' }"
      @tap="interactive && $emit('update:modelValue', i)"
    >{{ i <= modelValue ? '★' : '☆' }}</text>
    <text v-if="showCount && count" class="count">({{ count }})</text>
  </view>
</template>

<script setup>
defineProps({
  modelValue: { type: Number, default: 0 },
  max: { type: Number, default: 5 },
  size: { type: Number, default: 32 },
  gap: { type: Number, default: 4 },
  interactive: { type: Boolean, default: false },
  showCount: { type: Boolean, default: false },
  count: { type: Number, default: 0 }
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.star-rating {
  display: flex;
  align-items: center;
}
.star {
  color: #E0E5E2;
  line-height: 1;
  &.filled {
    color: $accent;
  }
  &.interactive {
    cursor: pointer;
  }
}
.count {
  color: $text-secondary;
  font-size: $font-sm;
  margin-left: 8rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/StarRating.vue
git commit -m "feat: add StarRating component"
```

---

### Task 7: TagPill and SearchBar Components

**Files:**
- Create: `components/TagPill.vue`
- Create: `components/SearchBar.vue`

- [ ] **Step 1: Write components/TagPill.vue**

```vue
<template>
  <view
    class="tag-pill"
    :class="{ 'tag-active': active, 'tag-tappable': tappable }"
    @tap="tappable && $emit('tap')"
  >
    {{ label }}
  </view>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  active: { type: Boolean, default: false },
  tappable: { type: Boolean, default: false }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.tag-pill {
  display: inline-block;
  padding: 8rpx 20rpx;
  border-radius: $radius-sm;
  font-size: $font-sm;
  color: $text-secondary;
  background-color: $bg-card;
  border: 1rpx solid $divider;
  white-space: nowrap;
  &.tag-active {
    color: #fff;
    background-color: $primary;
    border-color: $primary;
  }
  &.tag-tappable {
    cursor: pointer;
  }
}
</style>
```

- [ ] **Step 2: Write components/SearchBar.vue**

```vue
<template>
  <view class="search-bar" @tap="$emit('tap')">
    <text class="search-icon">🔍</text>
    <text class="placeholder">{{ placeholder }}</text>
  </view>
</template>

<script setup>
defineProps({
  placeholder: { type: String, default: '搜索医生姓名/科室' }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.search-bar {
  display: flex;
  align-items: center;
  height: 72rpx;
  background-color: $bg-card;
  border: 2rpx solid $primary-light2;
  border-radius: $radius-round;
  padding: 0 28rpx;
}
.search-icon {
  margin-right: 12rpx;
  font-size: 28rpx;
}
.placeholder {
  color: $text-secondary;
  font-size: $font-body;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add components/TagPill.vue components/SearchBar.vue
git commit -m "feat: add TagPill and SearchBar components"
```

---

### Task 8: FilterBar and RatingBar Components

**Files:**
- Create: `components/FilterBar.vue`
- Create: `components/RatingBar.vue`

- [ ] **Step 1: Write components/FilterBar.vue**

```vue
<template>
  <view class="filter-bar">
    <view
      v-for="item in options"
      :key="item.value"
      class="filter-item"
      :class="{ active: modelValue === item.value }"
      @tap="$emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </view>
  </view>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
  modelValue: { type: String, default: '' }
})
defineEmits(['update:modelValue'])
</script>

<style lang="scss" scoped>
.filter-bar {
  display: flex;
  gap: 16rpx;
  padding: 20rpx 32rpx;
  background-color: $bg-card;
}
.filter-item {
  padding: 10rpx 24rpx;
  border-radius: $radius-round;
  font-size: $font-sm;
  color: $text-secondary;
  background-color: $bg-page;
  cursor: pointer;
  &.active {
    color: $primary;
    background-color: $primary-light;
    font-weight: 600;
  }
}
</style>
```

- [ ] **Step 2: Write components/RatingBar.vue**

```vue
<template>
  <view class="rating-bar">
    <text class="label">{{ label }}</text>
    <view class="bar-wrap">
      <view class="bar" :style="{ width: percent + '%' }"></view>
    </view>
    <text class="value">{{ value.toFixed(1) }}</text>
  </view>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: { type: String, required: true },
  value: { type: Number, default: 0 },
  max: { type: Number, default: 5 }
})

const percent = computed(() => (props.value / props.max) * 100)
</script>

<style lang="scss" scoped>
.rating-bar {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 8rpx 0;
}
.label {
  width: 120rpx;
  font-size: $font-sm;
  color: $text-secondary;
  text-align: right;
}
.bar-wrap {
  flex: 1;
  height: 12rpx;
  background-color: $divider;
  border-radius: 6rpx;
  overflow: hidden;
}
.bar {
  height: 100%;
  background-color: $primary;
  border-radius: 6rpx;
  transition: width 0.3s;
}
.value {
  width: 48rpx;
  font-size: $font-sm;
  color: $primary;
  font-weight: 600;
}
</style>
```

- [ ] **Step 3: Commit**

```bash
git add components/FilterBar.vue components/RatingBar.vue
git commit -m "feat: add FilterBar and RatingBar components"
```

---

### Task 9: DoctorCard Component

**Files:**
- Create: `components/DoctorCard.vue`

- [ ] **Step 1: Write components/DoctorCard.vue**

```vue
<template>
  <view class="doctor-card" @tap="$emit('tap')">
    <view class="card-left">
      <view class="avatar">
        <text class="avatar-placeholder">{{ doctor.name[0] }}</text>
      </view>
    </view>
    <view class="card-mid">
      <view class="name-row">
        <text class="name">{{ doctor.name }}</text>
        <text class="title">{{ doctor.title }}</text>
      </view>
      <text class="hospital">{{ doctor.hospital }}</text>
      <view class="tags" v-if="doctor.tags && doctor.tags.length">
        <c-TagPill v-for="tag in doctor.tags.slice(0, 3)" :key="tag" :label="tag" />
      </view>
    </view>
    <view class="card-right">
      <c-StarRating :modelValue="Math.round(doctor.rating)" :size="24" />
      <text class="rating-num">{{ doctor.rating }}</text>
      <text class="review-count">{{ doctor.reviewCount }}条评价</text>
    </view>
  </view>
</template>

<script setup>
defineProps({
  doctor: { type: Object, required: true }
})
defineEmits(['tap'])
</script>

<style lang="scss" scoped>
.doctor-card {
  display: flex;
  align-items: center;
  padding: 28rpx;
  margin: 0 32rpx 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.card-left { margin-right: 20rpx; }
.avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-placeholder {
  font-size: 40rpx;
  color: $primary;
  font-weight: 700;
}
.card-mid {
  flex: 1;
  min-width: 0;
}
.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 4rpx;
}
.name {
  font-size: $font-title;
  font-weight: 700;
  color: $text-primary;
}
.title {
  font-size: $font-xs;
  color: $primary;
  background-color: $primary-light;
  padding: 2rpx 10rpx;
  border-radius: $radius-sm;
}
.hospital {
  font-size: $font-sm;
  color: $text-secondary;
  margin-bottom: 8rpx;
}
.tags {
  display: flex;
  gap: 8rpx;
  flex-wrap: wrap;
}
.card-right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-left: 16rpx;
}
.rating-num {
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}
.review-count {
  font-size: $font-xs;
  color: $text-secondary;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/DoctorCard.vue
git commit -m "feat: add DoctorCard component"
```

---

### Task 10: ReviewCard Component

**Files:**
- Create: `components/ReviewCard.vue`

- [ ] **Step 1: Write components/ReviewCard.vue**

```vue
<template>
  <view class="review-card">
    <view class="review-header">
      <view class="reviewer-info">
        <view class="reviewer-avatar">
          <text class="avatar-icon">👤</text>
        </view>
        <view>
          <text class="reviewer-name">{{ review.userName }}</text>
          <text class="review-date">{{ review.date }}</text>
        </view>
      </view>
      <c-StarRating :modelValue="review.rating" :size="24" />
    </view>
    <text class="review-content">{{ review.content }}</text>
    <view class="emotion-tags" v-if="review.emotionTags && review.emotionTags.length">
      <c-TagPill v-for="tag in review.emotionTags" :key="tag" :label="tag" />
    </view>
  </view>
</template>

<script setup>
defineProps({
  review: { type: Object, required: true }
})
</script>

<style lang="scss" scoped>
.review-card {
  padding: 28rpx;
  margin: 0 32rpx 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16rpx;
}
.reviewer-info {
  display: flex;
  align-items: center;
  gap: 16rpx;
}
.reviewer-avatar {
  width: 64rpx;
  height: 64rpx;
  border-radius: 50%;
  background-color: $bg-page;
  display: flex;
  align-items: center;
  justify-content: center;
}
.avatar-icon { font-size: 28rpx; }
.reviewer-name {
  display: block;
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.review-date {
  font-size: $font-xs;
  color: $text-secondary;
}
.review-content {
  font-size: $font-body;
  color: $text-primary;
  line-height: 1.7;
}
.emotion-tags {
  display: flex;
  gap: 8rpx;
  margin-top: 16rpx;
  flex-wrap: wrap;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add components/ReviewCard.vue
git commit -m "feat: add ReviewCard component"
```

---

### Task 11: Home Page

**Files:**
- Modify: `pages/index/index.vue`

- [ ] **Step 1: Write pages/index/index.vue**

```vue
<template>
  <view class="page">
    <!-- Search -->
    <view class="search-wrap">
      <c-SearchBar @tap="onSearchTap" />
    </view>

    <!-- Department Tags -->
    <scroll-view class="dept-scroll" scroll-x show-scrollbar="false">
      <view class="dept-tags">
        <c-TagPill
          v-for="dept in departments"
          :key="dept.id"
          :label="dept.name"
          :active="activeDept === dept.id"
          tappable
          @tap="onDeptTap(dept.id)"
        />
      </view>
    </scroll-view>

    <!-- TOP Rankings -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">口碑TOP医生榜单</text>
        <text class="section-more" @tap="switchTab('/pages/rankings/rankings')">查看全部 ›</text>
      </view>
      <scroll-view class="top-scroll" scroll-x show-scrollbar="false">
        <view
          v-for="doctor in topDoctors"
          :key="doctor.id"
          class="top-card"
          @tap="goDetail(doctor.id)"
        >
          <view class="top-rank">TOP{{ topDoctors.indexOf(doctor) + 1 }}</view>
          <view class="top-avatar">
            <text class="top-avatar-text">{{ doctor.name[0] }}</text>
          </view>
          <text class="top-name">{{ doctor.name }}</text>
          <text class="top-dept">{{ getDeptName(doctor.departmentId) }}</text>
          <c-StarRating :modelValue="Math.round(doctor.rating)" :size="22" />
        </view>
      </scroll-view>
    </view>

    <!-- High-Rated Doctors -->
    <view class="section">
      <view class="section-header">
        <text class="section-title">高分人气医生推荐</text>
      </view>
      <c-DoctorCard
        v-for="doctor in highRatedDoctors"
        :key="doctor.id"
        :doctor="doctor"
        @tap="goDetail(doctor.id)"
      />
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import departments from '@/data/departments.json'
import doctors from '@/data/doctors.json'
import rankings from '@/data/rankings.json'
import { addHistory } from '@/utils/storage.js'

const activeDept = ref('')

const topDoctorIds = rankings[0].doctorIds.slice(0, 6)
const topDoctors = computed(() =>
  topDoctorIds.map(id => doctors.find(d => d.id === id)).filter(Boolean)
)

const highRatedDoctors = computed(() =>
  [...doctors].sort((a, b) => b.rating - a.rating).slice(0, 8)
)

function getDeptName(deptId) {
  return departments.find(d => d.id === deptId)?.name || ''
}

function onDeptTap(deptId) {
  activeDept.value = deptId
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?deptId=${deptId}` })
}

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}

function onSearchTap() {
  // For now search just navigates to doctor list without filter
  uni.navigateTo({ url: '/pages/doctor-list/doctor-list' })
}

function switchTab(url) {
  uni.switchTab({ url })
}
</script>

<style lang="scss" scoped>
.page {
  padding-bottom: 32rpx;
  background-color: $bg-page;
  min-height: 100vh;
}
.search-wrap {
  padding: 20rpx 32rpx;
}
.dept-scroll {
  white-space: nowrap;
  padding: 0 32rpx 16rpx;
}
.dept-tags {
  display: inline-flex;
  gap: 12rpx;
}
.section {
  margin-top: 24rpx;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx 16rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
}
.section-more {
  font-size: $font-sm;
  color: $primary;
}
.top-scroll {
  white-space: nowrap;
  padding-left: 32rpx;
}
.top-card {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  width: 180rpx;
  padding: 24rpx 16rpx;
  margin-right: 16rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
}
.top-rank {
  font-size: $font-xs;
  color: $accent;
  font-weight: 700;
  margin-bottom: 8rpx;
  background-color: $accent-light;
  padding: 2rpx 12rpx;
  border-radius: $radius-sm;
}
.top-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 8rpx;
}
.top-avatar-text {
  font-size: 32rpx;
  color: $primary;
  font-weight: 700;
}
.top-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
}
.top-dept {
  font-size: $font-xs;
  color: $text-secondary;
  margin-bottom: 8rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/index/index.vue
git commit -m "feat: implement Home page with search, dept tags, rankings, and doctor list"
```

---

### Task 12: Departments Page

**Files:**
- Modify: `pages/departments/departments.vue`

- [ ] **Step 1: Write pages/departments/departments.vue**

```vue
<template>
  <view class="page">
    <view class="grid">
      <view
        v-for="dept in departments"
        :key="dept.id"
        class="dept-card"
        @tap="goDept(dept.id)"
      >
        <text class="dept-icon">{{ dept.icon }}</text>
        <text class="dept-name">{{ dept.name }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import departments from '@/data/departments.json'

function goDept(deptId) {
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?deptId=${deptId}` })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx;
  background-color: $bg-page;
  min-height: 100vh;
}
.grid {
  display: flex;
  flex-wrap: wrap;
}
.dept-card {
  width: calc(25% - 18rpx);
  margin: 0 24rpx 24rpx 0;
  padding: 28rpx 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  &:nth-child(4n) {
    margin-right: 0;
  }
}
.dept-icon {
  font-size: 48rpx;
  margin-bottom: 12rpx;
}
.dept-name {
  font-size: $font-sm;
  color: $text-primary;
  font-weight: 500;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/departments/departments.vue
git commit -m "feat: implement Departments page with 4-column grid"
```

---

### Task 13: Rankings Page

**Files:**
- Modify: `pages/rankings/rankings.vue`

- [ ] **Step 1: Write pages/rankings/rankings.vue**

```vue
<template>
  <scroll-view class="page" scroll-y>
    <view v-for="rank in rankings" :key="rank.id" class="rank-section">
      <text class="rank-title">{{ rank.category }}</text>
      <view v-for="(doctor, index) in getRankedDoctors(rank)" :key="doctor.id">
        <view class="rank-item" @tap="goDetail(doctor.id)">
          <view class="rank-num" :class="{ 'top3': index < 3 }">
            {{ index + 1 }}
          </view>
          <view class="rank-avatar">
            <text class="rank-avatar-text">{{ doctor.name[0] }}</text>
          </view>
          <view class="rank-info">
            <text class="rank-name">{{ doctor.name }}</text>
            <text class="rank-desc">{{ doctor.title }} · {{ doctor.hospital }}</text>
          </view>
          <view class="rank-rating">
            <text class="rank-score">{{ doctor.rating }}</text>
            <text class="rank-label">分</text>
          </view>
        </view>
        <view class="rank-divider" v-if="index < rank.doctorIds.length - 1" />
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import rankings from '@/data/rankings.json'
import doctors from '@/data/doctors.json'
import { addHistory } from '@/utils/storage.js'

function getRankedDoctors(rank) {
  return rank.doctorIds.map(id => doctors.find(d => d.id === id)).filter(Boolean)
}

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}
</script>

<style lang="scss" scoped>
.page {
  padding: 24rpx 0;
  background-color: $bg-page;
  min-height: 100vh;
}
.rank-section {
  margin: 0 32rpx 32rpx;
}
.rank-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 20rpx;
}
.rank-item {
  display: flex;
  align-items: center;
  padding: 20rpx 0;
}
.rank-num {
  width: 48rpx;
  height: 48rpx;
  text-align: center;
  line-height: 48rpx;
  font-size: $font-body;
  font-weight: 700;
  color: $text-secondary;
  &.top3 {
    color: $accent;
    font-size: 34rpx;
  }
}
.rank-avatar {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary-light2, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 20rpx;
}
.rank-avatar-text {
  font-size: 28rpx;
  color: $primary;
  font-weight: 700;
}
.rank-info {
  flex: 1;
  min-width: 0;
}
.rank-name {
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  display: block;
}
.rank-desc {
  font-size: $font-xs;
  color: $text-secondary;
}
.rank-rating {
  display: flex;
  align-items: baseline;
}
.rank-score {
  font-size: 40rpx;
  font-weight: 700;
  color: $primary;
}
.rank-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-left: 4rpx;
}
.rank-divider {
  height: 1rpx;
  background-color: $divider;
  margin-left: 48rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/rankings/rankings.vue
git commit -m "feat: implement Rankings page with categorized lists"
```

---

### Task 14: Doctor List Page

**Files:**
- Modify: `pages/doctor-list/doctor-list.vue`

- [ ] **Step 1: Write pages/doctor-list/doctor-list.vue**

```vue
<template>
  <view class="page">
    <c-FilterBar
      :options="sortOptions"
      v-model="sortBy"
    />
    <scroll-view class="list-scroll" scroll-y>
      <c-DoctorCard
        v-for="doctor in sortedDoctors"
        :key="doctor.id"
        :doctor="doctor"
        @tap="goDetail(doctor.id)"
      />
      <view v-if="sortedDoctors.length === 0" class="empty">
        <text>暂无医生数据</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import doctors from '@/data/doctors.json'
import departments from '@/data/departments.json'
import { addHistory } from '@/utils/storage.js'

const deptId = ref('')
const sortBy = ref('default')

const sortOptions = [
  { label: '综合排序', value: 'default' },
  { label: '评分最高', value: 'rating' },
  { label: '评价最多', value: 'reviews' }
]

onLoad((options) => {
  if (options?.deptId) {
    deptId.value = options.deptId
    const dept = departments.find(d => d.id === deptId.value)
    if (dept) {
      uni.setNavigationBarTitle({ title: dept.name + '医生' })
    }
  }
})

const filteredDoctors = computed(() => {
  if (!deptId.value) return doctors
  return doctors.filter(d => d.departmentId === deptId.value)
})

const sortedDoctors = computed(() => {
  const list = [...filteredDoctors.value]
  if (sortBy.value === 'rating') return list.sort((a, b) => b.rating - a.rating)
  if (sortBy.value === 'reviews') return list.sort((a, b) => b.reviewCount - a.reviewCount)
  return list
})

function goDetail(doctorId) {
  addHistory(doctorId)
  uni.navigateTo({ url: `/pages/doctor-detail/doctor-detail?id=${doctorId}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
}
.list-scroll {
  height: calc(100vh - 100rpx);
  padding-top: 16rpx;
}
.empty {
  text-align: center;
  padding: 100rpx 0;
  color: $text-secondary;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/doctor-list/doctor-list.vue
git commit -m "feat: implement Doctor List page with filtering and sorting"
```

---

### Task 15: Doctor Detail Page

**Files:**
- Modify: `pages/doctor-detail/doctor-detail.vue`

- [ ] **Step 1: Write pages/doctor-detail/doctor-detail.vue**

```vue
<template>
  <scroll-view class="page" scroll-y v-if="doctor">
    <!-- Profile Header -->
    <view class="header">
      <view class="header-avatar">
        <text class="header-avatar-text">{{ doctor.name[0] }}</text>
      </view>
      <text class="header-name">{{ doctor.name }}</text>
      <text class="header-sub">{{ doctor.title }} · {{ doctor.hospital }}</text>
      <text class="header-bio">{{ doctor.bio }}</text>
    </view>

    <!-- Overall Rating -->
    <view class="rating-section">
      <view class="overall-rating">
        <text class="overall-num">{{ doctor.rating }}</text>
        <text class="overall-label">综合评分</text>
      </view>
      <view class="sub-ratings">
        <c-RatingBar label="医术印象" :value="doctor.subRatings.skill" />
        <c-RatingBar label="耐心程度" :value="doctor.subRatings.patience" />
        <c-RatingBar label="沟通感受" :value="doctor.subRatings.communication" />
      </view>
    </view>

    <!-- Skill Tags -->
    <view class="tags-section" v-if="doctor.tags && doctor.tags.length">
      <text class="block-title">擅长领域</text>
      <view class="tags-wrap">
        <c-TagPill v-for="tag in doctor.tags" :key="tag" :label="tag" />
      </view>
    </view>

    <!-- Reviews -->
    <view class="reviews-section">
      <text class="block-title">用户真实点评</text>
      <c-FilterBar
        :options="reviewFilters"
        v-model="reviewFilter"
      />
      <c-ReviewCard
        v-for="review in filteredReviews"
        :key="review.id"
        :review="review"
      />
      <view v-if="filteredReviews.length === 0" class="empty-text">
        暂无评价
      </view>
    </view>

    <!-- Bottom Buttons -->
    <view class="bottom-bar">
      <view class="btn-fav" :class="{ faved: isFaved }" @tap="toggleFav">
        <text>{{ isFaved ? '★ 已收藏' : '☆ 收藏医生' }}</text>
      </view>
      <view class="btn-review" @tap="goWriteReview">
        <text>✎ 写点评</text>
      </view>
    </view>
  </scroll-view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import doctors from '@/data/doctors.json'
import reviews from '@/data/reviews.json'
import { isFavorite, addFavorite, removeFavorite, getUserReviews } from '@/utils/storage.js'

const doctor = ref(null)
const isFaved = ref(false)
const reviewFilter = ref('all')

const reviewFilters = [
  { label: '全部', value: 'all' },
  { label: '好评', value: 'positive' },
  { label: '中评', value: 'neutral' },
  { label: '差评', value: 'negative' }
]

onLoad((options) => {
  const id = options?.id
  doctor.value = doctors.find(d => d.id === id)
  if (doctor.value) {
    isFaved.value = isFavorite(id)
    uni.setNavigationBarTitle({ title: doctor.value.name })
  }
})

const allReviews = computed(() => {
  if (!doctor.value) return []
  const staticReviews = reviews.filter(r => r.doctorId === doctor.value.id)
  const userReviews = getUserReviews().filter(r => r.doctorId === doctor.value.id)
  return [...userReviews, ...staticReviews]
})

const filteredReviews = computed(() => {
  if (reviewFilter.value === 'all') return allReviews.value
  return allReviews.value.filter(r => r.sentiment === reviewFilter.value)
})

function toggleFav() {
  if (!doctor.value) return
  if (isFaved.value) {
    removeFavorite(doctor.value.id)
  } else {
    addFavorite(doctor.value.id)
  }
  isFaved.value = !isFaved.value
}

function goWriteReview() {
  if (!doctor.value) return
  uni.navigateTo({ url: `/pages/write-review/write-review?doctorId=${doctor.value.id}&doctorName=${doctor.value.name}` })
}
</script>

<style lang="scss" scoped>
.page {
  background-color: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.header {
  background: linear-gradient(180deg, $primary-light 0%, $bg-card 100%);
  padding: 48rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.header-avatar {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, $primary, $primary-light);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 20rpx;
}
.header-avatar-text {
  font-size: 60rpx;
  color: #fff;
  font-weight: 700;
}
.header-name {
  font-size: 44rpx;
  font-weight: 700;
  color: $text-primary;
}
.header-sub {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.header-bio {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 16rpx;
  text-align: center;
  line-height: 1.5;
  padding: 0 16rpx;
}
.rating-section {
  background-color: $bg-card;
  margin: 24rpx 32rpx;
  padding: 32rpx;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  display: flex;
  gap: 32rpx;
}
.overall-rating {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 120rpx;
}
.overall-num {
  font-size: 72rpx;
  font-weight: 700;
  color: $primary;
  line-height: 1;
}
.overall-label {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.sub-ratings {
  flex: 1;
}
.tags-section {
  margin: 0 32rpx 24rpx;
}
.block-title {
  font-size: 34rpx;
  font-weight: 700;
  color: $text-primary;
  display: block;
  margin-bottom: 16rpx;
}
.tags-wrap {
  display: flex;
  gap: 10rpx;
  flex-wrap: wrap;
}
.reviews-section {
  margin-top: 8rpx;
  padding: 0 0 16rpx;
}
.empty-text {
  text-align: center;
  padding: 48rpx;
  color: $text-secondary;
  font-size: $font-sm;
}
.bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  gap: 20rpx;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: $bg-card;
  border-top: 1rpx solid $divider;
}
.btn-fav {
  flex: 1;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  border: 2rpx solid $primary;
  color: $primary;
  font-size: $font-body;
  font-weight: 600;
  &.faved {
    background-color: $primary-light;
    border-color: $primary;
  }
}
.btn-review {
  flex: 1.5;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  background-color: $primary;
  color: #fff;
  font-size: $font-body;
  font-weight: 600;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/doctor-detail/doctor-detail.vue
git commit -m "feat: implement Doctor Detail page with ratings, tags, and reviews"
```

---

### Task 16: Write Review Page

**Files:**
- Modify: `pages/write-review/write-review.vue`

- [ ] **Step 1: Write pages/write-review/write-review.vue**

```vue
<template>
  <view class="page">
    <!-- Star Rating -->
    <view class="section">
      <text class="section-label">为 {{ doctorName }} 打分</text>
      <c-StarRating
        v-model="rating"
        :size="48"
        :gap="12"
        interactive
      />
    </view>

    <!-- Quick Tags -->
    <view class="section">
      <text class="section-label">快捷标签（可多选）</text>
      <view class="quick-tags">
        <c-TagPill
          v-for="tag in quickTags"
          :key="tag"
          :label="tag"
          :active="selectedTags.includes(tag)"
          tappable
          @tap="toggleTag(tag)"
        />
      </view>
    </view>

    <!-- Text Area -->
    <view class="section">
      <text class="section-label">评价内容</text>
      <textarea
        class="review-textarea"
        v-model="content"
        placeholder="分享你的真实感受即可"
        placeholder-style="color: #C0C8C4;"
        :maxlength="500"
        auto-height
      />
      <text class="char-count">{{ content.length }}/500</text>
    </view>

    <!-- Submit -->
    <view class="submit-wrap">
      <view class="btn-submit" @tap="submitReview">提交评价</view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { addUserReview } from '@/utils/storage.js'

const doctorId = ref('')
const doctorName = ref('')
const rating = ref(0)
const selectedTags = ref([])
const content = ref('')

const quickTags = ['耐心亲和', '专业靠谱', '沟通顺畅', '讲解清晰', '等待较久', '环境舒适']

onLoad((options) => {
  doctorId.value = options?.doctorId || ''
  doctorName.value = options?.doctorName || '医生'
  if (doctorName.value) {
    uni.setNavigationBarTitle({ title: '给' + doctorName.value + '写口碑评价' })
  }
})

function toggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx > -1) {
    selectedTags.value.splice(idx, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

function submitReview() {
  if (rating.value === 0) {
    uni.showToast({ title: '请先打分', icon: 'none' })
    return
  }
  if (!content.value.trim()) {
    uni.showToast({ title: '请输入评价内容', icon: 'none' })
    return
  }
  addUserReview({
    doctorId: doctorId.value,
    userName: '匿名用户',
    rating: rating.value,
    content: content.value,
    emotionTags: selectedTags.value,
    sentiment: rating.value >= 4 ? 'positive' : rating.value >= 3 ? 'neutral' : 'negative'
  })
  uni.showToast({ title: '评价提交成功', icon: 'success' })
  setTimeout(() => uni.navigateBack(), 1500)
}
</script>

<style lang="scss" scoped>
.page {
  padding: 32rpx;
  background-color: $bg-page;
  min-height: 100vh;
  padding-bottom: 120rpx;
}
.section {
  margin-bottom: 40rpx;
}
.section-label {
  display: block;
  font-size: $font-body;
  font-weight: 600;
  color: $text-primary;
  margin-bottom: 20rpx;
}
.quick-tags {
  display: flex;
  gap: 12rpx;
  flex-wrap: wrap;
}
.review-textarea {
  width: 100%;
  min-height: 280rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  padding: 24rpx;
  font-size: $font-body;
  color: $text-primary;
  line-height: 1.7;
  box-sizing: border-box;
}
.char-count {
  text-align: right;
  font-size: $font-xs;
  color: $text-secondary;
  margin-top: 8rpx;
}
.submit-wrap {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16rpx 32rpx;
  padding-bottom: calc(16rpx + env(safe-area-inset-bottom));
  background-color: $bg-card;
  border-top: 1rpx solid $divider;
}
.btn-submit {
  width: 100%;
  height: $btn-height;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: $radius-lg;
  background-color: $primary;
  color: #fff;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/write-review/write-review.vue
git commit -m "feat: implement Write Review page with stars, tags, and text input"
```

---

### Task 17: Profile Page

**Files:**
- Modify: `pages/profile/profile.vue`

- [ ] **Step 1: Write pages/profile/profile.vue**

```vue
<template>
  <view class="page">
    <!-- Profile Header -->
    <view class="profile-header">
      <view class="profile-avatar">
        <text class="profile-avatar-icon">👤</text>
      </view>
      <text class="profile-name">用户昵称</text>
      <text class="profile-bio">这个人很懒，什么都没写</text>
      <view class="profile-stats">
        <view class="stat-item">
          <text class="stat-num">{{ favorites.length }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ userReviews.length }}</text>
          <text class="stat-label">评价</text>
        </view>
        <view class="stat-item">
          <text class="stat-num">{{ history.length }}</text>
          <text class="stat-label">浏览</text>
        </view>
      </view>
    </view>

    <!-- Menu List -->
    <view class="menu-list">
      <view class="menu-item" @tap="goFavorites">
        <text class="menu-icon">★</text>
        <text class="menu-label">我的收藏</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goMyReviews">
        <text class="menu-icon">✎</text>
        <text class="menu-label">我的评价</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item" @tap="goHistory">
        <text class="menu-icon">⌛</text>
        <text class="menu-label">浏览记录</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item">
        <text class="menu-icon">⚙</text>
        <text class="menu-label">账号设置</text>
        <text class="menu-arrow">›</text>
      </view>
      <view class="menu-divider" />
      <view class="menu-item">
        <text class="menu-icon">💬</text>
        <text class="menu-label">帮助反馈</text>
        <text class="menu-arrow">›</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getFavorites, getUserReviews, getHistory } from '@/utils/storage.js'
import doctors from '@/data/doctors.json'

const favorites = ref(getFavorites())
const userReviews = ref(getUserReviews())
const history = ref(getHistory())

function goFavorites() {
  // Navigate to doctor list showing only favorites
  const ids = favorites.value.join(',')
  uni.navigateTo({ url: `/pages/doctor-list/doctor-list?favIds=${ids}` })
}

function goMyReviews() {
  uni.showToast({ title: '我的评价（开发中）', icon: 'none' })
}

function goHistory() {
  uni.showToast({ title: '浏览记录（开发中）', icon: 'none' })
}
</script>

<style lang="scss" scoped>
.profile-header {
  background: linear-gradient(180deg, $primary-light 0%, #fff 100%);
  padding: 48rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.profile-avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background-color: $primary-light2;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16rpx;
}
.profile-avatar-icon {
  font-size: 56rpx;
}
.profile-name {
  font-size: 36rpx;
  font-weight: 700;
  color: $text-primary;
}
.profile-bio {
  font-size: $font-sm;
  color: $text-secondary;
  margin-top: 8rpx;
}
.profile-stats {
  display: flex;
  gap: 60rpx;
  margin-top: 28rpx;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.stat-num {
  font-size: 36rpx;
  font-weight: 700;
  color: $primary;
}
.stat-label {
  font-size: $font-xs;
  color: $text-secondary;
  margin-top: 4rpx;
}
.menu-list {
  margin: 24rpx 32rpx;
  background-color: $bg-card;
  border-radius: $radius-md;
  box-shadow: $shadow-card;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx;
  cursor: pointer;
}
.menu-icon {
  font-size: 36rpx;
  margin-right: 20rpx;
}
.menu-label {
  flex: 1;
  font-size: $font-body;
  color: $text-primary;
}
.menu-arrow {
  font-size: 36rpx;
  color: $text-secondary;
}
.menu-divider {
  height: 1rpx;
  background-color: $divider;
  margin-left: 80rpx;
}
</style>
```

- [ ] **Step 2: Commit**

```bash
git add pages/profile/profile.vue
git commit -m "feat: implement Profile page with stats and menu list"
```

---

### Task 18: Tab Bar Icons

**Files:**
- Create: `static/tabbar/home.png`, `static/tabbar/home-active.png` (and 6 more)

- [ ] **Step 1: Generate simple tab bar icon PNGs**

Since we cannot create actual PNG files from code, generate simple SVG placeholder icons and convert via a node script. Write a generate script:

```bash
cd ~/Desktop/doctor-reviews && node -e "
const fs = require('fs');
const path = require('path');
const dir = 'static/tabbar';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

// Create minimal 1x1 PNG placeholders (will be replaced with real icons)
// For now, create empty placeholder files
const icons = ['home', 'home-active', 'dept', 'dept-active', 'rank', 'rank-active', 'profile', 'profile-active'];
icons.forEach(name => {
  fs.writeFileSync(path.join(dir, name + '.png'), '');
});
console.log('Created placeholder icons');
"
```

Note: These are placeholder files. Real tab bar icons (48x48 PNG with transparency) should be produced by a designer. For development in WeChat DevTools, install proper icon PNGs.

- [ ] **Step 2: Commit**

```bash
git add static/tabbar/
git commit -m "feat: add tab bar icon placeholders"
```

---

### Task 19: Integration — Build Verification and Final Wiring

**Files:**
- Verify: all pages compile
- Verify: navigation flows work
- Verify: data loading works

- [ ] **Step 1: Build the project**

```bash
cd ~/Desktop/doctor-reviews && npx uni build -p mp-weixin
```
Expected: Build succeeds with all 7 pages in `dist/build/mp-weixin/`.

- [ ] **Step 2: Review pages.json for correctness**

Verify that all page paths exist and tabBar config matches the actual page structure.

- [ ] **Step 3: Test navigation flows mentally**

Walk through each user flow:
1. Home → tap department tag → Doctor List → tap doctor → Doctor Detail → tap "写点评" → Write Review → submit → back
2. Tab: Departments → tap dept → Doctor List
3. Tab: Rankings → tap doctor → Doctor Detail
4. Tab: Profile → view stats
5. Home → search bar → Doctor List (no filter)

- [ ] **Step 4: Fix any missing imports or paths**

Check that all `@/components/` references match actual files via easycom (`c-` prefix auto-resolves to `components/`).

- [ ] **Step 5: Commit final integration fixes**

```bash
git add -A
git commit -m "chore: final integration fixes and build verification"
```
