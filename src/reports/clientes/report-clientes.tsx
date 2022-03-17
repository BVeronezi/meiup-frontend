import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import Rodape from "../utils";
export default function ClientesPDF(clientes, empresa) {
  pdfMake.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : pdfMake.vfs;

  const reportTitle = [
    {
      text: `${empresa.razaoSocial}`,
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45],
    },
  ];

  const dados = clientes
    ? clientes.map((cliente) => {
        return [
          { text: cliente.nome, fontSize: 9, margin: [0, 2, 0, 2] },
          { text: cliente.email, fontSize: 9, margin: [0, 2, 0, 2] },
          { text: cliente.celular, fontSize: 9, margin: [0, 2, 0, 2] },
          { text: cliente.telefone, fontSize: 9, margin: [0, 2, 0, 2] },
        ];
      })
    : [];

  const details = [
    {
      text: `Clientes`,
      margin: [0, 0, 0, 20],
      bold: true,
      fontSize: 14,
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*"],
        body: [
          [
            { text: "Nome", style: "tableHeader", fontSize: 10, bold: true },
            { text: "E-mail", style: "tableHeader", fontSize: 10, bold: true },
            { text: "Celular", style: "tableHeader", fontSize: 10, bold: true },
            {
              text: "Telefone",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
          ],
          ...dados,
        ],
      },
      layout: "lightHorizontalLines",
    },
  ];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [15, 50, 15, 40],
    header: [reportTitle],
    content: [details],
    footer: Rodape,
  };

  pdfMake.createPdf(docDefinition).open();
}
