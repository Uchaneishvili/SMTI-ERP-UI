# Architectural Decisions

## 1. Optimistic Updates

We use **Optimistic Updates** for drag-and-drop interactions.

**Definition:** Optimistic UI means updating the interface _immediately_ based on the user's action, assuming the server request will succeed, rather than waiting for the server confirmation.

**How it works in this app:**

1.  **User Action:** User drags 'Card A' to 'Column B'.
2.  **Immediate Update:** The Store (`useInquiryStore`) instantly updates the local state. The card snaps to the new position.
3.  **Background Async:** A `PATCH` request is sent to the API.
4.  **Error Handling:** If the API fails, the Store **reverts** the change (moves the card back) and shows an error Toast.

**Benefit:** Eliminates "network lag" feeling, making the app feel incredibly fast and responsive.

## 2. Global State (Zustand)

We use **Zustand** to manage the `inquiries` data.

- **Why:** Separate business logic (`moveInquiry`, `fetchInquiries`) from UI Components (`page.tsx`).
- **Benefit:** Clean code, easy to test, and centralized data mutations.

## 3. URL-Based Filtering

Filter state (`clientName`, `minValue`, etc.) is stored in the **URL Search Params** (e.g., `?clientName=UBS`).

- **Why:** Makes the view **Shareable** and **Persistent** on refresh.
- **Implementation:** `page.tsx` reads from URL on mount and updates URL on filter change.

## 4. File-Based Persistence

We use a local JSON file (`data/inquiries.json`) managed by a generic `db.ts` adapter.

- **Why:** Simulates a real database environment (Persistent, Async) without setting up an external DB container.
- **Pattern:** Repository pattern (`db.getAll()`, `db.update()`) allows easy swapping to Postgres later.
