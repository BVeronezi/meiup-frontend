import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import Rodape from "../utils/[utils]";

export default function ProdutosPDF(produtos, empresa) {
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

  const dados = produtos
    ? produtos.map((produto) => {
        return [
          { text: produto.descricao, fontSize: 9, margin: [0, 2, 0, 2] },
          {
            text: produto.categoria?.nome ?? "",
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              produto.precos ? Number(produto.precos.precoVendaVarejo) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              produto.precos ? Number(produto.precos.precoVendaAtacado) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              produto.precos ? Number(produto.precos.precoCompra) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              produto.precos ? Number(produto.precos.margemLucro) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
        ];
      })
    : [];

  const details = [
    {
      text: `Produtos`,
      margin: [0, 0, 0, 20],
      bold: true,
      fontSize: 14,
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*", "*", "*"],
        body: [
          [
            {
              text: "Descrição",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
            {
              text: "Categoria",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
            {
              text: "Preço venda varejo",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
            {
              text: "Preço venda atacado",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
            {
              text: "Preço compra",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
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
