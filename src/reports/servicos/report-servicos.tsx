import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import Rodape from "../utils";

export default function ServicosPDF(servicos, empresa) {
  pdfMake.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : pdfMake.vfs;

  const reportTitle = [
    {
      text: `${empresa.razaoSocial}`,
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45],
    },
  ];

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const dados = servicos
    ? servicos.map((servico) => {
        return [
          { text: servico.nome, fontSize: 9, margin: [0, 2, 0, 2] },
          {
            text: formatter.format(servico.custo ? Number(servico.custo) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(servico.valor ? Number(servico.valor) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              servico.margemLucro ? Number(servico.margemLucro) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
        ];
      })
    : [];

  const details = [
    {
      text: `Serviços`,
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
            { text: "Custo", style: "tableHeader", fontSize: 10, bold: true },
            { text: "Valor", style: "tableHeader", fontSize: 10, bold: true },
            {
              text: "Margem de lucro",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
          ],
          ...dados,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex % 2 === 0 ? "#CCCCCC" : null;
        },
      },
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
