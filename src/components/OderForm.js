import React, { useContext, useState } from 'react';
import PlanetsContext from '../services/MyContext';

function OrderForm() {
  const {
    data,
    columnTags,
    setFilterPlanets,
  } = useContext(PlanetsContext);

  const [order, setOrder] = useState({
    column: 'population',
    sort: '',
  });

  async function handleOrderButton() {
    const POSITIVE = 1;
    const NEGATIVE = -1;
    if (order.sort === 'ASC') {
      setFilterPlanets(
        [...data].sort((a, b) => {
          if (Number(a[order.column]) > Number(b[order.column])) return POSITIVE;
          if (Number(a[order.column]) < Number(b[order.column])) return NEGATIVE;
          return 0;
        }),
      );
    } else {
      setFilterPlanets(
        [...data].sort((a, b) => {
          if (Number(a[order.column]) > Number(b[order.column])) return NEGATIVE;
          if (Number(a[order.column]) < Number(b[order.column])) return POSITIVE;
          return 0;
        }),
      );
    }
  }

  return (
    <form>
      <select
        data-testid="column-sort"
        onChange={ (e) => setOrder({ ...order, column: e.target.value }) }
      >
        {columnTags.map((sortTag) => (
          <option key={ sortTag } value={ sortTag }>
            {sortTag}
          </option>
        ))}
      </select>
      <label htmlFor="ASC">
        <input
          type="radio"
          name="radio"
          data-testid="column-sort-input-asc"
          value="ASC"
          onClick={ (e) => setOrder({ ...order, sort: e.target.value }) }
        />
        Ascendente
      </label>
      <label htmlFor="DESC">
        <input
          type="radio"
          name="radio"
          data-testid="column-sort-input-desc"
          value="DESC"
          onClick={ (e) => setOrder({ ...order, sort: e.target.value }) }
        />
        Descendente
      </label>
      <button
        onClick={ handleOrderButton }
        type="button"
        data-testid="column-sort-button"
      >
        Filtrar
      </button>
    </form>
  );
}

export default OrderForm;
