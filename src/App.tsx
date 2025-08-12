import React, { useState } from "react"
import SearchBar from "./components/SearchBar"
import FilterBar from "./components/FilterBar"
import MovieList from "./components/MovieList"

function App() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleFilterClick = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  return (
    <>
      <div>
        <SearchBar onFilterClick={handleFilterClick}/>
        <FilterBar isOpen={isFilterOpen} onToggle={setIsFilterOpen}/>
        <MovieList/>


      </div>

     
    </>
  )
}

export default App
