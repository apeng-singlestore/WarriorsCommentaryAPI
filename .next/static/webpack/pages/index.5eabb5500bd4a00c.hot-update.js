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

eval(__webpack_require__.ts("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": function() { return /* binding */ VideoPlayer; }\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"./node_modules/react/jsx-dev-runtime.js\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ \"./node_modules/react/index.js\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _CommentarySidebar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CommentarySidebar */ \"./components/CommentarySidebar.js\");\n\nvar _s = $RefreshSig$();\n\n\nfunction VideoPlayer(param) {\n    let { videoSrc } = param;\n    _s();\n    const videoRef = (0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null);\n    const [error, setError] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(null);\n    const [commentary, setCommentary] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)([]);\n    const [showAIMessages, setShowAIMessages] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(true);\n    const [isAIWatching, setIsAIWatching] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    const [isSpeaking, setIsSpeaking] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(false);\n    (0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)(()=>{\n        const video = videoRef.current;\n        const handlePlay = ()=>{\n            console.log(\"Video playback started\");\n        };\n        const handlePause = ()=>{\n            console.log(\"Video playback paused\");\n        };\n        const handleError = (e)=>{\n            console.error(\"Video error:\", e);\n            setError(\"Error loading video. Please check the video source.\");\n        };\n        video.addEventListener(\"play\", handlePlay);\n        video.addEventListener(\"pause\", handlePause);\n        video.addEventListener(\"error\", handleError);\n        return ()=>{\n            video.removeEventListener(\"play\", handlePlay);\n            video.removeEventListener(\"pause\", handlePause);\n            video.removeEventListener(\"error\", handleError);\n        };\n    }, []);\n    const fetchCommentary = async ()=>{\n        try {\n            setIsAIWatching(true);\n            const canvas = document.createElement(\"canvas\");\n            const video = videoRef.current;\n            canvas.width = video.videoWidth;\n            canvas.height = video.videoHeight;\n            canvas.getContext(\"2d\").drawImage(video, 0, 0, canvas.width, canvas.height);\n            const imageData = canvas.toDataURL(\"image/jpeg\");\n            const response = await fetch(\"/api/commentary\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    imageData,\n                    width: canvas.width,\n                    height: canvas.height\n                })\n            });\n            const data = await response.json();\n            if (data.text) {\n                setCommentary((prev)=>[\n                        ...prev,\n                        {\n                            ...data,\n                            type: \"ai\"\n                        }\n                    ]);\n                playSpeechFromServer(data.text);\n            }\n            setIsAIWatching(false);\n        } catch (error) {\n            console.error(\"Error generating commentary:\", error);\n            setError(\"Error generating commentary. Please check the console for details.\");\n            setIsAIWatching(false);\n        }\n    };\n    const playSpeechFromServer = async (text)=>{\n        setIsSpeaking(true);\n        const video = videoRef.current;\n        video.muted = true; // Mute the video during speech playback\n        try {\n            // Fetch the audio stream from our new API route\n            const response = await fetch(\"/api/text-to-speech\", {\n                method: \"POST\",\n                headers: {\n                    \"Content-Type\": \"application/json\"\n                },\n                body: JSON.stringify({\n                    text\n                })\n            });\n            const audioContext = new (window.AudioContext || window.webkitAudioContext)();\n            const audioSource = audioContext.createBufferSource();\n            const arrayBuffer = await response.arrayBuffer();\n            audioContext.decodeAudioData(arrayBuffer, (decodedData)=>{\n                audioSource.buffer = decodedData;\n                audioSource.connect(audioContext.destination);\n                audioSource.start(0);\n            });\n            audioSource.onended = ()=>{\n                video.muted = false; // Unmute the video after speech finishes\n                setIsSpeaking(false);\n            };\n        } catch (err) {\n            console.error(\"Error playing speech from server:\", err);\n            video.muted = false; // Ensure video is unmuted if speech fails\n            setIsSpeaking(false);\n        }\n    };\n    return /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n        className: \"flex h-screen\",\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"w-2/3 p-4 video-container card\",\n                children: [\n                    /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"video\", {\n                        ref: videoRef,\n                        src: videoSrc,\n                        controls: true,\n                        crossOrigin: \"anonymous\",\n                        className: \"w-full h-auto max-h-full rounded-lg\"\n                    }, void 0, false, {\n                        fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                        lineNumber: 114,\n                        columnNumber: 9\n                    }, this),\n                    error && /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"p\", {\n                        className: \"text-red-500 mt-2\",\n                        children: error\n                    }, void 0, false, {\n                        fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                        lineNumber: 121,\n                        columnNumber: 19\n                    }, this)\n                ]\n            }, void 0, true, {\n                fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                lineNumber: 113,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                className: \"w-1/3 p-4 sidebar-container card\",\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_CommentarySidebar__WEBPACK_IMPORTED_MODULE_2__[\"default\"], {\n                    commentary: commentary,\n                    showAIMessages: showAIMessages,\n                    onToggleAIMessages: ()=>setShowAIMessages(!showAIMessages),\n                    onGenerateCommentary: fetchCommentary,\n                    isAIWatching: isAIWatching,\n                    isSpeaking: isSpeaking\n                }, void 0, false, {\n                    fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                    lineNumber: 124,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n                lineNumber: 123,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true, {\n        fileName: \"/Users/rohitbhamidipati/Desktop/folders/demos/S2Now_video_demo/WarriorsCommentaryAPI/components/VideoPlayer.js\",\n        lineNumber: 112,\n        columnNumber: 5\n    }, this);\n}\n_s(VideoPlayer, \"OebeiEmHj8wS4Hu28NxNRulLSbg=\");\n_c = VideoPlayer;\nvar _c;\n$RefreshReg$(_c, \"VideoPlayer\");\n\n\n;\n    // Wrapped in an IIFE to avoid polluting the global scope\n    ;\n    (function () {\n        var _a, _b;\n        // Legacy CSS implementations will `eval` browser code in a Node.js context\n        // to extract CSS. For backwards compatibility, we need to check we're in a\n        // browser context before continuing.\n        if (typeof self !== 'undefined' &&\n            // AMP / No-JS mode does not inject these helpers:\n            '$RefreshHelpers$' in self) {\n            // @ts-ignore __webpack_module__ is global\n            var currentExports = module.exports;\n            // @ts-ignore __webpack_module__ is global\n            var prevSignature = (_b = (_a = module.hot.data) === null || _a === void 0 ? void 0 : _a.prevSignature) !== null && _b !== void 0 ? _b : null;\n            // This cannot happen in MainTemplate because the exports mismatch between\n            // templating and execution.\n            self.$RefreshHelpers$.registerExportsForReactRefresh(currentExports, module.id);\n            // A module can be accepted automatically based on its exports, e.g. when\n            // it is a Refresh Boundary.\n            if (self.$RefreshHelpers$.isReactRefreshBoundary(currentExports)) {\n                // Save the previous exports signature on update so we can compare the boundary\n                // signatures. We avoid saving exports themselves since it causes memory leaks (https://github.com/vercel/next.js/pull/53797)\n                module.hot.dispose(function (data) {\n                    data.prevSignature =\n                        self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports);\n                });\n                // Unconditionally accept an update to this module, we'll check if it's\n                // still a Refresh Boundary later.\n                // @ts-ignore importMeta is replaced in the loader\n                module.hot.accept();\n                // This field is set when the previous version of this module was a\n                // Refresh Boundary, letting us know we need to check for invalidation or\n                // enqueue an update.\n                if (prevSignature !== null) {\n                    // A boundary can become ineligible if its exports are incompatible\n                    // with the previous exports.\n                    //\n                    // For example, if you add/remove/change exports, we'll want to\n                    // re-execute the importing modules, and force those components to\n                    // re-render. Similarly, if you convert a class component to a\n                    // function, we want to invalidate the boundary.\n                    if (self.$RefreshHelpers$.shouldInvalidateReactRefreshBoundary(prevSignature, self.$RefreshHelpers$.getRefreshBoundarySignature(currentExports))) {\n                        module.hot.invalidate();\n                    }\n                    else {\n                        self.$RefreshHelpers$.scheduleUpdate();\n                    }\n                }\n            }\n            else {\n                // Since we just executed the code for the module, it's possible that the\n                // new exports made it ineligible for being a boundary.\n                // We only care about the case when we were _previously_ a boundary,\n                // because we already accepted this update (accidental side effect).\n                var isNoLongerABoundary = prevSignature !== null;\n                if (isNoLongerABoundary) {\n                    module.hot.invalidate();\n                }\n            }\n        }\n    })();\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,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b21wb25lbnRzL1ZpZGVvUGxheWVyLmpzP2Q3ZDYiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgdXNlUmVmLCB1c2VFZmZlY3QsIHVzZVN0YXRlIH0gZnJvbSBcInJlYWN0XCI7XG5pbXBvcnQgQ29tbWVudGFyeVNpZGViYXIgZnJvbSBcIi4vQ29tbWVudGFyeVNpZGViYXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gVmlkZW9QbGF5ZXIoeyB2aWRlb1NyYyB9KSB7XG4gIGNvbnN0IHZpZGVvUmVmID0gdXNlUmVmKG51bGwpO1xuICBjb25zdCBbZXJyb3IsIHNldEVycm9yXSA9IHVzZVN0YXRlKG51bGwpO1xuICBjb25zdCBbY29tbWVudGFyeSwgc2V0Q29tbWVudGFyeV0gPSB1c2VTdGF0ZShbXSk7XG4gIGNvbnN0IFtzaG93QUlNZXNzYWdlcywgc2V0U2hvd0FJTWVzc2FnZXNdID0gdXNlU3RhdGUodHJ1ZSk7XG4gIGNvbnN0IFtpc0FJV2F0Y2hpbmcsIHNldElzQUlXYXRjaGluZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtpc1NwZWFraW5nLCBzZXRJc1NwZWFraW5nXSA9IHVzZVN0YXRlKGZhbHNlKTtcblxuICB1c2VFZmZlY3QoKCkgPT4ge1xuICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcblxuICAgIGNvbnN0IGhhbmRsZVBsYXkgPSAoKSA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhcIlZpZGVvIHBsYXliYWNrIHN0YXJ0ZWRcIik7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZVBhdXNlID0gKCkgPT4ge1xuICAgICAgY29uc29sZS5sb2coXCJWaWRlbyBwbGF5YmFjayBwYXVzZWRcIik7XG4gICAgfTtcblxuICAgIGNvbnN0IGhhbmRsZUVycm9yID0gKGUpID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJWaWRlbyBlcnJvcjpcIiwgZSk7XG4gICAgICBzZXRFcnJvcihcIkVycm9yIGxvYWRpbmcgdmlkZW8uIFBsZWFzZSBjaGVjayB0aGUgdmlkZW8gc291cmNlLlwiKTtcbiAgICB9O1xuXG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBsYXlcIiwgaGFuZGxlUGxheSk7XG4gICAgdmlkZW8uYWRkRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIGhhbmRsZVBhdXNlKTtcbiAgICB2aWRlby5hZGRFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgaGFuZGxlRXJyb3IpO1xuXG4gICAgcmV0dXJuICgpID0+IHtcbiAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJwbGF5XCIsIGhhbmRsZVBsYXkpO1xuICAgICAgdmlkZW8ucmVtb3ZlRXZlbnRMaXN0ZW5lcihcInBhdXNlXCIsIGhhbmRsZVBhdXNlKTtcbiAgICAgIHZpZGVvLnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBoYW5kbGVFcnJvcik7XG4gICAgfTtcbiAgfSwgW10pO1xuXG4gIGNvbnN0IGZldGNoQ29tbWVudGFyeSA9IGFzeW5jICgpID0+IHtcbiAgICB0cnkge1xuICAgICAgc2V0SXNBSVdhdGNoaW5nKHRydWUpO1xuICAgICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcbiAgICAgIGNhbnZhcy53aWR0aCA9IHZpZGVvLnZpZGVvV2lkdGg7XG4gICAgICBjYW52YXMuaGVpZ2h0ID0gdmlkZW8udmlkZW9IZWlnaHQ7XG4gICAgICBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpLmRyYXdJbWFnZSh2aWRlbywgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcbiAgICAgIGNvbnN0IGltYWdlRGF0YSA9IGNhbnZhcy50b0RhdGFVUkwoXCJpbWFnZS9qcGVnXCIpO1xuXG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKFwiL2FwaS9jb21tZW50YXJ5XCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgaW1hZ2VEYXRhLFxuICAgICAgICAgIHdpZHRoOiBjYW52YXMud2lkdGgsXG4gICAgICAgICAgaGVpZ2h0OiBjYW52YXMuaGVpZ2h0LFxuICAgICAgICB9KSxcbiAgICAgIH0pO1xuXG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgaWYgKGRhdGEudGV4dCkge1xuICAgICAgICBzZXRDb21tZW50YXJ5KChwcmV2KSA9PiBbLi4ucHJldiwgeyAuLi5kYXRhLCB0eXBlOiBcImFpXCIgfV0pO1xuICAgICAgICBwbGF5U3BlZWNoRnJvbVNlcnZlcihkYXRhLnRleHQpO1xuICAgICAgfVxuXG4gICAgICBzZXRJc0FJV2F0Y2hpbmcoZmFsc2UpO1xuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgZ2VuZXJhdGluZyBjb21tZW50YXJ5OlwiLCBlcnJvcik7XG4gICAgICBzZXRFcnJvcihcIkVycm9yIGdlbmVyYXRpbmcgY29tbWVudGFyeS4gUGxlYXNlIGNoZWNrIHRoZSBjb25zb2xlIGZvciBkZXRhaWxzLlwiKTtcbiAgICAgIHNldElzQUlXYXRjaGluZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IHBsYXlTcGVlY2hGcm9tU2VydmVyID0gYXN5bmMgKHRleHQpID0+IHtcbiAgICBzZXRJc1NwZWFraW5nKHRydWUpO1xuICAgIGNvbnN0IHZpZGVvID0gdmlkZW9SZWYuY3VycmVudDtcbiAgICB2aWRlby5tdXRlZCA9IHRydWU7IC8vIE11dGUgdGhlIHZpZGVvIGR1cmluZyBzcGVlY2ggcGxheWJhY2tcblxuICAgIHRyeSB7XG4gICAgICAvLyBGZXRjaCB0aGUgYXVkaW8gc3RyZWFtIGZyb20gb3VyIG5ldyBBUEkgcm91dGVcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goXCIvYXBpL3RleHQtdG8tc3BlZWNoXCIsIHtcbiAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcbiAgICAgICAgaGVhZGVyczoge1xuICAgICAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICB9LFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IHRleHQgfSksXG4gICAgICB9KTtcblxuICAgICAgY29uc3QgYXVkaW9Db250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKCk7XG4gICAgICBjb25zdCBhdWRpb1NvdXJjZSA9IGF1ZGlvQ29udGV4dC5jcmVhdGVCdWZmZXJTb3VyY2UoKTtcblxuICAgICAgY29uc3QgYXJyYXlCdWZmZXIgPSBhd2FpdCByZXNwb25zZS5hcnJheUJ1ZmZlcigpO1xuICAgICAgYXVkaW9Db250ZXh0LmRlY29kZUF1ZGlvRGF0YShhcnJheUJ1ZmZlciwgKGRlY29kZWREYXRhKSA9PiB7XG4gICAgICAgIGF1ZGlvU291cmNlLmJ1ZmZlciA9IGRlY29kZWREYXRhO1xuICAgICAgICBhdWRpb1NvdXJjZS5jb25uZWN0KGF1ZGlvQ29udGV4dC5kZXN0aW5hdGlvbik7XG4gICAgICAgIGF1ZGlvU291cmNlLnN0YXJ0KDApO1xuICAgICAgfSk7XG5cbiAgICAgIGF1ZGlvU291cmNlLm9uZW5kZWQgPSAoKSA9PiB7XG4gICAgICAgIHZpZGVvLm11dGVkID0gZmFsc2U7IC8vIFVubXV0ZSB0aGUgdmlkZW8gYWZ0ZXIgc3BlZWNoIGZpbmlzaGVzXG4gICAgICAgIHNldElzU3BlYWtpbmcoZmFsc2UpO1xuICAgICAgfTtcbiAgICB9IGNhdGNoIChlcnIpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBwbGF5aW5nIHNwZWVjaCBmcm9tIHNlcnZlcjpcIiwgZXJyKTtcbiAgICAgIHZpZGVvLm11dGVkID0gZmFsc2U7IC8vIEVuc3VyZSB2aWRlbyBpcyB1bm11dGVkIGlmIHNwZWVjaCBmYWlsc1xuICAgICAgc2V0SXNTcGVha2luZyhmYWxzZSk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiAoXG4gICAgPGRpdiBjbGFzc05hbWU9XCJmbGV4IGgtc2NyZWVuXCI+XG4gICAgICA8ZGl2IGNsYXNzTmFtZT1cInctMi8zIHAtNCB2aWRlby1jb250YWluZXIgY2FyZFwiPlxuICAgICAgICA8dmlkZW9cbiAgICAgICAgICByZWY9e3ZpZGVvUmVmfVxuICAgICAgICAgIHNyYz17dmlkZW9TcmN9XG4gICAgICAgICAgY29udHJvbHNcbiAgICAgICAgICBjcm9zc09yaWdpbj1cImFub255bW91c1wiXG4gICAgICAgICAgY2xhc3NOYW1lPVwidy1mdWxsIGgtYXV0byBtYXgtaC1mdWxsIHJvdW5kZWQtbGdcIlxuICAgICAgICAvPlxuICAgICAgICB7ZXJyb3IgJiYgPHAgY2xhc3NOYW1lPVwidGV4dC1yZWQtNTAwIG10LTJcIj57ZXJyb3J9PC9wPn1cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiBjbGFzc05hbWU9XCJ3LTEvMyBwLTQgc2lkZWJhci1jb250YWluZXIgY2FyZFwiPlxuICAgICAgICA8Q29tbWVudGFyeVNpZGViYXJcbiAgICAgICAgICBjb21tZW50YXJ5PXtjb21tZW50YXJ5fVxuICAgICAgICAgIHNob3dBSU1lc3NhZ2VzPXtzaG93QUlNZXNzYWdlc31cbiAgICAgICAgICBvblRvZ2dsZUFJTWVzc2FnZXM9eygpID0+IHNldFNob3dBSU1lc3NhZ2VzKCFzaG93QUlNZXNzYWdlcyl9XG4gICAgICAgICAgb25HZW5lcmF0ZUNvbW1lbnRhcnk9e2ZldGNoQ29tbWVudGFyeX0gLy8gTW92ZWQgdGhlIGJ1dHRvbiBpbnNpZGUgdGhlIHNpZGViYXJcbiAgICAgICAgICBpc0FJV2F0Y2hpbmc9e2lzQUlXYXRjaGluZ31cbiAgICAgICAgICBpc1NwZWFraW5nPXtpc1NwZWFraW5nfVxuICAgICAgICAvPlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gICk7XG59XG4iXSwibmFtZXMiOlsidXNlUmVmIiwidXNlRWZmZWN0IiwidXNlU3RhdGUiLCJDb21tZW50YXJ5U2lkZWJhciIsIlZpZGVvUGxheWVyIiwidmlkZW9TcmMiLCJ2aWRlb1JlZiIsImVycm9yIiwic2V0RXJyb3IiLCJjb21tZW50YXJ5Iiwic2V0Q29tbWVudGFyeSIsInNob3dBSU1lc3NhZ2VzIiwic2V0U2hvd0FJTWVzc2FnZXMiLCJpc0FJV2F0Y2hpbmciLCJzZXRJc0FJV2F0Y2hpbmciLCJpc1NwZWFraW5nIiwic2V0SXNTcGVha2luZyIsInZpZGVvIiwiY3VycmVudCIsImhhbmRsZVBsYXkiLCJjb25zb2xlIiwibG9nIiwiaGFuZGxlUGF1c2UiLCJoYW5kbGVFcnJvciIsImUiLCJhZGRFdmVudExpc3RlbmVyIiwicmVtb3ZlRXZlbnRMaXN0ZW5lciIsImZldGNoQ29tbWVudGFyeSIsImNhbnZhcyIsImRvY3VtZW50IiwiY3JlYXRlRWxlbWVudCIsIndpZHRoIiwidmlkZW9XaWR0aCIsImhlaWdodCIsInZpZGVvSGVpZ2h0IiwiZ2V0Q29udGV4dCIsImRyYXdJbWFnZSIsImltYWdlRGF0YSIsInRvRGF0YVVSTCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJoZWFkZXJzIiwiYm9keSIsIkpTT04iLCJzdHJpbmdpZnkiLCJkYXRhIiwianNvbiIsInRleHQiLCJwcmV2IiwidHlwZSIsInBsYXlTcGVlY2hGcm9tU2VydmVyIiwibXV0ZWQiLCJhdWRpb0NvbnRleHQiLCJ3aW5kb3ciLCJBdWRpb0NvbnRleHQiLCJ3ZWJraXRBdWRpb0NvbnRleHQiLCJhdWRpb1NvdXJjZSIsImNyZWF0ZUJ1ZmZlclNvdXJjZSIsImFycmF5QnVmZmVyIiwiZGVjb2RlQXVkaW9EYXRhIiwiZGVjb2RlZERhdGEiLCJidWZmZXIiLCJjb25uZWN0IiwiZGVzdGluYXRpb24iLCJzdGFydCIsIm9uZW5kZWQiLCJlcnIiLCJkaXYiLCJjbGFzc05hbWUiLCJyZWYiLCJzcmMiLCJjb250cm9scyIsImNyb3NzT3JpZ2luIiwicCIsIm9uVG9nZ2xlQUlNZXNzYWdlcyIsIm9uR2VuZXJhdGVDb21tZW50YXJ5Il0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./components/VideoPlayer.js\n"));

/***/ })

});