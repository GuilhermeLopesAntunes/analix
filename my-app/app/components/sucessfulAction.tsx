import { useEffect, useState } from "react";

interface Props {
  action: string;
}

export const SucessAction = ({ action }: Props) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="absolute w-full top-25 animate-toast">
      <div className="bg-green-400 text-white rounded-3xl font-bold w-150 text-center m-auto p-5">
        {action} Criado Com Sucesso!
      </div>

      <div className="w-130 bg-green-300 h-2 text-center m-auto rounded-3xl overflow-hidden mt-2">
        <div className="h-full bg-green-500 animate-progress" />
      </div>
    </div>
  );
};
