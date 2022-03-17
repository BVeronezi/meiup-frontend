function cov_2m9ee2w2q2() {
  var path = "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/pages/relatorios/clientes/[...report-clientes].tsx";
  var hash = "7cbdb99397dc0f15d7bf3f52b9e2a9b86c15294b";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/pages/relatorios/clientes/[...report-clientes].tsx",
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
        name: "ClientesPDF",
        decl: {
          start: {
            line: 5,
            column: 24
          },
          end: {
            line: 5,
            column: 35
          }
        },
        loc: {
          start: {
            line: 5,
            column: 55
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
            column: 19
          },
          end: {
            line: 18,
            column: 20
          }
        },
        loc: {
          start: {
            line: 18,
            column: 32
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
    hash: "7cbdb99397dc0f15d7bf3f52b9e2a9b86c15294b"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2m9ee2w2q2 = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2m9ee2w2q2();
import pdfMake from "pdfmake/build/pdfmake";
import vfsFonts from "pdfmake/build/vfs_fonts";
import Rodape from "../utils/[utils]";
export default function ClientesPDF(clientes, empresa) {
  cov_2m9ee2w2q2().f[0]++;
  cov_2m9ee2w2q2().s[0]++;
  pdfMake.vfs = vfsFonts.pdfMake ? (cov_2m9ee2w2q2().b[0][0]++, vfsFonts.pdfMake.vfs) : (cov_2m9ee2w2q2().b[0][1]++, pdfMake.vfs);
  const reportTitle = (cov_2m9ee2w2q2().s[1]++, [{
    text: `${empresa.razaoSocial}`,
    fontSize: 15,
    bold: true,
    margin: [15, 20, 0, 45]
  }]);
  const dados = (cov_2m9ee2w2q2().s[2]++, clientes ? (cov_2m9ee2w2q2().b[1][0]++, clientes.map(cliente => {
    cov_2m9ee2w2q2().f[1]++;
    cov_2m9ee2w2q2().s[3]++;
    return [{
      text: cliente.nome,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: cliente.email,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: cliente.celular,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }, {
      text: cliente.telefone,
      fontSize: 9,
      margin: [0, 2, 0, 2]
    }];
  })) : (cov_2m9ee2w2q2().b[1][1]++, []));
  const details = (cov_2m9ee2w2q2().s[4]++, [{
    text: `Clientes`,
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
  const docDefinition = (cov_2m9ee2w2q2().s[5]++, {
    pageSize: "A4",
    pageMargins: [15, 50, 15, 40],
    header: [reportTitle],
    content: [details],
    footer: Rodape
  });
  cov_2m9ee2w2q2().s[6]++;
  pdfMake.createPdf(docDefinition).open();
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlsuLi5yZXBvcnQtY2xpZW50ZXNdLnRzeCJdLCJuYW1lcyI6WyJwZGZNYWtlIiwidmZzRm9udHMiLCJSb2RhcGUiLCJDbGllbnRlc1BERiIsImNsaWVudGVzIiwiZW1wcmVzYSIsInZmcyIsInJlcG9ydFRpdGxlIiwidGV4dCIsInJhemFvU29jaWFsIiwiZm9udFNpemUiLCJib2xkIiwibWFyZ2luIiwiZGFkb3MiLCJtYXAiLCJjbGllbnRlIiwibm9tZSIsImVtYWlsIiwiY2VsdWxhciIsInRlbGVmb25lIiwiZGV0YWlscyIsInRhYmxlIiwiaGVhZGVyUm93cyIsIndpZHRocyIsImJvZHkiLCJzdHlsZSIsImxheW91dCIsImRvY0RlZmluaXRpb24iLCJwYWdlU2l6ZSIsInBhZ2VNYXJnaW5zIiwiaGVhZGVyIiwiY29udGVudCIsImZvb3RlciIsImNyZWF0ZVBkZiIsIm9wZW4iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPQSxPQUFQLE1BQW9CLHVCQUFwQjtBQUNBLE9BQU9DLFFBQVAsTUFBcUIseUJBQXJCO0FBQ0EsT0FBT0MsTUFBUCxNQUFtQixrQkFBbkI7QUFFQSxlQUFlLFNBQVNDLFdBQVQsQ0FBcUJDLFFBQXJCLEVBQStCQyxPQUEvQixFQUF3QztBQUFBO0FBQUE7QUFDckRMLEVBQUFBLE9BQU8sQ0FBQ00sR0FBUixHQUFjTCxRQUFRLENBQUNELE9BQVQsZ0NBQW1CQyxRQUFRLENBQUNELE9BQVQsQ0FBaUJNLEdBQXBDLGlDQUEw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LEdBQUdFLEtBWkM7QUFIRCxLQURUO0FBbUJFYSxJQUFBQSxNQUFNLEVBQUU7QUFuQlYsR0FQYyxDQUFILENBQWI7QUE4QkEsUUFBTUMsYUFBYSw2QkFBRztBQUNwQkMsSUFBQUEsUUFBUSxFQUFFLElBRFU7QUFFcEJDLElBQUFBLFdBQVcsRUFBRSxDQUFDLEVBQUQsRUFBSyxFQUFMLEVBQVMsRUFBVCxFQUFhLEVBQWIsQ0FGTztBQUdwQkMsSUFBQUEsTUFBTSxFQUFFLENBQUN2QixXQUFELENBSFk7QUFJcEJ3QixJQUFBQSxPQUFPLEVBQUUsQ0FBQ1gsT0FBRCxDQUpXO0FBS3BCWSxJQUFBQSxNQUFNLEVBQUU5QjtBQUxZLEdBQUgsQ0FBbkI7QUFyRHFEO0FBNkRyREYsRUFBQUEsT0FBTyxDQUFDaUMsU0FBUixDQUFrQk4sYUFBbEIsRUFBaUNPLElBQWpDO0FBQ0QiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgcGRmTWFrZSBmcm9tIFwicGRmbWFrZS9idWlsZC9wZGZtYWtlXCI7XG5pbXBvcnQgdmZzRm9udHMgZnJvbSBcInBkZm1ha2UvYnVpbGQvdmZzX2ZvbnRzXCI7XG5pbXBvcnQgUm9kYXBlIGZyb20gXCIuLi91dGlscy9bdXRpbHNdXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIENsaWVudGVzUERGKGNsaWVudGVzLCBlbXByZXNhKSB7XG4gIHBkZk1ha2UudmZzID0gdmZzRm9udHMucGRmTWFrZSA/IHZmc0ZvbnRzLnBkZk1ha2UudmZzIDogcGRmTWFrZS52ZnM7XG5cbiAgY29uc3QgcmVwb3J0VGl0bGUgPSBbXG4gICAge1xuICAgICAgdGV4dDogYCR7ZW1wcmVzYS5yYXphb1NvY2lhbH1gLFxuICAgICAgZm9udFNpemU6IDE1LFxuICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgIG1hcmdpbjogWzE1LCAyMCwgMCwgNDVdLFxuICAgIH0sXG4gIF07XG5cbiAgY29uc3QgZGFkb3MgPSBjbGllbnRlc1xuICAgID8gY2xpZW50ZXMubWFwKChjbGllbnRlKSA9PiB7XG4gICAgICAgIHJldHVybiBbXG4gICAgICAgICAgeyB0ZXh0OiBjbGllbnRlLm5vbWUsIGZvbnRTaXplOiA5LCBtYXJnaW46IFswLCAyLCAwLCAyXSB9LFxuICAgICAgICAgIHsgdGV4dDogY2xpZW50ZS5lbWFpbCwgZm9udFNpemU6IDksIG1hcmdpbjogWzAsIDIsIDAsIDJdIH0sXG4gICAgICAgICAgeyB0ZXh0OiBjbGllbnRlLmNlbHVsYXIsIGZvbnRTaXplOiA5LCBtYXJnaW46IFswLCAyLCAwLCAyXSB9LFxuICAgICAgICAgIHsgdGV4dDogY2xpZW50ZS50ZWxlZm9uZSwgZm9udFNpemU6IDksIG1hcmdpbjogWzAsIDIsIDAsIDJdIH0sXG4gICAgICAgIF07XG4gICAgICB9KVxuICAgIDogW107XG5cbiAgY29uc3QgZGV0YWlscyA9IFtcbiAgICB7XG4gICAgICB0ZXh0OiBgQ2xpZW50ZXNgLFxuICAgICAgbWFyZ2luOiBbMCwgMCwgMCwgMjBdLFxuICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgIGZvbnRTaXplOiAxNCxcbiAgICB9LFxuICAgIHtcbiAgICAgIHRhYmxlOiB7XG4gICAgICAgIGhlYWRlclJvd3M6IDEsXG4gICAgICAgIHdpZHRoczogW1wiKlwiLCBcIipcIiwgXCIqXCIsIFwiKlwiXSxcbiAgICAgICAgYm9keTogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIHsgdGV4dDogXCJOb21lXCIsIHN0eWxlOiBcInRhYmxlSGVhZGVyXCIsIGZvbnRTaXplOiAxMCwgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAgeyB0ZXh0OiBcIkUtbWFpbFwiLCBzdHlsZTogXCJ0YWJsZUhlYWRlclwiLCBmb250U2l6ZTogMTAsIGJvbGQ6IHRydWUgfSxcbiAgICAgICAgICAgIHsgdGV4dDogXCJDZWx1bGFyXCIsIHN0eWxlOiBcInRhYmxlSGVhZGVyXCIsIGZvbnRTaXplOiAxMCwgYm9sZDogdHJ1ZSB9LFxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICB0ZXh0OiBcIlRlbGVmb25lXCIsXG4gICAgICAgICAgICAgIHN0eWxlOiBcInRhYmxlSGVhZGVyXCIsXG4gICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgYm9sZDogdHJ1ZSxcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgXSxcbiAgICAgICAgICAuLi5kYWRvcyxcbiAgICAgICAgXSxcbiAgICAgIH0sXG4gICAgICBsYXlvdXQ6IFwibGlnaHRIb3Jpem9udGFsTGluZXNcIixcbiAgICB9LFxuICBdO1xuXG4gIGNvbnN0IGRvY0RlZmluaXRpb24gPSB7XG4gICAgcGFnZVNpemU6IFwiQTRcIixcbiAgICBwYWdlTWFyZ2luczogWzE1LCA1MCwgMTUsIDQwXSxcbiAgICBoZWFkZXI6IFtyZXBvcnRUaXRsZV0sXG4gICAgY29udGVudDogW2RldGFpbHNdLFxuICAgIGZvb3RlcjogUm9kYXBlLFxuICB9O1xuXG4gIHBkZk1ha2UuY3JlYXRlUGRmKGRvY0RlZmluaXRpb24pLm9wZW4oKTtcbn1cbiJdfQ==