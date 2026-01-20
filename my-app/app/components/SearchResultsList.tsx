interface User {
  id: number;
  name: string;
  email: string;
}

interface Props {
  results: User[];
}

export const SearchResultsList = ({ results }: Props) => {
  if (results.length === 0) return null;

  return (
    <div className="absolute bg-white shadow mt-2 rounded-xl p-3 w-[300px] max-h-[300px] overflow-y-auto">

      {results.map((user) => (
        <div
          key={user.id}
          className="p-2 hover:bg-gray-100 cursor-pointer rounded"
        >
          {user.name}
        </div>
      ))}

    </div>
  );
};
