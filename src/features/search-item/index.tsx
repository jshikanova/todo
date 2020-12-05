import React, { FC } from 'react';

type SearchItemProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
};

export const SearchItem: FC<SearchItemProps> = ({ search, setSearch }) => {
  return (
    <form className="form">
      <input
        className="form__input"
        type="text"
        placeholder="Search for task"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </form>
  );
};
