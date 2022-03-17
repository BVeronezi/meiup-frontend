import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import Rodape from "../utils";

export const StatusVenda = [
  { codigo: 0, label: "ABERTA" },
  { codigo: 1, label: "FINALIZADA" },
  { codigo: 2, label: "CANCELADA" },
];

export default function VendasPDF(
  dados,
  dataInicioFiltro,
  dataFimFiltro,
  empresa
) {
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

  const values = dados.vendas
    ? dados.vendas.map((venda) => {
        return [
          { text: venda.cliente.nome, fontSize: 9, margin: [0, 2, 0, 2] },
          {
            text: moment(venda.dataVenda).format("DD/MM/YYYY"),
            fontSize: 10,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              venda.valorTotal ? Number(venda.valorTotal) : 0
            ),
            fontSize: 10,
            margin: [0, 2, 0, 2],
          },
          {
            text: StatusVenda[venda.status].label,
            fontSize: 10,
            margin: [0, 2, 0, 2],
          },
          { text: venda.usuario.nome, fontSize: 9, margin: [0, 2, 0, 2] },
        ];
      })
    : [];

  const totais = dados.totais
    ? dados.totais.map((v) => {
        return {
          totalEmAberto: v.totalEmAberto,
          totalFinalizadas: v.totalFinalizadas,
          totalCanceladas: v.totalCanceladas,
          total: v.total,
        };
      })
    : [];

  const details = [
    {
      text: `Vendas - Período: ${moment(dataInicioFiltro).format(
        "DD/MM/YYYY"
      )} - ${moment(dataFimFiltro).format("DD/MM/YYYY")}`,
      margin: [0, 0, 0, 20],
      bold: true,
      fontSize: 14,
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*", "*"],
        body: [
          [
            { text: "Cliente", style: "tableHeader", fontSize: 12, bold: true },
            {
              text: "Data da venda",
              style: "tableHeader",
              fontSize: 12,
              bold: true,
            },
            {
              text: "Valor total",
              style: "tableHeader",
              fontSize: 12,
              bold: true,
            },
            { text: "Status", style: "tableHeader", fontSize: 12, bold: true },
            {
              text: "Vendedor(a)",
              style: "tableHeader",
              fontSize: 12,
              bold: true,
            },
          ],
          ...values,
        ],
      },
      layout: "lightHorizontalLines",
    },
    {
      columns: [
        {
          width: "*",
          stack: [
            { text: "ABERTAS ", alignment: "right", fontSize: 10 },
            { text: "CANCELADAS: ", alignment: "right", fontSize: 10 },
            { text: "FINALIZADAS: ", alignment: "right", fontSize: 10 },
          ],
        },
        {
          width: "100",
          stack: [
            {
              text: formatter.format(
                totais[0].totalEmAberto ? Number(totais[0].totalEmAberto) : 0
              ),
              alignment: "right",
              fontSize: 10,
            },
            {
              text: formatter.format(
                totais[0].totalCanceladas
                  ? Number(totais[0].totalCanceladas)
                  : 0
              ),
              alignment: "right",
              fontSize: 10,
            },
            {
              text: formatter.format(
                totais[0].totalFinalizadas
                  ? Number(totais[0].totalFinalizadas)
                  : 0
              ),
              alignment: "right",
              fontSize: 10,
            },
          ],
        },
      ],
      margin: [20, 30, 20, 0],
    },
    {
      canvas: [{ type: "line", x1: 300, y1: 5, x2: 540, y2: 5, lineWidth: 1 }],
      margin: [20, 0, 20, 0],
    },
    {
      columns: [
        {
          width: "*",
          text: "TOTAL:  ",
          alignment: "right",
          bold: true,
          fontSize: 12,
        },
        {
          width: "100",
          text: formatter.format(totais[0].total ? Number(totais[0].total) : 0),
          alignment: "right",
          bold: true,
          fontSize: 12,
        },
      ],
      margin: [20, 2, 20, 0],
    },
  ];

  const docDefinition = {
    pageSize: "A4",
    pageMargins: [15, 50, 15, 40],
    header: [reportTitle],
    content: [details],
    footer: Rodape,

    styles: {
      anotherStyle: {
        alignment: "right",
      },
    },
  };

  pdfMake.createPdf(docDefinition).open();
}
