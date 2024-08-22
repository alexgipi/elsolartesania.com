<script lang="ts">
  const title = "Lexgi CMS";
</script>

<div class="table">
  <header class="table-header">
    <div class="table-controls">
      <button>
        Columns
        <svg
          class="icon chevron-icon"
          viewBox="0 0 9 7"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          ><path
            class="stroke"
            d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"
          /></svg
        >
      </button>
      <button>
        Filters
        <svg
          class="icon chevron-icon"
          viewBox="0 0 9 7"
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          height="100%"
          ><path
            class="stroke"
            d="M1.42871 1.5332L4.42707 4.96177L7.42543 1.5332"
          /></svg
        >
      </button>
    </div>
  </header>

  <table cellpadding="0" cellspacing="0">
    <thead>
      <tr>
        <th id="heading-_select">
          <div class="checkbox-input select-all__checkbox">
            <div class="checkbox-input__input">#</div>
          </div>
        </th>

        <th>
          <div class="sort-column">
            <span class="sort-column__label capitalize">Producto</span>
          </div>
        </th>

        <th>
          <div class="sort-column">
            <span class="sort-column__label capitalize">Total</span>
          </div>
        </th>
      </tr>
    </thead>

    <tbody>
      <tr class="row-1">
        <td class="cell-_select"> # </td>

        <td>
          <div>
            <span> Hola </span>
          </div>
        </td>

        <td class="cell-_select"> 5,60 </td>
      </tr>
    </tbody>
  </table>
</div>

<style>
  .capitalize {
    text-transform: capitalize;
  }

  .table-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
    background: #0c0c0c;
    border-radius: 6px;
  }

  .table-search {
    display: flex;
    border-radius: 5px;
    flex: auto;

    & input {
      padding: 10px 22px;
      background: unset;
      border: none;
      width: 100%;
      outline: none;
      color: #fff;
    }
  }

  .table-controls {
    display: flex;
    gap: 10px;
    padding: 14px;

    & button {
      border: none;
      border-radius: 6px;
      color: rgb(189 189 189);
      background-color: rgb(51, 51, 51);
      padding: 8px 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;

      & .chevron-icon {
        width: 14px;
        fill: none;
        stroke: #8d8d8d;
      }

      &.red {
        background: #ff3343;
        color: #2e0004;
      }
    }
  }

  table {
    width: 100%;
    background: black;
    border-radius: 10px;
    outline: 1px solid #101010;
  }

  th {
    padding: 24px 20px;
  }

  .checkbox-input {
    display: flex;
    justify-content: center;
  }

  .checkbox-input__input {
    display: flex;

    & input {
      accent-color: #924beb;
      width: 18px;
      height: 18px;
    }
  }

  tbody {
    & tr:nth-child(odd) {
      background: #090909;
    }
  }

  .sort-column {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .sort-column__buttons {
    display: flex;
  }

  .sort-column__button {
    width: 32px;
    border: none;
    display: flex;
    align-items: center;
    background: transparent;
    color: #fff;
  }

  .sort-column__button svg {
    stroke: #898989;
    fill: transparent;
  }

  td {
    padding: 16px 20px;
    border-top: 1px solid #161616;
    font-size: 0.8em;
    color: #7c7c7c;

    & a:not(.code-cell) {
      color: #828282;
    }
  }

  .code-cell {
    font-family: Menlo, Monaco, Lucida Console, Liberation Mono,
      DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;
    font-size: 12px;
    padding: 4px;
    background: #23232385;
    padding: 10px 15px;
    border-radius: 6px;
    display: inline-flex;
    align-items: center;
    line-height: 1;
    color: #d2d2d2;

    &:hover {
      color: #fff;
    }
  }

  .table-footer {
    display: flex;
    margin-top: 20px;
    justify-content: space-between;
  }

  .table-pagination {
    display: flex;
    background: #090909;
    border-radius: 8px;
    border: 1px solid #2727277a;
  }

  .pagination-btn {
    width: 40px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    color: #9d9d9d;
    background: transparent;
    cursor: pointer;
    border-right: 1px solid #2727277a;

    &:last-child {
      border: none;
    }
  }

  .pagination-icon {
    width: 14px;
    height: 14px;
  }

  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 0.84em;
    position: relative;
  }

  .pagination-info {
    opacity: 0.5;
    font-size: 0.84em;
  }

  .items-per-page {
    position: relative;
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #fff;
    background: no-repeat;
    border: none;
    padding: 5px 0;

    & strong {
      font-weight: 600;
    }

    & .chevron-icon {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: currentColor;
    }
  }

  .items-per-page-options {
    position: absolute;
    display: flex;
    flex-direction: column;
    right: 0;
    bottom: 38px;
    min-width: 114px;
    background: #2222228c;
    border-radius: 5px;
    align-items: flex-start;
    padding: 10px 0;
    backdrop-filter: blur(7px);
    cursor: default;
    visibility: hidden;
    opacity: 0;
    transition: opacity 0.3s ease, visibility 0.3s ease;

    & button {
      width: 100%;
      text-align: left;
      padding: 11px 14px;
      border: none;
      background: no-repeat;
      color: #afafaf;
      cursor: pointer;
    }

    &.opened {
      visibility: visible;
      opacity: 1;
    }
  }

  .no-content-section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 24px;
    margin-bottom: 3rem;

    & p {
      font-size: 0.84em;
      color: #a7a7a7;
      margin: 0;
    }

    & button {
      padding: 16px 27px;
      border-radius: 6px;
      border: none;
      cursor: pointer;
    }
  }
</style>
