import { useState } from "react";
import "./CopyRoomCode.css";

type CopyRoomCodeProps = {
  roomId: string;
};

export default function CopyRoomCode({ roomId }: CopyRoomCodeProps) {
  const [copiado, setCopiado] = useState(false);

  const copiarCodigo = async () => {
    try {
      await navigator.clipboard.writeText(roomId);
      setCopiado(true);
      //setTimeout(() => setCopiado(false), 2000);
    } catch (err) {
      console.error("Error al copiar:", err);
    }
  };

  return (
  <button className="copy-btn" onClick={copiarCodigo}>
    {copiado ? (
      <img
        src="/clipboard-check.svg"
        alt="Copiado"
        className="copy-icon"
      />
    ) : (
      <img
        src="/clipboard-add.svg"
        alt="Copiar"
        className="copy-icon"
      />
    )}
  </button>
);
}