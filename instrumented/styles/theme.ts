function cov_2f9pnersui() {
  var path = "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/styles/theme.ts";
  var hash = "5d5b90fab3497fbf51e7569aae6ef9887eb94c05";
  var global = new Function("return this")();
  var gcv = "__coverage__";
  var coverageData = {
    path: "/Users/labianca.veronezi/Documents/MyProjects/TCC/meiup-frontend/src/styles/theme.ts",
    statementMap: {
      "0": {
        start: {
          line: 3,
          column: 21
        },
        end: {
          line: 36,
          column: 2
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
    hash: "5d5b90fab3497fbf51e7569aae6ef9887eb94c05"
  };
  var coverage = global[gcv] || (global[gcv] = {});

  if (!coverage[path] || coverage[path].hash !== hash) {
    coverage[path] = coverageData;
  }

  var actualCoverage = coverage[path];
  {
    // @ts-ignore
    cov_2f9pnersui = function () {
      return actualCoverage;
    };
  }
  return actualCoverage;
}

cov_2f9pnersui();
import { extendTheme, Theme } from "@chakra-ui/react";
export const theme = (cov_2f9pnersui().s[0]++, extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false
  },
  colors: {
    gray: {
      "100": "#f5f6fa",
      "200": "#dcdde1",
      "500": "#7f8fa6",
      "700": "#718093",
      "900": "#2D2D2D"
    },
    yellow: {
      "900": "#F8C33B"
    },
    blue: {
      "500": "#40739E",
      "700": "#487EB0"
    },
    red: {
      "700": "#C23616"
    }
  },
  fonts: {
    heading: "Poppins",
    body: "Poppins"
  },
  textStyles: {
    a: {
      textDecoration: "underline"
    }
  }
}));
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInRoZW1lLnRzIl0sIm5hbWVzIjpbImV4dGVuZFRoZW1lIiwiVGhlbWUiLCJ0aGVtZSIsImNvbmZpZyIsImluaXRpYWxDb2xvck1vZGUiLCJ1c2VTeXN0ZW1Db2xvck1vZGUiLCJjb2xvcnMiLCJncmF5IiwieWVsbG93IiwiYmx1ZSIsInJlZCIsImZvbnRzIiwiaGVhZGluZyIsImJvZHkiLCJ0ZXh0U3R5bGVzIiwiYSIsInRleHREZWNvcmF0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBZVk7Ozs7Ozs7OztBQWZaLFNBQVNBLFdBQVQsRUFBc0JDLEtBQXRCLFFBQW1DLGtCQUFuQztBQUVBLE9BQU8sTUFBTUMsS0FBSyw2QkFBR0YsV0FBVyxDQUFDO0FBQy9CRyxFQUFBQSxNQUFNLEVBQUU7QUFDTkMsSUFBQUEsZ0JBQWdCLEVBQUUsT0FEWjtBQUVOQyxJQUFBQSxrQkFBa0IsRUFBRTtBQUZkLEdBRHVCO0FBSy9CQyxFQUFBQSxNQUFNLEVBQUU7QUFDTkMsSUFBQUEsSUFBSSxFQUFFO0FBQ0osYUFBTyxTQURIO0FBRUosYUFBTyxTQUZIO0FBR0osYUFBTyxTQUhIO0FBSUosYUFBTyxTQUpIO0FBS0osYUFBTztBQUxILEtBREE7QUFRTkMsSUFBQUEsTUFBTSxFQUFFO0FBQ04sYUFBTztBQURELEtBUkY7QUFXTkMsSUFBQUEsSUFBSSxFQUFFO0FBQ0osYUFBTyxTQURIO0FBRUosYUFBTztBQUZILEtBWEE7QUFlTkMsSUFBQUEsR0FBRyxFQUFFO0FBQ0gsYUFBTztBQURKO0FBZkMsR0FMdUI7QUF3Qi9CQyxFQUFBQSxLQUFLLEVBQUU7QUFDTEMsSUFBQUEsT0FBTyxFQUFFLFNBREo7QUFFTEMsSUFBQUEsSUFBSSxFQUFFO0FBRkQsR0F4QndCO0FBNEIvQkMsRUFBQUEsVUFBVSxFQUFFO0FBQ1ZDLElBQUFBLENBQUMsRUFBRTtBQUNEQyxNQUFBQSxjQUFjLEVBQUU7QUFEZjtBQURPO0FBNUJtQixDQUFELENBQWQsQ0FBWCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGV4dGVuZFRoZW1lLCBUaGVtZSB9IGZyb20gXCJAY2hha3JhLXVpL3JlYWN0XCI7XG5cbmV4cG9ydCBjb25zdCB0aGVtZSA9IGV4dGVuZFRoZW1lKHtcbiAgY29uZmlnOiB7XG4gICAgaW5pdGlhbENvbG9yTW9kZTogXCJsaWdodFwiLFxuICAgIHVzZVN5c3RlbUNvbG9yTW9kZTogZmFsc2UsXG4gIH0sXG4gIGNvbG9yczoge1xuICAgIGdyYXk6IHtcbiAgICAgIFwiMTAwXCI6IFwiI2Y1ZjZmYVwiLFxuICAgICAgXCIyMDBcIjogXCIjZGNkZGUxXCIsXG4gICAgICBcIjUwMFwiOiBcIiM3ZjhmYTZcIixcbiAgICAgIFwiNzAwXCI6IFwiIzcxODA5M1wiLFxuICAgICAgXCI5MDBcIjogXCIjMkQyRDJEXCIsXG4gICAgfSxcbiAgICB5ZWxsb3c6IHtcbiAgICAgIFwiOTAwXCI6IFwiI0Y4QzMzQlwiLFxuICAgIH0sXG4gICAgYmx1ZToge1xuICAgICAgXCI1MDBcIjogXCIjNDA3MzlFXCIsXG4gICAgICBcIjcwMFwiOiBcIiM0ODdFQjBcIixcbiAgICB9LFxuICAgIHJlZDoge1xuICAgICAgXCI3MDBcIjogXCIjQzIzNjE2XCIsXG4gICAgfSxcbiAgfSxcbiAgZm9udHM6IHtcbiAgICBoZWFkaW5nOiBcIlBvcHBpbnNcIixcbiAgICBib2R5OiBcIlBvcHBpbnNcIixcbiAgfSxcbiAgdGV4dFN0eWxlczoge1xuICAgIGE6IHtcbiAgICAgIHRleHREZWNvcmF0aW9uOiBcInVuZGVybGluZVwiLFxuICAgIH0sXG4gIH0sXG59KTtcbiJdfQ==