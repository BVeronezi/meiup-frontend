import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import moment from "moment";
import Rodape from "../../relatorios/utils/[utils]";

export default function VendaPDF(venda, dadosProduto, dadosServico) {
  pdfMake.vfs = vfsFonts.pdfMake ? vfsFonts.pdfMake.vfs : pdfMake.vfs;

  const reportTitle = [
    {
      text: `${venda.empresa.razaoSocial}`,
      fontSize: 15,
      bold: true,
      margin: [15, 20, 0, 45],
    },
  ];

  const formatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  const produtos = dadosProduto
    ? dadosProduto.map((p) => {
        return [
          {
            text: p.produto.descricao,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              p?.precoUnitario ? Number(p.precoUnitario) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: p.quantidade,
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(
              p.outrasDespesas ? Number(p.outrasDespesas) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(p.desconto ? Number(p.desconto) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(p.valorTotal ? Number(p.valorTotal) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
        ];
      })
    : [];

  const servicos = dadosServico
    ? dadosServico.map((s) => {
        return [
          {
            text: s.servico.nome,
            fontSize: 9,
            margin: [0, 2, 0, 2],
          },
          {
            text: formatter.format(
              s?.valorServico ? Number(s.valorServico) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(
              s.outrasDespesas ? Number(s.outrasDespesas) : 0
            ),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(s.desconto ? Number(s.desconto) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
          {
            text: formatter.format(s.valorTotal ? Number(s.valorTotal) : 0),
            fontSize: 9,
            margin: [0, 2, 0, 2],
            alignment: "right",
          },
        ];
      })
    : [];

  const details = [
    {
      columns: [
        {
          text: `Cliente - ${venda.cliente.nome}`,
          bold: true,
          fontSize: 12,
        },
        {
          text: `Data venda: ${moment(venda.dataVenda).format("DD/MM/YYYY")}`,
          bold: true,
          fontSize: 12,
          alignment: "left",
        },
        {
          text: `Vendedor: ${venda.usuario.nome}`,
          bold: true,
          fontSize: 12,
          alignment: "left",
        },
      ],

      margin: [0, 10, 0, 10],
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 15, y2: 5, lineWidth: 1.2 },
      ],
      margin: [0, 0, 0, 10],
    },
    {
      text: "Produtos",
      bold: true,
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
              text: "Valor unitário",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Quantidade",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Outras Despesas",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Desconto",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Total",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
          ],
          ...produtos,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex % 2 === 0 ? "#D9D9D9" : null;
        },
      },
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 15, y2: 5, lineWidth: 1.2 },
      ],
      margin: [0, 10, 0, 10],
    },
    {
      text: "Serviços",
      bold: true,
    },
    {
      table: {
        headerRows: 1,
        widths: ["*", "*", "*", "*", "*"],
        body: [
          [
            {
              text: "Nome",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
            },
            {
              text: "Valor serviço",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Outras Despesas",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Desconto",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
            {
              text: "Total",
              style: "tableHeader",
              fontSize: 10,
              bold: true,
              alignment: "right",
            },
          ],
          ...servicos,
        ],
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return rowIndex % 2 === 0 ? "#D9D9D9" : null;
        },
      },
    },
    {
      canvas: [
        { type: "line", x1: 0, y1: 5, x2: 595 - 2 * 15, y2: 5, lineWidth: 1.2 },
      ],
      margin: [0, 10, 0, 0],
    },
    {
      columns: [
        { text: "VALOR TOTAL", fontSize: 10, bold: true, alignment: "left" },
        {
          text: formatter.format(
            venda.valorTotal ? Number(venda.valorTotal) : 0
          ),
          fontSize: 10,
          bold: true,
          alignment: "right",
        },
      ],
      margin: [0, 4, 0, 0],
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
