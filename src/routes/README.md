# Routes

## Commands

Before making any changes to routes, run these commands from the project root:

```powershell
cd C:\Users\HP\Desktop\khelolocal
git status
npm install
npm run build

If the build is successful, start the local development server:

npm run dev

After making route changes, test locally and run:

npm run build
git status

For Git, stage only the files that were intentionally changed:

git add <file-path>
git commit -m "Update routes"
git push origin main

Do not use git add . unless all changed files are intentionally meant to be committed.


# Routes

TanStack Start uses **file-based routing**. Every `.tsx` file in this directory
defines a route. Do **not** create `src/pages/`, `src/routes/_app/index.tsx`, or
`app/layout.tsx` — those are Next.js / Remix conventions. The only root layout
is `src/routes/__root.tsx`.

## Conventions

| File | URL |
| --- | --- |
| `index.tsx` | `/` |
| `about.tsx` | `/about` |
| `users/index.tsx` | `/users` |
| `users/$id.tsx` | `/users/:id` (dynamic — bare `$`, no curly braces) |
| `posts/{-$category}.tsx` | `/posts/:category?` (optional segment) |
| `files/$.tsx` | `/files/*` (splat — read via `_splat` param, never `*`) |
| `_layout.tsx` | layout route (renders children via `<Outlet />`) |
| `__root.tsx` | app shell — wraps every page; preserve `<Outlet />` |

`routeTree.gen.ts` is auto-generated. Don't edit it by hand.
