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

/***/ "./components/VideoPlayer.js":
/*!***********************************!*\
  !*** ./components/VideoPlayer.js ***!
  \***********************************/
/***/ (function(module, __webpack_exports__, __webpack_require__) {

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ VideoPlayer; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _CommentarySidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CommentarySidebar */ \"./components/CommentarySidebar.js\");\n\nvar _s = $RefreshSig$();\n\n\nfunction VideoPlayer(param) {\n    let { videoSrc } = param;\n    _s();\n    const videoRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [commentary, setCommentary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [showAIMessages, setShowAIMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [isAIWatching, setIsAIWatching] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isSpeaking, setIsSpeaking] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const video = videoRef.current;\n        let rafId;\n        let lastCaptureTime = 0;\n        const captureFrame = (time)=>{\n            if (time - lastCaptureTime >= 2000) {\n                if (video.readyState >= video.HAVE_CURRENT_DATA) {\n                    const canvas = document.createElement(\"canvas\");\n                    canvas.width = video.videoWidth;\n                    canvas.height = video.videoHeight;\n                    canvas.getContext(\"2d\").drawImage(video, 0, 0, canvas.width, canvas.height);\n                    console.log(\"Capturing frame:\", canvas.width, \"x\", canvas.height);\n                    const imageData = canvas.toDataURL(\"image/jpeg\");\n                    setIsAIWatching(true);\n                    fetch(\"/api/commentary\", {\n                        method: \"POST\",\n                        headers: {\n                            \"Content-Type\": \"application/json\"\n                        },\n                        body: JSON.stringify({\n                            imageData,\n                            width: canvas.width,\n                            height: canvas.height\n                        })\n                    }).then((response)=>response.json()).then((data)=>{\n                        console.log(\"Commentary generated:\", data);\n                        setCommentary((prevCommentary)=>[\n                                ...prevCommentary,\n                                {\n                                    ...data,\n                                    type: \"ai\"\n                                }\n                            ]);\n                        setIsAIWatching(false);\n                    }).catch((error)=>{\n                        console.error(\"Error generating commentary:\", error);\n                        setError(\"Error generating commentary. Please check the console for details.\");\n                        setIsAIWatching(false);\n                    });\n                    lastCaptureTime = time;\n                }\n            }\n            rafId = requestAnimationFrame(captureFrame);\n        };\n        const handlePlay = ()=>{\n            console.log(\"Video playback started\");\n            rafId = requestAnimationFrame(captureFrame);\n        };\n        const handlePause = ()=>{\n            console.log(\"Video playback paused\");\n            cancelAnimationFrame(rafId);\n            setIsAIWatching(false);\n        };\n        const handleError = (e)=>{\n            console.error(\"Video error:\", e);\n            setError(\"Error loading video. Please check the video source.\");\n        };\n        video.addEventListener(\"play\", handlePlay);\n        video.addEventListener(\"pause\", handlePause);\n        video.addEventListener(\"error\", handleError);\n        return ()=>{\n            video.removeEventListener(\"play\", handlePlay);\n            video.removeEventListener(\"pause\", handlePause);\n            video.removeEventListener(\"error\", handleError);\n            cancelAnimationFrame(rafId);\n        };\n    }, []);\n    const fetchCommentary = async ()=>{\n        try {\n            setIsAIWatching(true);\n            const canvas = document.createElement(\"canvas\");\n            const video = videoRef.current;\n            canvas.width = video.videoWidth;\n            canvas.height = video.videoHeight;\n            canvas.getContext(\"2d\").drawImage(video, 0, 0, canvas.width, canvas.height);\n            const imageData = canvas.toDataURL(\"image/jpeg\");\n            const response = await fetch(\"/api/commentary\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    imageData,\n                    width: canvas.width,\n                    height: canvas.height\n                })\n            });\n            const data = await response.json();\n            if (data.text) {\n                setCommentary((prev)=>[\n                        ...prev,\n                        {\n                            ...data,\n                            type: \"ai\"\n                        }\n                    ]);\n                playSpeechFromServer(data.text);\n            }\n            setIsAIWatching(false);\n        } catch (error) {\n            console.error(\"Error generating commentary:\", error);\n            setError(\"Error generating commentary. Please check the console for details.\");\n            setIsAIWatching(false);\n        }\n    };\n    const playSpeechFromServer = async (text)=>{\n        setIsSpeaking(true);\n        const video = videoRef.current;\n        video.muted = true;\n        try {\n            const response = await fetch(\"/api/text-to-speech\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    text\n                })\n            });\n            const audioContext = new (window.AudioContext || window.webkitAudioContext)();\n            const audioSource = audioContext.createBufferSource();\n            const arrayBuffer = await response.arrayBuffer();\n            audioContext.decodeAudioData(arrayBuffer, (decodedData)=>{\n                audioSource.buffer = decodedData;\n                audioSource.connect(audioContext.destination);\n                audioSource.start(0);\n            });\n            audioSource.onended = ()=>{\n                video.muted = false;\n                setIsSpeaking(false);\n            };\n        } catch (err) {\n            console.error(\"Error playing speech from server:\", err);\n            video.muted = false;\n            setIsSpeaking(false);\n        }\n    };\n    const handleUserMessage = (message)=>{\n        const userComment = {\n            timestamp: new Date().toISOString(),\n            text: message,\n            type: \"user\"\n        };\n        setCommentary((prevCommentary)=>[\n                ...prevCommentary,\n                userComment\n            ]);\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"main-container\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"video-container p-4\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"video\", {\n                        ref: videoRef,\n                        src: videoSrc,\n                        controls: true,\n                        crossOrigin: \"anonymous\",\n                        className: \"w-full h-auto max-h-full bg-black border border-gray-700\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                        lineNumber: 182,\n                        columnNumber: 9\n                    }, this),\n                    error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        className: \"text-red-500 mt-2\",\n                        children: error\n                    }, void 0, false, {\n                        fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                        lineNumber: 189,\n                        columnNumber: 19\n                    }, this),\n                    isAIWatching && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                        className: \"absolute top-4 right-4 bg-gray-500 bg-opacity-50 text-white px-2 py-1 rounded animate-pulse\",\n                        children: \"AI is watching\"\n                    }, void 0, false, {\n                        fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                        lineNumber: 191,\n                        columnNumber: 11\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                lineNumber: 181,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"sidebar-container p-4\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_CommentarySidebar__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                    commentary: commentary,\n                    showAIMessages: showAIMessages,\n                    onToggleAIMessages: ()=>setShowAIMessages(!showAIMessages),\n                    onGenerateCommentary: fetchCommentary,\n                    isAIWatching: isAIWatching,\n                    isSpeaking: isSpeaking,\n                    onSendMessage: handleUserMessage\n                }, void 0, false, {\n                    fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                    lineNumber: 197,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                lineNumber: 196,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/home/runner/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n        lineNumber: 180,\n        columnNumber: 5\n    }, this);\n}\n_s(VideoPlayer, \"OebeiEmHj8wS4Hu28NxNRulLSbg=\");\n_c = VideoPlayer;\nvar _c;\n$RefreshReg$(_c, \"VideoPlayer\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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VTtrQ0FBcUIvRTs7Ozs7O29CQUMzQ00sOEJBQ0MsOERBQUN3RTt3QkFBSUMsV0FBVTtrQ0FBOEY7Ozs7Ozs7Ozs7OzswQkFLakgsOERBQUNEO2dCQUFJQyxXQUFVOzBCQUNiLDRFQUFDbkYsMERBQWlCQTtvQkFDaEJNLFlBQVlBO29CQUNaRSxnQkFBZ0JBO29CQUNoQmlGLG9CQUFvQixJQUFNaEYsa0JBQWtCLENBQUNEO29CQUM3Q2tGLHNCQUFzQmxDO29CQUN0QjlDLGNBQWNBO29CQUNkRSxZQUFZQTtvQkFDWitFLGVBQWVmOzs7Ozs7Ozs7Ozs7Ozs7OztBQUt6QjtHQTdNd0IzRTtLQUFBQSIsInNvdXJjZXMiOlsid2VicGFjazovL19OX0UvLi9jb21wb25lbnRzL1ZpZGVvUGxheWVyLmpzP2Q3ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgQ29tbWVudGFyeVNpZGViYXIgZnJvbSBcIi4vQ29tbWVudGFyeVNpZGViYXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVmlkZW9QbGF5ZXIoeyB2aWRlb1NyYyB9KSB7XG4gIGNvbnN0IHZpZGVvUmVmID0gdXNlUmVmKG51bGwpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbY29tbWVudGFyeSwgc2V0Q29tbWVudGFyeV0gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtzaG93QUlNZXNzYWdlcywgc2V0U2hvd0FJTWVzc2FnZXNdID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtpc0FJV2F0Y2hpbmcsIHNldElzQUlXYXRjaGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1NwZWFraW5nLCBzZXRJc1NwZWFraW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcbiAgICBsZXQgcmFmSWQ7XG4gICAgbGV0IGxhc3RDYXB0dXJlVGltZSA9IDA7XG5cbiAgICBjb25zdCBjYXB0dXJlRnJhbWUgPSAodGltZSkgPT4ge1xuICAgICAgaWYgKHRpbWUgLSBsYXN0Q2FwdHVyZVRpbWUgPj0gMjAwMCkge1xuICAgICAgICBpZiAodmlkZW8ucmVhZHlTdGF0ZSA+PSB2aWRlby5IQVZFX0NVUlJFTlRfREFUQSkge1xuICAgICAgICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgY2FudmFzLndpZHRoID0gdmlkZW8udmlkZW9XaWR0aDtcbiAgICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICAgICAgY2FudmFzXG4gICAgICAgICAgICAuZ2V0Q29udGV4dChcIjJkXCIpXG4gICAgICAgICAgICAuZHJhd0ltYWdlKHZpZGVvLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgICAgY29uc29sZS5sb2coXCJDYXB0dXJpbmcgZnJhbWU6XCIsIGNhbnZhcy53aWR0aCwgXCJ4XCIsIGNhbnZhcy5oZWlnaHQpO1xuXG4gICAgICAgICAgY29uc3QgaW1hZ2VEYXRhID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIik7XG5cbiAgICAgICAgICBzZXRJc0FJV2F0Y2hpbmcodHJ1ZSk7XG4gICAgICAgICAgZmV0Y2goXCIvYXBpL2NvbW1lbnRhcnlcIiwge1xuICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGhlYWRlcnM6IHtcbiAgICAgICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICBpbWFnZURhdGEsXG4gICAgICAgICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgICAgICAgIGhlaWdodDogY2FudmFzLmhlaWdodCxcbiAgICAgICAgICAgIH0pLFxuICAgICAgICAgIH0pXG4gICAgICAgICAgICAudGhlbigocmVzcG9uc2UpID0+IHJlc3BvbnNlLmpzb24oKSlcbiAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQ29tbWVudGFyeSBnZW5lcmF0ZWQ6XCIsIGRhdGEpO1xuICAgICAgICAgICAgICBzZXRDb21tZW50YXJ5KChwcmV2Q29tbWVudGFyeSkgPT4gW1xuICAgICAgICAgICAgICAgIC4uLnByZXZDb21tZW50YXJ5LFxuICAgICAgICAgICAgICAgIHsgLi4uZGF0YSwgdHlwZTogXCJhaVwiIH0sXG4gICAgICAgICAgICAgIF0pO1xuICAgICAgICAgICAgICBzZXRJc0FJV2F0Y2hpbmcoZmFsc2UpO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyb3IpID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGdlbmVyYXRpbmcgY29tbWVudGFyeTpcIiwgZXJyb3IpO1xuICAgICAgICAgICAgICBzZXRFcnJvcihcbiAgICAgICAgICAgICAgICBcIkVycm9yIGdlbmVyYXRpbmcgY29tbWVudGFyeS4gUGxlYXNlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiLFxuICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgICBzZXRJc0FJV2F0Y2hpbmcoZmFsc2UpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsYXN0Q2FwdHVyZVRpbWUgPSB0aW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICByYWZJZCA9IHJlcXVlc3RBbmltYXRpb25GcmFtZShjYXB0dXJlRnJhbWUpO1xuICAgIH07XG5cbiAgICBjb25zdCBoYW5kbGVQbGF5ID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJWaWRlbyBwbGF5YmFjayBzdGFydGVkXCIpO1xuICAgICAgcmFmSWQgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FwdHVyZUZyYW1lKTtcbiAgICB9O1xuXG4gICAgY29uc3QgaGFuZGxlUGF1c2UgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIlZpZGVvIHBsYXliYWNrIHBhdXNlZFwiKTtcbiAgICAgIGNhbmNlbEFuaW1hdGlvbkZyYW1lKHJhZklkKTtcbiAgICAgIHNldElzQUlXYXRjaGluZyhmYWxzZSk7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGUpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJWaWRlbyBlcnJvcjpcIiwgZSk7XG4gICAgICBzZXRFcnJvcihcIkVycm9yIGxvYWRpbmcgdmlkZW8uIFBsZWFzZSBjaGVjayB0aGUgdmlkZW8gc291cmNlLlwiKTtcbiAgICB9O1xuXG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIiwgaGFuZGxlUGxheSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIGhhbmRsZVBhdXNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgaGFuZGxlRXJyb3IpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsIGhhbmRsZVBsYXkpO1xuICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIGhhbmRsZVBhdXNlKTtcbiAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBoYW5kbGVFcnJvcik7XG4gICAgICBjYW5jZWxBbmltYXRpb25GcmFtZShyYWZJZCk7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGZldGNoQ29tbWVudGFyeSA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgc2V0SXNBSVdhdGNoaW5nKHRydWUpO1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvLnZpZGVvV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICBjYW52YXNcbiAgICAgICAgLmdldENvbnRleHQoXCIyZFwiKVxuICAgICAgICAuZHJhd0ltYWdlKHZpZGVvLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgY29uc3QgaW1hZ2VEYXRhID0gY2FudmFzLnRvRGF0YVVSTChcImltYWdlL2pwZWdcIik7XG5cbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL2NvbW1lbnRhcnlcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICBpbWFnZURhdGEsXG4gICAgICAgICAgd2lkdGg6IGNhbnZhcy53aWR0aCxcbiAgICAgICAgICBoZWlnaHQ6IGNhbnZhcy5oZWlnaHQsXG4gICAgICAgIH0pLFxuICAgICAgfSk7XG5cbiAgICAgIGNvbnN0IGRhdGEgPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgICBpZiAoZGF0YS50ZXh0KSB7XG4gICAgICAgIHNldENvbW1lbnRhcnkoKHByZXYpID0+IFsuLi5wcmV2LCB7IC4uLmRhdGEsIHR5cGU6IFwiYWlcIiB9XSk7XG4gICAgICAgIHBsYXlTcGVlY2hGcm9tU2VydmVyKGRhdGEudGV4dCk7XG4gICAgICB9XG5cbiAgICAgIHNldElzQUlXYXRjaGluZyhmYWxzZSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBnZW5lcmF0aW5nIGNvbW1lbnRhcnk6XCIsIGVycm9yKTtcbiAgICAgIHNldEVycm9yKFxuICAgICAgICBcIkVycm9yIGdlbmVyYXRpbmcgY29tbWVudGFyeS4gUGxlYXNlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiLFxuICAgICAgKTtcbiAgICAgIHNldElzQUlXYXRjaGluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYXlTcGVlY2hGcm9tU2VydmVyID0gYXN5bmMgKHRleHQpID0+IHtcbiAgICBzZXRJc1NwZWFraW5nKHRydWUpO1xuICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcbiAgICB2aWRlby5tdXRlZCA9IHRydWU7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaChcIi9hcGkvdGV4dC10by1zcGVlY2hcIiwge1xuICAgICAgICBtZXRob2Q6IFwiUE9TVFwiLFxuICAgICAgICBoZWFkZXJzOiB7XG4gICAgICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIH0sXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHsgdGV4dCB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBhdWRpb0NvbnRleHQgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHxcbiAgICAgICAgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKTtcbiAgICAgIGNvbnN0IGF1ZGlvU291cmNlID0gYXVkaW9Db250ZXh0LmNyZWF0ZUJ1ZmZlclNvdXJjZSgpO1xuXG4gICAgICBjb25zdCBhcnJheUJ1ZmZlciA9IGF3YWl0IHJlc3BvbnNlLmFycmF5QnVmZmVyKCk7XG4gICAgICBhdWRpb0NvbnRleHQuZGVjb2RlQXVkaW9EYXRhKGFycmF5QnVmZmVyLCAoZGVjb2RlZERhdGEpID0+IHtcbiAgICAgICAgYXVkaW9Tb3VyY2UuYnVmZmVyID0gZGVjb2RlZERhdGE7XG4gICAgICAgIGF1ZGlvU291cmNlLmNvbm5lY3QoYXVkaW9Db250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgICAgICAgYXVkaW9Tb3VyY2Uuc3RhcnQoMCk7XG4gICAgICB9KTtcblxuICAgICAgYXVkaW9Tb3VyY2Uub25lbmRlZCA9ICgpID0+IHtcbiAgICAgICAgdmlkZW8ubXV0ZWQgPSBmYWxzZTtcbiAgICAgICAgc2V0SXNTcGVha2luZyhmYWxzZSk7XG4gICAgICB9O1xuICAgIH0gY2F0Y2ggKGVycikge1xuICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIHBsYXlpbmcgc3BlZWNoIGZyb20gc2VydmVyOlwiLCBlcnIpO1xuICAgICAgdmlkZW8ubXV0ZWQgPSBmYWxzZTtcbiAgICAgIHNldElzU3BlYWtpbmcoZmFsc2UpO1xuICAgIH1cbiAgfTtcblxuICBjb25zdCBoYW5kbGVVc2VyTWVzc2FnZSA9IChtZXNzYWdlKSA9PiB7XG4gICAgY29uc3QgdXNlckNvbW1lbnQgPSB7XG4gICAgICB0aW1lc3RhbXA6IG5ldyBEYXRlKCkudG9JU09TdHJpbmcoKSxcbiAgICAgIHRleHQ6IG1lc3NhZ2UsXG4gICAgICB0eXBlOiBcInVzZXJcIixcbiAgICB9O1xuICAgIHNldENvbW1lbnRhcnkoKHByZXZDb21tZW50YXJ5KSA9PiBbLi4ucHJldkNvbW1lbnRhcnksIHVzZXJDb21tZW50XSk7XG4gIH07XG5cbiAgcmV0dXJuIChcbiAgICA8ZGl2IGNsYXNzTmFtZT1cIm1haW4tY29udGFpbmVyXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInZpZGVvLWNvbnRhaW5lciBwLTRcIj5cbiAgICAgICAgPHZpZGVvXG4gICAgICAgICAgcmVmPXt2aWRlb1JlZn1cbiAgICAgICAgICBzcmM9e3ZpZGVvU3JjfVxuICAgICAgICAgIGNvbnRyb2xzXG4gICAgICAgICAgY3Jvc3NPcmlnaW49XCJhbm9ueW1vdXNcIlxuICAgICAgICAgIGNsYXNzTmFtZT1cInctZnVsbCBoLWF1dG8gbWF4LWgtZnVsbCBiZy1ibGFjayBib3JkZXIgYm9yZGVyLWdyYXktNzAwXCJcbiAgICAgICAgLz5cbiAgICAgICAge2Vycm9yICYmIDxwIGNsYXNzTmFtZT1cInRleHQtcmVkLTUwMCBtdC0yXCI+e2Vycm9yfTwvcD59XG4gICAgICAgIHtpc0FJV2F0Y2hpbmcgJiYgKFxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYWJzb2x1dGUgdG9wLTQgcmlnaHQtNCBiZy1ncmF5LTUwMCBiZy1vcGFjaXR5LTUwIHRleHQtd2hpdGUgcHgtMiBweS0xIHJvdW5kZWQgYW5pbWF0ZS1wdWxzZVwiPlxuICAgICAgICAgICAgQUkgaXMgd2F0Y2hpbmdcbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKX1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJzaWRlYmFyLWNvbnRhaW5lciBwLTRcIj5cbiAgICAgICAgPENvbW1lbnRhcnlTaWRlYmFyXG4gICAgICAgICAgY29tbWVudGFyeT17Y29tbWVudGFyeX1cbiAgICAgICAgICBzaG93QUlNZXNzYWdlcz17c2hvd0FJTWVzc2FnZXN9XG4gICAgICAgICAgb25Ub2dnbGVBSU1lc3NhZ2VzPXsoKSA9PiBzZXRTaG93QUlNZXNzYWdlcyghc2hvd0FJTWVzc2FnZXMpfVxuICAgICAgICAgIG9uR2VuZXJhdGVDb21tZW50YXJ5PXtmZXRjaENvbW1lbnRhcnl9XG4gICAgICAgICAgaXNBSVdhdGNoaW5nPXtpc0FJV2F0Y2hpbmd9XG4gICAgICAgICAgaXNTcGVha2luZz17aXNTcGVha2luZ31cbiAgICAgICAgICBvblNlbmRNZXNzYWdlPXtoYW5kbGVVc2VyTWVzc2FnZX1cbiAgICAgICAgLz5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICApO1xufVxuIl0sIm5hbWVzIjpbInVzZVJlZiIsInVzZUVmZmVjdCIsInVzZVN0YXRlIiwiQ29tbWVudGFyeVNpZGViYXIiLCJWaWRlb1BsYXllciIsInZpZGVvU3JjIiwidmlkZW9SZWYiLCJlcnJvciIsInNldEVycm9yIiwiY29tbWVudGFyeSIsInNldENvbW1lbnRhcnkiLCJzaG93QUlNZXNzYWdlcyIsInNldFNob3dBSU1lc3NhZ2VzIiwiaXNBSVdhdGNoaW5nIiwic2V0SXNBSVdhdGNoaW5nIiwiaXNTcGVha2luZyIsInNldElzU3BlYWtpbmciLCJ2aWRlbyIsImN1cnJlbnQiLCJyYWZJZCIsImxhc3RDYXB0dXJlVGltZSIsImNhcHR1cmVGcmFtZSIsInRpbWUiLCJyZWFkeVN0YXRlIiwiSEFWRV9DVVJSRU5UX0RBVEEiLCJjYW52YXMiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJ3aWR0aCIsInZpZGVvV2lkdGgiLCJoZWlnaHQiLCJ2aWRlb0hlaWdodCIsImdldENvbnRleHQiLCJkcmF3SW1hZ2UiLCJjb25zb2xlIiwibG9nIiwiaW1hZ2VEYXRhIiwidG9EYXRhVVJMIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJ0aGVuIiwicmVzcG9uc2UiLCJqc29uIiwiZGF0YSIsInByZXZDb21tZW50YXJ5IiwidHlwZSIsImNhdGNoIiwicmVxdWVzdEFuaW1hdGlvbkZyYW1lIiwiaGFuZGxlUGxheSIsImhhbmRsZVBhdXNlIiwiY2FuY2VsQW5pbWF0aW9uRnJhbWUiLCJoYW5kbGVFcnJvciIsImUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZldGNoQ29tbWVudGFyeSIsInRleHQiLCJwcmV2IiwicGxheVNwZWVjaEZyb21TZXJ2ZXIiLCJtdXRlZCIsImF1ZGlvQ29udGV4dCIsIndpbmRvdyIsIkF1ZGlvQ29udGV4dCIsIndlYmtpdEF1ZGlvQ29udGV4dCIsImF1ZGlvU291cmNlIiwiY3JlYXRlQnVmZmVyU291cmNlIiwiYXJyYXlCdWZmZXIiLCJkZWNvZGVBdWRpb0RhdGEiLCJkZWNvZGVkRGF0YSIsImJ1ZmZlciIsImNvbm5lY3QiLCJkZXN0aW5hdGlvbiIsInN0YXJ0Iiwib25lbmRlZCIsImVyciIsImhhbmRsZVVzZXJNZXNzYWdlIiwibWVzc2FnZSIsInVzZXJDb21tZW50IiwidGltZXN0YW1wIiwiRGF0ZSIsInRvSVNPU3RyaW5nIiwiZGl2IiwiY2xhc3NOYW1lIiwicmVmIiwic3JjIiwiY29udHJvbHMiLCJjcm9zc09yaWdpbiIsInAiLCJvblRvZ2dsZUFJTWVzc2FnZXMiLCJvbkdlbmVyYXRlQ29tbWVudGFyeSIsIm9uU2VuZE1lc3NhZ2UiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///./components/VideoPlayer.js\n"));

/***/ })

});