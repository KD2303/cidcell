# Architecture Overview

## Layout
The application follows a standard MERN stack architecture (MongoDB, Express, React, Node).

## Frontend Architecture
- `src/components`: Reusable UI components (Navbar, Footer, Modal, etc).
- `src/pages`: Top-level route components representing distinct pages.
- `src/context`: React Context providers (like AuthContext).
- `src/admin`, `src/faculty`, `src/mentor`: Role-specific directories with their own localized layouts and components.

## Backend Architecture
- The backend serves RESTful APIs using standard Express controllers and routes.
- WebSockets provide real-time notification/chat support.
