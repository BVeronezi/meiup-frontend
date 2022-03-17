export default function Rodape(currentPage, pageCount) {
  return [
    {
      text: currentPage + "/" + pageCount,
      alignment: "right",
      fontSize: 15,
      bold: true,
      margin: [0, 10, 20, 0],
    },
  ];
}
