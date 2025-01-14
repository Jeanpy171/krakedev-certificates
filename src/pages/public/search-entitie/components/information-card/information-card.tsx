const InformationCard = () => {
  return (
    <article
      className="border-purple-500 border-2 p-2 rounded-lg flex flex-col gap-2
    "
    >
      <span className="bg-purple-500 flex p-2">
        <h3 className="font-bold text-white">INFORMACION</h3>
      </span>
      <p className="text-lg font-medium">
        Ingrese el correo electrónico y presione el botón: "
        <strong>Buscar</strong>", para obtener tu certificado de participación
      </p>
    </article>
  );
};

export default InformationCard;
