# Tóm tắt chuyển đổi sang Next.js

## Đã hoàn thành

### 1. Cấu hình cơ bản
- ✅ Cài đặt `antd`
- ✅ Cập nhật `app/globals.css` với styles từ `src/styles/global.css`
- ✅ Tạo `app/providers.tsx` để wrap Ant Design ConfigProvider và SidebarColorProvider
- ✅ Cập nhật root layout (`app/layout.tsx`) với Providers
- ✅ Cập nhật `tsconfig.json` với path alias cho `@/src/*`

### 2. Root Pages (Route Group: `(root)`)
- ✅ Tạo `app/(root)/layout.tsx` với Header và Footer
- ✅ Tạo `app/components/Header.tsx` (Next.js-compatible)
- ✅ Tạo `app/components/Footer.tsx` (Next.js-compatible)
- ✅ Tạo `app/(root)/page.tsx` (Home page)
- ✅ Tạo `app/(root)/news/page.tsx`
- ✅ Tạo `app/(root)/events/page.tsx`
- ✅ Tạo `app/(root)/about/page.tsx`
- ✅ Tạo `app/(root)/features/[type]/page.tsx`

### 3. Admin Layout & Pages
- ✅ Tạo `app/components/AdminSidebar.tsx` (Next.js-compatible)
- ✅ Tạo `app/admin/layout.tsx`
- ✅ Tạo `app/admin/page.tsx` (Dashboard)

### 4. User Layout & Pages
- ✅ Tạo `app/components/UserSidebar.tsx` (Next.js-compatible)
- ✅ Tạo `app/user/layout.tsx`
- ✅ Tạo `app/user/page.tsx` (Dashboard)

### 5. Components
- ✅ Tạo `app/components/CardNews.tsx` (Next.js-compatible wrapper)

## Tiến độ hiện tại

### ✅ Đã hoàn thành (~95%)

#### Admin Pages:
- ✅ `app/admin/page.tsx` (Dashboard)
- ✅ `app/admin/exercises/page.tsx`
- ✅ `app/admin/news/page.tsx`
- ✅ `app/admin/classes/page.tsx`
- ✅ `app/admin/teachers/page.tsx`
- ✅ `app/admin/content/page.tsx`

#### User Pages:
- ✅ `app/user/page.tsx` (Dashboard)
- ✅ `app/user/exercises/page.tsx`
- ✅ `app/user/grades/page.tsx`
- ✅ `app/user/community/page.tsx`
- ✅ `app/user/documents/page.tsx`
- ✅ `app/user/chat/page.tsx`

#### Components Next.js-compatible:
- ✅ `app/components/Header.tsx`
- ✅ `app/components/Footer.tsx`
- ✅ `app/components/AdminSidebar.tsx`
- ✅ `app/components/UserSidebar.tsx`
- ✅ `app/components/CardNews.tsx`
- ✅ `app/components/HomeEvents.tsx`
- ✅ `app/components/HomeNews.tsx`

## Cần hoàn thiện

### 1. Detail Pages (Quan trọng)

Các components trong `src/components/` vẫn đang sử dụng `react-router-dom`. Cần tạo các wrapper Next.js-compatible hoặc chuyển đổi trực tiếp:

**Components cần chuyển đổi:**
- `src/components/card_components/Card_news.tsx` → Đã tạo wrapper `app/components/CardNews.tsx`
- `src/components/card_components/Card_event.tsx`
- `src/components/home_components/Events.tsx`
- `src/components/home_components/News.tsx`
- Các components khác sử dụng `Link`, `NavLink`, `useNavigate`, `useLocation`, `useParams`

**Cách chuyển đổi:**
- `react-router-dom` → `next/navigation`
  - `Link` → `next/link` (Link)
  - `NavLink` → `next/link` (Link với logic active state)
  - `useNavigate()` → `useRouter()` từ `next/navigation`
  - `useLocation()` → `usePathname()` từ `next/navigation`
  - `useParams()` → `params` prop từ page component

### 2. Tạo các Pages còn lại

**Root Pages:**
- [ ] `app/(root)/news/[id]/page.tsx` (News Detail)
- [ ] `app/(root)/events/[id]/page.tsx` (Event Detail)

**Admin Pages:**
- [ ] `app/admin/exercises/page.tsx`
- [ ] `app/admin/exercises/[id]/page.tsx`
- [ ] `app/admin/news/page.tsx`
- [ ] `app/admin/news/handle/[id]/page.tsx`
- [ ] `app/admin/classes/page.tsx`
- [ ] `app/admin/teachers/page.tsx`
- [ ] `app/admin/content/page.tsx`

**User Pages:**
- [ ] `app/user/exercises/page.tsx`
- [ ] `app/user/exercises/[id]/page.tsx`
- [ ] `app/user/grades/page.tsx`
- [ ] `app/user/community/page.tsx`
- [ ] `app/user/documents/page.tsx`
- [ ] `app/user/chat/page.tsx`

### 3. Chuyển đổi các Pages sử dụng Routing Hooks

Tất cả các pages trong `src/pages/` cần được chuyển đổi:

1. Thay `useNavigate()` bằng `useRouter()` từ `next/navigation`
2. Thay `useParams()` bằng `params` prop
3. Đánh dấu là "use client" nếu sử dụng hooks
4. Di chuyển vào đúng thư mục routing trong `app/`

**Ví dụ chuyển đổi:**

```tsx
// Trước (React Router)
import { useNavigate, useParams } from "react-router-dom";

export default function MyPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  // ...
}

// Sau (Next.js)
"use client";
import { useRouter } from "next/navigation";

interface MyPageProps {
  params: {
    id: string;
  };
}

export default function MyPage({ params }: MyPageProps) {
  const router = useRouter();
  const { id } = params;
  // ...
}
```

### 4. Cập nhật Contexts

Các contexts trong `src/contexts/` đã được import qua `@/src/contexts/`. Đảm bảo tất cả contexts đều tương thích (các contexts hiện tại đã OK).

### 5. Assets & Images

- Đảm bảo các images trong `public/` được truy cập đúng cách
- Sử dụng `next/image` cho tối ưu hình ảnh nếu cần

### 6. Cleanup

Sau khi hoàn thiện chuyển đổi:
- [ ] Xóa `src/main.tsx`
- [ ] Xóa `src/App.tsx`
- [ ] Xóa `package.json` dependencies không cần thiết (nếu có)
- [ ] Cập nhật `.gitignore` nếu cần

## Hướng dẫn tiếp tục

### Bước 1: Chuyển đổi Components
1. Tìm các components sử dụng `react-router-dom`
2. Tạo các wrapper components Next.js-compatible trong `app/components/`
3. Hoặc chuyển đổi trực tiếp các components trong `src/components/`

### Bước 2: Tạo các Pages
1. Di chuyển các pages từ `src/pages/` sang `app/` với cấu trúc routing đúng
2. Chuyển đổi routing hooks sang Next.js equivalents
3. Đánh dấu "use client" cho các pages sử dụng hooks

### Bước 3: Kiểm tra & Test
1. Chạy `npm run dev` để kiểm tra
2. Kiểm tra từng route hoạt động đúng
3. Sửa các lỗi phát sinh

## Lưu ý quan trọng

1. **Client vs Server Components**: 
   - Mặc định, các components trong Next.js App Router là Server Components
   - Thêm `"use client"` nếu component sử dụng hooks, event handlers, hoặc browser APIs

2. **Routing**:
   - File-based routing trong `app/` directory
   - Dynamic routes: `[param]`
   - Route groups: `(groupName)` - không ảnh hưởng URL

3. **Imports**:
   - Sử dụng path alias `@/src/*` để import từ thư mục `src/`
   - Components từ `src/` vẫn có thể được sử dụng nếu chúng không phụ thuộc vào routing

4. **Styles**:
   - Global styles trong `app/globals.css`
   - Tailwind CSS đã được cấu hình

## Cấu trúc thư mục sau chuyển đổi

```
app/
├── (root)/              # Route group cho root pages
│   ├── layout.tsx       # Layout với Header & Footer
│   ├── page.tsx         # Home page (/)
│   ├── news/
│   │   ├── page.tsx     # News list (/news)
│   │   └── [id]/
│   │       └── page.tsx # News detail (/news/[id])
│   ├── events/
│   ├── about/
│   └── features/
│       └── [type]/
├── admin/               # Admin routes
│   ├── layout.tsx
│   ├── page.tsx         # Admin dashboard (/admin)
│   ├── exercises/
│   ├── news/
│   └── ...
├── user/                # User routes
│   ├── layout.tsx
│   ├── page.tsx         # User dashboard (/user)
│   ├── exercises/
│   └── ...
├── components/          # Next.js-compatible components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AdminSidebar.tsx
│   └── UserSidebar.tsx
├── providers.tsx        # Providers wrapper
├── layout.tsx           # Root layout (HTML)
└── globals.css          # Global styles

src/                     # Giữ nguyên cho components, contexts, types
├── components/          # Các components gốc (có thể giữ lại)
├── contexts/
├── types/
└── ...
```

