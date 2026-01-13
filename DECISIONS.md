# Architectural Decisions & Trade-offs

This document outlines the key technical decisions made during the development of the Inquiry Kanban Board.

## 1. Drag-and-Drop Approach: @dnd-kit

I chose **@dnd-kit** over alternatives like `react-beautiful-dnd` or the native HTML5 Drag and Drop API.

- **Why?**
  - **Headless & Flexible**: `@dnd-kit` provides the logic (sensors, collisions, modifiers) but leaves the rendering entirely to us. This was crucial for implementing our **Generic Kanban Board**, allowing us to decouple the drag logic (`useKanban`) from the visual representation.
  - **Geometry-Based**: It uses collision detection algorithms (like `closestCorners` or `rectIntersection`) rather than DOM order, which is more robust for mixed grid/flex layouts.
  - **Future-Proof**: `react-beautiful-dnd` is largely unmaintained, and native HTML5 DnD is often clunky to style and inconsistent across browsers.

## 2. State Management Strategy

I adopted a **Hybrid State Architecture**:

- **Global Server State (Zustand)**:
  - Used for the `inquiries` data source.
  - Why? I needed a central place to handle data fetching, optimistic updates, and syncing with the API (`src/store/useInquiryStore.ts`). Zustand offers a simple hook-based API without the "Context Hell" or boilerplate of Redux.
- **Local UI State (`useKanban` Hook)**:
  - Used for transient drag states (`activeId`, `items` mapping).
  - Why? Drag operations are high-frequency updates. Isolating this state in a generic hook prevents global app re-renders during dragging, ensuring 60fps performance.
- **URL State (Search Params)**:
  - Used for **Filters**.
  - Why? Storing filters in the URL makes the application **shareable** and **bookmarkable**. Users can send a link with active filters to a colleague.

## 3. UX Decisions & Alternatives

- **Optimistic UI Updates**:
  - **Decision**: When an item is moved, I update the UI _immediately_ before the server responds. If the server fails, I roll back.
  - **Alternative**: Waiting for the server response. This would make the drag-and-drop feel sluggish and "laggy" (bad UX).
- **Configuration-Driven Filters**:
  - **Decision**: Filters are generated from a config array (`page.tsx`), rendered by a generic `GenericFilterPanel`.
  - **Alternative**: Hardcoding inputs. While faster to build initially, it makes adding new filters tedious. The config approach scales better.
- **Responsive Grid Layout**:
  - **Decision**: On desktop, columns expanded to a Grid 4 layout to fill the screen. On mobile, they remain scrollable.
  - **Reasoning**: Maximizes screen real estate usage for power users on large displays.

## 4. Future Improvements (With More Time)

If I had more time or were building for production scale, I would:

1.  **Replace File Persistence with a Real DB**:
    - Move from `FileRepository` (JSON) to **PostgreSQL + Prisma**. This would support concurrent writes and complex queries efficiently.
2.  **Add Authentication**:
    - Implement NextAuth.js to secure the API and support multi-user workflows.
3.  **Unit & E2E Testing**:
    - Add Jest/Vitest for unit tests (especially the `db.ts` logic) and Playwright for full drag-and-drop end-to-end testing.
