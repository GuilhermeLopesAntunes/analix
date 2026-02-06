'use client';

import Tooltip from './Tooltip';

interface ProtocolWithDescriptionProps {
  protocolo: string;
  descricao: string;
  className?: string;
}

export default function ProtocolWithDescription({
  protocolo,
  descricao,
  className = '',
}: ProtocolWithDescriptionProps) {
  return (
    <Tooltip 
      content={descricao}
      position="top"
      delay={200}
      maxWidth="400px"
    >
      <span className={`cursor-help hover:text-blue-500 transition-colors ${className}`}>
        {protocolo}
      </span>
    </Tooltip>
  );
}