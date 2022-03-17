function cov_1ntp77ad7l() {
  var path = "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/pages/relatorios/fornecedores/[...report-fornecedores].tsx";
  var hash = "6405a7b7c00591ccdd5ea38c94585c1d4ae1690d";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/pages/relatorios/fornecedores/[...report-fornecedores].tsx",
    statementMap: {
      "0": {
        start: {
          line: 6,
          column: 2
        },
        end: {
          line: 6,
          column: 70
        }
      },
      "1": {
        start: {
          line: 8,
          column: 22
        },
        end: {
          line: 15,
          column: 3
        }
      },
      "2": {
        start: {
          line: 17,
          column: 16
        },
        end: {
          line: 26,
          column: 8
        }
      },
      "3": {
        start: {
          line: 19,
          column: 8
        },
        end: {
          line: 24,
          column: 10
        }
      },
      "4": {
        start: {
          line: 28,
          column: 18
        },
        end: {
          line: 56,
          column: 3
        }
      },
      "5": {
        start: {
          line: 58,
          column: 24
        },
        end: {
          line: 64,
          column: 3
        }
      },
      "6": {
        start: {
          line: 66,
          column: 2
        },
        end: {
          line: 66,
          column: 42
        }
      }
    },
    fnMap: {
      "0": {
        name: "FornecedoresPDF",
        decl: {
          start: {
            line: 5,
            column: 24
          },
          end: {
            line: 5,
            column: 39
          }
        },
        loc: {
          start: {
            line: 5,
            column: 63
          },
          end: {
            line: 67,
            column: 1
          }
        },
        line: 5
      },
      "1": {
        name: "(anonymous_1)",
        decl: {
          start: {
            line: 18,
            column: 23
          },
          end: {
            line: 18,
            column: 24
          }
        },
        loc: {
          start: {
            line: 18,
            column: 39
          },
          end: {
            line: 25,
            column: 7
          }
        },
        line: 18
      }
    },
    branchMap: {
      "0": {
        loc: {
          start: {
            line: 6,
            column: 16
          },
          end: {
            line: 6,
            column: 69
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 6,
            column: 35
          },
          end: {
            line: 6,
            column: 55
          }
        }, {
          start: {
            line: 6,
            column: 58
          },
          end: {
            line: 6,
            column: 69
          }
        }],
        line: 6
      },
      "1": {
        loc: {
          start: {
            line: 17,
            column: 16
          },
          end: {
            line: 26,
            column: 8
          }
        },
        type: "cond-expr",
        locations: [{
          start: {
            line: 18,
            column: 6
          },
          end: {
            line: 25,
            column: 8
          }
        }, {
          start: {
            line: 26,
            column: 6
          },
          end: {
            line: 26,
            column: 8
          }
        }],
        line: 17
      }
    },
    s: {
      "0": 0,
      "1": 0,
      "2": 0,
      "3": 0,
      "4": 0,
      "5": 0,
      "6": 0
    },
    f: {
      "0": 0,
      "1": 0
    },
    b: {
      "0": [0, 0],
      "1": [0, 0]
    },
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "6405a7b7c00591ccdd5ea38c94585c1d4ae1690d"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_1ntp77ad7l = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_1ntp77ad7l();
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import Rodape from "../utils/[utils]";
export default function FornecedoresPDF(fornecedores, empresa) {
  cov_1ntp77ad7l().f[0]++;
  cov_1ntp77ad7l().s[0]++;
  pdfMake.vfs = vfsFonts.pdfMake ? (cov_1ntp77ad7l().b[0][0]++, vfsFonts.pdfMake.vfs) : (cov_1ntp77ad7l().b[0][1]++, pdfMake.vfs);
  const reportTitle = (cov_1ntp77ad7l().s[1]++, [{
    text: `${empresa.razaoSocial}`,
    fontSize: 15,
    bold: true,
    margin: [15, 20, 0, 45]
  }]);
  const dados = (cov_1ntp77ad7l().s[2]++, fornecedores ? (cov_1ntp77ad7l().b[1][0]++, fornecedores.map(fornecedor => {
    cov_1ntp77ad7l().f[1]++;
    cov_1ntp77ad7l().s[3]++;
    return [{
      text: fornecedor.nome,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: fornecedor.email,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: fornecedor.celular,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: fornecedor.telefone,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }];
  })) : (cov_1ntp77ad7l().b[1][1]++, []));
  const details = (cov_1ntp77ad7l().s[4]++, [{
    text: `Fornecedores`,
    margin: [0, 0, 0, 20],
    bold: true,
    fontSize: 14
  }, {
    table: {
      headerRows: 1,
      widths: ["*", "*", "*", "*"],
      body: [[{
        text: "Nome",
        style: "tableHeader",
        fontSize: 10,
        bold: true
      }, {
        text: "E-mail",
        style: "tableHeader",
        fontSize: 10,
        bold: true
      }, {
        text: "Celular",
        style: "tableHeader",
        fontSize: 10,
        bold: true
      }, {
        text: "Telefone",
        style: "tableHeader",
        fontSize: 10,
        bold: true
      }], ...dados]
    },
    layout: "lightHorizontalLines"
  }]);
  const docDefinition = (cov_1ntp77ad7l().s[5]++, {
    pageSize: "A4",
    pageMargins: [15, 50, 15, 40],
    header: [reportTitle],
    content: [details],
    footer: Rodape
  });
  cov_1ntp77ad7l().s[6]++;
  pdfMake.createPdf(docDefinition).open();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlsuLi5yZXBvcnQtZm9ybmVjZWRvcmVzXS50c3giXSwibmFtZXMiOlsicGRmTWFrZSIsInZmc0ZvbnRzIiwiUm9kYXBlIiwiRm9ybmVjZWRvcmVzUERGIiwiZm9ybmVjZWRvcmVzIiwiZW1wcmVzYSIsInZmcyIsInJlcG9ydFRpdGxlIiwidGV4dCIsInJhemFvU29jaWFsIiwiZm9udFNpemUiLCJib2xkIiwibWFyZ2luIiwiZGFkb3MiLCJtYXAiLCJmb3JuZWNlZG9yIiwibm9tZSIsImVtYWlsIiwiY2VsdWxhciIsInRlbGVmb25lIiwiZGV0YWlscyIsInRhYmxlIiwiaGVhZGVyUm93cyIsIndpZHRocyIsImJvZHkiLCJzdHlsZSIsImxheW91dCIsImRvY0RlZmluaXRpb24iLCJwYWdlU2l6ZSIsInBhZ2VNYXJnaW5zIiwiaGVhZGVyIiwiY29udGVudCIsImZvb3RlciIsImNyZWF0ZVBkZiIsIm9wZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxPQUFQLE1BQW9CLHVCQUFwQjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIseUJBQXJCO0FBQ0EsT0FBT0MsTUFBUCxNQUFtQixrQkFBbkI7QUFFQSxlQUFlLFNBQVNDLGVBQVQsQ0FBeUJDLFlBQXpCLEVBQXVDQyxPQUF2QyxFQUFnRDtBQUFBO0FBQUE7QUFDN0RMLEVBQUFBLE9BQU8sQ0FBQ00sR0FBUixHQUFjTCxRQUFRLENBQUNELE9BQVQsZ0NBQW1CQyxRQUFRLENBQUNELE9BQVQsQ0FB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SlIsT0FKRixDQURJLEVBWUosR0FBR0UsS0FaQztBQUhELEtBRFQ7QUFtQkVhLElBQUFBLE1BQU0sRUFBRTtBQW5CVixHQVBjLENBQUgsQ0FBYjtBQThCQSxRQUFNQyxhQUFhLDZCQUFHO0FBQ3BCQyxJQUFBQSxRQUFRLEVBQUUsSUFEVTtBQUVwQkMsSUFBQUEsV0FBVyxFQUFFLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixDQUZPO0FBR3BCQyxJQUFBQSxNQUFNLEVBQUUsQ0FBQ3ZCLFdBQUQsQ0FIWTtBQUlwQndCLElBQUFBLE9BQU8sRUFBRSxDQUFDWCxPQUFELENBSlc7QUFLcEJZLElBQUFBLE1BQU0sRUFBRTlCO0FBTFksR0FBSCxDQUFuQjtBQXJENkQ7QUE2RDdERixFQUFBQSxPQUFPLENBQUNpQyxTQUFSLENBQWtCTixhQUFsQixFQUFpQ08sSUFBakM7QUFDRCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBwZGZNYWtlIGZyb20gXCJwZGZtYWtlL2J1aWxkL3BkZm1ha2VcIjtcbmltcG9ydCB2ZnNGb250cyBmcm9tIFwicGRmbWFrZS9idWlsZC92ZnNfZm9udHNcIjtcbmltcG9ydCBSb2RhcGUgZnJvbSBcIi4uL3V0aWxzL1t1dGlsc11cIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gRm9ybmVjZWRvcmVzUERGKGZvcm5lY2Vkb3JlcywgZW1wcmVzYSkge1xuICBwZGZNYWtlLnZmcyA9IHZmc0ZvbnRzLnBkZk1ha2UgPyB2ZnNGb250cy5wZGZNYWtlLnZmcyA6IHBkZk1ha2UudmZzO1xuXG4gIGNvbnN0IHJlcG9ydFRpdGxlID0gW1xuICAgIHtcbiAgICAgIHRleHQ6IGAke2VtcHJlc2EucmF6YW9Tb2NpYWx9YCxcbiAgICAgIGZvbnRTaXplOiAxNSxcbiAgICAgIGJvbGQ6IHRydWUsXG4gICAgICBtYXJnaW46IFsxNSwgMjAsIDAsIDQ1XSxcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IGRhZG9zID0gZm9ybmVjZWRvcmVzXG4gICAgPyBmb3JuZWNlZG9yZXMubWFwKChmb3JuZWNlZG9yKSA9PiB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgeyB0ZXh0OiBmb3JuZWNlZG9yLm5vbWUsIGZvbnRTaXplOiA5LCBtYXJnaW46IFswLCAyLCAwLCAyXSB9LFxuICAgICAgICAgIHsgdGV4dDogZm9ybmVjZWRvci5lbWFpbCwgZm9udFNpemU6IDksIG1hcmdpbjogWzAsIDIsIDAsIDJdIH0sXG4gICAgICAgICAgeyB0ZXh0OiBmb3JuZWNlZG9yLmNlbHVsYXIsIGZvbnRTaXplOiA5LCBtYXJnaW46IFswLCAyLCAwLCAyXSB9LFxuICAgICAgICAgIHsgdGV4dDogZm9ybmVjZWRvci50ZWxlZm9uZSwgZm9udFNpemU6IDksIG1hcmdpbjogWzAsIDIsIDAsIDJdIH0sXG4gICAgICAgIF07XG4gICAgICB9KVxuICAgIDogW107XG5cbiAgY29uc3QgZGV0YWlscyA9IFtcbiAgICB7XG4gICAgICB0ZXh0OiBgRm9ybmVjZWRvcmVzYCxcbiAgICAgIG1hcmdpbjogWzAsIDAsIDAsIDIwXSxcbiAgICAgIGJvbGQ6IHRydWUsXG4gICAgICBmb250U2l6ZTogMTQsXG4gICAgfSxcbiAgICB7XG4gICAgICB0YWJsZToge1xuICAgICAgICBoZWFkZXJSb3dzOiAxLFxuICAgICAgICB3aWR0aHM6IFtcIipcIiwgXCIqXCIsIFwiKlwiLCBcIipcIl0sXG4gICAgICAgIGJvZHk6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICB7IHRleHQ6IFwiTm9tZVwiLCBzdHlsZTogXCJ0YWJsZUhlYWRlclwiLCBmb250U2l6ZTogMTAsIGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJFLW1haWxcIiwgc3R5bGU6IFwidGFibGVIZWFkZXJcIiwgZm9udFNpemU6IDEwLCBib2xkOiB0cnVlIH0sXG4gICAgICAgICAgICB7IHRleHQ6IFwiQ2VsdWxhclwiLCBzdHlsZTogXCJ0YWJsZUhlYWRlclwiLCBmb250U2l6ZTogMTAsIGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgdGV4dDogXCJUZWxlZm9uZVwiLFxuICAgICAgICAgICAgICBzdHlsZTogXCJ0YWJsZUhlYWRlclwiLFxuICAgICAgICAgICAgICBmb250U2l6ZTogMTAsXG4gICAgICAgICAgICAgIGJvbGQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIF0sXG4gICAgICAgICAgLi4uZGFkb3MsXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgbGF5b3V0OiBcImxpZ2h0SG9yaXpvbnRhbExpbmVzXCIsXG4gICAgfSxcbiAgXTtcblxuICBjb25zdCBkb2NEZWZpbml0aW9uID0ge1xuICAgIHBhZ2VTaXplOiBcIkE0XCIsXG4gICAgcGFnZU1hcmdpbnM6IFsxNSwgNTAsIDE1LCA0MF0sXG4gICAgaGVhZGVyOiBbcmVwb3J0VGl0bGVdLFxuICAgIGNvbnRlbnQ6IFtkZXRhaWxzXSxcbiAgICBmb290ZXI6IFJvZGFwZSxcbiAgfTtcblxuICBwZGZNYWtlLmNyZWF0ZVBkZihkb2NEZWZpbml0aW9uKS5vcGVuKCk7XG59XG4iXX0=