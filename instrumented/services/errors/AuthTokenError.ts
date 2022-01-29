function cov_20kovb659z() {
  var path = "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/services/errors/AuthTokenError.ts";
  var hash = "e8248cc73a53c8b1b36f13fa135b4cf97168a6cc";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/services/errors/AuthTokenError.ts",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 8
        },
        end: {
          line: 3,
          column: 49
        }
      }
    },
    fnMap: {
      "0": {
        name: "(anonymous_0)",
        decl: {
          start: {
            line: 2,
            column: 4
          },
          end: {
            line: 2,
            column: 5
          }
        },
        loc: {
          start: {
            line: 2,
            column: 18
          },
          end: {
            line: 4,
            column: 5
          }
        },
        line: 2
      }
    },
    branchMap: {},
    s: {
      "0": 0
    },
    f: {
      "0": 0
    },
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "e8248cc73a53c8b1b36f13fa135b4cf97168a6cc"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_20kovb659z = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_20kovb659z();
export class AuthTokenError extends Error {
  constructor() {
    cov_20kovb659z().f[0]++;
    cov_20kovb659z().s[0]++;
    super('Error with authentication token');
  }

}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkF1dGhUb2tlbkVycm9yLnRzIl0sIm5hbWVzIjpbIkF1dGhUb2tlbkVycm9yIiwiRXJyb3IiLCJjb25zdHJ1Y3RvciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixPQUFPLE1BQU1BLGNBQU4sU0FBNkJDLEtBQTdCLENBQW1DO0FBQ3RDQyxFQUFBQSxXQUFXLEdBQUc7QUFBQTtBQUFBO0FBQ1YsVUFBTSxpQ0FBTjtBQUNIOztBQUhxQyIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBjbGFzcyBBdXRoVG9rZW5FcnJvciBleHRlbmRzIEVycm9yIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoJ0Vycm9yIHdpdGggYXV0aGVudGljYXRpb24gdG9rZW4nKTtcbiAgICB9XG59Il19