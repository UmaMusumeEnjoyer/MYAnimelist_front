# MyAnilist Frontend

This folder contains the Create React App frontend used by the MyAnilist project.

The instructions below are written for Windows (PowerShell). They work on other platforms with equivalent commands.

## Prerequisites

- Node.js (recommended LTS >= 16)
- npm (comes with Node) or yarn
- (Optional) A running backend API for full functionality. By default the frontend expects the backend at `http://localhost:8000`.

## Install dependencies

Open PowerShell in the `myanilist_front` folder and run:

```powershell
npm install
```

or with yarn:

```powershell
yarn install
```

## Configure API base URL

The frontend reads the backend base URL from an environment variable named `REACT_APP_API_BASE_URL`.
Create a `.env` file in the `myanilist_front` folder (same level as `package.json`) with the API URL you want to use. Example:

```
REACT_APP_API_BASE_URL=http://localhost:8000
```

Note: Create React App exposes only variables prefixed with `REACT_APP_` to the client bundle.

After changing `.env` you may need to restart the dev server.

## Run in development

Start the dev server (hot reload):

```powershell
npm start
```

This will open the app at http://localhost:3000 by default.

If your backend runs on a different host/port, set `REACT_APP_API_BASE_URL` accordingly in `.env`.

## Build for production

```powershell
npm run build
```

The optimized files are produced in the `build` folder. To serve the production build locally you can use the `serve` package:

```powershell
npm i -g serve
serve -s build -l 3000
```

## Common scripts

- `npm start` — development server
- `npm test` — run tests
- `npm run build` — production build

## Backend endpoints used by the frontend

The frontend expects the backend API paths under `/api/anilist/` (example):

- Search by name: `POST /api/anilist/search/name/` (JSON body like {"name":"Naruto","page":1,"limit":10})
- Anime detail and tabs: `/api/anilist/anime/<anime_id>/...` (characters, staffs, stats, watch)

If a feature doesn't work, ensure your Django backend is running and that `REACT_APP_API_BASE_URL` points to it.

## Troubleshooting

- CORS errors: enable CORS on the Django backend (e.g., use `django-cors-headers`) and allow the frontend origin.
- 404 on API calls: confirm the backend base URL and the routes defined in the backend (check `src/api/anilist/urls.py` on the Django project).
- Wrong/missing data: check backend logs (where you run `python manage.py runserver`) for tracebacks.

## Quick Postman test (example)

To test the search endpoint with Postman, send a POST to:

```
{{baseURL}}/api/anilist/search/name/
```

With header `Content-Type: application/json` and body:

```json
{
  "name": "Naruto",
  "page": 1,
  "limit": 10
}
```

## Contributing

If you change frontend behavior that depends on backend responses, please coordinate with backend changes and update `REACT_APP_API_BASE_URL` or the code that consumes backend fields.

---

If you want, I can also:
- add a sample `.env.example` file,
- add a README section describing how the frontend calls specific backend endpoints (examples of requests), or
- prepare a small script to run backend + frontend together for local development. Which would you like?
