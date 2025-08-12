# Movie Search App

A React + TypeScript + Vite application for searching movies using The Movie Database (TMDB) API.

## TODO

### ✅ Completed
- [x] Project setup with React + TypeScript + Vite
- [x] Redux store configuration
- [x] Movie slice with search functionality
- [x] Async thunk for API calls
- [x] Type definitions for Movie and MovieSearchState
- [x] SearchBar component with Material-UI
- [x] Material-UI icons package installed

### 🔄 In Progress
- [ ] Get TMDB API key
- [ ] Create `.env` file with API key

### 📋 Next Steps
- [ ] Build remaining UI components:
  - [ ] MovieList component  
  - [ ] MovieCard component
  - [ ] LoadingSpinner component
  - [ ] ErrorDisplay component
- [ ] Connect components to Redux store
- [ ] Add pagination support
- [ ] Style the application
- [ ] Test search functionality
- [ ] Add error handling and loading states

### 🚀 Future Enhancements
- [ ] Movie details page
- [ ] Favorites functionality
- [ ] Advanced search filters
- [ ] Responsive design improvements

## Setup Instructions

1. Get a free API key from [TMDB](https://www.themoviedb.org/settings/api)
2. Create a `.env` file in the project root:
   ```
   VITE_TMDB_API_KEY=your_api_key_here
   ```
3. Install dependencies: `npm install`
4. Run development server: `npm run dev`

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **State Management**: Redux Toolkit
- **API**: The Movie Database (TMDB)
- **Styling**: CSS (can be enhanced with Tailwind, Styled Components, etc.)

## Project Structure

```
src/
├── redux/
│   ├── store.tsx          # Redux store configuration
│   └── movieSlice.ts      # Movie search slice with actions and reducers
├── components/             # UI components (to be created)
├── App.tsx                # Main app component
└── main.tsx               # App entry point
```
