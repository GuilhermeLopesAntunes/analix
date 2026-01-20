import { Search } from "lucide-react";
import React, { useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  setResults: React.Dispatch<React.SetStateAction<User[]>>;
}

export const SearchBar = ({ setResults }: Props) => {
  const [input, setInput] = useState("");

  const fetchData = (value: string) => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json: User[]) => {
        const results = json.filter((user) =>
          value.length > 0 &&
          user.name.toLowerCase().includes(value.toLowerCase())
        );

        setResults(results);
      });
  };

  const handleChange = (value: string) => {
    setInput(value);
    fetchData(value);
  };

  return (
    <div className=" relative flex items-center dark:bg-[#323232] bg-white w-[300px] rounded-3xl px-4 py-2.5 gap-2">
      <Search />
      <input
        className="bg-transparent  border-none focus:outline-none w-full"
        placeholder="Pesquisar"
        value={input}
        onChange={(e) => handleChange(e.target.value)}
      />
    </div>
  );
};
