function cov_13ns3jze5j() {
  var path = "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/services/apiClient.ts";
  var hash = "cc8c94158a7257b60f2b76cb2e51a31a0afabfef";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/services/apiClient.ts",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 19
        },
        end: {
          line: 3,
          column: 35
        }
      }
    },
    fnMap: {},
    branchMap: {},
    s: {
      "0": 0
    },
    f: {},
    b: {},
    _coverageSchema: "1a1c01bbd47fc00a2c39e90264f33305004495a9",
    hash: "cc8c94158a7257b60f2b76cb2e51a31a0afabfef"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_13ns3jze5j = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_13ns3jze5j();
import { setupAPIClient } from './api';
export const api = (cov_13ns3jze5j().s[0]++, setupAPIClient());
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwaUNsaWVudC50cyJdLCJuYW1lcyI6WyJzZXR1cEFQSUNsaWVudCIsImFwaSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWVZOzs7Ozs7Ozs7QUFmWixTQUFTQSxjQUFULFFBQStCLE9BQS9CO0FBRUEsT0FBTyxNQUFNQyxHQUFHLDZCQUFHRCxjQUFjLEVBQWpCLENBQVQiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBzZXR1cEFQSUNsaWVudCB9IGZyb20gJy4vYXBpJztcblxuZXhwb3J0IGNvbnN0IGFwaSA9IHNldHVwQVBJQ2xpZW50KCk7Il19