import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearFilters, setFilters } from "../../features/transactions/transactionSlice";

export default function FilterBar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.transactions);

  const onChange = (event) => {
    dispatch(setFilters({ [event.target.name]: event.target.value }));
  };

  return (
    <section className="filter-bar">
      <select className="input-control" name="type" value={filters.type} onChange={onChange}>
        <option value="all">All types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>

      <input
        className="input-control"
        type="text"
        name="category"
        value={filters.category}
        onChange={onChange}
        placeholder="Filter by category"
      />

      <input
        className="input-control"
        type="date"
        name="startDate"
        value={filters.startDate}
        onChange={onChange}
      />

      <input
        className="input-control"
        type="date"
        name="endDate"
        value={filters.endDate}
        onChange={onChange}
      />

      <button type="button" className="btn btn--ghost" onClick={() => dispatch(clearFilters())}>
        Clear
      </button>
    </section>
  );
}
