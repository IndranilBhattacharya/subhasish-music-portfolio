"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
self["webpackHotUpdate_N_E"]("pages/index",{

/***/ "./components/Interfaces/YtCard.tsx":
/*!******************************************!*\
  !*** ./components/Interfaces/YtCard.tsx ***!
  \******************************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\nvar _this = undefined;\n\nvar _s = $RefreshSig$();\n\nvar YtCard = function(param) {\n    var x = param.x, y = param.y, children = param.children;\n    _s();\n    var cardRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    var ref = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), localX = ref[0], setLocalX = ref[1];\n    var ref1 = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(0), localY = ref1[0], setLocalY = ref1[1];\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(function() {\n        var ref;\n        var cardRectBoundary = (ref = cardRef.current) === null || ref === void 0 ? void 0 : ref.getBoundingClientRect();\n        var ref1;\n        setLocalX(x - ((ref1 = cardRectBoundary === null || cardRectBoundary === void 0 ? void 0 : cardRectBoundary.left) !== null && ref1 !== void 0 ? ref1 : 0));\n        var ref2;\n        setLocalY(y - ((ref2 = cardRectBoundary === null || cardRectBoundary === void 0 ? void 0 : cardRectBoundary.top) !== null && ref2 !== void 0 ? ref2 : 0));\n    }, [\n        x,\n        y,\n        setLocalX,\n        setLocalY\n    ]);\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        ref: cardRef,\n        className: \"glass-card yt-card bg-slate-50 bg-opacity-5 flex flex-col h-fit\",\n        style: {\n            background: \"radial-gradient(\\n        30rem circle at \".concat(localX, \"px \").concat(localY, \"px,\\n        rgba(225, 115, 115, 0.17),\\n        transparent 95%\\n      )\")\n        },\n        children: children\n    }, void 0, false, {\n        fileName: \"C:\\\\My Files\\\\NextJsProjects\\\\subhasish\\\\components\\\\Interfaces\\\\YtCard.tsx\",\n        lineNumber: 21,\n        columnNumber: 5\n    }, _this);\n};\n_s(YtCard, \"/rKo2BX9I917VDsCMeaq9yfSjX4=\");\n_c = YtCard;\n/* harmony default export */ __webpack_exports__[\"default\"] = (/*#__PURE__*/_c1 = (0,react__WEBPACK_IMPORTED_MODULE_1__.memo)(YtCard));\nvar _c, _c1;\n$RefreshReg$(_c, \"YtCard\");\n$RefreshReg$(_c1, \"%default%\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevExports = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevExports) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports on update so we can compare the boundary\n                // signatures.\n                module.hot.dispose(function (data) {\n                    data.prevExports = currentExports;\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevExports !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevExports, currentExports)) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevExports !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9jb21wb25lbnRzL0ludGVyZmFjZXMvWXRDYXJkLnRzeC5qcyIsIm1hcHBpbmdzIjoiOzs7OztBQUFBOzs7QUFBOEQ7QUFROUQsSUFBTUksTUFBTSxHQUFrQixnQkFBd0I7UUFBckJDLENBQUMsU0FBREEsQ0FBQyxFQUFFQyxDQUFDLFNBQURBLENBQUMsRUFBRUMsUUFBUSxTQUFSQSxRQUFROztJQUM3QyxJQUFNQyxPQUFPLEdBQUdOLDZDQUFNLENBQWlCLElBQUksQ0FBQztJQUM1QyxJQUE0QkMsR0FBbUIsR0FBbkJBLCtDQUFRLENBQVMsQ0FBQyxDQUFDLEVBQXhDTSxNQUFNLEdBQWVOLEdBQW1CLEdBQWxDLEVBQUVPLFNBQVMsR0FBSVAsR0FBbUIsR0FBdkI7SUFDeEIsSUFBNEJBLElBQW1CLEdBQW5CQSwrQ0FBUSxDQUFTLENBQUMsQ0FBQyxFQUF4Q1EsTUFBTSxHQUFlUixJQUFtQixHQUFsQyxFQUFFUyxTQUFTLEdBQUlULElBQW1CLEdBQXZCO0lBRXhCRixnREFBUyxDQUFDLFdBQU07WUFDV08sR0FBZTtRQUF4QyxJQUFNSyxnQkFBZ0IsR0FBR0wsQ0FBQUEsR0FBZSxHQUFmQSxPQUFPLENBQUNNLE9BQU8sY0FBZk4sR0FBZSxXQUF1QixHQUF0Q0EsS0FBQUEsQ0FBc0MsR0FBdENBLEdBQWUsQ0FBRU8scUJBQXFCLEVBQUU7WUFDbERGLElBQXNCO1FBQXJDSCxTQUFTLENBQUNMLENBQUMsR0FBSVEsQ0FBQUEsQ0FBQUEsSUFBc0IsR0FBdEJBLGdCQUFnQixhQUFoQkEsZ0JBQWdCLFdBQU0sR0FBdEJBLEtBQUFBLENBQXNCLEdBQXRCQSxnQkFBZ0IsQ0FBRUcsSUFBSSxjQUF0QkgsSUFBc0IsY0FBdEJBLElBQXNCLEdBQUksQ0FBQyxFQUFFLENBQUM7WUFDOUJBLElBQXFCO1FBQXBDRCxTQUFTLENBQUNOLENBQUMsR0FBSU8sQ0FBQUEsQ0FBQUEsSUFBcUIsR0FBckJBLGdCQUFnQixhQUFoQkEsZ0JBQWdCLFdBQUssR0FBckJBLEtBQUFBLENBQXFCLEdBQXJCQSxnQkFBZ0IsQ0FBRUksR0FBRyxjQUFyQkosSUFBcUIsY0FBckJBLElBQXFCLEdBQUksQ0FBQyxFQUFFLENBQUM7SUFDOUMsQ0FBQyxFQUFFO1FBQUNSLENBQUM7UUFBRUMsQ0FBQztRQUFFSSxTQUFTO1FBQUVFLFNBQVM7S0FBQyxDQUFDLENBQUM7SUFFakMscUJBQ0UsOERBQUNNLEtBQUc7UUFDRkMsR0FBRyxFQUFFWCxPQUFPO1FBQ1pZLFNBQVMsRUFBQyxpRUFBaUU7UUFDM0VDLEtBQUssRUFBRTtZQUNMQyxVQUFVLEVBQUUsNENBQ0ksQ0FBY1gsTUFBTSxDQUFsQkYsTUFBTSxFQUFDLEtBQUcsQ0FBUyxPQUd0QyxDQUgrQkUsTUFBTSxFQUFDLDJFQUd0QyxDQUFDO1NBQ0Q7a0JBRUFKLFFBQVE7Ozs7O2FBQ0wsQ0FDTjtBQUNKLENBQUM7R0ExQktILE1BQU07QUFBTkEsS0FBQUEsTUFBTTtBQTRCWiw0RUFBZUosTUFBQUEsMkNBQUksQ0FBQ0ksTUFBTSxDQUFDLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9fTl9FLy4vY29tcG9uZW50cy9JbnRlcmZhY2VzL1l0Q2FyZC50c3g/ZDgxOCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBGQywgbWVtbywgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XHJcbmltcG9ydCB7IEZDUHJvcHMgfSBmcm9tIFwiLi4vLi4vdHlwZXNcIjtcclxuXHJcbmludGVyZmFjZSBDYXJkUHJvcHMgZXh0ZW5kcyBGQ1Byb3BzIHtcclxuICB4OiBudW1iZXI7XHJcbiAgeTogbnVtYmVyO1xyXG59XHJcblxyXG5jb25zdCBZdENhcmQ6IEZDPENhcmRQcm9wcz4gPSAoeyB4LCB5LCBjaGlsZHJlbiB9KSA9PiB7XHJcbiAgY29uc3QgY2FyZFJlZiA9IHVzZVJlZjxIVE1MRGl2RWxlbWVudD4obnVsbCk7XHJcbiAgY29uc3QgW2xvY2FsWCwgc2V0TG9jYWxYXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XHJcbiAgY29uc3QgW2xvY2FsWSwgc2V0TG9jYWxZXSA9IHVzZVN0YXRlPG51bWJlcj4oMCk7XHJcblxyXG4gIHVzZUVmZmVjdCgoKSA9PiB7XHJcbiAgICBjb25zdCBjYXJkUmVjdEJvdW5kYXJ5ID0gY2FyZFJlZi5jdXJyZW50Py5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIHNldExvY2FsWCh4IC0gKGNhcmRSZWN0Qm91bmRhcnk/LmxlZnQgPz8gMCkpO1xyXG4gICAgc2V0TG9jYWxZKHkgLSAoY2FyZFJlY3RCb3VuZGFyeT8udG9wID8/IDApKTtcclxuICB9LCBbeCwgeSwgc2V0TG9jYWxYLCBzZXRMb2NhbFldKTtcclxuXHJcbiAgcmV0dXJuIChcclxuICAgIDxkaXZcclxuICAgICAgcmVmPXtjYXJkUmVmfVxyXG4gICAgICBjbGFzc05hbWU9XCJnbGFzcy1jYXJkIHl0LWNhcmQgYmctc2xhdGUtNTAgYmctb3BhY2l0eS01IGZsZXggZmxleC1jb2wgaC1maXRcIlxyXG4gICAgICBzdHlsZT17e1xyXG4gICAgICAgIGJhY2tncm91bmQ6IGByYWRpYWwtZ3JhZGllbnQoXHJcbiAgICAgICAgMzByZW0gY2lyY2xlIGF0ICR7bG9jYWxYfXB4ICR7bG9jYWxZfXB4LFxyXG4gICAgICAgIHJnYmEoMjI1LCAxMTUsIDExNSwgMC4xNyksXHJcbiAgICAgICAgdHJhbnNwYXJlbnQgOTUlXHJcbiAgICAgIClgLFxyXG4gICAgICB9fVxyXG4gICAgPlxyXG4gICAgICB7Y2hpbGRyZW59XHJcbiAgICA8L2Rpdj5cclxuICApO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbWVtbyhZdENhcmQpO1xyXG4iXSwibmFtZXMiOlsibWVtbyIsInVzZUVmZmVjdCIsInVzZVJlZiIsInVzZVN0YXRlIiwiWXRDYXJkIiwieCIsInkiLCJjaGlsZHJlbiIsImNhcmRSZWYiLCJsb2NhbFgiLCJzZXRMb2NhbFgiLCJsb2NhbFkiLCJzZXRMb2NhbFkiLCJjYXJkUmVjdEJvdW5kYXJ5IiwiY3VycmVudCIsImdldEJvdW5kaW5nQ2xpZW50UmVjdCIsImxlZnQiLCJ0b3AiLCJkaXYiLCJyZWYiLCJjbGFzc05hbWUiLCJzdHlsZSIsImJhY2tncm91bmQiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/Interfaces/YtCard.tsx\n"));

/***/ })

});