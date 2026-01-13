# Inquiry Kanban Board

An advanced, scalable Kanban board for managing hotel inquiries, built with Next.js 14 and modern React patterns.

## 🚀 Setup Instructions

1.  **Install Dependencies**

    ```bash
    npm install
    ```

2.  **Run Development Server**

    ```bash
    npm run dev
    ```

3.  **Open Browser**
    Navigate to [http://localhost:3000](http://localhost:3000).

> **Note**: This project uses a file-based JSON database located at `data/inquiries.json`. Data persists across restarts but is local to the filesystem.

## 📂 Project Structure Overview

The project is architected for scalability, separating generic UI components from domain-specific logic.

```
src/
├── app/                    # Next.js App Router (Domain Layer)
│   ├── api/                # API Routes (CRUD for Inquiries)
│   └── page.tsx            # Main Page (composes Generic Board + Inquiry Business Logic)
│
├── components/
│   ├── kanban/             # 🧩 GENERIC Kanban Components (Reusable)
│   │   ├── GenericKanbanBoard.tsx
│   │   ├── KanbanColumn.tsx
│   │   └── SortableItem.tsx
│   ├── GenericFilterPanel.tsx # 🧩 Config-driven Filter UI
│   └── ...                 # Domain Components (InquiryCard, DetailModal)
│
├── hooks/
│   └── useKanban.ts        # 🪝 GENERIC Drag-and-Drop Logic (Headless)
│
├── lib/
│   ├── FileRepository.ts   # 💾 GENERIC File-based Persistence Class
│   └── db.ts               # Domain-specific Service (Inquiry logic)
│
└── store/
    └── useInquiryStore.ts  # Global State Management (Zustand)
```

## 🛠 Libraries Used & Justification

| Library          | Purpose             | Why I chose it                                                                                                                                             |
| :--------------- | :------------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js 14**   | Framework           | Server Components, App Router, and built-in API routes simplify the full-stack architecture.                                                               |
| **@dnd-kit**     | Drag & Drop         | **Headless**, modular, and accessible. Unlike strict libraries, it allows complete control over the UI rendering and supports complex layouts (Grid/Flex). |
| **Zustand**      | State Management    | Minimalist and boilerplate-free compared to Redux/Context. Perfect for managing the `inquiries` list and optimistic updates.                               |
| **Tailwind CSS** | Styling             | Utility-first approach ensures design consistency and rapid UI development.                                                                                |
| **Sonner**       | Toast Notifications | Lightweight, beautiful, and customizable toast animations for user feedback.                                                                               |
| **Lucide React** | Icons               | Clean, consistent SVG icons commonly used in modern web apps.                                                                                              |
