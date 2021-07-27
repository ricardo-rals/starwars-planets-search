import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import PlanetsContext from './MyContext';

function PlanetsProvider({ children }) {
  // -----------------------REQUISITO 2---------------
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [filterPlanets, setFilterPlanets] = useState([]);
  // ----------------------------------------------------

  // --------------------- REQUISITO 3 --------------------
  const [columnTags, setColumnTags] = useState([
    'population',
    'orbital_period',
    'diameter',
    'rotation_period',
    'surface_water',
  ]);
  const [comparisonOptions] = useState(['maior que', 'menor que', 'igual a']);
  const [numericFilters, setNumericFilters] = useState({
    column: 'population',
    comparison: 'maior que',
    value: '',
  });
  // -----------------------------------------------------------
  
  // --------------------------- REQUISITO 4--------------------
  const [numericFilterList, setNumericFilterList] = useState([]);
  // ---------------------------------------------------------

  // REQUISITO 6------------------------------------------------
  const POSITIVE = 1;
  const NEGATIVE = -1;
  const [order, setOrder] = useState(data.sort((a, b) => {
    if (a.name > b.name) return POSITIVE;
    if (a.name < b.name) return NEGATIVE;
    return 0;
  }));
  // --------------------------------------------------------
  // ------------------ REQUISITO 1 ----------------------------------
  useEffect(() => {
    fetch('https://swapi-trybe.herokuapp.com/api/planets/')
      .then((response) => response.json())
      .then((planets) => setData(planets.results));
  }, []);
  // ------------------------------------------------------------------

  // ----------------------REQUISITO 2------------------
  useEffect(() => {
    const searchingPlanets = data.filter((planet) => planet.name.includes(search));
    setFilterPlanets(searchingPlanets);
  }, [data, search]);
  //----------------------------------------------------------------------

 // -------------------------------REQUISITO 4-------------------------
  function handleNumericFilter() {
    setNumericFilterList([...numericFilterList, numericFilters]);
    columnTags.forEach((tag) => {
      if (tag === numericFilters.column) {
        const newColumnTags = [...columnTags];
        newColumnTags.splice(newColumnTags.indexOf(tag), 1);
        setColumnTags(newColumnTags);
      }
    });
  }
  // ---------------------------------------------
  // ---------------------- REQUISITO 3 -----------------------------------
  function handleChangeColumn(event) {
    setNumericFilters({ ...numericFilters, column: event.target.value });
  }

  function handleChangeComparison(event) {
    setNumericFilters({ ...numericFilters, comparison: event.target.value });
  }

  function handleChangeValue(event) {
    setNumericFilters({ ...numericFilters, value: event.target.value });
  }


  function handleClickFilter() {
    const numericFilterPlanets = data.filter((planet) => {
      const targetTag = Number(planet[numericFilters.column]);
      const inputValue = Number(numericFilters.value);
      if (numericFilters.comparison === 'maior que') {
        return targetTag > inputValue;
      }
      if (numericFilters.comparison === 'menor que') {
        return targetTag < inputValue;
      }
      if (numericFilters.comparison === 'igual a') {
        return targetTag === inputValue;
      }
      return numericFilterPlanets;
    });
    setFilterPlanets(numericFilterPlanets);
    handleNumericFilter();
  }
  //------------------------------------------------------------------

  // ------------------- REQUISITO 2 -------------------------
  function filterByNameInput() {
    return (
      <form>
        <label htmlFor="name-filter">
          Planet:
          <input
            type="text"
            name="name-filter"
            placeholder="Search"
            data-testid="name-filter"
            onChange={ (e) => setSearch(e.target.value) }
          />
        </label>
      </form>
    );
  }
  // ---------------------------------------------------------------

  // ----------------------------requisito 3-----------------------------
  function numericFiltersSelects() {
    return (
      <section>
        <select data-testid="column-filter" onChange={ handleChangeColumn }>
          {columnTags.map((tag) => (
            <option key={ tag } value={ tag }>
              {tag}
            </option>
          ))}
        </select>
        <select
          data-testid="comparison-filter"
          onChange={ handleChangeComparison }
        >
          {comparisonOptions.map((option) => (
            <option key={ option } value={ option }>
              {option}
            </option>
          ))}
        </select>
        <input
          data-testid="value-filter"
          type="number"
          onChange={ handleChangeValue }
        />
        <button
          data-testid="button-filter"
          type="button"
          onClick={ handleClickFilter }
        >
          Add filter
        </button>
      </section>
    );
  }
  // ----------------------------------------------------------------

  //------------------------ REQUISITO 5 ----------------------------------
  function removeNumericFilter(event) {
    const newNumericFilterList = [...numericFilterList];
    newNumericFilterList.splice(newNumericFilterList.indexOf(event.target), 1);
    setNumericFilterList(newNumericFilterList);
    setFilterPlanets(data);
  }

  function renderNumericFilter() {
    return numericFilterList.map((selectedFilter, index) => (
      <div key={ index } data-testid="filter">
        <span>
          {`${selectedFilter.column} |
          ${selectedFilter.comparison} |
          ${selectedFilter.value}`}
        </span>
        <button onClick={ removeNumericFilter } type="button">
          X
        </button>
      </div>
    ));
  }
  // ----------------------------------------------------------
  return (
    <PlanetsContext.Provider
      value={ {
        data,
        filterPlanets,
        columnTags,
        order,
        setOrder,
        setFilterPlanets,
      } }
    >
      {numericFiltersSelects()}
      {filterByNameInput()}
      {renderNumericFilter()}
      {children}
    </PlanetsContext.Provider>
  );
}

PlanetsProvider.propTypes = {
  children: PropTypes.array.isRequired,
};

export default PlanetsProvider;
