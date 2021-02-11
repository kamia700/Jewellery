
/* eslint-disable */
/*stylelint-disable*/
'use strict';

(function () {
  // svgforeverybody;

  !function(root, factory) {
    "function" == typeof define && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
    define([], function() {
        return root.svg4everybody = factory();
    }) : "object" == typeof module && module.exports ? // Node. Does not work with strict CommonJS, but

    module.exports = factory() : root.svg4everybody = factory();
  }(this, function() {
    function embed(parent, svg, target, use) {
        if (target) {
            var fragment = document.createDocumentFragment(), viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
            viewBox && svg.setAttribute("viewBox", viewBox);
            for (// clone the target
            var clone = document.importNode ? document.importNode(target, !0) : target.cloneNode(!0), g = document.createElementNS(svg.namespaceURI || "http://www.w3.org/2000/svg", "g"); clone.childNodes.length; ) {
                g.appendChild(clone.firstChild);
            }
            if (use) {
                for (var i = 0; use.attributes.length > i; i++) {
                    var attr = use.attributes[i];
                    "xlink:href" !== attr.name && "href" !== attr.name && g.setAttribute(attr.name, attr.value);
                }
            }
            fragment.appendChild(g), // append the fragment into the svg
            parent.appendChild(fragment);
        }
    }
    function loadreadystatechange(xhr, use) {
        xhr.onreadystatechange = function() {
            if (4 === xhr.readyState) {
                var cachedDocument = xhr._cachedDocument;
                cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
                cachedDocument.body.innerHTML = xhr.responseText, // ensure domains are the same, otherwise we'll have issues appending the
                cachedDocument.domain !== document.domain && (cachedDocument.domain = document.domain),
                xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
                xhr._embeds.splice(0).map(function(item) {
                    var target = xhr._cachedTarget[item.id];
                    target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
                    embed(item.parent, item.svg, target, use);
                });
            }
        }, // test the ready state change immediately
        xhr.onreadystatechange();
    }
    function svg4everybody(rawopts) {
        function oninterval() {
            if (numberOfSvgUseElementsToBypass && uses.length - numberOfSvgUseElementsToBypass <= 0) {
                return void requestAnimationFrame(oninterval, 67);
            }
            numberOfSvgUseElementsToBypass = 0;
            for (// get the cached <use> index
            var index = 0; index < uses.length; ) {
                // get the current <use>
                var use = uses[index], parent = use.parentNode, svg = getSVGAncestor(parent), src = use.getAttribute("xlink:href") || use.getAttribute("href");
                if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
                svg && src) {
                    if (polyfill) {
                        if (!opts.validate || opts.validate(src, svg, use)) {
                            parent.removeChild(use);
                            var srcSplit = src.split("#"), url = srcSplit.shift(), id = srcSplit.join("#");
                            if (url.length) {
                                var xhr = requests[url];
                                xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
                                xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
                                xhr._embeds.push({
                                    parent: parent,
                                    svg: svg,
                                    id: id
                                }), // prepare the xhr ready state change event
                                loadreadystatechange(xhr, use);
                            } else {
                                embed(parent, svg, document.getElementById(id), use);
                            }
                        } else {
                            ++index, ++numberOfSvgUseElementsToBypass;
                        }
                    }
                } else {
                    ++index;
                }
            }
            requestAnimationFrame(oninterval, 67);
        }
        var polyfill, opts = Object(rawopts), newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/, webkitUA = /\bAppleWebKit\/(\d+)\b/, olderEdgeUA = /\bEdge\/12\.(\d+)\b/, edgeUA = /\bEdge\/.(\d+)\b/, inIframe = window.top !== window.self;
        polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
        var requests = {}, requestAnimationFrame = window.requestAnimationFrame || setTimeout, uses = document.getElementsByTagName("use"), numberOfSvgUseElementsToBypass = 0;
        polyfill && oninterval();
    }
    function getSVGAncestor(node) {
        for (var svg = node; "svg" !== svg.nodeName.toLowerCase() && (svg = svg.parentNode); ) {}
        return svg;
    }
    return svg4everybody;
  });
});

(function () {
  // ! picturefill - v3.0.2 - 2016-02-12

  (function (window) {
    /*jshint eqnull:true */
    var ua = navigator.userAgent;

    if (window.HTMLPictureElement && ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 < 45)) {
      addEventListener("resize", (function () {
        var timer;

        var dummySrc = document.createElement("source");

        var fixRespimg = function (img) {
          var source, sizes;
          var picture = img.parentNode;

          if (picture.nodeName.toUpperCase() === "PICTURE") {
            source = dummySrc.cloneNode();

            picture.insertBefore(source, picture.firstElementChild);
            setTimeout(function () {
              picture.removeChild(source);
            });
          } else if (!img._pfLastSize || img.offsetWidth > img._pfLastSize) {
            img._pfLastSize = img.offsetWidth;
            sizes = img.sizes;
            img.sizes += ",100vw";
            setTimeout(function () {
              img.sizes = sizes;
            });
          }
        };

        var findPictureImgs = function () {
          var i;
          var imgs = document.querySelectorAll("picture > img, img[srcset][sizes]");
          for (i = 0; i < imgs.length; i++) {
            fixRespimg(imgs[i]);
          }
        };
        var onResize = function () {
          clearTimeout(timer);
          timer = setTimeout(findPictureImgs, 99);
        };
        var mq = window.matchMedia && matchMedia("(orientation: landscape)");
        var init = function () {
          onResize();

          if (mq && mq.addListener) {
            mq.addListener(onResize);
          }
        };

        dummySrc.srcset = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";

        if (/^[c|i]|d$/.test(document.readyState || "")) {
          init();
        } else {
          document.addEventListener("DOMContentLoaded", init);
        }

        return onResize;
      })());
    }
  })(window);

  (function (window, document, undefined) {
    // Enable strict mode
    "use strict";

    document.createElement("picture");
    var warn, eminpx, alwaysCheckWDescriptor, evalId;
    var pf = {};
    var isSupportTestReady = false;
    var noop = function () { };
    var image = document.createElement("img");
    var getImgAttr = image.getAttribute;
    var setImgAttr = image.setAttribute;
    var removeImgAttr = image.removeAttribute;
    var docElem = document.documentElement;
    var types = {};
    var cfg = {
      algorithm: ""
    };
    var srcAttr = "data-pfsrc";
    var srcsetAttr = srcAttr + "set";
    var ua = navigator.userAgent;
    var supportAbort = (/rident/).test(ua) || ((/ecko/).test(ua) && ua.match(/rv\:(\d+)/) && RegExp.$1 > 35);
    var curSrcProp = "currentSrc";
    var regWDesc = /\s+\+?\d+(e\d+)?w/;
    var regSize = /(\([^)]+\))?\s*(.+)/;
    var setOptions = window.picturefillCFG;
    var baseStyle = "position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)";
    var fsCss = "font-size:100%!important;";
    var isVwDirty = true;
    var cssCache = {};
    var sizeLengthCache = {};
    var DPR = window.devicePixelRatio;
    var units = {
      px: 1,
      "in": 96
    };
    var anchor = document.createElement("a");
  /*** alreadyRun flag used for setOptions. is it true setOptions will reevaluate
     * @type {boolean}
     */
    var alreadyRun = false;
    var regexLeadingSpaces = /^[ \t\n\r\u000c]+/,
      regexLeadingCommasOrSpaces = /^[, \t\n\r\u000c]+/,
      regexLeadingNotSpaces = /^[^ \t\n\r\u000c]+/,
      regexTrailingCommas = /[,]+$/,
      regexNonNegativeInteger = /^\d+$/,
      regexFloatingPoint = /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/;

    var on = function (obj, evt, fn, capture) {
      if (obj.addEventListener) {
        obj.addEventListener(evt, fn, capture || false);
      } else if (obj.attachEvent) {
        obj.attachEvent("on" + evt, fn);
      }
    };

    var memoize = function (fn) {
      var cache = {};
      return function (input) {
        if (!(input in cache)) {
          cache[input] = fn(input);
        }
        return cache[input];
      };
    };

    function isSpace(c) {
      return (c === "\u0020" || // space
        c === "\u0009" || // horizontal tab
        c === "\u000A" || // new line
        c === "\u000C" || // form feed
        c === "\u000D");  // carriage return
    }

  /**
     * gets a mediaquery and returns a boolean or gets a css length and returns a number
     * @param css mediaqueries or css length
     * @returns {boolean|number}
     *
     * based on: https://gist.github.com/jonathantneal/db4f77009b155f083738
     */
    var evalCSS = (function () {

      var regLength = /^([\d\.]+)(em|vw|px)$/;
      var replace = function () {
        var args = arguments, index = 0, string = args[0];
        while (++index in args) {
          string = string.replace(args[index], args[++index]);
        }
        return string;
      };

      var buildStr = memoize(function (css) {

        return "return " + replace((css || "").toLowerCase(),
          // interpret `and`
          /\band\b/g, "&&",

          // interpret `,`
          /,/g, "||",

          // interpret `min-` as >=
          /min-([a-z-\s]+):/g, "e.$1>=",

          // interpret `max-` as <=
          /max-([a-z-\s]+):/g, "e.$1<=",

          //calc value
          /calc([^)]+)/g, "($1)",

          // interpret css values
          /(\d+[\.]*[\d]*)([a-z]+)/g, "($1 * e.$2)",
          //make eval less evil
          /^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/ig, ""
        ) + ";";
      });

      return function (css, length) {
        var parsedLength;
        if (!(css in cssCache)) {
          cssCache[css] = false;
          if (length && (parsedLength = css.match(regLength))) {
            cssCache[css] = parsedLength[1] * units[parsedLength[2]];
          } else {
            /*jshint evil:true */
            try {
              cssCache[css] = new Function("e", buildStr(css))(units);
            } catch (e) { }
            /*jshint evil:false */
          }
        }
        return cssCache[css];
      };
    })();

    var setResolution = function (candidate, sizesattr) {
      if (candidate.w) { // h = means height: || descriptor.type === 'h' do not handle yet...
        candidate.cWidth = pf.calcListLength(sizesattr || "100vw");
        candidate.res = candidate.w / candidate.cWidth;
      } else {
        candidate.res = candidate.d;
      }
      return candidate;
    };

  /**
     *
     * @param opt
     */
    var picturefill = function (opt) {

      if (!isSupportTestReady) { return; }

      var elements, i, plen;

      var options = opt || {};

      if (options.elements && options.elements.nodeType === 1) {
        if (options.elements.nodeName.toUpperCase() === "IMG") {
          options.elements = [options.elements];
        } else {
          options.context = options.elements;
          options.elements = null;
        }
      }

      elements = options.elements || pf.qsa((options.context || document), (options.reevaluate || options.reselect) ? pf.sel : pf.selShort);

      if ((plen = elements.length)) {

        pf.setupRun(options);
        alreadyRun = true;

        // Loop through all elements
        for (i = 0; i < plen; i++) {
          pf.fillImg(elements[i], options);
        }

        pf.teardownRun(options);
      }
    };

  /**
     * outputs a warning for the developer
     * @param {message}
     * @type {Function}
     */
    warn = (window.console && console.warn) ?
      function (message) {
        console.warn(message);
      } :
      noop
      ;

    if (!(curSrcProp in image)) {
      curSrcProp = "src";
    }

    types["image/jpeg"] = true;
    types["image/gif"] = true;
    types["image/png"] = true;

    function detectTypeSupport(type, typeUri) {
      var image = new window.Image();
      image.onerror = function () {
        types[type] = false;
        picturefill();
      };
      image.onload = function () {
        types[type] = image.width === 1;
        picturefill();
      };
      image.src = typeUri;
      return "pending";
    }

    types["image/svg+xml"] = document.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image", "1.1");

    function updateMetrics() {

      isVwDirty = false;
      DPR = window.devicePixelRatio;
      cssCache = {};
      sizeLengthCache = {};

      pf.DPR = DPR || 1;

      units.width = Math.max(window.innerWidth || 0, docElem.clientWidth);
      units.height = Math.max(window.innerHeight || 0, docElem.clientHeight);

      units.vw = units.width / 100;
      units.vh = units.height / 100;

      evalId = [units.height, units.width, DPR].join("-");

      units.em = pf.getEmValue();
      units.rem = units.em;
    }

    function chooseLowRes(lowerValue, higherValue, dprValue, isCached) {
      var bonusFactor, tooMuch, bonus, meanDensity;

      if (cfg.algorithm === "saveData") {
        if (lowerValue > 2.7) {
          meanDensity = dprValue + 1;
        } else {
          tooMuch = higherValue - dprValue;
          bonusFactor = Math.pow(lowerValue - 0.6, 1.5);

          bonus = tooMuch * bonusFactor;

          if (isCached) {
            bonus += 0.1 * bonusFactor;
          }

          meanDensity = lowerValue + bonus;
        }
      } else {
        meanDensity = (dprValue > 1) ?
          Math.sqrt(lowerValue * higherValue) :
          lowerValue;
      }

      return meanDensity > dprValue;
    }

    function applyBestCandidate(img) {
      var srcSetCandidates;
      var matchingSet = pf.getSet(img);
      var evaluated = false;
      if (matchingSet !== "pending") {
        evaluated = evalId;
        if (matchingSet) {
          srcSetCandidates = pf.setRes(matchingSet);
          pf.applySetCandidate(srcSetCandidates, img);
        }
      }
      img[pf.ns].evaled = evaluated;
    }

    function ascendingSort(a, b) {
      return a.res - b.res;
    }

    function setSrcToCur(img, src, set) {
      var candidate;
      if (!set && src) {
        set = img[pf.ns].sets;
        set = set && set[set.length - 1];
      }

      candidate = getCandidateForSrc(src, set);

      if (candidate) {
        src = pf.makeUrl(src);
        img[pf.ns].curSrc = src;
        img[pf.ns].curCan = candidate;

        if (!candidate.res) {
          setResolution(candidate, candidate.set.sizes);
        }
      }
      return candidate;
    }

    function getCandidateForSrc(src, set) {
      var i, candidate, candidates;
      if (src && set) {
        candidates = pf.parseSet(set);
        src = pf.makeUrl(src);
        for (i = 0; i < candidates.length; i++) {
          if (src === pf.makeUrl(candidates[i].url)) {
            candidate = candidates[i];
            break;
          }
        }
      }
      return candidate;
    }

    function getAllSourceElements(picture, candidates) {
      var i, len, source, srcset;
      var sources = picture.getElementsByTagName("source");
      for (i = 0, len = sources.length; i < len; i++) {
        source = sources[i];
        source[pf.ns] = true;
        srcset = source.getAttribute("srcset");
        if (srcset) {
          candidates.push({
            srcset: srcset,
            media: source.getAttribute("media"),
            type: source.getAttribute("type"),
            sizes: source.getAttribute("sizes")
          });
        }
      }
    }

  /**
     * Srcset Parser
     * By Alex Bell |  MIT License
     *
     * @returns Array [{url: _, d: _, w: _, h:_, set:_(????)}, ...]
     *
     * Based super duper closely on the reference algorithm at:
     * https://html.spec.whatwg.org/multipage/embedded-content.html#parse-a-srcset-attribute
     */
    function parseSrcset(input, set) {
      function collectCharacters(regEx) {
        var chars,
          match = regEx.exec(input.substring(pos));
        if (match) {
          chars = match[0];
          pos += chars.length;
          return chars;
        }
      }

      var inputLength = input.length,
        url,
        descriptors,
        currentDescriptor,
        state,
        c,
        pos = 0,
        candidates = [];

  /**
      * Adds descriptor properties to a candidate, pushes to the candidates array
      * @return undefined
      */
      function parseDescriptors() {
        var pError = false,
          w, d, h, i,
          candidate = {},
          desc, lastChar, value, intVal, floatVal;
        for (i = 0; i < descriptors.length; i++) {
          desc = descriptors[i];

          lastChar = desc[desc.length - 1];
          value = desc.substring(0, desc.length - 1);
          intVal = parseInt(value, 10);
          floatVal = parseFloat(value);
          if (regexNonNegativeInteger.test(value) && (lastChar === "w")) {
            if (w || d) { pError = true; }
            if (intVal === 0) { pError = true; } else { w = intVal; }
          } else if (regexFloatingPoint.test(value) && (lastChar === "x")) {
            if (w || d || h) { pError = true; }
            if (floatVal < 0) { pError = true; } else { d = floatVal; }
          } else if (regexNonNegativeInteger.test(value) && (lastChar === "h")) {
            if (h || d) { pError = true; }
            if (intVal === 0) { pError = true; } else { h = intVal; }
          } else { pError = true; }
        } // (close step 13 for loop)
        if (!pError) {
          candidate.url = url;

          if (w) { candidate.w = w; }
          if (d) { candidate.d = d; }
          if (h) { candidate.h = h; }
          if (!h && !d && !w) { candidate.d = 1; }
          if (candidate.d === 1) { set.has1x = true; }
          candidate.set = set;

          candidates.push(candidate);
        }
      } // (close parseDescriptors fn)

      function tokenize() {
        collectCharacters(regexLeadingSpaces);
        currentDescriptor = "";
        state = "in descriptor";
        while (true) {
          c = input.charAt(pos);
          if (state === "in descriptor") {
            if (isSpace(c)) {
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
                currentDescriptor = "";
                state = "after descriptor";
              }
            } else if (c === ",") {
              pos += 1;
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
              }
              parseDescriptors();
              return;
            } else if (c === "\u0028") {
              currentDescriptor = currentDescriptor + c;
              state = "in parens";
            } else if (c === "") {
              if (currentDescriptor) {
                descriptors.push(currentDescriptor);
              }
              parseDescriptors();
              return;

            } else {
              currentDescriptor = currentDescriptor + c;
            }
          } else if (state === "in parens") {
            if (c === ")") {
              currentDescriptor = currentDescriptor + c;
              state = "in descriptor";
            } else if (c === "") {
              descriptors.push(currentDescriptor);
              parseDescriptors();
              return;
            } else {
              currentDescriptor = currentDescriptor + c;
            }
          } else if (state === "after descriptor") {
            if (isSpace(c)) {
            } else if (c === "") {
              parseDescriptors();
              return;
            } else {
              state = "in descriptor";
              pos -= 1;

            }
          }
          pos += 1;
        } // (close while true loop)
      }
      while (true) {
        collectCharacters(regexLeadingCommasOrSpaces);

        if (pos >= inputLength) {
          return candidates; // (we're done, this is the sole return path)
        }
        url = collectCharacters(regexLeadingNotSpaces);
        descriptors = [];
        if (url.slice(-1) === ",") {
          url = url.replace(regexTrailingCommas, "");
          parseDescriptors();
        } else {
          tokenize();
        } // (close else of step 8)

      } // (Close of big while loop.)
    }

    function parseSizes(strValue) {
      var regexCssLengthWithUnits = /^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i;
      var regexCssCalc = /^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;
      var i;
      var unparsedSizesList;
      var unparsedSizesListLength;
      var unparsedSize;
      var lastComponentValue;
      var size;
      function parseComponentValues(str) {
        var chrctr;
        var component = "";
        var componentArray = [];
        var listArray = [];
        var parenDepth = 0;
        var pos = 0;
        var inComment = false;

        function pushComponent() {
          if (component) {
            componentArray.push(component);
            component = "";
          }
        }

        function pushComponentArray() {
          if (componentArray[0]) {
            listArray.push(componentArray);
            componentArray = [];
          }
        }

        while (true) {
          chrctr = str.charAt(pos);

          if (chrctr === "") { // ( End of string reached.)
            pushComponent();
            pushComponentArray();
            return listArray;
          } else if (inComment) {
            if ((chrctr === "*") && (str[pos + 1] === "/")) { // (At end of a comment.)
              inComment = false;
              pos += 2;
              pushComponent();
              continue;
            } else {
              pos += 1; // (Skip all characters inside comments.)
              continue;
            }
          } else if (isSpace(chrctr)) {
            if ((str.charAt(pos - 1) && isSpace(str.charAt(pos - 1))) || !component) {
              pos += 1;
              continue;
            } else if (parenDepth === 0) {
              pushComponent();
              pos += 1;
              continue;
            } else {
              chrctr = " ";
            }
          } else if (chrctr === "(") {
            parenDepth += 1;
          } else if (chrctr === ")") {
            parenDepth -= 1;
          } else if (chrctr === ",") {
            pushComponent();
            pushComponentArray();
            pos += 1;
            continue;
          } else if ((chrctr === "/") && (str.charAt(pos + 1) === "*")) {
            inComment = true;
            pos += 2;
            continue;
          }

          component = component + chrctr;
          pos += 1;
        }
      }

      function isValidNonNegativeSourceSizeValue(s) {
        if (regexCssLengthWithUnits.test(s) && (parseFloat(s) >= 0)) { return true; }
        if (regexCssCalc.test(s)) { return true; }
        if ((s === "0") || (s === "-0") || (s === "+0")) { return true; }
        return false;
      }

      unparsedSizesList = parseComponentValues(strValue);
      unparsedSizesListLength = unparsedSizesList.length;
      for (i = 0; i < unparsedSizesListLength; i++) {
        unparsedSize = unparsedSizesList[i];
        lastComponentValue = unparsedSize[unparsedSize.length - 1];

        if (isValidNonNegativeSourceSizeValue(lastComponentValue)) {
          size = lastComponentValue;
          unparsedSize.pop();
        } else {
          continue;
        }
        if (unparsedSize.length === 0) {
          return size;
        }
        unparsedSize = unparsedSize.join(" ");
        if (!(pf.matchesMedia(unparsedSize))) {
          continue;
        }
        return size;
      }
      return "100vw";
    }
    pf.ns = ("pf" + new Date().getTime()).substr(0, 9);
    pf.supSrcset = "srcset" in image;
    pf.supSizes = "sizes" in image;
    pf.supPicture = !!window.HTMLPictureElement;
    if (pf.supSrcset && pf.supPicture && !pf.supSizes) {
      (function (image2) {
        image.srcset = "data:,a";
        image2.src = "data:,a";
        pf.supSrcset = image.complete === image2.complete;
        pf.supPicture = pf.supSrcset && pf.supPicture;
      })(document.createElement("img"));
    }
    if (pf.supSrcset && !pf.supSizes) {

      (function () {
        var width2 = "data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw==";
        var width1 = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
        var img = document.createElement("img");
        var test = function () {
          var width = img.width;

          if (width === 2) {
            pf.supSizes = true;
          }

          alwaysCheckWDescriptor = pf.supSrcset && !pf.supSizes;

          isSupportTestReady = true;
          setTimeout(picturefill);
        };

        img.onload = test;
        img.onerror = test;
        img.setAttribute("sizes", "9px");

        img.srcset = width1 + " 1w," + width2 + " 9w";
        img.src = width1;
      })();

    } else {
      isSupportTestReady = true;
    }
    pf.selShort = "picture>img,img[srcset]";
    pf.sel = pf.selShort;
    pf.cfg = cfg;
    pf.DPR = (DPR || 1);
    pf.u = units;
    pf.types = types;
    pf.setSize = noop;

  /**
     * Gets a string and returns the absolute URL
     * @param src
     * @returns {String} absolute URL
     */

    pf.makeUrl = memoize(function (src) {
      anchor.href = src;
      return anchor.href;
    });

  /**
     * Gets a DOM element or document and a selctor and returns the found matches
     * Can be extended with jQuery/Sizzle for IE7 support
     * @param context
     * @param sel
     * @returns {NodeList|Array}
     */
    pf.qsa = function (context, sel) {
      return ("querySelector" in context) ? context.querySelectorAll(sel) : [];
    };

  /**
     * Shortcut method for matchMedia ( for easy overriding in tests )
     * wether native or pf.mMQ is used will be decided lazy on first call
     * @returns {boolean}
     */
    pf.matchesMedia = function () {
      if (window.matchMedia && (matchMedia("(min-width: 0.1em)") || {}).matches) {
        pf.matchesMedia = function (media) {
          return !media || (matchMedia(media).matches);
        };
      } else {
        pf.matchesMedia = pf.mMQ;
      }

      return pf.matchesMedia.apply(this, arguments);
    };

  /**
     * A simplified matchMedia implementation for IE8 and IE9
     * handles only min-width/max-width with px or em values
     * @param media
     * @returns {boolean}
     */
    pf.mMQ = function (media) {
      return media ? evalCSS(media) : true;
    };

  /**
     * Returns the calculated length in css pixel from the given sourceSizeValue
     * http://dev.w3.org/csswg/css-values-3/#length-value
     * intended Spec mismatches:
     * * Does not check for invalid use of CSS functions
     * * Does handle a computed length of 0 the same as a negative and therefore invalid value
     * @param sourceSizeValue
     * @returns {Number}
     */
    pf.calcLength = function (sourceSizeValue) {

      var value = evalCSS(sourceSizeValue, true) || false;
      if (value < 0) {
        value = false;
      }

      return value;
    };
    pf.supportsType = function (type) {
      return (type) ? types[type] : true;
    };

  /**
     * Parses a sourceSize into mediaCondition (media) and sourceSizeValue (length)
     * @param sourceSizeStr
     * @returns {*}
     */
    pf.parseSize = memoize(function (sourceSizeStr) {
      var match = (sourceSizeStr || "").match(regSize);
      return {
        media: match && match[1],
        length: match && match[2]
      };
    });

    pf.parseSet = function (set) {
      if (!set.cands) {
        set.cands = parseSrcset(set.srcset, set);
      }
      return set.cands;
    };

  /**
     * returns 1em in css px for html/body default size
     * function taken from respondjs
     * @returns {*|number}
     */
    pf.getEmValue = function () {
      var body;
      if (!eminpx && (body = document.body)) {
        var div = document.createElement("div"),
        originalHTMLCSS = docElem.style.cssText,
        originalBodyCSS = body.style.cssText;
        div.style.cssText = baseStyle;
        docElem.style.cssText = fsCss;
        body.style.cssText = fsCss;

        body.appendChild(div);
        eminpx = div.offsetWidth;
        body.removeChild(div);
        eminpx = parseFloat(eminpx, 10);
        docElem.style.cssText = originalHTMLCSS;
        body.style.cssText = originalBodyCSS;

      }
      return eminpx || 16;
    };

  /**
     * Takes a string of sizes and returns the width in pixels as a number
     */
    pf.calcListLength = function (sourceSizeListStr) {
      if (!(sourceSizeListStr in sizeLengthCache) || cfg.uT) {
        var winningLength = pf.calcLength(parseSizes(sourceSizeListStr));

        sizeLengthCache[sourceSizeListStr] = !winningLength ? units.width : winningLength;
      }

      return sizeLengthCache[sourceSizeListStr];
    };
    pf.setRes = function (set) {
      var candidates;
      if (set) {

        candidates = pf.parseSet(set);

        for (var i = 0, len = candidates.length; i < len; i++) {
          setResolution(candidates[i], set.sizes);
        }
      }
      return candidates;
    };

    pf.setRes.res = setResolution;

    pf.applySetCandidate = function (candidates, img) {
      if (!candidates.length) { return; }
      var candidate,
        i,
        j,
        length,
        bestCandidate,
        curSrc,
        curCan,
        candidateSrc,
        abortCurSrc;
      var imageData = img[pf.ns];
      var dpr = pf.DPR;
      curSrc = imageData.curSrc || img[curSrcProp];
      curCan = imageData.curCan || setSrcToCur(img, curSrc, candidates[0].set);
      if (curCan && curCan.set === candidates[0].set) {
        abortCurSrc = (supportAbort && !img.complete && curCan.res - 0.1 > dpr);

        if (!abortCurSrc) {
          curCan.cached = true;
          if (curCan.res >= dpr) {
            bestCandidate = curCan;
          }
        }
      }

      if (!bestCandidate) {

        candidates.sort(ascendingSort);

        length = candidates.length;
        bestCandidate = candidates[length - 1];

        for (i = 0; i < length; i++) {
          candidate = candidates[i];
          if (candidate.res >= dpr) {
            j = i - 1;

            if (candidates[j] &&
              (abortCurSrc || curSrc !== pf.makeUrl(candidate.url)) &&
              chooseLowRes(candidates[j].res, candidate.res, dpr, candidates[j].cached)) {

              bestCandidate = candidates[j];

            } else {
              bestCandidate = candidate;
            }
            break;
          }
        }
      }

      if (bestCandidate) {

        candidateSrc = pf.makeUrl(bestCandidate.url);

        imageData.curSrc = candidateSrc;
        imageData.curCan = bestCandidate;

        if (candidateSrc !== curSrc) {
          pf.setSrc(img, bestCandidate);
        }
        pf.setSize(img);
      }
    };

    pf.setSrc = function (img, bestCandidate) {
      var origWidth;
      img.src = bestCandidate.url;
      if (bestCandidate.set.type === "image/svg+xml") {
        origWidth = img.style.width;
        img.style.width = (img.offsetWidth + 1) + "px";
        if (img.offsetWidth + 1) {
          img.style.width = origWidth;
        }
      }
    };

    pf.getSet = function (img) {
      var i, set, supportsType;
      var match = false;
      var sets = img[pf.ns].sets;

      for (i = 0; i < sets.length && !match; i++) {
        set = sets[i];

        if (!set.srcset || !pf.matchesMedia(set.media) || !(supportsType = pf.supportsType(set.type))) {
          continue;
        }

        if (supportsType === "pending") {
          set = supportsType;
        }

        match = set;
        break;
      }

      return match;
    };

    pf.parseSets = function (element, parent, options) {
      var srcsetAttribute, imageSet, isWDescripor, srcsetParsed;

      var hasPicture = parent && parent.nodeName.toUpperCase() === "PICTURE";
      var imageData = element[pf.ns];

      if (imageData.src === undefined || options.src) {
        imageData.src = getImgAttr.call(element, "src");
        if (imageData.src) {
          setImgAttr.call(element, srcAttr, imageData.src);
        } else {
          removeImgAttr.call(element, srcAttr);
        }
      }

      if (imageData.srcset === undefined || options.srcset || !pf.supSrcset || element.srcset) {
        srcsetAttribute = getImgAttr.call(element, "srcset");
        imageData.srcset = srcsetAttribute;
        srcsetParsed = true;
      }

      imageData.sets = [];

      if (hasPicture) {
        imageData.pic = true;
        getAllSourceElements(parent, imageData.sets);
      }

      if (imageData.srcset) {
        imageSet = {
          srcset: imageData.srcset,
          sizes: getImgAttr.call(element, "sizes")
        };
        imageData.sets.push(imageSet);
        isWDescripor = (alwaysCheckWDescriptor || imageData.src) && regWDesc.test(imageData.srcset || "");
        if (!isWDescripor && imageData.src && !getCandidateForSrc(imageData.src, imageSet) && !imageSet.has1x) {
          imageSet.srcset += ", " + imageData.src;
          imageSet.cands.push({
            url: imageData.src,
            d: 1,
            set: imageSet
          });
        }

      } else if (imageData.src) {
        imageData.sets.push({
          srcset: imageData.src,
          sizes: null
        });
      }

      imageData.curCan = null;
      imageData.curSrc = undefined;
      imageData.supported = !(hasPicture || (imageSet && !pf.supSrcset) || (isWDescripor && !pf.supSizes));

      if (srcsetParsed && pf.supSrcset && !imageData.supported) {
        if (srcsetAttribute) {
          setImgAttr.call(element, srcsetAttr, srcsetAttribute);
          element.srcset = "";
        } else {
          removeImgAttr.call(element, srcsetAttr);
        }
      }

      if (imageData.supported && !imageData.srcset && ((!imageData.src && element.src) || element.src !== pf.makeUrl(imageData.src))) {
        if (imageData.src === null) {
          element.removeAttribute("src");
        } else {
          element.src = imageData.src;
        }
      }

      imageData.parsed = true;
    };

    pf.fillImg = function (element, options) {
      var imageData;
      var extreme = options.reselect || options.reevaluate;
      if (!element[pf.ns]) {
        element[pf.ns] = {};
      }

      imageData = element[pf.ns];
      if (!extreme && imageData.evaled === evalId) {
        return;
      }

      if (!imageData.parsed || options.reevaluate) {
        pf.parseSets(element, element.parentNode, options);
      }

      if (!imageData.supported) {
        applyBestCandidate(element);
      } else {
        imageData.evaled = evalId;
      }
    };

    pf.setupRun = function () {
      if (!alreadyRun || isVwDirty || (DPR !== window.devicePixelRatio)) {
        updateMetrics();
      }
    };

    if (pf.supPicture) {
      picturefill = noop;
      pf.fillImg = noop;
    } else {

      (function () {
        var isDomReady;
        var regReady = window.attachEvent ? /d$|^c/ : /d$|^c|^i/;

        var run = function () {
          var readyState = document.readyState || "";

          timerId = setTimeout(run, readyState === "loading" ? 200 : 999);
          if (document.body) {
            pf.fillImgs();
            isDomReady = isDomReady || regReady.test(readyState);
            if (isDomReady) {
              clearTimeout(timerId);
            }

          }
        };

        var timerId = setTimeout(run, document.body ? 9 : 99);
        var debounce = function (func, wait) {
          var timeout, timestamp;
          var later = function () {
            var last = (new Date()) - timestamp;

            if (last < wait) {
              timeout = setTimeout(later, wait - last);
            } else {
              timeout = null;
              func();
            }
          };

          return function () {
            timestamp = new Date();

            if (!timeout) {
              timeout = setTimeout(later, wait);
            }
          };
        };
        var lastClientWidth = docElem.clientHeight;
        var onResize = function () {
          isVwDirty = Math.max(window.innerWidth || 0, docElem.clientWidth) !== units.width || docElem.clientHeight !== lastClientWidth;
          lastClientWidth = docElem.clientHeight;
          if (isVwDirty) {
            pf.fillImgs();
          }
        };

        on(window, "resize", debounce(onResize, 99));
        on(document, "readystatechange", run);
      })();
    }

    pf.picturefill = picturefill;
    pf.fillImgs = picturefill;
    pf.teardownRun = noop;
    picturefill._ = pf;
    window.picturefillCFG = {
      pf: pf,
      push: function (args) {
        var name = args.shift();
        if (typeof pf[name] === "function") {
          pf[name].apply(pf, args);
        } else {
          cfg[name] = args[0];
          if (alreadyRun) {
            pf.fillImgs({ reselect: true });
          }
        }
      }
    };

    while (setOptions && setOptions.length) {
      window.picturefillCFG.push(setOptions.shift());
    }

    window.picturefill = picturefill;
    if (typeof module === "object" && typeof module.exports === "object") {
      module.exports = picturefill;
    } else if (typeof define === "function" && define.amd) {
      define("picturefill", function () { return picturefill; });
    }
    if (!pf.supPicture) {
      types["image/webp"] = detectTypeSupport("image/webp", "data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==");
    }

  })(window, document);
});


//code.jquery.com/jquery-1.11.0
/*! jQuery v1.11.0 | (c) 2005, 2014 jQuery Foundation, Inc. | jquery.org/license */ ! function(a, b) {
  "object" == typeof module && "object" == typeof module.exports ? module.exports = a.document ? b(a, !0) : function(a) {
    if (!a.document) throw new Error("jQuery requires a window with a document");
    return b(a)
} : b(a)
}("undefined" != typeof window ? window : this, function(a, b) {
var c = [],
    d = c.slice,
    e = c.concat,
    f = c.push,
    g = c.indexOf,
    h = {},
    i = h.toString,
    j = h.hasOwnProperty,
    k = "".trim,
    l = {},
    m = "1.11.0",
    n = function(a, b) {
        return new n.fn.init(a, b)
    },
    o = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,
    p = /^-ms-/,
    q = /-([\da-z])/gi,
    r = function(a, b) {
        return b.toUpperCase()
    };
n.fn = n.prototype = {
    jquery: m,
    constructor: n,
    selector: "",
    length: 0,
    toArray: function() {
        return d.call(this)
    },
    get: function(a) {
        return null != a ? 0 > a ? this[a + this.length] : this[a] : d.call(this)
    },
    pushStack: function(a) {
        var b = n.merge(this.constructor(), a);
        return b.prevObject = this, b.context = this.context, b
    },
    each: function(a, b) {
        return n.each(this, a, b)
    },
    map: function(a) {
        return this.pushStack(n.map(this, function(b, c) {
            return a.call(b, c, b)
        }))
    },
    slice: function() {
        return this.pushStack(d.apply(this, arguments))
    },
    first: function() {
        return this.eq(0)
    },
    last: function() {
        return this.eq(-1)
    },
    eq: function(a) {
        var b = this.length,
            c = +a + (0 > a ? b : 0);
        return this.pushStack(c >= 0 && b > c ? [this[c]] : [])
    },
    end: function() {
        return this.prevObject || this.constructor(null)
    },
    push: f,
    sort: c.sort,
    splice: c.splice
}, n.extend = n.fn.extend = function() {
    var a, b, c, d, e, f, g = arguments[0] || {},
        h = 1,
        i = arguments.length,
        j = !1;
    for ("boolean" == typeof g && (j = g, g = arguments[h] || {}, h++), "object" == typeof g || n.isFunction(g) || (g = {}), h === i && (g = this, h--); i > h; h++)
        if (null != (e = arguments[h]))
            for (d in e) a = g[d], c = e[d], g !== c && (j && c && (n.isPlainObject(c) || (b = n.isArray(c))) ? (b ? (b = !1, f = a && n.isArray(a) ? a : []) : f = a && n.isPlainObject(a) ? a : {}, g[d] = n.extend(j, f, c)) : void 0 !== c && (g[d] = c));
    return g
}, n.extend({
    expando: "jQuery" + (m + Math.random()).replace(/\D/g, ""),
    isReady: !0,
    error: function(a) {
        throw new Error(a)
    },
    noop: function() {},
    isFunction: function(a) {
        return "function" === n.type(a)
    },
    isArray: Array.isArray || function(a) {
        return "array" === n.type(a)
    },
    isWindow: function(a) {
        return null != a && a == a.window
    },
    isNumeric: function(a) {
        return a - parseFloat(a) >= 0
    },
    isEmptyObject: function(a) {
        var b;
        for (b in a) return !1;
        return !0
    },
    isPlainObject: function(a) {
        var b;
        if (!a || "object" !== n.type(a) || a.nodeType || n.isWindow(a)) return !1;
        try {
            if (a.constructor && !j.call(a, "constructor") && !j.call(a.constructor.prototype, "isPrototypeOf")) return !1
        } catch (c) {
            return !1
        }
        if (l.ownLast)
            for (b in a) return j.call(a, b);
        for (b in a);
        return void 0 === b || j.call(a, b)
    },
    type: function(a) {
        return null == a ? a + "" : "object" == typeof a || "function" == typeof a ? h[i.call(a)] || "object" : typeof a
    },
    globalEval: function(b) {
        b && n.trim(b) && (a.execScript || function(b) {
            a.eval.call(a, b)
        })(b)
    },
    camelCase: function(a) {
        return a.replace(p, "ms-").replace(q, r)
    },
    nodeName: function(a, b) {
        return a.nodeName && a.nodeName.toLowerCase() === b.toLowerCase()
    },
    each: function(a, b, c) {
        var d, e = 0,
            f = a.length,
            g = s(a);
        if (c) {
            if (g) {
                for (; f > e; e++)
                    if (d = b.apply(a[e], c), d === !1) break
            } else
                for (e in a)
                    if (d = b.apply(a[e], c), d === !1) break
        } else if (g) {
            for (; f > e; e++)
                if (d = b.call(a[e], e, a[e]), d === !1) break
        } else
            for (e in a)
                if (d = b.call(a[e], e, a[e]), d === !1) break;
        return a
    },
    trim: k && !k.call("\ufeff\xa0") ? function(a) {
        return null == a ? "" : k.call(a)
    } : function(a) {
        return null == a ? "" : (a + "").replace(o, "")
    },
    makeArray: function(a, b) {
        var c = b || [];
        return null != a && (s(Object(a)) ? n.merge(c, "string" == typeof a ? [a] : a) : f.call(c, a)), c
    },
    inArray: function(a, b, c) {
        var d;
        if (b) {
            if (g) return g.call(b, a, c);
            for (d = b.length, c = c ? 0 > c ? Math.max(0, d + c) : c : 0; d > c; c++)
                if (c in b && b[c] === a) return c
        }
        return -1
    },
    merge: function(a, b) {
        var c = +b.length,
            d = 0,
            e = a.length;
        while (c > d) a[e++] = b[d++];
        if (c !== c)
            while (void 0 !== b[d]) a[e++] = b[d++];
        return a.length = e, a
    },
    grep: function(a, b, c) {
        for (var d, e = [], f = 0, g = a.length, h = !c; g > f; f++) d = !b(a[f], f), d !== h && e.push(a[f]);
        return e
    },
    map: function(a, b, c) {
        var d, f = 0,
            g = a.length,
            h = s(a),
            i = [];
        if (h)
            for (; g > f; f++) d = b(a[f], f, c), null != d && i.push(d);
        else
            for (f in a) d = b(a[f], f, c), null != d && i.push(d);
        return e.apply([], i)
    },
    guid: 1,
    proxy: function(a, b) {
        var c, e, f;
        return "string" == typeof b && (f = a[b], b = a, a = f), n.isFunction(a) ? (c = d.call(arguments, 2), e = function() {
            return a.apply(b || this, c.concat(d.call(arguments)))
        }, e.guid = a.guid = a.guid || n.guid++, e) : void 0
    },
    now: function() {
        return +new Date
    },
    support: l
}), n.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(a, b) {
    h["[object " + b + "]"] = b.toLowerCase()
});

function s(a) {
    var b = a.length,
        c = n.type(a);
    return "function" === c || n.isWindow(a) ? !1 : 1 === a.nodeType && b ? !0 : "array" === c || 0 === b || "number" == typeof b && b > 0 && b - 1 in a
}
var t = function(a) {
    var b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s = "sizzle" + -new Date,
        t = a.document,
        u = 0,
        v = 0,
        w = eb(),
        x = eb(),
        y = eb(),
        z = function(a, b) {
            return a === b && (j = !0), 0
        },
        A = "undefined",
        B = 1 << 31,
        C = {}.hasOwnProperty,
        D = [],
        E = D.pop,
        F = D.push,
        G = D.push,
        H = D.slice,
        I = D.indexOf || function(a) {
            for (var b = 0, c = this.length; c > b; b++)
                if (this[b] === a) return b;
            return -1
        },
        J = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",
        K = "[\\x20\\t\\r\\n\\f]",
        L = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",
        M = L.replace("w", "w#"),
        N = "\\[" + K + "*(" + L + ")" + K + "*(?:([*^$|!~]?=)" + K + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + M + ")|)|)" + K + "*\\]",
        O = ":(" + L + ")(?:\\(((['\"])((?:\\\\.|[^\\\\])*?)\\3|((?:\\\\.|[^\\\\()[\\]]|" + N.replace(3, 8) + ")*)|.*)\\)|)",
        P = new RegExp("^" + K + "+|((?:^|[^\\\\])(?:\\\\.)*)" + K + "+$", "g"),
        Q = new RegExp("^" + K + "*," + K + "*"),
        R = new RegExp("^" + K + "*([>+~]|" + K + ")" + K + "*"),
        S = new RegExp("=" + K + "*([^\\]'\"]*?)" + K + "*\\]", "g"),
        T = new RegExp(O),
        U = new RegExp("^" + M + "$"),
        V = {
            ID: new RegExp("^#(" + L + ")"),
            CLASS: new RegExp("^\\.(" + L + ")"),
            TAG: new RegExp("^(" + L.replace("w", "w*") + ")"),
            ATTR: new RegExp("^" + N),
            PSEUDO: new RegExp("^" + O),
            CHILD: new RegExp("^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + K + "*(even|odd|(([+-]|)(\\d*)n|)" + K + "*(?:([+-]|)" + K + "*(\\d+)|))" + K + "*\\)|)", "i"),
            bool: new RegExp("^(?:" + J + ")$", "i"),
            needsContext: new RegExp("^" + K + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + K + "*((?:-\\d)?\\d*)" + K + "*\\)|)(?=[^-]|$)", "i")
        },
        W = /^(?:input|select|textarea|button)$/i,
        X = /^h\d$/i,
        Y = /^[^{]+\{\s*\[native \w/,
        Z = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,
        $ = /[+~]/,
        _ = /'|\\/g,
        ab = new RegExp("\\\\([\\da-f]{1,6}" + K + "?|(" + K + ")|.)", "ig"),
        bb = function(a, b, c) {
            var d = "0x" + b - 65536;
            return d !== d || c ? b : 0 > d ? String.fromCharCode(d + 65536) : String.fromCharCode(d >> 10 | 55296, 1023 & d | 56320)
        };
    try {
        G.apply(D = H.call(t.childNodes), t.childNodes), D[t.childNodes.length].nodeType
    } catch (cb) {
        G = {
            apply: D.length ? function(a, b) {
                F.apply(a, H.call(b))
            } : function(a, b) {
                var c = a.length,
                    d = 0;
                while (a[c++] = b[d++]);
                a.length = c - 1
            }
        }
    }

    function db(a, b, d, e) {
        var f, g, h, i, j, m, p, q, u, v;
        if ((b ? b.ownerDocument || b : t) !== l && k(b), b = b || l, d = d || [], !a || "string" != typeof a) return d;
        if (1 !== (i = b.nodeType) && 9 !== i) return [];
        if (n && !e) {
            if (f = Z.exec(a))
                if (h = f[1]) {
                    if (9 === i) {
                        if (g = b.getElementById(h), !g || !g.parentNode) return d;
                        if (g.id === h) return d.push(g), d
                    } else if (b.ownerDocument && (g = b.ownerDocument.getElementById(h)) && r(b, g) && g.id === h) return d.push(g), d
                } else {
                    if (f[2]) return G.apply(d, b.getElementsByTagName(a)), d;
                    if ((h = f[3]) && c.getElementsByClassName && b.getElementsByClassName) return G.apply(d, b.getElementsByClassName(h)), d
                } if (c.qsa && (!o || !o.test(a))) {
                if (q = p = s, u = b, v = 9 === i && a, 1 === i && "object" !== b.nodeName.toLowerCase()) {
                    m = ob(a), (p = b.getAttribute("id")) ? q = p.replace(_, "\\$&") : b.setAttribute("id", q), q = "[id='" + q + "'] ", j = m.length;
                    while (j--) m[j] = q + pb(m[j]);
                    u = $.test(a) && mb(b.parentNode) || b, v = m.join(",")
                }
                if (v) try {
                    return G.apply(d, u.querySelectorAll(v)), d
                } catch (w) {} finally {
                    p || b.removeAttribute("id")
                }
            }
        }
        return xb(a.replace(P, "$1"), b, d, e)
    }

    function eb() {
        var a = [];

        function b(c, e) {
            return a.push(c + " ") > d.cacheLength && delete b[a.shift()], b[c + " "] = e
        }
        return b
    }

    function fb(a) {
        return a[s] = !0, a
    }

    function gb(a) {
        var b = l.createElement("div");
        try {
            return !!a(b)
        } catch (c) {
            return !1
        } finally {
            b.parentNode && b.parentNode.removeChild(b), b = null
        }
    }

    function hb(a, b) {
        var c = a.split("|"),
            e = a.length;
        while (e--) d.attrHandle[c[e]] = b
    }

    function ib(a, b) {
        var c = b && a,
            d = c && 1 === a.nodeType && 1 === b.nodeType && (~b.sourceIndex || B) - (~a.sourceIndex || B);
        if (d) return d;
        if (c)
            while (c = c.nextSibling)
                if (c === b) return -1;
        return a ? 1 : -1
    }

    function jb(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return "input" === c && b.type === a
        }
    }

    function kb(a) {
        return function(b) {
            var c = b.nodeName.toLowerCase();
            return ("input" === c || "button" === c) && b.type === a
        }
    }

    function lb(a) {
        return fb(function(b) {
            return b = +b, fb(function(c, d) {
                var e, f = a([], c.length, b),
                    g = f.length;
                while (g--) c[e = f[g]] && (c[e] = !(d[e] = c[e]))
            })
        })
    }

    function mb(a) {
        return a && typeof a.getElementsByTagName !== A && a
    }
    c = db.support = {}, f = db.isXML = function(a) {
        var b = a && (a.ownerDocument || a).documentElement;
        return b ? "HTML" !== b.nodeName : !1
    }, k = db.setDocument = function(a) {
        var b, e = a ? a.ownerDocument || a : t,
            g = e.defaultView;
        return e !== l && 9 === e.nodeType && e.documentElement ? (l = e, m = e.documentElement, n = !f(e), g && g !== g.top && (g.addEventListener ? g.addEventListener("unload", function() {
            k()
        }, !1) : g.attachEvent && g.attachEvent("onunload", function() {
            k()
        })), c.attributes = gb(function(a) {
            return a.className = "i", !a.getAttribute("className")
        }), c.getElementsByTagName = gb(function(a) {
            return a.appendChild(e.createComment("")), !a.getElementsByTagName("*").length
        }), c.getElementsByClassName = Y.test(e.getElementsByClassName) && gb(function(a) {
            return a.innerHTML = "<div class='a'></div><div class='a i'></div>", a.firstChild.className = "i", 2 === a.getElementsByClassName("i").length
        }), c.getById = gb(function(a) {
            return m.appendChild(a).id = s, !e.getElementsByName || !e.getElementsByName(s).length
        }), c.getById ? (d.find.ID = function(a, b) {
            if (typeof b.getElementById !== A && n) {
                var c = b.getElementById(a);
                return c && c.parentNode ? [c] : []
            }
        }, d.filter.ID = function(a) {
            var b = a.replace(ab, bb);
            return function(a) {
                return a.getAttribute("id") === b
            }
        }) : (delete d.find.ID, d.filter.ID = function(a) {
            var b = a.replace(ab, bb);
            return function(a) {
                var c = typeof a.getAttributeNode !== A && a.getAttributeNode("id");
                return c && c.value === b
            }
        }), d.find.TAG = c.getElementsByTagName ? function(a, b) {
            return typeof b.getElementsByTagName !== A ? b.getElementsByTagName(a) : void 0
        } : function(a, b) {
            var c, d = [],
                e = 0,
                f = b.getElementsByTagName(a);
            if ("*" === a) {
                while (c = f[e++]) 1 === c.nodeType && d.push(c);
                return d
            }
            return f
        }, d.find.CLASS = c.getElementsByClassName && function(a, b) {
            return typeof b.getElementsByClassName !== A && n ? b.getElementsByClassName(a) : void 0
        }, p = [], o = [], (c.qsa = Y.test(e.querySelectorAll)) && (gb(function(a) {
            a.innerHTML = "<select t=''><option selected=''></option></select>", a.querySelectorAll("[t^='']").length && o.push("[*^$]=" + K + "*(?:''|\"\")"), a.querySelectorAll("[selected]").length || o.push("\\[" + K + "*(?:value|" + J + ")"), a.querySelectorAll(":checked").length || o.push(":checked")
        }), gb(function(a) {
            var b = e.createElement("input");
            b.setAttribute("type", "hidden"), a.appendChild(b).setAttribute("name", "D"), a.querySelectorAll("[name=d]").length && o.push("name" + K + "*[*^$|!~]?="), a.querySelectorAll(":enabled").length || o.push(":enabled", ":disabled"), a.querySelectorAll("*,:x"), o.push(",.*:")
        })), (c.matchesSelector = Y.test(q = m.webkitMatchesSelector || m.mozMatchesSelector || m.oMatchesSelector || m.msMatchesSelector)) && gb(function(a) {
            c.disconnectedMatch = q.call(a, "div"), q.call(a, "[s!='']:x"), p.push("!=", O)
        }), o = o.length && new RegExp(o.join("|")), p = p.length && new RegExp(p.join("|")), b = Y.test(m.compareDocumentPosition), r = b || Y.test(m.contains) ? function(a, b) {
            var c = 9 === a.nodeType ? a.documentElement : a,
                d = b && b.parentNode;
            return a === d || !(!d || 1 !== d.nodeType || !(c.contains ? c.contains(d) : a.compareDocumentPosition && 16 & a.compareDocumentPosition(d)))
        } : function(a, b) {
            if (b)
                while (b = b.parentNode)
                    if (b === a) return !0;
            return !1
        }, z = b ? function(a, b) {
            if (a === b) return j = !0, 0;
            var d = !a.compareDocumentPosition - !b.compareDocumentPosition;
            return d ? d : (d = (a.ownerDocument || a) === (b.ownerDocument || b) ? a.compareDocumentPosition(b) : 1, 1 & d || !c.sortDetached && b.compareDocumentPosition(a) === d ? a === e || a.ownerDocument === t && r(t, a) ? -1 : b === e || b.ownerDocument === t && r(t, b) ? 1 : i ? I.call(i, a) - I.call(i, b) : 0 : 4 & d ? -1 : 1)
        } : function(a, b) {
            if (a === b) return j = !0, 0;
            var c, d = 0,
                f = a.parentNode,
                g = b.parentNode,
                h = [a],
                k = [b];
            if (!f || !g) return a === e ? -1 : b === e ? 1 : f ? -1 : g ? 1 : i ? I.call(i, a) - I.call(i, b) : 0;
            if (f === g) return ib(a, b);
            c = a;
            while (c = c.parentNode) h.unshift(c);
            c = b;
            while (c = c.parentNode) k.unshift(c);
            while (h[d] === k[d]) d++;
            return d ? ib(h[d], k[d]) : h[d] === t ? -1 : k[d] === t ? 1 : 0
        }, e) : l
    }, db.matches = function(a, b) {
        return db(a, null, null, b)
    }, db.matchesSelector = function(a, b) {
        if ((a.ownerDocument || a) !== l && k(a), b = b.replace(S, "='$1']"), !(!c.matchesSelector || !n || p && p.test(b) || o && o.test(b))) try {
            var d = q.call(a, b);
            if (d || c.disconnectedMatch || a.document && 11 !== a.document.nodeType) return d
        } catch (e) {}
        return db(b, l, null, [a]).length > 0
    }, db.contains = function(a, b) {
        return (a.ownerDocument || a) !== l && k(a), r(a, b)
    }, db.attr = function(a, b) {
        (a.ownerDocument || a) !== l && k(a);
        var e = d.attrHandle[b.toLowerCase()],
            f = e && C.call(d.attrHandle, b.toLowerCase()) ? e(a, b, !n) : void 0;
        return void 0 !== f ? f : c.attributes || !n ? a.getAttribute(b) : (f = a.getAttributeNode(b)) && f.specified ? f.value : null
    }, db.error = function(a) {
        throw new Error("Syntax error, unrecognized expression: " + a)
    }, db.uniqueSort = function(a) {
        var b, d = [],
            e = 0,
            f = 0;
        if (j = !c.detectDuplicates, i = !c.sortStable && a.slice(0), a.sort(z), j) {
            while (b = a[f++]) b === a[f] && (e = d.push(f));
            while (e--) a.splice(d[e], 1)
        }
        return i = null, a
    }, e = db.getText = function(a) {
        var b, c = "",
            d = 0,
            f = a.nodeType;
        if (f) {
            if (1 === f || 9 === f || 11 === f) {
                if ("string" == typeof a.textContent) return a.textContent;
                for (a = a.firstChild; a; a = a.nextSibling) c += e(a)
            } else if (3 === f || 4 === f) return a.nodeValue
        } else
            while (b = a[d++]) c += e(b);
        return c
    }, d = db.selectors = {
        cacheLength: 50,
        createPseudo: fb,
        match: V,
        attrHandle: {},
        find: {},
        relative: {
            ">": {
                dir: "parentNode",
                first: !0
            },
            " ": {
                dir: "parentNode"
            },
            "+": {
                dir: "previousSibling",
                first: !0
            },
            "~": {
                dir: "previousSibling"
            }
        },
        preFilter: {
            ATTR: function(a) {
                return a[1] = a[1].replace(ab, bb), a[3] = (a[4] || a[5] || "").replace(ab, bb), "~=" === a[2] && (a[3] = " " + a[3] + " "), a.slice(0, 4)
            },
            CHILD: function(a) {
                return a[1] = a[1].toLowerCase(), "nth" === a[1].slice(0, 3) ? (a[3] || db.error(a[0]), a[4] = +(a[4] ? a[5] + (a[6] || 1) : 2 * ("even" === a[3] || "odd" === a[3])), a[5] = +(a[7] + a[8] || "odd" === a[3])) : a[3] && db.error(a[0]), a
            },
            PSEUDO: function(a) {
                var b, c = !a[5] && a[2];
                return V.CHILD.test(a[0]) ? null : (a[3] && void 0 !== a[4] ? a[2] = a[4] : c && T.test(c) && (b = ob(c, !0)) && (b = c.indexOf(")", c.length - b) - c.length) && (a[0] = a[0].slice(0, b), a[2] = c.slice(0, b)), a.slice(0, 3))
            }
        },
        filter: {
            TAG: function(a) {
                var b = a.replace(ab, bb).toLowerCase();
                return "*" === a ? function() {
                    return !0
                } : function(a) {
                    return a.nodeName && a.nodeName.toLowerCase() === b
                }
            },
            CLASS: function(a) {
                var b = w[a + " "];
                return b || (b = new RegExp("(^|" + K + ")" + a + "(" + K + "|$)")) && w(a, function(a) {
                    return b.test("string" == typeof a.className && a.className || typeof a.getAttribute !== A && a.getAttribute("class") || "")
                })
            },
            ATTR: function(a, b, c) {
                return function(d) {
                    var e = db.attr(d, a);
                    return null == e ? "!=" === b : b ? (e += "", "=" === b ? e === c : "!=" === b ? e !== c : "^=" === b ? c && 0 === e.indexOf(c) : "*=" === b ? c && e.indexOf(c) > -1 : "$=" === b ? c && e.slice(-c.length) === c : "~=" === b ? (" " + e + " ").indexOf(c) > -1 : "|=" === b ? e === c || e.slice(0, c.length + 1) === c + "-" : !1) : !0
                }
            },
            CHILD: function(a, b, c, d, e) {
                var f = "nth" !== a.slice(0, 3),
                    g = "last" !== a.slice(-4),
                    h = "of-type" === b;
                return 1 === d && 0 === e ? function(a) {
                    return !!a.parentNode
                } : function(b, c, i) {
                    var j, k, l, m, n, o, p = f !== g ? "nextSibling" : "previousSibling",
                        q = b.parentNode,
                        r = h && b.nodeName.toLowerCase(),
                        t = !i && !h;
                    if (q) {
                        if (f) {
                            while (p) {
                                l = b;
                                while (l = l[p])
                                    if (h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) return !1;
                                o = p = "only" === a && !o && "nextSibling"
                            }
                            return !0
                        }
                        if (o = [g ? q.firstChild : q.lastChild], g && t) {
                            k = q[s] || (q[s] = {}), j = k[a] || [], n = j[0] === u && j[1], m = j[0] === u && j[2], l = n && q.childNodes[n];
                            while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                if (1 === l.nodeType && ++m && l === b) {
                                    k[a] = [u, n, m];
                                    break
                                }
                        } else if (t && (j = (b[s] || (b[s] = {}))[a]) && j[0] === u) m = j[1];
                        else
                            while (l = ++n && l && l[p] || (m = n = 0) || o.pop())
                                if ((h ? l.nodeName.toLowerCase() === r : 1 === l.nodeType) && ++m && (t && ((l[s] || (l[s] = {}))[a] = [u, m]), l === b)) break;
                        return m -= e, m === d || m % d === 0 && m / d >= 0
                    }
                }
            },
            PSEUDO: function(a, b) {
                var c, e = d.pseudos[a] || d.setFilters[a.toLowerCase()] || db.error("unsupported pseudo: " + a);
                return e[s] ? e(b) : e.length > 1 ? (c = [a, a, "", b], d.setFilters.hasOwnProperty(a.toLowerCase()) ? fb(function(a, c) {
                    var d, f = e(a, b),
                        g = f.length;
                    while (g--) d = I.call(a, f[g]), a[d] = !(c[d] = f[g])
                }) : function(a) {
                    return e(a, 0, c)
                }) : e
            }
        },
        pseudos: {
            not: fb(function(a) {
                var b = [],
                    c = [],
                    d = g(a.replace(P, "$1"));
                return d[s] ? fb(function(a, b, c, e) {
                    var f, g = d(a, null, e, []),
                        h = a.length;
                    while (h--)(f = g[h]) && (a[h] = !(b[h] = f))
                }) : function(a, e, f) {
                    return b[0] = a, d(b, null, f, c), !c.pop()
                }
            }),
            has: fb(function(a) {
                return function(b) {
                    return db(a, b).length > 0
                }
            }),
            contains: fb(function(a) {
                return function(b) {
                    return (b.textContent || b.innerText || e(b)).indexOf(a) > -1
                }
            }),
            lang: fb(function(a) {
                return U.test(a || "") || db.error("unsupported lang: " + a), a = a.replace(ab, bb).toLowerCase(),
                    function(b) {
                        var c;
                        do
                            if (c = n ? b.lang : b.getAttribute("xml:lang") || b.getAttribute("lang")) return c = c.toLowerCase(), c === a || 0 === c.indexOf(a + "-"); while ((b = b.parentNode) && 1 === b.nodeType);
                        return !1
                    }
            }),
            target: function(b) {
                var c = a.location && a.location.hash;
                return c && c.slice(1) === b.id
            },
            root: function(a) {
                return a === m
            },
            focus: function(a) {
                return a === l.activeElement && (!l.hasFocus || l.hasFocus()) && !!(a.type || a.href || ~a.tabIndex)
            },
            enabled: function(a) {
                return a.disabled === !1
            },
            disabled: function(a) {
                return a.disabled === !0
            },
            checked: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && !!a.checked || "option" === b && !!a.selected
            },
            selected: function(a) {
                return a.parentNode && a.parentNode.selectedIndex, a.selected === !0
            },
            empty: function(a) {
                for (a = a.firstChild; a; a = a.nextSibling)
                    if (a.nodeType < 6) return !1;
                return !0
            },
            parent: function(a) {
                return !d.pseudos.empty(a)
            },
            header: function(a) {
                return X.test(a.nodeName)
            },
            input: function(a) {
                return W.test(a.nodeName)
            },
            button: function(a) {
                var b = a.nodeName.toLowerCase();
                return "input" === b && "button" === a.type || "button" === b
            },
            text: function(a) {
                var b;
                return "input" === a.nodeName.toLowerCase() && "text" === a.type && (null == (b = a.getAttribute("type")) || "text" === b.toLowerCase())
            },
            first: lb(function() {
                return [0]
            }),
            last: lb(function(a, b) {
                return [b - 1]
            }),
            eq: lb(function(a, b, c) {
                return [0 > c ? c + b : c]
            }),
            even: lb(function(a, b) {
                for (var c = 0; b > c; c += 2) a.push(c);
                return a
            }),
            odd: lb(function(a, b) {
                for (var c = 1; b > c; c += 2) a.push(c);
                return a
            }),
            lt: lb(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; --d >= 0;) a.push(d);
                return a
            }),
            gt: lb(function(a, b, c) {
                for (var d = 0 > c ? c + b : c; ++d < b;) a.push(d);
                return a
            })
        }
    }, d.pseudos.nth = d.pseudos.eq;
    for (b in {
            radio: !0,
            checkbox: !0,
            file: !0,
            password: !0,
            image: !0
        }) d.pseudos[b] = jb(b);
    for (b in {
            submit: !0,
            reset: !0
        }) d.pseudos[b] = kb(b);

    function nb() {}
    nb.prototype = d.filters = d.pseudos, d.setFilters = new nb;

    function ob(a, b) {
        var c, e, f, g, h, i, j, k = x[a + " "];
        if (k) return b ? 0 : k.slice(0);
        h = a, i = [], j = d.preFilter;
        while (h) {
            (!c || (e = Q.exec(h))) && (e && (h = h.slice(e[0].length) || h), i.push(f = [])), c = !1, (e = R.exec(h)) && (c = e.shift(), f.push({
                value: c,
                type: e[0].replace(P, " ")
            }), h = h.slice(c.length));
            for (g in d.filter) !(e = V[g].exec(h)) || j[g] && !(e = j[g](e)) || (c = e.shift(), f.push({
                value: c,
                type: g,
                matches: e
            }), h = h.slice(c.length));
            if (!c) break
        }
        return b ? h.length : h ? db.error(a) : x(a, i).slice(0)
    }

    function pb(a) {
        for (var b = 0, c = a.length, d = ""; c > b; b++) d += a[b].value;
        return d
    }

    function qb(a, b, c) {
        var d = b.dir,
            e = c && "parentNode" === d,
            f = v++;
        return b.first ? function(b, c, f) {
            while (b = b[d])
                if (1 === b.nodeType || e) return a(b, c, f)
        } : function(b, c, g) {
            var h, i, j = [u, f];
            if (g) {
                while (b = b[d])
                    if ((1 === b.nodeType || e) && a(b, c, g)) return !0
            } else
                while (b = b[d])
                    if (1 === b.nodeType || e) {
                        if (i = b[s] || (b[s] = {}), (h = i[d]) && h[0] === u && h[1] === f) return j[2] = h[2];
                        if (i[d] = j, j[2] = a(b, c, g)) return !0
                    }
        }
    }

    function rb(a) {
        return a.length > 1 ? function(b, c, d) {
            var e = a.length;
            while (e--)
                if (!a[e](b, c, d)) return !1;
            return !0
        } : a[0]
    }

    function sb(a, b, c, d, e) {
        for (var f, g = [], h = 0, i = a.length, j = null != b; i > h; h++)(f = a[h]) && (!c || c(f, d, e)) && (g.push(f), j && b.push(h));
        return g
    }

    function tb(a, b, c, d, e, f) {
        return d && !d[s] && (d = tb(d)), e && !e[s] && (e = tb(e, f)), fb(function(f, g, h, i) {
            var j, k, l, m = [],
                n = [],
                o = g.length,
                p = f || wb(b || "*", h.nodeType ? [h] : h, []),
                q = !a || !f && b ? p : sb(p, m, a, h, i),
                r = c ? e || (f ? a : o || d) ? [] : g : q;
            if (c && c(q, r, h, i), d) {
                j = sb(r, n), d(j, [], h, i), k = j.length;
                while (k--)(l = j[k]) && (r[n[k]] = !(q[n[k]] = l))
            }
            if (f) {
                if (e || a) {
                    if (e) {
                        j = [], k = r.length;
                        while (k--)(l = r[k]) && j.push(q[k] = l);
                        e(null, r = [], j, i)
                    }
                    k = r.length;
                    while (k--)(l = r[k]) && (j = e ? I.call(f, l) : m[k]) > -1 && (f[j] = !(g[j] = l))
                }
            } else r = sb(r === g ? r.splice(o, r.length) : r), e ? e(null, g, r, i) : G.apply(g, r)
        })
    }

    function ub(a) {
        for (var b, c, e, f = a.length, g = d.relative[a[0].type], i = g || d.relative[" "], j = g ? 1 : 0, k = qb(function(a) {
                return a === b
            }, i, !0), l = qb(function(a) {
                return I.call(b, a) > -1
            }, i, !0), m = [function(a, c, d) {
                return !g && (d || c !== h) || ((b = c).nodeType ? k(a, c, d) : l(a, c, d))
            }]; f > j; j++)
            if (c = d.relative[a[j].type]) m = [qb(rb(m), c)];
            else {
                if (c = d.filter[a[j].type].apply(null, a[j].matches), c[s]) {
                    for (e = ++j; f > e; e++)
                        if (d.relative[a[e].type]) break;
                    return tb(j > 1 && rb(m), j > 1 && pb(a.slice(0, j - 1).concat({
                        value: " " === a[j - 2].type ? "*" : ""
                    })).replace(P, "$1"), c, e > j && ub(a.slice(j, e)), f > e && ub(a = a.slice(e)), f > e && pb(a))
                }
                m.push(c)
            } return rb(m)
    }

    function vb(a, b) {
        var c = b.length > 0,
            e = a.length > 0,
            f = function(f, g, i, j, k) {
                var m, n, o, p = 0,
                    q = "0",
                    r = f && [],
                    s = [],
                    t = h,
                    v = f || e && d.find.TAG("*", k),
                    w = u += null == t ? 1 : Math.random() || .1,
                    x = v.length;
                for (k && (h = g !== l && g); q !== x && null != (m = v[q]); q++) {
                    if (e && m) {
                        n = 0;
                        while (o = a[n++])
                            if (o(m, g, i)) {
                                j.push(m);
                                break
                            } k && (u = w)
                    }
                    c && ((m = !o && m) && p--, f && r.push(m))
                }
                if (p += q, c && q !== p) {
                    n = 0;
                    while (o = b[n++]) o(r, s, g, i);
                    if (f) {
                        if (p > 0)
                            while (q--) r[q] || s[q] || (s[q] = E.call(j));
                        s = sb(s)
                    }
                    G.apply(j, s), k && !f && s.length > 0 && p + b.length > 1 && db.uniqueSort(j)
                }
                return k && (u = w, h = t), r
            };
        return c ? fb(f) : f
    }
    g = db.compile = function(a, b) {
        var c, d = [],
            e = [],
            f = y[a + " "];
        if (!f) {
            b || (b = ob(a)), c = b.length;
            while (c--) f = ub(b[c]), f[s] ? d.push(f) : e.push(f);
            f = y(a, vb(e, d))
        }
        return f
    };

    function wb(a, b, c) {
        for (var d = 0, e = b.length; e > d; d++) db(a, b[d], c);
        return c
    }

    function xb(a, b, e, f) {
        var h, i, j, k, l, m = ob(a);
        if (!f && 1 === m.length) {
            if (i = m[0] = m[0].slice(0), i.length > 2 && "ID" === (j = i[0]).type && c.getById && 9 === b.nodeType && n && d.relative[i[1].type]) {
                if (b = (d.find.ID(j.matches[0].replace(ab, bb), b) || [])[0], !b) return e;
                a = a.slice(i.shift().value.length)
            }
            h = V.needsContext.test(a) ? 0 : i.length;
            while (h--) {
                if (j = i[h], d.relative[k = j.type]) break;
                if ((l = d.find[k]) && (f = l(j.matches[0].replace(ab, bb), $.test(i[0].type) && mb(b.parentNode) || b))) {
                    if (i.splice(h, 1), a = f.length && pb(i), !a) return G.apply(e, f), e;
                    break
                }
            }
        }
        return g(a, m)(f, b, !n, e, $.test(a) && mb(b.parentNode) || b), e
    }
    return c.sortStable = s.split("").sort(z).join("") === s, c.detectDuplicates = !!j, k(), c.sortDetached = gb(function(a) {
        return 1 & a.compareDocumentPosition(l.createElement("div"))
    }), gb(function(a) {
        return a.innerHTML = "<a href='#'></a>", "#" === a.firstChild.getAttribute("href")
    }) || hb("type|href|height|width", function(a, b, c) {
        return c ? void 0 : a.getAttribute(b, "type" === b.toLowerCase() ? 1 : 2)
    }), c.attributes && gb(function(a) {
        return a.innerHTML = "<input/>", a.firstChild.setAttribute("value", ""), "" === a.firstChild.getAttribute("value")
    }) || hb("value", function(a, b, c) {
        return c || "input" !== a.nodeName.toLowerCase() ? void 0 : a.defaultValue
    }), gb(function(a) {
        return null == a.getAttribute("disabled")
    }) || hb(J, function(a, b, c) {
        var d;
        return c ? void 0 : a[b] === !0 ? b.toLowerCase() : (d = a.getAttributeNode(b)) && d.specified ? d.value : null
    }), db
}(a);
n.find = t, n.expr = t.selectors, n.expr[":"] = n.expr.pseudos, n.unique = t.uniqueSort, n.text = t.getText, n.isXMLDoc = t.isXML, n.contains = t.contains;
var u = n.expr.match.needsContext,
    v = /^<(\w+)\s*\/?>(?:<\/\1>|)$/,
    w = /^.[^:#\[\.,]*$/;

function x(a, b, c) {
    if (n.isFunction(b)) return n.grep(a, function(a, d) {
        return !!b.call(a, d, a) !== c
    });
    if (b.nodeType) return n.grep(a, function(a) {
        return a === b !== c
    });
    if ("string" == typeof b) {
        if (w.test(b)) return n.filter(b, a, c);
        b = n.filter(b, a)
    }
    return n.grep(a, function(a) {
        return n.inArray(a, b) >= 0 !== c
    })
}
n.filter = function(a, b, c) {
    var d = b[0];
    return c && (a = ":not(" + a + ")"), 1 === b.length && 1 === d.nodeType ? n.find.matchesSelector(d, a) ? [d] : [] : n.find.matches(a, n.grep(b, function(a) {
        return 1 === a.nodeType
    }))
}, n.fn.extend({
    find: function(a) {
        var b, c = [],
            d = this,
            e = d.length;
        if ("string" != typeof a) return this.pushStack(n(a).filter(function() {
            for (b = 0; e > b; b++)
                if (n.contains(d[b], this)) return !0
        }));
        for (b = 0; e > b; b++) n.find(a, d[b], c);
        return c = this.pushStack(e > 1 ? n.unique(c) : c), c.selector = this.selector ? this.selector + " " + a : a, c
    },
    filter: function(a) {
        return this.pushStack(x(this, a || [], !1))
    },
    not: function(a) {
        return this.pushStack(x(this, a || [], !0))
    },
    is: function(a) {
        return !!x(this, "string" == typeof a && u.test(a) ? n(a) : a || [], !1).length
    }
});
var y, z = a.document,
    A = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,
    B = n.fn.init = function(a, b) {
        var c, d;
        if (!a) return this;
        if ("string" == typeof a) {
            if (c = "<" === a.charAt(0) && ">" === a.charAt(a.length - 1) && a.length >= 3 ? [null, a, null] : A.exec(a), !c || !c[1] && b) return !b || b.jquery ? (b || y).find(a) : this.constructor(b).find(a);
            if (c[1]) {
                if (b = b instanceof n ? b[0] : b, n.merge(this, n.parseHTML(c[1], b && b.nodeType ? b.ownerDocument || b : z, !0)), v.test(c[1]) && n.isPlainObject(b))
                    for (c in b) n.isFunction(this[c]) ? this[c](b[c]) : this.attr(c, b[c]);
                return this
            }
            if (d = z.getElementById(c[2]), d && d.parentNode) {
                if (d.id !== c[2]) return y.find(a);
                this.length = 1, this[0] = d
            }
            return this.context = z, this.selector = a, this
        }
        return a.nodeType ? (this.context = this[0] = a, this.length = 1, this) : n.isFunction(a) ? "undefined" != typeof y.ready ? y.ready(a) : a(n) : (void 0 !== a.selector && (this.selector = a.selector, this.context = a.context), n.makeArray(a, this))
    };
B.prototype = n.fn, y = n(z);
var C = /^(?:parents|prev(?:Until|All))/,
    D = {
        children: !0,
        contents: !0,
        next: !0,
        prev: !0
    };
n.extend({
    dir: function(a, b, c) {
        var d = [],
            e = a[b];
        while (e && 9 !== e.nodeType && (void 0 === c || 1 !== e.nodeType || !n(e).is(c))) 1 === e.nodeType && d.push(e), e = e[b];
        return d
    },
    sibling: function(a, b) {
        for (var c = []; a; a = a.nextSibling) 1 === a.nodeType && a !== b && c.push(a);
        return c
    }
}), n.fn.extend({
    has: function(a) {
        var b, c = n(a, this),
            d = c.length;
        return this.filter(function() {
            for (b = 0; d > b; b++)
                if (n.contains(this, c[b])) return !0
        })
    },
    closest: function(a, b) {
        for (var c, d = 0, e = this.length, f = [], g = u.test(a) || "string" != typeof a ? n(a, b || this.context) : 0; e > d; d++)
            for (c = this[d]; c && c !== b; c = c.parentNode)
                if (c.nodeType < 11 && (g ? g.index(c) > -1 : 1 === c.nodeType && n.find.matchesSelector(c, a))) {
                    f.push(c);
                    break
                } return this.pushStack(f.length > 1 ? n.unique(f) : f)
    },
    index: function(a) {
        return a ? "string" == typeof a ? n.inArray(this[0], n(a)) : n.inArray(a.jquery ? a[0] : a, this) : this[0] && this[0].parentNode ? this.first().prevAll().length : -1
    },
    add: function(a, b) {
        return this.pushStack(n.unique(n.merge(this.get(), n(a, b))))
    },
    addBack: function(a) {
        return this.add(null == a ? this.prevObject : this.prevObject.filter(a))
    }
});

function E(a, b) {
    do a = a[b]; while (a && 1 !== a.nodeType);
    return a
}
n.each({
    parent: function(a) {
        var b = a.parentNode;
        return b && 11 !== b.nodeType ? b : null
    },
    parents: function(a) {
        return n.dir(a, "parentNode")
    },
    parentsUntil: function(a, b, c) {
        return n.dir(a, "parentNode", c)
    },
    next: function(a) {
        return E(a, "nextSibling")
    },
    prev: function(a) {
        return E(a, "previousSibling")
    },
    nextAll: function(a) {
        return n.dir(a, "nextSibling")
    },
    prevAll: function(a) {
        return n.dir(a, "previousSibling")
    },
    nextUntil: function(a, b, c) {
        return n.dir(a, "nextSibling", c)
    },
    prevUntil: function(a, b, c) {
        return n.dir(a, "previousSibling", c)
    },
    siblings: function(a) {
        return n.sibling((a.parentNode || {}).firstChild, a)
    },
    children: function(a) {
        return n.sibling(a.firstChild)
    },
    contents: function(a) {
        return n.nodeName(a, "iframe") ? a.contentDocument || a.contentWindow.document : n.merge([], a.childNodes)
    }
}, function(a, b) {
    n.fn[a] = function(c, d) {
        var e = n.map(this, b, c);
        return "Until" !== a.slice(-5) && (d = c), d && "string" == typeof d && (e = n.filter(d, e)), this.length > 1 && (D[a] || (e = n.unique(e)), C.test(a) && (e = e.reverse())), this.pushStack(e)
    }
});
var F = /\S+/g,
    G = {};

function H(a) {
    var b = G[a] = {};
    return n.each(a.match(F) || [], function(a, c) {
        b[c] = !0
    }), b
}
n.Callbacks = function(a) {
    a = "string" == typeof a ? G[a] || H(a) : n.extend({}, a);
    var b, c, d, e, f, g, h = [],
        i = !a.once && [],
        j = function(l) {
            for (c = a.memory && l, d = !0, f = g || 0, g = 0, e = h.length, b = !0; h && e > f; f++)
                if (h[f].apply(l[0], l[1]) === !1 && a.stopOnFalse) {
                    c = !1;
                    break
                } b = !1, h && (i ? i.length && j(i.shift()) : c ? h = [] : k.disable())
        },
        k = {
            add: function() {
                if (h) {
                    var d = h.length;
                    ! function f(b) {
                        n.each(b, function(b, c) {
                            var d = n.type(c);
                            "function" === d ? a.unique && k.has(c) || h.push(c) : c && c.length && "string" !== d && f(c)
                        })
                    }(arguments), b ? e = h.length : c && (g = d, j(c))
                }
                return this
            },
            remove: function() {
                return h && n.each(arguments, function(a, c) {
                    var d;
                    while ((d = n.inArray(c, h, d)) > -1) h.splice(d, 1), b && (e >= d && e--, f >= d && f--)
                }), this
            },
            has: function(a) {
                return a ? n.inArray(a, h) > -1 : !(!h || !h.length)
            },
            empty: function() {
                return h = [], e = 0, this
            },
            disable: function() {
                return h = i = c = void 0, this
            },
            disabled: function() {
                return !h
            },
            lock: function() {
                return i = void 0, c || k.disable(), this
            },
            locked: function() {
                return !i
            },
            fireWith: function(a, c) {
                return !h || d && !i || (c = c || [], c = [a, c.slice ? c.slice() : c], b ? i.push(c) : j(c)), this
            },
            fire: function() {
                return k.fireWith(this, arguments), this
            },
            fired: function() {
                return !!d
            }
        };
    return k
}, n.extend({
    Deferred: function(a) {
        var b = [
                ["resolve", "done", n.Callbacks("once memory"), "resolved"],
                ["reject", "fail", n.Callbacks("once memory"), "rejected"],
                ["notify", "progress", n.Callbacks("memory")]
            ],
            c = "pending",
            d = {
                state: function() {
                    return c
                },
                always: function() {
                    return e.done(arguments).fail(arguments), this
                },
                then: function() {
                    var a = arguments;
                    return n.Deferred(function(c) {
                        n.each(b, function(b, f) {
                            var g = n.isFunction(a[b]) && a[b];
                            e[f[1]](function() {
                                var a = g && g.apply(this, arguments);
                                a && n.isFunction(a.promise) ? a.promise().done(c.resolve).fail(c.reject).progress(c.notify) : c[f[0] + "With"](this === d ? c.promise() : this, g ? [a] : arguments)
                            })
                        }), a = null
                    }).promise()
                },
                promise: function(a) {
                    return null != a ? n.extend(a, d) : d
                }
            },
            e = {};
        return d.pipe = d.then, n.each(b, function(a, f) {
            var g = f[2],
                h = f[3];
            d[f[1]] = g.add, h && g.add(function() {
                c = h
            }, b[1 ^ a][2].disable, b[2][2].lock), e[f[0]] = function() {
                return e[f[0] + "With"](this === e ? d : this, arguments), this
            }, e[f[0] + "With"] = g.fireWith
        }), d.promise(e), a && a.call(e, e), e
    },
    when: function(a) {
        var b = 0,
            c = d.call(arguments),
            e = c.length,
            f = 1 !== e || a && n.isFunction(a.promise) ? e : 0,
            g = 1 === f ? a : n.Deferred(),
            h = function(a, b, c) {
                return function(e) {
                    b[a] = this, c[a] = arguments.length > 1 ? d.call(arguments) : e, c === i ? g.notifyWith(b, c) : --f || g.resolveWith(b, c)
                }
            },
            i, j, k;
        if (e > 1)
            for (i = new Array(e), j = new Array(e), k = new Array(e); e > b; b++) c[b] && n.isFunction(c[b].promise) ? c[b].promise().done(h(b, k, c)).fail(g.reject).progress(h(b, j, i)) : --f;
        return f || g.resolveWith(k, c), g.promise()
    }
});
var I;
n.fn.ready = function(a) {
    return n.ready.promise().done(a), this
}, n.extend({
    isReady: !1,
    readyWait: 1,
    holdReady: function(a) {
        a ? n.readyWait++ : n.ready(!0)
    },
    ready: function(a) {
        if (a === !0 ? !--n.readyWait : !n.isReady) {
            if (!z.body) return setTimeout(n.ready);
            n.isReady = !0, a !== !0 && --n.readyWait > 0 || (I.resolveWith(z, [n]), n.fn.trigger && n(z).trigger("ready").off("ready"))
        }
    }
});

function J() {
    z.addEventListener ? (z.removeEventListener("DOMContentLoaded", K, !1), a.removeEventListener("load", K, !1)) : (z.detachEvent("onreadystatechange", K), a.detachEvent("onload", K))
}

function K() {
    (z.addEventListener || "load" === event.type || "complete" === z.readyState) && (J(), n.ready())
}
n.ready.promise = function(b) {
    if (!I)
        if (I = n.Deferred(), "complete" === z.readyState) setTimeout(n.ready);
        else if (z.addEventListener) z.addEventListener("DOMContentLoaded", K, !1), a.addEventListener("load", K, !1);
    else {
        z.attachEvent("onreadystatechange", K), a.attachEvent("onload", K);
        var c = !1;
        try {
            c = null == a.frameElement && z.documentElement
        } catch (d) {}
        c && c.doScroll && ! function e() {
            if (!n.isReady) {
                try {
                    c.doScroll("left")
                } catch (a) {
                    return setTimeout(e, 50)
                }
                J(), n.ready()
            }
        }()
    }
    return I.promise(b)
};
var L = "undefined",
    M;
for (M in n(l)) break;
l.ownLast = "0" !== M, l.inlineBlockNeedsLayout = !1, n(function() {
        var a, b, c = z.getElementsByTagName("body")[0];
        c && (a = z.createElement("div"), a.style.cssText = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px;margin-top:1px", b = z.createElement("div"), c.appendChild(a).appendChild(b), typeof b.style.zoom !== L && (b.style.cssText = "border:0;margin:0;width:1px;padding:1px;display:inline;zoom:1", (l.inlineBlockNeedsLayout = 3 === b.offsetWidth) && (c.style.zoom = 1)), c.removeChild(a), a = b = null)
    }),
    function() {
        var a = z.createElement("div");
        if (null == l.deleteExpando) {
            l.deleteExpando = !0;
            try {
                delete a.test
            } catch (b) {
                l.deleteExpando = !1
            }
        }
        a = null
    }(), n.acceptData = function(a) {
        var b = n.noData[(a.nodeName + " ").toLowerCase()],
            c = +a.nodeType || 1;
        return 1 !== c && 9 !== c ? !1 : !b || b !== !0 && a.getAttribute("classid") === b
    };
var N = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
    O = /([A-Z])/g;

function P(a, b, c) {
    if (void 0 === c && 1 === a.nodeType) {
        var d = "data-" + b.replace(O, "-$1").toLowerCase();
        if (c = a.getAttribute(d), "string" == typeof c) {
            try {
                c = "true" === c ? !0 : "false" === c ? !1 : "null" === c ? null : +c + "" === c ? +c : N.test(c) ? n.parseJSON(c) : c
            } catch (e) {}
            n.data(a, b, c)
        } else c = void 0
    }
    return c
}

function Q(a) {
    var b;
    for (b in a)
        if (("data" !== b || !n.isEmptyObject(a[b])) && "toJSON" !== b) return !1;
    return !0
}

function R(a, b, d, e) {
    if (n.acceptData(a)) {
        var f, g, h = n.expando,
            i = a.nodeType,
            j = i ? n.cache : a,
            k = i ? a[h] : a[h] && h;
        if (k && j[k] && (e || j[k].data) || void 0 !== d || "string" != typeof b) return k || (k = i ? a[h] = c.pop() || n.guid++ : h), j[k] || (j[k] = i ? {} : {
            toJSON: n.noop
        }), ("object" == typeof b || "function" == typeof b) && (e ? j[k] = n.extend(j[k], b) : j[k].data = n.extend(j[k].data, b)), g = j[k], e || (g.data || (g.data = {}), g = g.data), void 0 !== d && (g[n.camelCase(b)] = d), "string" == typeof b ? (f = g[b], null == f && (f = g[n.camelCase(b)])) : f = g, f
    }
}

function S(a, b, c) {
    if (n.acceptData(a)) {
        var d, e, f = a.nodeType,
            g = f ? n.cache : a,
            h = f ? a[n.expando] : n.expando;
        if (g[h]) {
            if (b && (d = c ? g[h] : g[h].data)) {
                n.isArray(b) ? b = b.concat(n.map(b, n.camelCase)) : b in d ? b = [b] : (b = n.camelCase(b), b = b in d ? [b] : b.split(" ")), e = b.length;
                while (e--) delete d[b[e]];
                if (c ? !Q(d) : !n.isEmptyObject(d)) return
            }(c || (delete g[h].data, Q(g[h]))) && (f ? n.cleanData([a], !0) : l.deleteExpando || g != g.window ? delete g[h] : g[h] = null)
        }
    }
}
n.extend({
    cache: {},
    noData: {
        "applet ": !0,
        "embed ": !0,
        "object ": "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
    },
    hasData: function(a) {
        return a = a.nodeType ? n.cache[a[n.expando]] : a[n.expando], !!a && !Q(a)
    },
    data: function(a, b, c) {
        return R(a, b, c)
    },
    removeData: function(a, b) {
        return S(a, b)
    },
    _data: function(a, b, c) {
        return R(a, b, c, !0)
    },
    _removeData: function(a, b) {
        return S(a, b, !0)
    }
}), n.fn.extend({
    data: function(a, b) {
        var c, d, e, f = this[0],
            g = f && f.attributes;
        if (void 0 === a) {
            if (this.length && (e = n.data(f), 1 === f.nodeType && !n._data(f, "parsedAttrs"))) {
                c = g.length;
                while (c--) d = g[c].name, 0 === d.indexOf("data-") && (d = n.camelCase(d.slice(5)), P(f, d, e[d]));
                n._data(f, "parsedAttrs", !0)
            }
            return e
        }
        return "object" == typeof a ? this.each(function() {
            n.data(this, a)
        }) : arguments.length > 1 ? this.each(function() {
            n.data(this, a, b)
        }) : f ? P(f, a, n.data(f, a)) : void 0
    },
    removeData: function(a) {
        return this.each(function() {
            n.removeData(this, a)
        })
    }
}), n.extend({
    queue: function(a, b, c) {
        var d;
        return a ? (b = (b || "fx") + "queue", d = n._data(a, b), c && (!d || n.isArray(c) ? d = n._data(a, b, n.makeArray(c)) : d.push(c)), d || []) : void 0
    },
    dequeue: function(a, b) {
        b = b || "fx";
        var c = n.queue(a, b),
            d = c.length,
            e = c.shift(),
            f = n._queueHooks(a, b),
            g = function() {
                n.dequeue(a, b)
            };
        "inprogress" === e && (e = c.shift(), d--), e && ("fx" === b && c.unshift("inprogress"), delete f.stop, e.call(a, g, f)), !d && f && f.empty.fire()
    },
    _queueHooks: function(a, b) {
        var c = b + "queueHooks";
        return n._data(a, c) || n._data(a, c, {
            empty: n.Callbacks("once memory").add(function() {
                n._removeData(a, b + "queue"), n._removeData(a, c)
            })
        })
    }
}), n.fn.extend({
    queue: function(a, b) {
        var c = 2;
        return "string" != typeof a && (b = a, a = "fx", c--), arguments.length < c ? n.queue(this[0], a) : void 0 === b ? this : this.each(function() {
            var c = n.queue(this, a, b);
            n._queueHooks(this, a), "fx" === a && "inprogress" !== c[0] && n.dequeue(this, a)
        })
    },
    dequeue: function(a) {
        return this.each(function() {
            n.dequeue(this, a)
        })
    },
    clearQueue: function(a) {
        return this.queue(a || "fx", [])
    },
    promise: function(a, b) {
        var c, d = 1,
            e = n.Deferred(),
            f = this,
            g = this.length,
            h = function() {
                --d || e.resolveWith(f, [f])
            };
        "string" != typeof a && (b = a, a = void 0), a = a || "fx";
        while (g--) c = n._data(f[g], a + "queueHooks"), c && c.empty && (d++, c.empty.add(h));
        return h(), e.promise(b)
    }
});
var T = /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/.source,
    U = ["Top", "Right", "Bottom", "Left"],
    V = function(a, b) {
        return a = b || a, "none" === n.css(a, "display") || !n.contains(a.ownerDocument, a)
    },
    W = n.access = function(a, b, c, d, e, f, g) {
        var h = 0,
            i = a.length,
            j = null == c;
        if ("object" === n.type(c)) {
            e = !0;
            for (h in c) n.access(a, b, h, c[h], !0, f, g)
        } else if (void 0 !== d && (e = !0, n.isFunction(d) || (g = !0), j && (g ? (b.call(a, d), b = null) : (j = b, b = function(a, b, c) {
                return j.call(n(a), c)
            })), b))
            for (; i > h; h++) b(a[h], c, g ? d : d.call(a[h], h, b(a[h], c)));
        return e ? a : j ? b.call(a) : i ? b(a[0], c) : f
    },
    X = /^(?:checkbox|radio)$/i;
! function() {
    var a = z.createDocumentFragment(),
        b = z.createElement("div"),
        c = z.createElement("input");
    if (b.setAttribute("className", "t"), b.innerHTML = "  <link/><table></table><a href='/a'>a</a>", l.leadingWhitespace = 3 === b.firstChild.nodeType, l.tbody = !b.getElementsByTagName("tbody").length, l.htmlSerialize = !!b.getElementsByTagName("link").length, l.html5Clone = "<:nav></:nav>" !== z.createElement("nav").cloneNode(!0).outerHTML, c.type = "checkbox", c.checked = !0, a.appendChild(c), l.appendChecked = c.checked, b.innerHTML = "<textarea>x</textarea>", l.noCloneChecked = !!b.cloneNode(!0).lastChild.defaultValue, a.appendChild(b), b.innerHTML = "<input type='radio' checked='checked' name='t'/>", l.checkClone = b.cloneNode(!0).cloneNode(!0).lastChild.checked, l.noCloneEvent = !0, b.attachEvent && (b.attachEvent("onclick", function() {
            l.noCloneEvent = !1
        }), b.cloneNode(!0).click()), null == l.deleteExpando) {
        l.deleteExpando = !0;
        try {
            delete b.test
        } catch (d) {
            l.deleteExpando = !1
        }
    }
    a = b = c = null
}(),
function() {
    var b, c, d = z.createElement("div");
    for (b in {
            submit: !0,
            change: !0,
            focusin: !0
        }) c = "on" + b, (l[b + "Bubbles"] = c in a) || (d.setAttribute(c, "t"), l[b + "Bubbles"] = d.attributes[c].expando === !1);
    d = null
}();
var Y = /^(?:input|select|textarea)$/i,
    Z = /^key/,
    $ = /^(?:mouse|contextmenu)|click/,
    _ = /^(?:focusinfocus|focusoutblur)$/,
    ab = /^([^.]*)(?:\.(.+)|)$/;

function bb() {
    return !0
}

function cb() {
    return !1
}

function db() {
    try {
        return z.activeElement
    } catch (a) {}
}
n.event = {
    global: {},
    add: function(a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, o, p, q, r = n._data(a);
        if (r) {
            c.handler && (i = c, c = i.handler, e = i.selector), c.guid || (c.guid = n.guid++), (g = r.events) || (g = r.events = {}), (k = r.handle) || (k = r.handle = function(a) {
                return typeof n === L || a && n.event.triggered === a.type ? void 0 : n.event.dispatch.apply(k.elem, arguments)
            }, k.elem = a), b = (b || "").match(F) || [""], h = b.length;
            while (h--) f = ab.exec(b[h]) || [], o = q = f[1], p = (f[2] || "").split(".").sort(), o && (j = n.event.special[o] || {}, o = (e ? j.delegateType : j.bindType) || o, j = n.event.special[o] || {}, l = n.extend({
                type: o,
                origType: q,
                data: d,
                handler: c,
                guid: c.guid,
                selector: e,
                needsContext: e && n.expr.match.needsContext.test(e),
                namespace: p.join(".")
            }, i), (m = g[o]) || (m = g[o] = [], m.delegateCount = 0, j.setup && j.setup.call(a, d, p, k) !== !1 || (a.addEventListener ? a.addEventListener(o, k, !1) : a.attachEvent && a.attachEvent("on" + o, k))), j.add && (j.add.call(a, l), l.handler.guid || (l.handler.guid = c.guid)), e ? m.splice(m.delegateCount++, 0, l) : m.push(l), n.event.global[o] = !0);
            a = null
        }
    },
    remove: function(a, b, c, d, e) {
        var f, g, h, i, j, k, l, m, o, p, q, r = n.hasData(a) && n._data(a);
        if (r && (k = r.events)) {
            b = (b || "").match(F) || [""], j = b.length;
            while (j--)
                if (h = ab.exec(b[j]) || [], o = q = h[1], p = (h[2] || "").split(".").sort(), o) {
                    l = n.event.special[o] || {}, o = (d ? l.delegateType : l.bindType) || o, m = k[o] || [], h = h[2] && new RegExp("(^|\\.)" + p.join("\\.(?:.*\\.|)") + "(\\.|$)"), i = f = m.length;
                    while (f--) g = m[f], !e && q !== g.origType || c && c.guid !== g.guid || h && !h.test(g.namespace) || d && d !== g.selector && ("**" !== d || !g.selector) || (m.splice(f, 1), g.selector && m.delegateCount--, l.remove && l.remove.call(a, g));
                    i && !m.length && (l.teardown && l.teardown.call(a, p, r.handle) !== !1 || n.removeEvent(a, o, r.handle), delete k[o])
                } else
                    for (o in k) n.event.remove(a, o + b[j], c, d, !0);
            n.isEmptyObject(k) && (delete r.handle, n._removeData(a, "events"))
        }
    },
    trigger: function(b, c, d, e) {
        var f, g, h, i, k, l, m, o = [d || z],
            p = j.call(b, "type") ? b.type : b,
            q = j.call(b, "namespace") ? b.namespace.split(".") : [];
        if (h = l = d = d || z, 3 !== d.nodeType && 8 !== d.nodeType && !_.test(p + n.event.triggered) && (p.indexOf(".") >= 0 && (q = p.split("."), p = q.shift(), q.sort()), g = p.indexOf(":") < 0 && "on" + p, b = b[n.expando] ? b : new n.Event(p, "object" == typeof b && b), b.isTrigger = e ? 2 : 3, b.namespace = q.join("."), b.namespace_re = b.namespace ? new RegExp("(^|\\.)" + q.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, b.result = void 0, b.target || (b.target = d), c = null == c ? [b] : n.makeArray(c, [b]), k = n.event.special[p] || {}, e || !k.trigger || k.trigger.apply(d, c) !== !1)) {
            if (!e && !k.noBubble && !n.isWindow(d)) {
                for (i = k.delegateType || p, _.test(i + p) || (h = h.parentNode); h; h = h.parentNode) o.push(h), l = h;
                l === (d.ownerDocument || z) && o.push(l.defaultView || l.parentWindow || a)
            }
            m = 0;
            while ((h = o[m++]) && !b.isPropagationStopped()) b.type = m > 1 ? i : k.bindType || p, f = (n._data(h, "events") || {})[b.type] && n._data(h, "handle"), f && f.apply(h, c), f = g && h[g], f && f.apply && n.acceptData(h) && (b.result = f.apply(h, c), b.result === !1 && b.preventDefault());
            if (b.type = p, !e && !b.isDefaultPrevented() && (!k._default || k._default.apply(o.pop(), c) === !1) && n.acceptData(d) && g && d[p] && !n.isWindow(d)) {
                l = d[g], l && (d[g] = null), n.event.triggered = p;
                try {
                    d[p]()
                } catch (r) {}
                n.event.triggered = void 0, l && (d[g] = l)
            }
            return b.result
        }
    },
    dispatch: function(a) {
        a = n.event.fix(a);
        var b, c, e, f, g, h = [],
            i = d.call(arguments),
            j = (n._data(this, "events") || {})[a.type] || [],
            k = n.event.special[a.type] || {};
        if (i[0] = a, a.delegateTarget = this, !k.preDispatch || k.preDispatch.call(this, a) !== !1) {
            h = n.event.handlers.call(this, a, j), b = 0;
            while ((f = h[b++]) && !a.isPropagationStopped()) {
                a.currentTarget = f.elem, g = 0;
                while ((e = f.handlers[g++]) && !a.isImmediatePropagationStopped())(!a.namespace_re || a.namespace_re.test(e.namespace)) && (a.handleObj = e, a.data = e.data, c = ((n.event.special[e.origType] || {}).handle || e.handler).apply(f.elem, i), void 0 !== c && (a.result = c) === !1 && (a.preventDefault(), a.stopPropagation()))
            }
            return k.postDispatch && k.postDispatch.call(this, a), a.result
        }
    },
    handlers: function(a, b) {
        var c, d, e, f, g = [],
            h = b.delegateCount,
            i = a.target;
        if (h && i.nodeType && (!a.button || "click" !== a.type))
            for (; i != this; i = i.parentNode || this)
                if (1 === i.nodeType && (i.disabled !== !0 || "click" !== a.type)) {
                    for (e = [], f = 0; h > f; f++) d = b[f], c = d.selector + " ", void 0 === e[c] && (e[c] = d.needsContext ? n(c, this).index(i) >= 0 : n.find(c, this, null, [i]).length), e[c] && e.push(d);
                    e.length && g.push({
                        elem: i,
                        handlers: e
                    })
                } return h < b.length && g.push({
            elem: this,
            handlers: b.slice(h)
        }), g
    },
    fix: function(a) {
        if (a[n.expando]) return a;
        var b, c, d, e = a.type,
            f = a,
            g = this.fixHooks[e];
        g || (this.fixHooks[e] = g = $.test(e) ? this.mouseHooks : Z.test(e) ? this.keyHooks : {}), d = g.props ? this.props.concat(g.props) : this.props, a = new n.Event(f), b = d.length;
        while (b--) c = d[b], a[c] = f[c];
        return a.target || (a.target = f.srcElement || z), 3 === a.target.nodeType && (a.target = a.target.parentNode), a.metaKey = !!a.metaKey, g.filter ? g.filter(a, f) : a
    },
    props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),
    fixHooks: {},
    keyHooks: {
        props: "char charCode key keyCode".split(" "),
        filter: function(a, b) {
            return null == a.which && (a.which = null != b.charCode ? b.charCode : b.keyCode), a
        }
    },
    mouseHooks: {
        props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
        filter: function(a, b) {
            var c, d, e, f = b.button,
                g = b.fromElement;
            return null == a.pageX && null != b.clientX && (d = a.target.ownerDocument || z, e = d.documentElement, c = d.body, a.pageX = b.clientX + (e && e.scrollLeft || c && c.scrollLeft || 0) - (e && e.clientLeft || c && c.clientLeft || 0), a.pageY = b.clientY + (e && e.scrollTop || c && c.scrollTop || 0) - (e && e.clientTop || c && c.clientTop || 0)), !a.relatedTarget && g && (a.relatedTarget = g === a.target ? b.toElement : g), a.which || void 0 === f || (a.which = 1 & f ? 1 : 2 & f ? 3 : 4 & f ? 2 : 0), a
        }
    },
    special: {
        load: {
            noBubble: !0
        },
        focus: {
            trigger: function() {
                if (this !== db() && this.focus) try {
                    return this.focus(), !1
                } catch (a) {}
            },
            delegateType: "focusin"
        },
        blur: {
            trigger: function() {
                return this === db() && this.blur ? (this.blur(), !1) : void 0
            },
            delegateType: "focusout"
        },
        click: {
            trigger: function() {
                return n.nodeName(this, "input") && "checkbox" === this.type && this.click ? (this.click(), !1) : void 0
            },
            _default: function(a) {
                return n.nodeName(a.target, "a")
            }
        },
        beforeunload: {
            postDispatch: function(a) {
                void 0 !== a.result && (a.originalEvent.returnValue = a.result)
            }
        }
    },
    simulate: function(a, b, c, d) {
        var e = n.extend(new n.Event, c, {
            type: a,
            isSimulated: !0,
            originalEvent: {}
        });
        d ? n.event.trigger(e, null, b) : n.event.dispatch.call(b, e), e.isDefaultPrevented() && c.preventDefault()
    }
}, n.removeEvent = z.removeEventListener ? function(a, b, c) {
    a.removeEventListener && a.removeEventListener(b, c, !1)
} : function(a, b, c) {
    var d = "on" + b;
    a.detachEvent && (typeof a[d] === L && (a[d] = null), a.detachEvent(d, c))
}, n.Event = function(a, b) {
    return this instanceof n.Event ? (a && a.type ? (this.originalEvent = a, this.type = a.type, this.isDefaultPrevented = a.defaultPrevented || void 0 === a.defaultPrevented && (a.returnValue === !1 || a.getPreventDefault && a.getPreventDefault()) ? bb : cb) : this.type = a, b && n.extend(this, b), this.timeStamp = a && a.timeStamp || n.now(), void(this[n.expando] = !0)) : new n.Event(a, b)
}, n.Event.prototype = {
    isDefaultPrevented: cb,
    isPropagationStopped: cb,
    isImmediatePropagationStopped: cb,
    preventDefault: function() {
        var a = this.originalEvent;
        this.isDefaultPrevented = bb, a && (a.preventDefault ? a.preventDefault() : a.returnValue = !1)
    },
    stopPropagation: function() {
        var a = this.originalEvent;
        this.isPropagationStopped = bb, a && (a.stopPropagation && a.stopPropagation(), a.cancelBubble = !0)
    },
    stopImmediatePropagation: function() {
        this.isImmediatePropagationStopped = bb, this.stopPropagation()
    }
}, n.each({
    mouseenter: "mouseover",
    mouseleave: "mouseout"
}, function(a, b) {
    n.event.special[a] = {
        delegateType: b,
        bindType: b,
        handle: function(a) {
            var c, d = this,
                e = a.relatedTarget,
                f = a.handleObj;
            return (!e || e !== d && !n.contains(d, e)) && (a.type = f.origType, c = f.handler.apply(this, arguments), a.type = b), c
        }
    }
}), l.submitBubbles || (n.event.special.submit = {
    setup: function() {
        return n.nodeName(this, "form") ? !1 : void n.event.add(this, "click._submit keypress._submit", function(a) {
            var b = a.target,
                c = n.nodeName(b, "input") || n.nodeName(b, "button") ? b.form : void 0;
            c && !n._data(c, "submitBubbles") && (n.event.add(c, "submit._submit", function(a) {
                a._submit_bubble = !0
            }), n._data(c, "submitBubbles", !0))
        })
    },
    postDispatch: function(a) {
        a._submit_bubble && (delete a._submit_bubble, this.parentNode && !a.isTrigger && n.event.simulate("submit", this.parentNode, a, !0))
    },
    teardown: function() {
        return n.nodeName(this, "form") ? !1 : void n.event.remove(this, "._submit")
    }
}), l.changeBubbles || (n.event.special.change = {
    setup: function() {
        return Y.test(this.nodeName) ? (("checkbox" === this.type || "radio" === this.type) && (n.event.add(this, "propertychange._change", function(a) {
            "checked" === a.originalEvent.propertyName && (this._just_changed = !0)
        }), n.event.add(this, "click._change", function(a) {
            this._just_changed && !a.isTrigger && (this._just_changed = !1), n.event.simulate("change", this, a, !0)
        })), !1) : void n.event.add(this, "beforeactivate._change", function(a) {
            var b = a.target;
            Y.test(b.nodeName) && !n._data(b, "changeBubbles") && (n.event.add(b, "change._change", function(a) {
                !this.parentNode || a.isSimulated || a.isTrigger || n.event.simulate("change", this.parentNode, a, !0)
            }), n._data(b, "changeBubbles", !0))
        })
    },
    handle: function(a) {
        var b = a.target;
        return this !== b || a.isSimulated || a.isTrigger || "radio" !== b.type && "checkbox" !== b.type ? a.handleObj.handler.apply(this, arguments) : void 0
    },
    teardown: function() {
        return n.event.remove(this, "._change"), !Y.test(this.nodeName)
    }
}), l.focusinBubbles || n.each({
    focus: "focusin",
    blur: "focusout"
}, function(a, b) {
    var c = function(a) {
        n.event.simulate(b, a.target, n.event.fix(a), !0)
    };
    n.event.special[b] = {
        setup: function() {
            var d = this.ownerDocument || this,
                e = n._data(d, b);
            e || d.addEventListener(a, c, !0), n._data(d, b, (e || 0) + 1)
        },
        teardown: function() {
            var d = this.ownerDocument || this,
                e = n._data(d, b) - 1;
            e ? n._data(d, b, e) : (d.removeEventListener(a, c, !0), n._removeData(d, b))
        }
    }
}), n.fn.extend({
    on: function(a, b, c, d, e) {
        var f, g;
        if ("object" == typeof a) {
            "string" != typeof b && (c = c || b, b = void 0);
            for (f in a) this.on(f, b, c, a[f], e);
            return this
        }
        if (null == c && null == d ? (d = b, c = b = void 0) : null == d && ("string" == typeof b ? (d = c, c = void 0) : (d = c, c = b, b = void 0)), d === !1) d = cb;
        else if (!d) return this;
        return 1 === e && (g = d, d = function(a) {
            return n().off(a), g.apply(this, arguments)
        }, d.guid = g.guid || (g.guid = n.guid++)), this.each(function() {
            n.event.add(this, a, d, c, b)
        })
    },
    one: function(a, b, c, d) {
        return this.on(a, b, c, d, 1)
    },
    off: function(a, b, c) {
        var d, e;
        if (a && a.preventDefault && a.handleObj) return d = a.handleObj, n(a.delegateTarget).off(d.namespace ? d.origType + "." + d.namespace : d.origType, d.selector, d.handler), this;
        if ("object" == typeof a) {
            for (e in a) this.off(e, b, a[e]);
            return this
        }
        return (b === !1 || "function" == typeof b) && (c = b, b = void 0), c === !1 && (c = cb), this.each(function() {
            n.event.remove(this, a, c, b)
        })
    },
    trigger: function(a, b) {
        return this.each(function() {
            n.event.trigger(a, b, this)
        })
    },
    triggerHandler: function(a, b) {
        var c = this[0];
        return c ? n.event.trigger(a, b, c, !0) : void 0
    }
});

function eb(a) {
    var b = fb.split("|"),
        c = a.createDocumentFragment();
    if (c.createElement)
        while (b.length) c.createElement(b.pop());
    return c
}
var fb = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video",
    gb = / jQuery\d+="(?:null|\d+)"/g,
    hb = new RegExp("<(?:" + fb + ")[\\s/>]", "i"),
    ib = /^\s+/,
    jb = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
    kb = /<([\w:]+)/,
    lb = /<tbody/i,
    mb = /<|&#?\w+;/,
    nb = /<(?:script|style|link)/i,
    ob = /checked\s*(?:[^=]|=\s*.checked.)/i,
    pb = /^$|\/(?:java|ecma)script/i,
    qb = /^true\/(.*)/,
    rb = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,
    sb = {
        option: [1, "<select multiple='multiple'>", "</select>"],
        legend: [1, "<fieldset>", "</fieldset>"],
        area: [1, "<map>", "</map>"],
        param: [1, "<object>", "</object>"],
        thead: [1, "<table>", "</table>"],
        tr: [2, "<table><tbody>", "</tbody></table>"],
        col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
        td: [3, "<table><tbody><tr>", "</tr></tbody></table>"],
        _default: l.htmlSerialize ? [0, "", ""] : [1, "X<div>", "</div>"]
    },
    tb = eb(z),
    ub = tb.appendChild(z.createElement("div"));
sb.optgroup = sb.option, sb.tbody = sb.tfoot = sb.colgroup = sb.caption = sb.thead, sb.th = sb.td;

function vb(a, b) {
    var c, d, e = 0,
        f = typeof a.getElementsByTagName !== L ? a.getElementsByTagName(b || "*") : typeof a.querySelectorAll !== L ? a.querySelectorAll(b || "*") : void 0;
    if (!f)
        for (f = [], c = a.childNodes || a; null != (d = c[e]); e++) !b || n.nodeName(d, b) ? f.push(d) : n.merge(f, vb(d, b));
    return void 0 === b || b && n.nodeName(a, b) ? n.merge([a], f) : f
}

function wb(a) {
    X.test(a.type) && (a.defaultChecked = a.checked)
}

function xb(a, b) {
    return n.nodeName(a, "table") && n.nodeName(11 !== b.nodeType ? b : b.firstChild, "tr") ? a.getElementsByTagName("tbody")[0] || a.appendChild(a.ownerDocument.createElement("tbody")) : a
}

function yb(a) {
    return a.type = (null !== n.find.attr(a, "type")) + "/" + a.type, a
}

function zb(a) {
    var b = qb.exec(a.type);
    return b ? a.type = b[1] : a.removeAttribute("type"), a
}

function Ab(a, b) {
    for (var c, d = 0; null != (c = a[d]); d++) n._data(c, "globalEval", !b || n._data(b[d], "globalEval"))
}

function Bb(a, b) {
    if (1 === b.nodeType && n.hasData(a)) {
        var c, d, e, f = n._data(a),
            g = n._data(b, f),
            h = f.events;
        if (h) {
            delete g.handle, g.events = {};
            for (c in h)
                for (d = 0, e = h[c].length; e > d; d++) n.event.add(b, c, h[c][d])
        }
        g.data && (g.data = n.extend({}, g.data))
    }
}

function Cb(a, b) {
    var c, d, e;
    if (1 === b.nodeType) {
        if (c = b.nodeName.toLowerCase(), !l.noCloneEvent && b[n.expando]) {
            e = n._data(b);
            for (d in e.events) n.removeEvent(b, d, e.handle);
            b.removeAttribute(n.expando)
        }
        "script" === c && b.text !== a.text ? (yb(b).text = a.text, zb(b)) : "object" === c ? (b.parentNode && (b.outerHTML = a.outerHTML), l.html5Clone && a.innerHTML && !n.trim(b.innerHTML) && (b.innerHTML = a.innerHTML)) : "input" === c && X.test(a.type) ? (b.defaultChecked = b.checked = a.checked, b.value !== a.value && (b.value = a.value)) : "option" === c ? b.defaultSelected = b.selected = a.defaultSelected : ("input" === c || "textarea" === c) && (b.defaultValue = a.defaultValue)
    }
}
n.extend({
    clone: function(a, b, c) {
        var d, e, f, g, h, i = n.contains(a.ownerDocument, a);
        if (l.html5Clone || n.isXMLDoc(a) || !hb.test("<" + a.nodeName + ">") ? f = a.cloneNode(!0) : (ub.innerHTML = a.outerHTML, ub.removeChild(f = ub.firstChild)), !(l.noCloneEvent && l.noCloneChecked || 1 !== a.nodeType && 11 !== a.nodeType || n.isXMLDoc(a)))
            for (d = vb(f), h = vb(a), g = 0; null != (e = h[g]); ++g) d[g] && Cb(e, d[g]);
        if (b)
            if (c)
                for (h = h || vb(a), d = d || vb(f), g = 0; null != (e = h[g]); g++) Bb(e, d[g]);
            else Bb(a, f);
        return d = vb(f, "script"), d.length > 0 && Ab(d, !i && vb(a, "script")), d = h = e = null, f
    },
    buildFragment: function(a, b, c, d) {
        for (var e, f, g, h, i, j, k, m = a.length, o = eb(b), p = [], q = 0; m > q; q++)
            if (f = a[q], f || 0 === f)
                if ("object" === n.type(f)) n.merge(p, f.nodeType ? [f] : f);
                else if (mb.test(f)) {
            h = h || o.appendChild(b.createElement("div")), i = (kb.exec(f) || ["", ""])[1].toLowerCase(), k = sb[i] || sb._default, h.innerHTML = k[1] + f.replace(jb, "<$1></$2>") + k[2], e = k[0];
            while (e--) h = h.lastChild;
            if (!l.leadingWhitespace && ib.test(f) && p.push(b.createTextNode(ib.exec(f)[0])), !l.tbody) {
                f = "table" !== i || lb.test(f) ? "<table>" !== k[1] || lb.test(f) ? 0 : h : h.firstChild, e = f && f.childNodes.length;
                while (e--) n.nodeName(j = f.childNodes[e], "tbody") && !j.childNodes.length && f.removeChild(j)
            }
            n.merge(p, h.childNodes), h.textContent = "";
            while (h.firstChild) h.removeChild(h.firstChild);
            h = o.lastChild
        } else p.push(b.createTextNode(f));
        h && o.removeChild(h), l.appendChecked || n.grep(vb(p, "input"), wb), q = 0;
        while (f = p[q++])
            if ((!d || -1 === n.inArray(f, d)) && (g = n.contains(f.ownerDocument, f), h = vb(o.appendChild(f), "script"), g && Ab(h), c)) {
                e = 0;
                while (f = h[e++]) pb.test(f.type || "") && c.push(f)
            } return h = null, o
    },
    cleanData: function(a, b) {
        for (var d, e, f, g, h = 0, i = n.expando, j = n.cache, k = l.deleteExpando, m = n.event.special; null != (d = a[h]); h++)
            if ((b || n.acceptData(d)) && (f = d[i], g = f && j[f])) {
                if (g.events)
                    for (e in g.events) m[e] ? n.event.remove(d, e) : n.removeEvent(d, e, g.handle);
                j[f] && (delete j[f], k ? delete d[i] : typeof d.removeAttribute !== L ? d.removeAttribute(i) : d[i] = null, c.push(f))
            }
    }
}), n.fn.extend({
    text: function(a) {
        return W(this, function(a) {
            return void 0 === a ? n.text(this) : this.empty().append((this[0] && this[0].ownerDocument || z).createTextNode(a))
        }, null, a, arguments.length)
    },
    append: function() {
        return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = xb(this, a);
                b.appendChild(a)
            }
        })
    },
    prepend: function() {
        return this.domManip(arguments, function(a) {
            if (1 === this.nodeType || 11 === this.nodeType || 9 === this.nodeType) {
                var b = xb(this, a);
                b.insertBefore(a, b.firstChild)
            }
        })
    },
    before: function() {
        return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this)
        })
    },
    after: function() {
        return this.domManip(arguments, function(a) {
            this.parentNode && this.parentNode.insertBefore(a, this.nextSibling)
        })
    },
    remove: function(a, b) {
        for (var c, d = a ? n.filter(a, this) : this, e = 0; null != (c = d[e]); e++) b || 1 !== c.nodeType || n.cleanData(vb(c)), c.parentNode && (b && n.contains(c.ownerDocument, c) && Ab(vb(c, "script")), c.parentNode.removeChild(c));
        return this
    },
    empty: function() {
        for (var a, b = 0; null != (a = this[b]); b++) {
            1 === a.nodeType && n.cleanData(vb(a, !1));
            while (a.firstChild) a.removeChild(a.firstChild);
            a.options && n.nodeName(a, "select") && (a.options.length = 0)
        }
        return this
    },
    clone: function(a, b) {
        return a = null == a ? !1 : a, b = null == b ? a : b, this.map(function() {
            return n.clone(this, a, b)
        })
    },
    html: function(a) {
        return W(this, function(a) {
            var b = this[0] || {},
                c = 0,
                d = this.length;
            if (void 0 === a) return 1 === b.nodeType ? b.innerHTML.replace(gb, "") : void 0;
            if (!("string" != typeof a || nb.test(a) || !l.htmlSerialize && hb.test(a) || !l.leadingWhitespace && ib.test(a) || sb[(kb.exec(a) || ["", ""])[1].toLowerCase()])) {
                a = a.replace(jb, "<$1></$2>");
                try {
                    for (; d > c; c++) b = this[c] || {}, 1 === b.nodeType && (n.cleanData(vb(b, !1)), b.innerHTML = a);
                    b = 0
                } catch (e) {}
            }
            b && this.empty().append(a)
        }, null, a, arguments.length)
    },
    replaceWith: function() {
        var a = arguments[0];
        return this.domManip(arguments, function(b) {
            a = this.parentNode, n.cleanData(vb(this)), a && a.replaceChild(b, this)
        }), a && (a.length || a.nodeType) ? this : this.remove()
    },
    detach: function(a) {
        return this.remove(a, !0)
    },
    domManip: function(a, b) {
        a = e.apply([], a);
        var c, d, f, g, h, i, j = 0,
            k = this.length,
            m = this,
            o = k - 1,
            p = a[0],
            q = n.isFunction(p);
        if (q || k > 1 && "string" == typeof p && !l.checkClone && ob.test(p)) return this.each(function(c) {
            var d = m.eq(c);
            q && (a[0] = p.call(this, c, d.html())), d.domManip(a, b)
        });
        if (k && (i = n.buildFragment(a, this[0].ownerDocument, !1, this), c = i.firstChild, 1 === i.childNodes.length && (i = c), c)) {
            for (g = n.map(vb(i, "script"), yb), f = g.length; k > j; j++) d = i, j !== o && (d = n.clone(d, !0, !0), f && n.merge(g, vb(d, "script"))), b.call(this[j], d, j);
            if (f)
                for (h = g[g.length - 1].ownerDocument, n.map(g, zb), j = 0; f > j; j++) d = g[j], pb.test(d.type || "") && !n._data(d, "globalEval") && n.contains(h, d) && (d.src ? n._evalUrl && n._evalUrl(d.src) : n.globalEval((d.text || d.textContent || d.innerHTML || "").replace(rb, "")));
            i = c = null
        }
        return this
    }
}), n.each({
    appendTo: "append",
    prependTo: "prepend",
    insertBefore: "before",
    insertAfter: "after",
    replaceAll: "replaceWith"
}, function(a, b) {
    n.fn[a] = function(a) {
        for (var c, d = 0, e = [], g = n(a), h = g.length - 1; h >= d; d++) c = d === h ? this : this.clone(!0), n(g[d])[b](c), f.apply(e, c.get());
        return this.pushStack(e)
    }
});
var Db, Eb = {};

function Fb(b, c) {
    var d = n(c.createElement(b)).appendTo(c.body),
        e = a.getDefaultComputedStyle ? a.getDefaultComputedStyle(d[0]).display : n.css(d[0], "display");
    return d.detach(), e
}

function Gb(a) {
    var b = z,
        c = Eb[a];
    return c || (c = Fb(a, b), "none" !== c && c || (Db = (Db || n("<iframe frameborder='0' width='0' height='0'/>")).appendTo(b.documentElement), b = (Db[0].contentWindow || Db[0].contentDocument).document, b.write(), b.close(), c = Fb(a, b), Db.detach()), Eb[a] = c), c
}! function() {
    var a, b, c = z.createElement("div"),
        d = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
    c.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = c.getElementsByTagName("a")[0], a.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(a.style.opacity), l.cssFloat = !!a.style.cssFloat, c.style.backgroundClip = "content-box", c.cloneNode(!0).style.backgroundClip = "", l.clearCloneStyle = "content-box" === c.style.backgroundClip, a = c = null, l.shrinkWrapBlocks = function() {
        var a, c, e, f;
        if (null == b) {
            if (a = z.getElementsByTagName("body")[0], !a) return;
            f = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px", c = z.createElement("div"), e = z.createElement("div"), a.appendChild(c).appendChild(e), b = !1, typeof e.style.zoom !== L && (e.style.cssText = d + ";width:1px;padding:1px;zoom:1", e.innerHTML = "<div></div>", e.firstChild.style.width = "5px", b = 3 !== e.offsetWidth), a.removeChild(c), a = c = e = null
        }
        return b
    }
}();
var Hb = /^margin/,
    Ib = new RegExp("^(" + T + ")(?!px)[a-z%]+$", "i"),
    Jb, Kb, Lb = /^(top|right|bottom|left)$/;
a.getComputedStyle ? (Jb = function(a) {
    return a.ownerDocument.defaultView.getComputedStyle(a, null)
}, Kb = function(a, b, c) {
    var d, e, f, g, h = a.style;
    return c = c || Jb(a), g = c ? c.getPropertyValue(b) || c[b] : void 0, c && ("" !== g || n.contains(a.ownerDocument, a) || (g = n.style(a, b)), Ib.test(g) && Hb.test(b) && (d = h.width, e = h.minWidth, f = h.maxWidth, h.minWidth = h.maxWidth = h.width = g, g = c.width, h.width = d, h.minWidth = e, h.maxWidth = f)), void 0 === g ? g : g + ""
}) : z.documentElement.currentStyle && (Jb = function(a) {
    return a.currentStyle
}, Kb = function(a, b, c) {
    var d, e, f, g, h = a.style;
    return c = c || Jb(a), g = c ? c[b] : void 0, null == g && h && h[b] && (g = h[b]), Ib.test(g) && !Lb.test(b) && (d = h.left, e = a.runtimeStyle, f = e && e.left, f && (e.left = a.currentStyle.left), h.left = "fontSize" === b ? "1em" : g, g = h.pixelLeft + "px", h.left = d, f && (e.left = f)), void 0 === g ? g : g + "" || "auto"
});

function Mb(a, b) {
    return {
        get: function() {
            var c = a();
            if (null != c) return c ? void delete this.get : (this.get = b).apply(this, arguments)
        }
    }
}! function() {
    var b, c, d, e, f, g, h = z.createElement("div"),
        i = "border:0;width:0;height:0;position:absolute;top:0;left:-9999px",
        j = "-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box;display:block;padding:0;margin:0;border:0";
    h.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", b = h.getElementsByTagName("a")[0], b.style.cssText = "float:left;opacity:.5", l.opacity = /^0.5/.test(b.style.opacity), l.cssFloat = !!b.style.cssFloat, h.style.backgroundClip = "content-box", h.cloneNode(!0).style.backgroundClip = "", l.clearCloneStyle = "content-box" === h.style.backgroundClip, b = h = null, n.extend(l, {
        reliableHiddenOffsets: function() {
            if (null != c) return c;
            var a, b, d, e = z.createElement("div"),
                f = z.getElementsByTagName("body")[0];
            if (f) return e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = z.createElement("div"), a.style.cssText = i, f.appendChild(a).appendChild(e), e.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", b = e.getElementsByTagName("td"), b[0].style.cssText = "padding:0;margin:0;border:0;display:none", d = 0 === b[0].offsetHeight, b[0].style.display = "", b[1].style.display = "none", c = d && 0 === b[0].offsetHeight, f.removeChild(a), e = f = null, c
        },
        boxSizing: function() {
            return null == d && k(), d
        },
        boxSizingReliable: function() {
            return null == e && k(), e
        },
        pixelPosition: function() {
            return null == f && k(), f
        },
        reliableMarginRight: function() {
            var b, c, d, e;
            if (null == g && a.getComputedStyle) {
                if (b = z.getElementsByTagName("body")[0], !b) return;
                c = z.createElement("div"), d = z.createElement("div"), c.style.cssText = i, b.appendChild(c).appendChild(d), e = d.appendChild(z.createElement("div")), e.style.cssText = d.style.cssText = j, e.style.marginRight = e.style.width = "0", d.style.width = "1px", g = !parseFloat((a.getComputedStyle(e, null) || {}).marginRight), b.removeChild(c)
            }
            return g
        }
    });

    function k() {
        var b, c, h = z.getElementsByTagName("body")[0];
        h && (b = z.createElement("div"), c = z.createElement("div"), b.style.cssText = i, h.appendChild(b).appendChild(c), c.style.cssText = "-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;position:absolute;display:block;padding:1px;border:1px;width:4px;margin-top:1%;top:1%", n.swap(h, null != h.style.zoom ? {
            zoom: 1
        } : {}, function() {
            d = 4 === c.offsetWidth
        }), e = !0, f = !1, g = !0, a.getComputedStyle && (f = "1%" !== (a.getComputedStyle(c, null) || {}).top, e = "4px" === (a.getComputedStyle(c, null) || {
            width: "4px"
        }).width), h.removeChild(b), c = h = null)
    }
}(), n.swap = function(a, b, c, d) {
    var e, f, g = {};
    for (f in b) g[f] = a.style[f], a.style[f] = b[f];
    e = c.apply(a, d || []);
    for (f in b) a.style[f] = g[f];
    return e
};
var Nb = /alpha\([^)]*\)/i,
    Ob = /opacity\s*=\s*([^)]*)/,
    Pb = /^(none|table(?!-c[ea]).+)/,
    Qb = new RegExp("^(" + T + ")(.*)$", "i"),
    Rb = new RegExp("^([+-])=(" + T + ")", "i"),
    Sb = {
        position: "absolute",
        visibility: "hidden",
        display: "block"
    },
    Tb = {
        letterSpacing: 0,
        fontWeight: 400
    },
    Ub = ["Webkit", "O", "Moz", "ms"];

function Vb(a, b) {
    if (b in a) return b;
    var c = b.charAt(0).toUpperCase() + b.slice(1),
        d = b,
        e = Ub.length;
    while (e--)
        if (b = Ub[e] + c, b in a) return b;
    return d
}

function Wb(a, b) {
    for (var c, d, e, f = [], g = 0, h = a.length; h > g; g++) d = a[g], d.style && (f[g] = n._data(d, "olddisplay"), c = d.style.display, b ? (f[g] || "none" !== c || (d.style.display = ""), "" === d.style.display && V(d) && (f[g] = n._data(d, "olddisplay", Gb(d.nodeName)))) : f[g] || (e = V(d), (c && "none" !== c || !e) && n._data(d, "olddisplay", e ? c : n.css(d, "display"))));
    for (g = 0; h > g; g++) d = a[g], d.style && (b && "none" !== d.style.display && "" !== d.style.display || (d.style.display = b ? f[g] || "" : "none"));
    return a
}

function Xb(a, b, c) {
    var d = Qb.exec(b);
    return d ? Math.max(0, d[1] - (c || 0)) + (d[2] || "px") : b
}

function Yb(a, b, c, d, e) {
    for (var f = c === (d ? "border" : "content") ? 4 : "width" === b ? 1 : 0, g = 0; 4 > f; f += 2) "margin" === c && (g += n.css(a, c + U[f], !0, e)), d ? ("content" === c && (g -= n.css(a, "padding" + U[f], !0, e)), "margin" !== c && (g -= n.css(a, "border" + U[f] + "Width", !0, e))) : (g += n.css(a, "padding" + U[f], !0, e), "padding" !== c && (g += n.css(a, "border" + U[f] + "Width", !0, e)));
    return g
}

function Zb(a, b, c) {
    var d = !0,
        e = "width" === b ? a.offsetWidth : a.offsetHeight,
        f = Jb(a),
        g = l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, f);
    if (0 >= e || null == e) {
        if (e = Kb(a, b, f), (0 > e || null == e) && (e = a.style[b]), Ib.test(e)) return e;
        d = g && (l.boxSizingReliable() || e === a.style[b]), e = parseFloat(e) || 0
    }
    return e + Yb(a, b, c || (g ? "border" : "content"), d, f) + "px"
}
n.extend({
    cssHooks: {
        opacity: {
            get: function(a, b) {
                if (b) {
                    var c = Kb(a, "opacity");
                    return "" === c ? "1" : c
                }
            }
        }
    },
    cssNumber: {
        columnCount: !0,
        fillOpacity: !0,
        fontWeight: !0,
        lineHeight: !0,
        opacity: !0,
        order: !0,
        orphans: !0,
        widows: !0,
        zIndex: !0,
        zoom: !0
    },
    cssProps: {
        "float": l.cssFloat ? "cssFloat" : "styleFloat"
    },
    style: function(a, b, c, d) {
        if (a && 3 !== a.nodeType && 8 !== a.nodeType && a.style) {
            var e, f, g, h = n.camelCase(b),
                i = a.style;
            if (b = n.cssProps[h] || (n.cssProps[h] = Vb(i, h)), g = n.cssHooks[b] || n.cssHooks[h], void 0 === c) return g && "get" in g && void 0 !== (e = g.get(a, !1, d)) ? e : i[b];
            if (f = typeof c, "string" === f && (e = Rb.exec(c)) && (c = (e[1] + 1) * e[2] + parseFloat(n.css(a, b)), f = "number"), null != c && c === c && ("number" !== f || n.cssNumber[h] || (c += "px"), l.clearCloneStyle || "" !== c || 0 !== b.indexOf("background") || (i[b] = "inherit"), !(g && "set" in g && void 0 === (c = g.set(a, c, d))))) try {
                i[b] = "", i[b] = c
            } catch (j) {}
        }
    },
    css: function(a, b, c, d) {
        var e, f, g, h = n.camelCase(b);
        return b = n.cssProps[h] || (n.cssProps[h] = Vb(a.style, h)), g = n.cssHooks[b] || n.cssHooks[h], g && "get" in g && (f = g.get(a, !0, c)), void 0 === f && (f = Kb(a, b, d)), "normal" === f && b in Tb && (f = Tb[b]), "" === c || c ? (e = parseFloat(f), c === !0 || n.isNumeric(e) ? e || 0 : f) : f
    }
}), n.each(["height", "width"], function(a, b) {
    n.cssHooks[b] = {
        get: function(a, c, d) {
            return c ? 0 === a.offsetWidth && Pb.test(n.css(a, "display")) ? n.swap(a, Sb, function() {
                return Zb(a, b, d)
            }) : Zb(a, b, d) : void 0
        },
        set: function(a, c, d) {
            var e = d && Jb(a);
            return Xb(a, c, d ? Yb(a, b, d, l.boxSizing() && "border-box" === n.css(a, "boxSizing", !1, e), e) : 0)
        }
    }
}), l.opacity || (n.cssHooks.opacity = {
    get: function(a, b) {
        return Ob.test((b && a.currentStyle ? a.currentStyle.filter : a.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : b ? "1" : ""
    },
    set: function(a, b) {
        var c = a.style,
            d = a.currentStyle,
            e = n.isNumeric(b) ? "alpha(opacity=" + 100 * b + ")" : "",
            f = d && d.filter || c.filter || "";
        c.zoom = 1, (b >= 1 || "" === b) && "" === n.trim(f.replace(Nb, "")) && c.removeAttribute && (c.removeAttribute("filter"), "" === b || d && !d.filter) || (c.filter = Nb.test(f) ? f.replace(Nb, e) : f + " " + e)
    }
}), n.cssHooks.marginRight = Mb(l.reliableMarginRight, function(a, b) {
    return b ? n.swap(a, {
        display: "inline-block"
    }, Kb, [a, "marginRight"]) : void 0
}), n.each({
    margin: "",
    padding: "",
    border: "Width"
}, function(a, b) {
    n.cssHooks[a + b] = {
        expand: function(c) {
            for (var d = 0, e = {}, f = "string" == typeof c ? c.split(" ") : [c]; 4 > d; d++) e[a + U[d] + b] = f[d] || f[d - 2] || f[0];
            return e
        }
    }, Hb.test(a) || (n.cssHooks[a + b].set = Xb)
}), n.fn.extend({
    css: function(a, b) {
        return W(this, function(a, b, c) {
            var d, e, f = {},
                g = 0;
            if (n.isArray(b)) {
                for (d = Jb(a), e = b.length; e > g; g++) f[b[g]] = n.css(a, b[g], !1, d);
                return f
            }
            return void 0 !== c ? n.style(a, b, c) : n.css(a, b)
        }, a, b, arguments.length > 1)
    },
    show: function() {
        return Wb(this, !0)
    },
    hide: function() {
        return Wb(this)
    },
    toggle: function(a) {
        return "boolean" == typeof a ? a ? this.show() : this.hide() : this.each(function() {
            V(this) ? n(this).show() : n(this).hide()
        })
    }
});

function $b(a, b, c, d, e) {
    return new $b.prototype.init(a, b, c, d, e)
}
n.Tween = $b, $b.prototype = {
    constructor: $b,
    init: function(a, b, c, d, e, f) {
        this.elem = a, this.prop = c, this.easing = e || "swing", this.options = b, this.start = this.now = this.cur(), this.end = d, this.unit = f || (n.cssNumber[c] ? "" : "px")
    },
    cur: function() {
        var a = $b.propHooks[this.prop];
        return a && a.get ? a.get(this) : $b.propHooks._default.get(this)
    },
    run: function(a) {
        var b, c = $b.propHooks[this.prop];
        return this.pos = b = this.options.duration ? n.easing[this.easing](a, this.options.duration * a, 0, 1, this.options.duration) : a, this.now = (this.end - this.start) * b + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), c && c.set ? c.set(this) : $b.propHooks._default.set(this), this
    }
}, $b.prototype.init.prototype = $b.prototype, $b.propHooks = {
    _default: {
        get: function(a) {
            var b;
            return null == a.elem[a.prop] || a.elem.style && null != a.elem.style[a.prop] ? (b = n.css(a.elem, a.prop, ""), b && "auto" !== b ? b : 0) : a.elem[a.prop]
        },
        set: function(a) {
            n.fx.step[a.prop] ? n.fx.step[a.prop](a) : a.elem.style && (null != a.elem.style[n.cssProps[a.prop]] || n.cssHooks[a.prop]) ? n.style(a.elem, a.prop, a.now + a.unit) : a.elem[a.prop] = a.now
        }
    }
}, $b.propHooks.scrollTop = $b.propHooks.scrollLeft = {
    set: function(a) {
        a.elem.nodeType && a.elem.parentNode && (a.elem[a.prop] = a.now)
    }
}, n.easing = {
    linear: function(a) {
        return a
    },
    swing: function(a) {
        return .5 - Math.cos(a * Math.PI) / 2
    }
}, n.fx = $b.prototype.init, n.fx.step = {};
var _b, ac, bc = /^(?:toggle|show|hide)$/,
    cc = new RegExp("^(?:([+-])=|)(" + T + ")([a-z%]*)$", "i"),
    dc = /queueHooks$/,
    ec = [jc],
    fc = {
        "*": [function(a, b) {
            var c = this.createTween(a, b),
                d = c.cur(),
                e = cc.exec(b),
                f = e && e[3] || (n.cssNumber[a] ? "" : "px"),
                g = (n.cssNumber[a] || "px" !== f && +d) && cc.exec(n.css(c.elem, a)),
                h = 1,
                i = 20;
            if (g && g[3] !== f) {
                f = f || g[3], e = e || [], g = +d || 1;
                do h = h || ".5", g /= h, n.style(c.elem, a, g + f); while (h !== (h = c.cur() / d) && 1 !== h && --i)
            }
            return e && (g = c.start = +g || +d || 0, c.unit = f, c.end = e[1] ? g + (e[1] + 1) * e[2] : +e[2]), c
        }]
    };

function gc() {
    return setTimeout(function() {
        _b = void 0
    }), _b = n.now()
}

function hc(a, b) {
    var c, d = {
            height: a
        },
        e = 0;
    for (b = b ? 1 : 0; 4 > e; e += 2 - b) c = U[e], d["margin" + c] = d["padding" + c] = a;
    return b && (d.opacity = d.width = a), d
}

function ic(a, b, c) {
    for (var d, e = (fc[b] || []).concat(fc["*"]), f = 0, g = e.length; g > f; f++)
        if (d = e[f].call(c, b, a)) return d
}

function jc(a, b, c) {
    var d, e, f, g, h, i, j, k, m = this,
        o = {},
        p = a.style,
        q = a.nodeType && V(a),
        r = n._data(a, "fxshow");
    c.queue || (h = n._queueHooks(a, "fx"), null == h.unqueued && (h.unqueued = 0, i = h.empty.fire, h.empty.fire = function() {
        h.unqueued || i()
    }), h.unqueued++, m.always(function() {
        m.always(function() {
            h.unqueued--, n.queue(a, "fx").length || h.empty.fire()
        })
    })), 1 === a.nodeType && ("height" in b || "width" in b) && (c.overflow = [p.overflow, p.overflowX, p.overflowY], j = n.css(a, "display"), k = Gb(a.nodeName), "none" === j && (j = k), "inline" === j && "none" === n.css(a, "float") && (l.inlineBlockNeedsLayout && "inline" !== k ? p.zoom = 1 : p.display = "inline-block")), c.overflow && (p.overflow = "hidden", l.shrinkWrapBlocks() || m.always(function() {
        p.overflow = c.overflow[0], p.overflowX = c.overflow[1], p.overflowY = c.overflow[2]
    }));
    for (d in b)
        if (e = b[d], bc.exec(e)) {
            if (delete b[d], f = f || "toggle" === e, e === (q ? "hide" : "show")) {
                if ("show" !== e || !r || void 0 === r[d]) continue;
                q = !0
            }
            o[d] = r && r[d] || n.style(a, d)
        } if (!n.isEmptyObject(o)) {
        r ? "hidden" in r && (q = r.hidden) : r = n._data(a, "fxshow", {}), f && (r.hidden = !q), q ? n(a).show() : m.done(function() {
            n(a).hide()
        }), m.done(function() {
            var b;
            n._removeData(a, "fxshow");
            for (b in o) n.style(a, b, o[b])
        });
        for (d in o) g = ic(q ? r[d] : 0, d, m), d in r || (r[d] = g.start, q && (g.end = g.start, g.start = "width" === d || "height" === d ? 1 : 0))
    }
}

function kc(a, b) {
    var c, d, e, f, g;
    for (c in a)
        if (d = n.camelCase(c), e = b[d], f = a[c], n.isArray(f) && (e = f[1], f = a[c] = f[0]), c !== d && (a[d] = f, delete a[c]), g = n.cssHooks[d], g && "expand" in g) {
            f = g.expand(f), delete a[d];
            for (c in f) c in a || (a[c] = f[c], b[c] = e)
        } else b[d] = e
}

function lc(a, b, c) {
    var d, e, f = 0,
        g = ec.length,
        h = n.Deferred().always(function() {
            delete i.elem
        }),
        i = function() {
            if (e) return !1;
            for (var b = _b || gc(), c = Math.max(0, j.startTime + j.duration - b), d = c / j.duration || 0, f = 1 - d, g = 0, i = j.tweens.length; i > g; g++) j.tweens[g].run(f);
            return h.notifyWith(a, [j, f, c]), 1 > f && i ? c : (h.resolveWith(a, [j]), !1)
        },
        j = h.promise({
            elem: a,
            props: n.extend({}, b),
            opts: n.extend(!0, {
                specialEasing: {}
            }, c),
            originalProperties: b,
            originalOptions: c,
            startTime: _b || gc(),
            duration: c.duration,
            tweens: [],
            createTween: function(b, c) {
                var d = n.Tween(a, j.opts, b, c, j.opts.specialEasing[b] || j.opts.easing);
                return j.tweens.push(d), d
            },
            stop: function(b) {
                var c = 0,
                    d = b ? j.tweens.length : 0;
                if (e) return this;
                for (e = !0; d > c; c++) j.tweens[c].run(1);
                return b ? h.resolveWith(a, [j, b]) : h.rejectWith(a, [j, b]), this
            }
        }),
        k = j.props;
    for (kc(k, j.opts.specialEasing); g > f; f++)
        if (d = ec[f].call(j, a, k, j.opts)) return d;
    return n.map(k, ic, j), n.isFunction(j.opts.start) && j.opts.start.call(a, j), n.fx.timer(n.extend(i, {
        elem: a,
        anim: j,
        queue: j.opts.queue
    })), j.progress(j.opts.progress).done(j.opts.done, j.opts.complete).fail(j.opts.fail).always(j.opts.always)
}
n.Animation = n.extend(lc, {
        tweener: function(a, b) {
            n.isFunction(a) ? (b = a, a = ["*"]) : a = a.split(" ");
            for (var c, d = 0, e = a.length; e > d; d++) c = a[d], fc[c] = fc[c] || [], fc[c].unshift(b)
        },
        prefilter: function(a, b) {
            b ? ec.unshift(a) : ec.push(a)
        }
    }), n.speed = function(a, b, c) {
        var d = a && "object" == typeof a ? n.extend({}, a) : {
            complete: c || !c && b || n.isFunction(a) && a,
            duration: a,
            easing: c && b || b && !n.isFunction(b) && b
        };
        return d.duration = n.fx.off ? 0 : "number" == typeof d.duration ? d.duration : d.duration in n.fx.speeds ? n.fx.speeds[d.duration] : n.fx.speeds._default, (null == d.queue || d.queue === !0) && (d.queue = "fx"), d.old = d.complete, d.complete = function() {
            n.isFunction(d.old) && d.old.call(this), d.queue && n.dequeue(this, d.queue)
        }, d
    }, n.fn.extend({
        fadeTo: function(a, b, c, d) {
            return this.filter(V).css("opacity", 0).show().end().animate({
                opacity: b
            }, a, c, d)
        },
        animate: function(a, b, c, d) {
            var e = n.isEmptyObject(a),
                f = n.speed(b, c, d),
                g = function() {
                    var b = lc(this, n.extend({}, a), f);
                    (e || n._data(this, "finish")) && b.stop(!0)
                };
            return g.finish = g, e || f.queue === !1 ? this.each(g) : this.queue(f.queue, g)
        },
        stop: function(a, b, c) {
            var d = function(a) {
                var b = a.stop;
                delete a.stop, b(c)
            };
            return "string" != typeof a && (c = b, b = a, a = void 0), b && a !== !1 && this.queue(a || "fx", []), this.each(function() {
                var b = !0,
                    e = null != a && a + "queueHooks",
                    f = n.timers,
                    g = n._data(this);
                if (e) g[e] && g[e].stop && d(g[e]);
                else
                    for (e in g) g[e] && g[e].stop && dc.test(e) && d(g[e]);
                for (e = f.length; e--;) f[e].elem !== this || null != a && f[e].queue !== a || (f[e].anim.stop(c), b = !1, f.splice(e, 1));
                (b || !c) && n.dequeue(this, a)
            })
        },
        finish: function(a) {
            return a !== !1 && (a = a || "fx"), this.each(function() {
                var b, c = n._data(this),
                    d = c[a + "queue"],
                    e = c[a + "queueHooks"],
                    f = n.timers,
                    g = d ? d.length : 0;
                for (c.finish = !0, n.queue(this, a, []), e && e.stop && e.stop.call(this, !0), b = f.length; b--;) f[b].elem === this && f[b].queue === a && (f[b].anim.stop(!0), f.splice(b, 1));
                for (b = 0; g > b; b++) d[b] && d[b].finish && d[b].finish.call(this);
                delete c.finish
            })
        }
    }), n.each(["toggle", "show", "hide"], function(a, b) {
        var c = n.fn[b];
        n.fn[b] = function(a, d, e) {
            return null == a || "boolean" == typeof a ? c.apply(this, arguments) : this.animate(hc(b, !0), a, d, e)
        }
    }), n.each({
        slideDown: hc("show"),
        slideUp: hc("hide"),
        slideToggle: hc("toggle"),
        fadeIn: {
            opacity: "show"
        },
        fadeOut: {
            opacity: "hide"
        },
        fadeToggle: {
            opacity: "toggle"
        }
    }, function(a, b) {
        n.fn[a] = function(a, c, d) {
            return this.animate(b, a, c, d)
        }
    }), n.timers = [], n.fx.tick = function() {
        var a, b = n.timers,
            c = 0;
        for (_b = n.now(); c < b.length; c++) a = b[c], a() || b[c] !== a || b.splice(c--, 1);
        b.length || n.fx.stop(), _b = void 0
    }, n.fx.timer = function(a) {
        n.timers.push(a), a() ? n.fx.start() : n.timers.pop()
    }, n.fx.interval = 13, n.fx.start = function() {
        ac || (ac = setInterval(n.fx.tick, n.fx.interval))
    }, n.fx.stop = function() {
        clearInterval(ac), ac = null
    }, n.fx.speeds = {
        slow: 600,
        fast: 200,
        _default: 400
    }, n.fn.delay = function(a, b) {
        return a = n.fx ? n.fx.speeds[a] || a : a, b = b || "fx", this.queue(b, function(b, c) {
            var d = setTimeout(b, a);
            c.stop = function() {
                clearTimeout(d)
            }
        })
    },
    function() {
        var a, b, c, d, e = z.createElement("div");
        e.setAttribute("className", "t"), e.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", a = e.getElementsByTagName("a")[0], c = z.createElement("select"), d = c.appendChild(z.createElement("option")), b = e.getElementsByTagName("input")[0], a.style.cssText = "top:1px", l.getSetAttribute = "t" !== e.className, l.style = /top/.test(a.getAttribute("style")), l.hrefNormalized = "/a" === a.getAttribute("href"), l.checkOn = !!b.value, l.optSelected = d.selected, l.enctype = !!z.createElement("form").enctype, c.disabled = !0, l.optDisabled = !d.disabled, b = z.createElement("input"), b.setAttribute("value", ""), l.input = "" === b.getAttribute("value"), b.value = "t", b.setAttribute("type", "radio"), l.radioValue = "t" === b.value, a = b = c = d = e = null
    }();
var mc = /\r/g;
n.fn.extend({
    val: function(a) {
        var b, c, d, e = this[0]; {
            if (arguments.length) return d = n.isFunction(a), this.each(function(c) {
                var e;
                1 === this.nodeType && (e = d ? a.call(this, c, n(this).val()) : a, null == e ? e = "" : "number" == typeof e ? e += "" : n.isArray(e) && (e = n.map(e, function(a) {
                    return null == a ? "" : a + ""
                })), b = n.valHooks[this.type] || n.valHooks[this.nodeName.toLowerCase()], b && "set" in b && void 0 !== b.set(this, e, "value") || (this.value = e))
            });
            if (e) return b = n.valHooks[e.type] || n.valHooks[e.nodeName.toLowerCase()], b && "get" in b && void 0 !== (c = b.get(e, "value")) ? c : (c = e.value, "string" == typeof c ? c.replace(mc, "") : null == c ? "" : c)
        }
    }
}), n.extend({
    valHooks: {
        option: {
            get: function(a) {
                var b = n.find.attr(a, "value");
                return null != b ? b : n.text(a)
            }
        },
        select: {
            get: function(a) {
                for (var b, c, d = a.options, e = a.selectedIndex, f = "select-one" === a.type || 0 > e, g = f ? null : [], h = f ? e + 1 : d.length, i = 0 > e ? h : f ? e : 0; h > i; i++)
                    if (c = d[i], !(!c.selected && i !== e || (l.optDisabled ? c.disabled : null !== c.getAttribute("disabled")) || c.parentNode.disabled && n.nodeName(c.parentNode, "optgroup"))) {
                        if (b = n(c).val(), f) return b;
                        g.push(b)
                    } return g
            },
            set: function(a, b) {
                var c, d, e = a.options,
                    f = n.makeArray(b),
                    g = e.length;
                while (g--)
                    if (d = e[g], n.inArray(n.valHooks.option.get(d), f) >= 0) try {
                        d.selected = c = !0
                    } catch (h) {
                        d.scrollHeight
                    } else d.selected = !1;
                return c || (a.selectedIndex = -1), e
            }
        }
    }
}), n.each(["radio", "checkbox"], function() {
    n.valHooks[this] = {
        set: function(a, b) {
            return n.isArray(b) ? a.checked = n.inArray(n(a).val(), b) >= 0 : void 0
        }
    }, l.checkOn || (n.valHooks[this].get = function(a) {
        return null === a.getAttribute("value") ? "on" : a.value
    })
});
var nc, oc, pc = n.expr.attrHandle,
    qc = /^(?:checked|selected)$/i,
    rc = l.getSetAttribute,
    sc = l.input;
n.fn.extend({
    attr: function(a, b) {
        return W(this, n.attr, a, b, arguments.length > 1)
    },
    removeAttr: function(a) {
        return this.each(function() {
            n.removeAttr(this, a)
        })
    }
}), n.extend({
    attr: function(a, b, c) {
        var d, e, f = a.nodeType;
        if (a && 3 !== f && 8 !== f && 2 !== f) return typeof a.getAttribute === L ? n.prop(a, b, c) : (1 === f && n.isXMLDoc(a) || (b = b.toLowerCase(), d = n.attrHooks[b] || (n.expr.match.bool.test(b) ? oc : nc)), void 0 === c ? d && "get" in d && null !== (e = d.get(a, b)) ? e : (e = n.find.attr(a, b), null == e ? void 0 : e) : null !== c ? d && "set" in d && void 0 !== (e = d.set(a, c, b)) ? e : (a.setAttribute(b, c + ""), c) : void n.removeAttr(a, b))
    },
    removeAttr: function(a, b) {
        var c, d, e = 0,
            f = b && b.match(F);
        if (f && 1 === a.nodeType)
            while (c = f[e++]) d = n.propFix[c] || c, n.expr.match.bool.test(c) ? sc && rc || !qc.test(c) ? a[d] = !1 : a[n.camelCase("default-" + c)] = a[d] = !1 : n.attr(a, c, ""), a.removeAttribute(rc ? c : d)
    },
    attrHooks: {
        type: {
            set: function(a, b) {
                if (!l.radioValue && "radio" === b && n.nodeName(a, "input")) {
                    var c = a.value;
                    return a.setAttribute("type", b), c && (a.value = c), b
                }
            }
        }
    }
}), oc = {
    set: function(a, b, c) {
        return b === !1 ? n.removeAttr(a, c) : sc && rc || !qc.test(c) ? a.setAttribute(!rc && n.propFix[c] || c, c) : a[n.camelCase("default-" + c)] = a[c] = !0, c
    }
}, n.each(n.expr.match.bool.source.match(/\w+/g), function(a, b) {
    var c = pc[b] || n.find.attr;
    pc[b] = sc && rc || !qc.test(b) ? function(a, b, d) {
        var e, f;
        return d || (f = pc[b], pc[b] = e, e = null != c(a, b, d) ? b.toLowerCase() : null, pc[b] = f), e
    } : function(a, b, c) {
        return c ? void 0 : a[n.camelCase("default-" + b)] ? b.toLowerCase() : null
    }
}), sc && rc || (n.attrHooks.value = {
    set: function(a, b, c) {
        return n.nodeName(a, "input") ? void(a.defaultValue = b) : nc && nc.set(a, b, c)
    }
}), rc || (nc = {
    set: function(a, b, c) {
        var d = a.getAttributeNode(c);
        return d || a.setAttributeNode(d = a.ownerDocument.createAttribute(c)), d.value = b += "", "value" === c || b === a.getAttribute(c) ? b : void 0
    }
}, pc.id = pc.name = pc.coords = function(a, b, c) {
    var d;
    return c ? void 0 : (d = a.getAttributeNode(b)) && "" !== d.value ? d.value : null
}, n.valHooks.button = {
    get: function(a, b) {
        var c = a.getAttributeNode(b);
        return c && c.specified ? c.value : void 0
    },
    set: nc.set
}, n.attrHooks.contenteditable = {
    set: function(a, b, c) {
        nc.set(a, "" === b ? !1 : b, c)
    }
}, n.each(["width", "height"], function(a, b) {
    n.attrHooks[b] = {
        set: function(a, c) {
            return "" === c ? (a.setAttribute(b, "auto"), c) : void 0
        }
    }
})), l.style || (n.attrHooks.style = {
    get: function(a) {
        return a.style.cssText || void 0
    },
    set: function(a, b) {
        return a.style.cssText = b + ""
    }
});
var tc = /^(?:input|select|textarea|button|object)$/i,
    uc = /^(?:a|area)$/i;
n.fn.extend({
    prop: function(a, b) {
        return W(this, n.prop, a, b, arguments.length > 1)
    },
    removeProp: function(a) {
        return a = n.propFix[a] || a, this.each(function() {
            try {
                this[a] = void 0, delete this[a]
            } catch (b) {}
        })
    }
}), n.extend({
    propFix: {
        "for": "htmlFor",
        "class": "className"
    },
    prop: function(a, b, c) {
        var d, e, f, g = a.nodeType;
        if (a && 3 !== g && 8 !== g && 2 !== g) return f = 1 !== g || !n.isXMLDoc(a), f && (b = n.propFix[b] || b, e = n.propHooks[b]), void 0 !== c ? e && "set" in e && void 0 !== (d = e.set(a, c, b)) ? d : a[b] = c : e && "get" in e && null !== (d = e.get(a, b)) ? d : a[b]
    },
    propHooks: {
        tabIndex: {
            get: function(a) {
                var b = n.find.attr(a, "tabindex");
                return b ? parseInt(b, 10) : tc.test(a.nodeName) || uc.test(a.nodeName) && a.href ? 0 : -1
            }
        }
    }
}), l.hrefNormalized || n.each(["href", "src"], function(a, b) {
    n.propHooks[b] = {
        get: function(a) {
            return a.getAttribute(b, 4)
        }
    }
}), l.optSelected || (n.propHooks.selected = {
    get: function(a) {
        var b = a.parentNode;
        return b && (b.selectedIndex, b.parentNode && b.parentNode.selectedIndex), null
    }
}), n.each(["tabIndex", "readOnly", "maxLength", "cellSpacing", "cellPadding", "rowSpan", "colSpan", "useMap", "frameBorder", "contentEditable"], function() {
    n.propFix[this.toLowerCase()] = this
}), l.enctype || (n.propFix.enctype = "encoding");
var vc = /[\t\r\n\f]/g;
n.fn.extend({
    addClass: function(a) {
        var b, c, d, e, f, g, h = 0,
            i = this.length,
            j = "string" == typeof a && a;
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).addClass(a.call(this, b, this.className))
        });
        if (j)
            for (b = (a || "").match(F) || []; i > h; h++)
                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : " ")) {
                    f = 0;
                    while (e = b[f++]) d.indexOf(" " + e + " ") < 0 && (d += e + " ");
                    g = n.trim(d), c.className !== g && (c.className = g)
                } return this
    },
    removeClass: function(a) {
        var b, c, d, e, f, g, h = 0,
            i = this.length,
            j = 0 === arguments.length || "string" == typeof a && a;
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).removeClass(a.call(this, b, this.className))
        });
        if (j)
            for (b = (a || "").match(F) || []; i > h; h++)
                if (c = this[h], d = 1 === c.nodeType && (c.className ? (" " + c.className + " ").replace(vc, " ") : "")) {
                    f = 0;
                    while (e = b[f++])
                        while (d.indexOf(" " + e + " ") >= 0) d = d.replace(" " + e + " ", " ");
                    g = a ? n.trim(d) : "", c.className !== g && (c.className = g)
                } return this
    },
    toggleClass: function(a, b) {
        var c = typeof a;
        return "boolean" == typeof b && "string" === c ? b ? this.addClass(a) : this.removeClass(a) : this.each(n.isFunction(a) ? function(c) {
            n(this).toggleClass(a.call(this, c, this.className, b), b)
        } : function() {
            if ("string" === c) {
                var b, d = 0,
                    e = n(this),
                    f = a.match(F) || [];
                while (b = f[d++]) e.hasClass(b) ? e.removeClass(b) : e.addClass(b)
            } else(c === L || "boolean" === c) && (this.className && n._data(this, "__className__", this.className), this.className = this.className || a === !1 ? "" : n._data(this, "__className__") || "")
        })
    },
    hasClass: function(a) {
        for (var b = " " + a + " ", c = 0, d = this.length; d > c; c++)
            if (1 === this[c].nodeType && (" " + this[c].className + " ").replace(vc, " ").indexOf(b) >= 0) return !0;
        return !1
    }
}), n.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function(a, b) {
    n.fn[b] = function(a, c) {
        return arguments.length > 0 ? this.on(b, null, a, c) : this.trigger(b)
    }
}), n.fn.extend({
    hover: function(a, b) {
        return this.mouseenter(a).mouseleave(b || a)
    },
    bind: function(a, b, c) {
        return this.on(a, null, b, c)
    },
    unbind: function(a, b) {
        return this.off(a, null, b)
    },
    delegate: function(a, b, c, d) {
        return this.on(b, a, c, d)
    },
    undelegate: function(a, b, c) {
        return 1 === arguments.length ? this.off(a, "**") : this.off(b, a || "**", c)
    }
});
var wc = n.now(),
    xc = /\?/,
    yc = /(,)|(\[|{)|(}|])|"(?:[^"\\\r\n]|\\["\\\/bfnrt]|\\u[\da-fA-F]{4})*"\s*:?|true|false|null|-?(?!0\d)\d+(?:\.\d+|)(?:[eE][+-]?\d+|)/g;
n.parseJSON = function(b) {
    if (a.JSON && a.JSON.parse) return a.JSON.parse(b + "");
    var c, d = null,
        e = n.trim(b + "");
    return e && !n.trim(e.replace(yc, function(a, b, e, f) {
        return c && b && (d = 0), 0 === d ? a : (c = e || b, d += !f - !e, "")
    })) ? Function("return " + e)() : n.error("Invalid JSON: " + b)
}, n.parseXML = function(b) {
    var c, d;
    if (!b || "string" != typeof b) return null;
    try {
        a.DOMParser ? (d = new DOMParser, c = d.parseFromString(b, "text/xml")) : (c = new ActiveXObject("Microsoft.XMLDOM"), c.async = "false", c.loadXML(b))
    } catch (e) {
        c = void 0
    }
    return c && c.documentElement && !c.getElementsByTagName("parsererror").length || n.error("Invalid XML: " + b), c
};
var zc, Ac, Bc = /#.*$/,
    Cc = /([?&])_=[^&]*/,
    Dc = /^(.*?):[ \t]*([^\r\n]*)\r?$/gm,
    Ec = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
    Fc = /^(?:GET|HEAD)$/,
    Gc = /^\/\//,
    Hc = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,
    Ic = {},
    Jc = {},
    Kc = "*/".concat("*");
try {
    Ac = location.href
} catch (Lc) {
    Ac = z.createElement("a"), Ac.href = "", Ac = Ac.href
}
zc = Hc.exec(Ac.toLowerCase()) || [];

function Mc(a) {
    return function(b, c) {
        "string" != typeof b && (c = b, b = "*");
        var d, e = 0,
            f = b.toLowerCase().match(F) || [];
        if (n.isFunction(c))
            while (d = f[e++]) "+" === d.charAt(0) ? (d = d.slice(1) || "*", (a[d] = a[d] || []).unshift(c)) : (a[d] = a[d] || []).push(c)
    }
}

function Nc(a, b, c, d) {
    var e = {},
        f = a === Jc;

    function g(h) {
        var i;
        return e[h] = !0, n.each(a[h] || [], function(a, h) {
            var j = h(b, c, d);
            return "string" != typeof j || f || e[j] ? f ? !(i = j) : void 0 : (b.dataTypes.unshift(j), g(j), !1)
        }), i
    }
    return g(b.dataTypes[0]) || !e["*"] && g("*")
}

function Oc(a, b) {
    var c, d, e = n.ajaxSettings.flatOptions || {};
    for (d in b) void 0 !== b[d] && ((e[d] ? a : c || (c = {}))[d] = b[d]);
    return c && n.extend(!0, a, c), a
}

function Pc(a, b, c) {
    var d, e, f, g, h = a.contents,
        i = a.dataTypes;
    while ("*" === i[0]) i.shift(), void 0 === e && (e = a.mimeType || b.getResponseHeader("Content-Type"));
    if (e)
        for (g in h)
            if (h[g] && h[g].test(e)) {
                i.unshift(g);
                break
            } if (i[0] in c) f = i[0];
    else {
        for (g in c) {
            if (!i[0] || a.converters[g + " " + i[0]]) {
                f = g;
                break
            }
            d || (d = g)
        }
        f = f || d
    }
    return f ? (f !== i[0] && i.unshift(f), c[f]) : void 0
}

function Qc(a, b, c, d) {
    var e, f, g, h, i, j = {},
        k = a.dataTypes.slice();
    if (k[1])
        for (g in a.converters) j[g.toLowerCase()] = a.converters[g];
    f = k.shift();
    while (f)
        if (a.responseFields[f] && (c[a.responseFields[f]] = b), !i && d && a.dataFilter && (b = a.dataFilter(b, a.dataType)), i = f, f = k.shift())
            if ("*" === f) f = i;
            else if ("*" !== i && i !== f) {
        if (g = j[i + " " + f] || j["* " + f], !g)
            for (e in j)
                if (h = e.split(" "), h[1] === f && (g = j[i + " " + h[0]] || j["* " + h[0]])) {
                    g === !0 ? g = j[e] : j[e] !== !0 && (f = h[0], k.unshift(h[1]));
                    break
                } if (g !== !0)
            if (g && a["throws"]) b = g(b);
            else try {
                b = g(b)
            } catch (l) {
                return {
                    state: "parsererror",
                    error: g ? l : "No conversion from " + i + " to " + f
                }
            }
    }
    return {
        state: "success",
        data: b
    }
}
n.extend({
    active: 0,
    lastModified: {},
    etag: {},
    ajaxSettings: {
        url: Ac,
        type: "GET",
        isLocal: Ec.test(zc[1]),
        global: !0,
        processData: !0,
        async: !0,
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",
        accepts: {
            "*": Kc,
            text: "text/plain",
            html: "text/html",
            xml: "application/xml, text/xml",
            json: "application/json, text/javascript"
        },
        contents: {
            xml: /xml/,
            html: /html/,
            json: /json/
        },
        responseFields: {
            xml: "responseXML",
            text: "responseText",
            json: "responseJSON"
        },
        converters: {
            "* text": String,
            "text html": !0,
            "text json": n.parseJSON,
            "text xml": n.parseXML
        },
        flatOptions: {
            url: !0,
            context: !0
        }
    },
    ajaxSetup: function(a, b) {
        return b ? Oc(Oc(a, n.ajaxSettings), b) : Oc(n.ajaxSettings, a)
    },
    ajaxPrefilter: Mc(Ic),
    ajaxTransport: Mc(Jc),
    ajax: function(a, b) {
        "object" == typeof a && (b = a, a = void 0), b = b || {};
        var c, d, e, f, g, h, i, j, k = n.ajaxSetup({}, b),
            l = k.context || k,
            m = k.context && (l.nodeType || l.jquery) ? n(l) : n.event,
            o = n.Deferred(),
            p = n.Callbacks("once memory"),
            q = k.statusCode || {},
            r = {},
            s = {},
            t = 0,
            u = "canceled",
            v = {
                readyState: 0,
                getResponseHeader: function(a) {
                    var b;
                    if (2 === t) {
                        if (!j) {
                            j = {};
                            while (b = Dc.exec(f)) j[b[1].toLowerCase()] = b[2]
                        }
                        b = j[a.toLowerCase()]
                    }
                    return null == b ? null : b
                },
                getAllResponseHeaders: function() {
                    return 2 === t ? f : null
                },
                setRequestHeader: function(a, b) {
                    var c = a.toLowerCase();
                    return t || (a = s[c] = s[c] || a, r[a] = b), this
                },
                overrideMimeType: function(a) {
                    return t || (k.mimeType = a), this
                },
                statusCode: function(a) {
                    var b;
                    if (a)
                        if (2 > t)
                            for (b in a) q[b] = [q[b], a[b]];
                        else v.always(a[v.status]);
                    return this
                },
                abort: function(a) {
                    var b = a || u;
                    return i && i.abort(b), x(0, b), this
                }
            };
        if (o.promise(v).complete = p.add, v.success = v.done, v.error = v.fail, k.url = ((a || k.url || Ac) + "").replace(Bc, "").replace(Gc, zc[1] + "//"), k.type = b.method || b.type || k.method || k.type, k.dataTypes = n.trim(k.dataType || "*").toLowerCase().match(F) || [""], null == k.crossDomain && (c = Hc.exec(k.url.toLowerCase()), k.crossDomain = !(!c || c[1] === zc[1] && c[2] === zc[2] && (c[3] || ("http:" === c[1] ? "80" : "443")) === (zc[3] || ("http:" === zc[1] ? "80" : "443")))), k.data && k.processData && "string" != typeof k.data && (k.data = n.param(k.data, k.traditional)), Nc(Ic, k, b, v), 2 === t) return v;
        h = k.global, h && 0 === n.active++ && n.event.trigger("ajaxStart"), k.type = k.type.toUpperCase(), k.hasContent = !Fc.test(k.type), e = k.url, k.hasContent || (k.data && (e = k.url += (xc.test(e) ? "&" : "?") + k.data, delete k.data), k.cache === !1 && (k.url = Cc.test(e) ? e.replace(Cc, "$1_=" + wc++) : e + (xc.test(e) ? "&" : "?") + "_=" + wc++)), k.ifModified && (n.lastModified[e] && v.setRequestHeader("If-Modified-Since", n.lastModified[e]), n.etag[e] && v.setRequestHeader("If-None-Match", n.etag[e])), (k.data && k.hasContent && k.contentType !== !1 || b.contentType) && v.setRequestHeader("Content-Type", k.contentType), v.setRequestHeader("Accept", k.dataTypes[0] && k.accepts[k.dataTypes[0]] ? k.accepts[k.dataTypes[0]] + ("*" !== k.dataTypes[0] ? ", " + Kc + "; q=0.01" : "") : k.accepts["*"]);
        for (d in k.headers) v.setRequestHeader(d, k.headers[d]);
        if (k.beforeSend && (k.beforeSend.call(l, v, k) === !1 || 2 === t)) return v.abort();
        u = "abort";
        for (d in {
                success: 1,
                error: 1,
                complete: 1
            }) v[d](k[d]);
        if (i = Nc(Jc, k, b, v)) {
            v.readyState = 1, h && m.trigger("ajaxSend", [v, k]), k.async && k.timeout > 0 && (g = setTimeout(function() {
                v.abort("timeout")
            }, k.timeout));
            try {
                t = 1, i.send(r, x)
            } catch (w) {
                if (!(2 > t)) throw w;
                x(-1, w)
            }
        } else x(-1, "No Transport");

        function x(a, b, c, d) {
            var j, r, s, u, w, x = b;
            2 !== t && (t = 2, g && clearTimeout(g), i = void 0, f = d || "", v.readyState = a > 0 ? 4 : 0, j = a >= 200 && 300 > a || 304 === a, c && (u = Pc(k, v, c)), u = Qc(k, u, v, j), j ? (k.ifModified && (w = v.getResponseHeader("Last-Modified"), w && (n.lastModified[e] = w), w = v.getResponseHeader("etag"), w && (n.etag[e] = w)), 204 === a || "HEAD" === k.type ? x = "nocontent" : 304 === a ? x = "notmodified" : (x = u.state, r = u.data, s = u.error, j = !s)) : (s = x, (a || !x) && (x = "error", 0 > a && (a = 0))), v.status = a, v.statusText = (b || x) + "", j ? o.resolveWith(l, [r, x, v]) : o.rejectWith(l, [v, x, s]), v.statusCode(q), q = void 0, h && m.trigger(j ? "ajaxSuccess" : "ajaxError", [v, k, j ? r : s]), p.fireWith(l, [v, x]), h && (m.trigger("ajaxComplete", [v, k]), --n.active || n.event.trigger("ajaxStop")))
        }
        return v
    },
    getJSON: function(a, b, c) {
        return n.get(a, b, c, "json")
    },
    getScript: function(a, b) {
        return n.get(a, void 0, b, "script")
    }
}), n.each(["get", "post"], function(a, b) {
    n[b] = function(a, c, d, e) {
        return n.isFunction(c) && (e = e || d, d = c, c = void 0), n.ajax({
            url: a,
            type: b,
            dataType: e,
            data: c,
            success: d
        })
    }
}), n.each(["ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend"], function(a, b) {
    n.fn[b] = function(a) {
        return this.on(b, a)
    }
}), n._evalUrl = function(a) {
    return n.ajax({
        url: a,
        type: "GET",
        dataType: "script",
        async: !1,
        global: !1,
        "throws": !0
    })
}, n.fn.extend({
    wrapAll: function(a) {
        if (n.isFunction(a)) return this.each(function(b) {
            n(this).wrapAll(a.call(this, b))
        });
        if (this[0]) {
            var b = n(a, this[0].ownerDocument).eq(0).clone(!0);
            this[0].parentNode && b.insertBefore(this[0]), b.map(function() {
                var a = this;
                while (a.firstChild && 1 === a.firstChild.nodeType) a = a.firstChild;
                return a
            }).append(this)
        }
        return this
    },
    wrapInner: function(a) {
        return this.each(n.isFunction(a) ? function(b) {
            n(this).wrapInner(a.call(this, b))
        } : function() {
            var b = n(this),
                c = b.contents();
            c.length ? c.wrapAll(a) : b.append(a)
        })
    },
    wrap: function(a) {
        var b = n.isFunction(a);
        return this.each(function(c) {
            n(this).wrapAll(b ? a.call(this, c) : a)
        })
    },
    unwrap: function() {
        return this.parent().each(function() {
            n.nodeName(this, "body") || n(this).replaceWith(this.childNodes)
        }).end()
    }
}), n.expr.filters.hidden = function(a) {
    return a.offsetWidth <= 0 && a.offsetHeight <= 0 || !l.reliableHiddenOffsets() && "none" === (a.style && a.style.display || n.css(a, "display"))
}, n.expr.filters.visible = function(a) {
    return !n.expr.filters.hidden(a)
};
var Rc = /%20/g,
    Sc = /\[\]$/,
    Tc = /\r?\n/g,
    Uc = /^(?:submit|button|image|reset|file)$/i,
    Vc = /^(?:input|select|textarea|keygen)/i;

function Wc(a, b, c, d) {
    var e;
    if (n.isArray(b)) n.each(b, function(b, e) {
        c || Sc.test(a) ? d(a, e) : Wc(a + "[" + ("object" == typeof e ? b : "") + "]", e, c, d)
    });
    else if (c || "object" !== n.type(b)) d(a, b);
    else
        for (e in b) Wc(a + "[" + e + "]", b[e], c, d)
}
n.param = function(a, b) {
    var c, d = [],
        e = function(a, b) {
            b = n.isFunction(b) ? b() : null == b ? "" : b, d[d.length] = encodeURIComponent(a) + "=" + encodeURIComponent(b)
        };
    if (void 0 === b && (b = n.ajaxSettings && n.ajaxSettings.traditional), n.isArray(a) || a.jquery && !n.isPlainObject(a)) n.each(a, function() {
        e(this.name, this.value)
    });
    else
        for (c in a) Wc(c, a[c], b, e);
    return d.join("&").replace(Rc, "+")
}, n.fn.extend({
    serialize: function() {
        return n.param(this.serializeArray())
    },
    serializeArray: function() {
        return this.map(function() {
            var a = n.prop(this, "elements");
            return a ? n.makeArray(a) : this
        }).filter(function() {
            var a = this.type;
            return this.name && !n(this).is(":disabled") && Vc.test(this.nodeName) && !Uc.test(a) && (this.checked || !X.test(a))
        }).map(function(a, b) {
            var c = n(this).val();
            return null == c ? null : n.isArray(c) ? n.map(c, function(a) {
                return {
                    name: b.name,
                    value: a.replace(Tc, "\r\n")
                }
            }) : {
                name: b.name,
                value: c.replace(Tc, "\r\n")
            }
        }).get()
    }
}), n.ajaxSettings.xhr = void 0 !== a.ActiveXObject ? function() {
    return !this.isLocal && /^(get|post|head|put|delete|options)$/i.test(this.type) && $c() || _c()
} : $c;
var Xc = 0,
    Yc = {},
    Zc = n.ajaxSettings.xhr();
a.ActiveXObject && n(a).on("unload", function() {
    for (var a in Yc) Yc[a](void 0, !0)
}), l.cors = !!Zc && "withCredentials" in Zc, Zc = l.ajax = !!Zc, Zc && n.ajaxTransport(function(a) {
    if (!a.crossDomain || l.cors) {
        var b;
        return {
            send: function(c, d) {
                var e, f = a.xhr(),
                    g = ++Xc;
                if (f.open(a.type, a.url, a.async, a.username, a.password), a.xhrFields)
                    for (e in a.xhrFields) f[e] = a.xhrFields[e];
                a.mimeType && f.overrideMimeType && f.overrideMimeType(a.mimeType), a.crossDomain || c["X-Requested-With"] || (c["X-Requested-With"] = "XMLHttpRequest");
                for (e in c) void 0 !== c[e] && f.setRequestHeader(e, c[e] + "");
                f.send(a.hasContent && a.data || null), b = function(c, e) {
                    var h, i, j;
                    if (b && (e || 4 === f.readyState))
                        if (delete Yc[g], b = void 0, f.onreadystatechange = n.noop, e) 4 !== f.readyState && f.abort();
                        else {
                            j = {}, h = f.status, "string" == typeof f.responseText && (j.text = f.responseText);
                            try {
                                i = f.statusText
                            } catch (k) {
                                i = ""
                            }
                            h || !a.isLocal || a.crossDomain ? 1223 === h && (h = 204) : h = j.text ? 200 : 404
                        } j && d(h, i, j, f.getAllResponseHeaders())
                }, a.async ? 4 === f.readyState ? setTimeout(b) : f.onreadystatechange = Yc[g] = b : b()
            },
            abort: function() {
                b && b(void 0, !0)
            }
        }
    }
});

function $c() {
    try {
        return new a.XMLHttpRequest
    } catch (b) {}
}

function _c() {
    try {
        return new a.ActiveXObject("Microsoft.XMLHTTP")
    } catch (b) {}
}
n.ajaxSetup({
    accepts: {
        script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
    },
    contents: {
        script: /(?:java|ecma)script/
    },
    converters: {
        "text script": function(a) {
            return n.globalEval(a), a
        }
    }
}), n.ajaxPrefilter("script", function(a) {
    void 0 === a.cache && (a.cache = !1), a.crossDomain && (a.type = "GET", a.global = !1)
}), n.ajaxTransport("script", function(a) {
    if (a.crossDomain) {
        var b, c = z.head || n("head")[0] || z.documentElement;
        return {
            send: function(d, e) {
                b = z.createElement("script"), b.async = !0, a.scriptCharset && (b.charset = a.scriptCharset), b.src = a.url, b.onload = b.onreadystatechange = function(a, c) {
                    (c || !b.readyState || /loaded|complete/.test(b.readyState)) && (b.onload = b.onreadystatechange = null, b.parentNode && b.parentNode.removeChild(b), b = null, c || e(200, "success"))
                }, c.insertBefore(b, c.firstChild)
            },
            abort: function() {
                b && b.onload(void 0, !0)
            }
        }
    }
});
var ad = [],
    bd = /(=)\?(?=&|$)|\?\?/;
n.ajaxSetup({
    jsonp: "callback",
    jsonpCallback: function() {
        var a = ad.pop() || n.expando + "_" + wc++;
        return this[a] = !0, a
    }
}), n.ajaxPrefilter("json jsonp", function(b, c, d) {
    var e, f, g, h = b.jsonp !== !1 && (bd.test(b.url) ? "url" : "string" == typeof b.data && !(b.contentType || "").indexOf("application/x-www-form-urlencoded") && bd.test(b.data) && "data");
    return h || "jsonp" === b.dataTypes[0] ? (e = b.jsonpCallback = n.isFunction(b.jsonpCallback) ? b.jsonpCallback() : b.jsonpCallback, h ? b[h] = b[h].replace(bd, "$1" + e) : b.jsonp !== !1 && (b.url += (xc.test(b.url) ? "&" : "?") + b.jsonp + "=" + e), b.converters["script json"] = function() {
        return g || n.error(e + " was not called"), g[0]
    }, b.dataTypes[0] = "json", f = a[e], a[e] = function() {
        g = arguments
    }, d.always(function() {
        a[e] = f, b[e] && (b.jsonpCallback = c.jsonpCallback, ad.push(e)), g && n.isFunction(f) && f(g[0]), g = f = void 0
    }), "script") : void 0
}), n.parseHTML = function(a, b, c) {
    if (!a || "string" != typeof a) return null;
    "boolean" == typeof b && (c = b, b = !1), b = b || z;
    var d = v.exec(a),
        e = !c && [];
    return d ? [b.createElement(d[1])] : (d = n.buildFragment([a], b, e), e && e.length && n(e).remove(), n.merge([], d.childNodes))
};
var cd = n.fn.load;
n.fn.load = function(a, b, c) {
    if ("string" != typeof a && cd) return cd.apply(this, arguments);
    var d, e, f, g = this,
        h = a.indexOf(" ");
    return h >= 0 && (d = a.slice(h, a.length), a = a.slice(0, h)), n.isFunction(b) ? (c = b, b = void 0) : b && "object" == typeof b && (f = "POST"), g.length > 0 && n.ajax({
        url: a,
        type: f,
        dataType: "html",
        data: b
    }).done(function(a) {
        e = arguments, g.html(d ? n("<div>").append(n.parseHTML(a)).find(d) : a)
    }).complete(c && function(a, b) {
        g.each(c, e || [a.responseText, b, a])
    }), this
}, n.expr.filters.animated = function(a) {
    return n.grep(n.timers, function(b) {
        return a === b.elem
    }).length
};
var dd = a.document.documentElement;

function ed(a) {
    return n.isWindow(a) ? a : 9 === a.nodeType ? a.defaultView || a.parentWindow : !1
}
n.offset = {
    setOffset: function(a, b, c) {
        var d, e, f, g, h, i, j, k = n.css(a, "position"),
            l = n(a),
            m = {};
        "static" === k && (a.style.position = "relative"), h = l.offset(), f = n.css(a, "top"), i = n.css(a, "left"), j = ("absolute" === k || "fixed" === k) && n.inArray("auto", [f, i]) > -1, j ? (d = l.position(), g = d.top, e = d.left) : (g = parseFloat(f) || 0, e = parseFloat(i) || 0), n.isFunction(b) && (b = b.call(a, c, h)), null != b.top && (m.top = b.top - h.top + g), null != b.left && (m.left = b.left - h.left + e), "using" in b ? b.using.call(a, m) : l.css(m)
    }
}, n.fn.extend({
    offset: function(a) {
        if (arguments.length) return void 0 === a ? this : this.each(function(b) {
            n.offset.setOffset(this, a, b)
        });
        var b, c, d = {
                top: 0,
                left: 0
            },
            e = this[0],
            f = e && e.ownerDocument;
        if (f) return b = f.documentElement, n.contains(b, e) ? (typeof e.getBoundingClientRect !== L && (d = e.getBoundingClientRect()), c = ed(f), {
            top: d.top + (c.pageYOffset || b.scrollTop) - (b.clientTop || 0),
            left: d.left + (c.pageXOffset || b.scrollLeft) - (b.clientLeft || 0)
        }) : d
    },
    position: function() {
        if (this[0]) {
            var a, b, c = {
                    top: 0,
                    left: 0
                },
                d = this[0];
            return "fixed" === n.css(d, "position") ? b = d.getBoundingClientRect() : (a = this.offsetParent(), b = this.offset(), n.nodeName(a[0], "html") || (c = a.offset()), c.top += n.css(a[0], "borderTopWidth", !0), c.left += n.css(a[0], "borderLeftWidth", !0)), {
                top: b.top - c.top - n.css(d, "marginTop", !0),
                left: b.left - c.left - n.css(d, "marginLeft", !0)
            }
        }
    },
    offsetParent: function() {
        return this.map(function() {
            var a = this.offsetParent || dd;
            while (a && !n.nodeName(a, "html") && "static" === n.css(a, "position")) a = a.offsetParent;
            return a || dd
        })
    }
}), n.each({
    scrollLeft: "pageXOffset",
    scrollTop: "pageYOffset"
}, function(a, b) {
    var c = /Y/.test(b);
    n.fn[a] = function(d) {
        return W(this, function(a, d, e) {
            var f = ed(a);
            return void 0 === e ? f ? b in f ? f[b] : f.document.documentElement[d] : a[d] : void(f ? f.scrollTo(c ? n(f).scrollLeft() : e, c ? e : n(f).scrollTop()) : a[d] = e)
        }, a, d, arguments.length, null)
    }
}), n.each(["top", "left"], function(a, b) {
    n.cssHooks[b] = Mb(l.pixelPosition, function(a, c) {
        return c ? (c = Kb(a, b), Ib.test(c) ? n(a).position()[b] + "px" : c) : void 0
    })
}), n.each({
    Height: "height",
    Width: "width"
}, function(a, b) {
    n.each({
        padding: "inner" + a,
        content: b,
        "": "outer" + a
    }, function(c, d) {
        n.fn[d] = function(d, e) {
            var f = arguments.length && (c || "boolean" != typeof d),
                g = c || (d === !0 || e === !0 ? "margin" : "border");
            return W(this, function(b, c, d) {
                var e;
                return n.isWindow(b) ? b.document.documentElement["client" + a] : 9 === b.nodeType ? (e = b.documentElement, Math.max(b.body["scroll" + a], e["scroll" + a], b.body["offset" + a], e["offset" + a], e["client" + a])) : void 0 === d ? n.css(b, c, g) : n.style(b, c, d, g)
            }, b, f ? d : void 0, f, null)
        }
    })
}), n.fn.size = function() {
    return this.length
}, n.fn.andSelf = n.fn.addBack, "function" == typeof define && define.amd && define("jquery", [], function() {
    return n
});
var fd = a.jQuery,
    gd = a.$;
return n.noConflict = function(b) {
    return a.$ === n && (a.$ = gd), b && a.jQuery === n && (a.jQuery = fd), n
}, typeof b === L && (a.jQuery = a.$ = n), n
});


// slick
/* global window, document, define, jQuery, setInterval, clearInterval */
  ;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

  }(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                focusOnChange: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 0) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

            if (_.options.accessibility === true) {
                _.$dots.off('keydown.slick', _.keyHandler);
            }
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
            }
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 0) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this,
                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                    return (val >= 0) && (val < _.slideCount);
                });

        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        if (_.$dots !== null) {
            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
                var slideControlIndex = tabControlIndexes.indexOf(i);

                $(this).attr({
                    'role': 'tabpanel',
                    'id': 'slick-slide' + _.instanceUid + i,
                    'tabindex': -1
                });

                if (slideControlIndex !== -1) {
                  var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
                  if ($('#' + ariaButtonControl).length) {
                    $(this).attr({
                        'aria-describedby': ariaButtonControl
                    });
                  }
                }
            });

            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                var mappedSlideIndex = tabControlIndexes[i];

                $(this).attr({
                    'role': 'presentation'
                });

                $(this).find('button').first().attr({
                    'role': 'tab',
                    'id': 'slick-slide-control' + _.instanceUid + i,
                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                    'aria-label': (i + 1) + ' of ' + numDotGroups,
                    'aria-selected': null,
                    'tabindex': '-1'
                });

            }).eq(_.currentSlide).find('button').attr({
                'aria-selected': 'true',
                'tabindex': '0'
            }).end();
        }

        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
          if (_.options.focusOnChange) {
            _.$slides.eq(i).attr({'tabindex': '0'});
          } else {
            _.$slides.eq(i).removeAttr('tabindex');
          }
        }

        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
              .off('click.slick')
              .on('click.slick', {
                    message: 'previous'
              }, _.changeSlide);
            _.$nextArrow
              .off('click.slick')
              .on('click.slick', {
                    message: 'next'
              }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$dots.on('keydown.slick', _.keyHandler);
            }
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
        //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();

                if (_.options.focusOnChange) {
                    var $currentSlide = $(_.$slides.get(_.currentSlide));
                    $currentSlide.attr('tabindex', 0).focus();
                }
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                    .removeClass('slick-active')
                    .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

  }));


// Ion.RangeSlider
// =====================================================================================================================

;(function(factory) {
  if ((typeof jQuery === 'undefined' || !jQuery) && typeof define === "function" && define.amd) {
      define(["jquery"], function (jQuery) {
          return factory(jQuery, document, window, navigator);
      });
  } else if ((typeof jQuery === 'undefined' || !jQuery) && typeof exports === "object") {
      factory(require("jquery"), document, window, navigator);
  } else {
      factory(jQuery, document, window, navigator);
  }
} (function ($, document, window, navigator, undefined) {
  "use strict";

  // =================================================================================================================
  // Service

  var plugin_count = 0;

  // IE8 fix
  var is_old_ie = (function () {
      var n = navigator.userAgent,
          r = /msie\s\d+/i,
          v;
      if (n.search(r) > 0) {
          v = r.exec(n).toString();
          v = v.split(" ")[1];
          if (v < 9) {
              $("html").addClass("lt-ie9");
              return true;
          }
      }
      return false;
  } ());
  if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

          var target = this;
          var slice = [].slice;

          if (typeof target != "function") {
              throw new TypeError();
          }

          var args = slice.call(arguments, 1),
              bound = function () {

                  if (this instanceof bound) {

                      var F = function(){};
                      F.prototype = target.prototype;
                      var self = new F();

                      var result = target.apply(
                          self,
                          args.concat(slice.call(arguments))
                      );
                      if (Object(result) === result) {
                          return result;
                      }
                      return self;

                  } else {

                      return target.apply(
                          that,
                          args.concat(slice.call(arguments))
                      );

                  }

              };

          return bound;
      };
  }
  if (!Array.prototype.indexOf) {
      Array.prototype.indexOf = function(searchElement, fromIndex) {
          var k;
          if (this == null) {
              throw new TypeError('"this" is null or not defined');
          }
          var O = Object(this);
          var len = O.length >>> 0;
          if (len === 0) {
              return -1;
          }
          var n = +fromIndex || 0;
          if (Math.abs(n) === Infinity) {
              n = 0;
          }
          if (n >= len) {
              return -1;
          }
          k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);
          while (k < len) {
              if (k in O && O[k] === searchElement) {
                  return k;
              }
              k++;
          }
          return -1;
      };
  }



  // =================================================================================================================
  // Template

  var base_html =
      '<span class="irs">' +
      '<span class="irs-line" tabindex="0"></span>' +
      '<span class="irs-min">0</span><span class="irs-max">1</span>' +
      '<span class="irs-from">0</span><span class="irs-to">0</span><span class="irs-single">0</span>' +
      '</span>' +
      '<span class="irs-grid"></span>';

  var single_html =
      '<span class="irs-bar irs-bar--single"></span>' +
      '<span class="irs-shadow shadow-single"></span>' +
      '<span class="irs-handle single"><i></i><i></i><i></i></span>';

  var double_html =
      '<span class="irs-bar"></span>' +
      '<span class="irs-shadow shadow-from"></span>' +
      '<span class="irs-shadow shadow-to"></span>' +
      '<span class="irs-handle from"><i></i><i></i><i></i></span>' +
      '<span class="irs-handle to"><i></i><i></i><i></i></span>';

  var disable_html =
      '<span class="irs-disable-mask"></span>';



  // =================================================================================================================
  // Core

  /**
   * Main plugin constructor
   *
   * @param input {Object} link to base input element
   * @param options {Object} slider config
   * @param plugin_count {Number}
   * @constructor
   */
  var IonRangeSlider = function (input, options, plugin_count) {
      this.VERSION = "2.3.1";
      this.input = input;
      this.plugin_count = plugin_count;
      this.current_plugin = 0;
      this.calc_count = 0;
      this.update_tm = 0;
      this.old_from = 0;
      this.old_to = 0;
      this.old_min_interval = null;
      this.raf_id = null;
      this.dragging = false;
      this.force_redraw = false;
      this.no_diapason = false;
      this.has_tab_index = true;
      this.is_key = false;
      this.is_update = false;
      this.is_start = true;
      this.is_finish = false;
      this.is_active = false;
      this.is_resize = false;
      this.is_click = false;

      options = options || {};

      // cache for links to all DOM elements
      this.$cache = {
          win: $(window),
          body: $(document.body),
          input: $(input),
          cont: null,
          rs: null,
          min: null,
          max: null,
          from: null,
          to: null,
          single: null,
          bar: null,
          line: null,
          s_single: null,
          s_from: null,
          s_to: null,
          shad_single: null,
          shad_from: null,
          shad_to: null,
          edge: null,
          grid: null,
          grid_labels: []
      };

      // storage for measure variables
      this.coords = {
          // left
          x_gap: 0,
          x_pointer: 0,

          // width
          w_rs: 0,
          w_rs_old: 0,
          w_handle: 0,

          // percents
          p_gap: 0,
          p_gap_left: 0,
          p_gap_right: 0,
          p_step: 0,
          p_pointer: 0,
          p_handle: 0,
          p_single_fake: 0,
          p_single_real: 0,
          p_from_fake: 0,
          p_from_real: 0,
          p_to_fake: 0,
          p_to_real: 0,
          p_bar_x: 0,
          p_bar_w: 0,

          // grid
          grid_gap: 0,
          big_num: 0,
          big: [],
          big_w: [],
          big_p: [],
          big_x: []
      };

      // storage for labels measure variables
      this.labels = {
          // width
          w_min: 0,
          w_max: 0,
          w_from: 0,
          w_to: 0,
          w_single: 0,

          // percents
          p_min: 0,
          p_max: 0,
          p_from_fake: 0,
          p_from_left: 0,
          p_to_fake: 0,
          p_to_left: 0,
          p_single_fake: 0,
          p_single_left: 0
      };



      /**
       * get and validate config
       */
      var $inp = this.$cache.input,
          val = $inp.prop("value"),
          config, config_from_data, prop;

      // default config
      config = {
          skin: "flat",
          type: "single",

          min: 10,
          max: 100,
          from: null,
          to: null,
          step: 1,

          min_interval: 0,
          max_interval: 0,
          drag_interval: false,

          values: [],
          p_values: [],

          from_fixed: false,
          from_min: null,
          from_max: null,
          from_shadow: false,

          to_fixed: false,
          to_min: null,
          to_max: null,
          to_shadow: false,

          prettify_enabled: true,
          prettify_separator: " ",
          prettify: null,

          force_edges: false,

          keyboard: true,

          grid: false,
          grid_margin: true,
          grid_num: 4,
          grid_snap: false,

          hide_min_max: false,
          hide_from_to: false,

          prefix: "",
          postfix: "",
          max_postfix: "",
          decorate_both: true,
          values_separator: " — ",

          input_values_separator: ";",

          disable: false,
          block: false,

          extra_classes: "",

          scope: null,
          onStart: null,
          onChange: null,
          onFinish: null,
          onUpdate: null
      };


      // check if base element is input
      if ($inp[0].nodeName !== "INPUT") {
          console && console.warn && console.warn("Base element should be <input>!", $inp[0]);
      }


      // config from data-attributes extends js config
      config_from_data = {
          skin: $inp.data("skin"),
          type: $inp.data("type"),

          min: $inp.data("min"),
          max: $inp.data("max"),
          from: $inp.data("from"),
          to: $inp.data("to"),
          step: $inp.data("step"),

          min_interval: $inp.data("minInterval"),
          max_interval: $inp.data("maxInterval"),
          drag_interval: $inp.data("dragInterval"),

          values: $inp.data("values"),

          from_fixed: $inp.data("fromFixed"),
          from_min: $inp.data("fromMin"),
          from_max: $inp.data("fromMax"),
          from_shadow: $inp.data("fromShadow"),

          to_fixed: $inp.data("toFixed"),
          to_min: $inp.data("toMin"),
          to_max: $inp.data("toMax"),
          to_shadow: $inp.data("toShadow"),

          prettify_enabled: $inp.data("prettifyEnabled"),
          prettify_separator: $inp.data("prettifySeparator"),

          force_edges: $inp.data("forceEdges"),

          keyboard: $inp.data("keyboard"),

          grid: $inp.data("grid"),
          grid_margin: $inp.data("gridMargin"),
          grid_num: $inp.data("gridNum"),
          grid_snap: $inp.data("gridSnap"),

          hide_min_max: $inp.data("hideMinMax"),
          hide_from_to: $inp.data("hideFromTo"),

          prefix: $inp.data("prefix"),
          postfix: $inp.data("postfix"),
          max_postfix: $inp.data("maxPostfix"),
          decorate_both: $inp.data("decorateBoth"),
          values_separator: $inp.data("valuesSeparator"),

          input_values_separator: $inp.data("inputValuesSeparator"),

          disable: $inp.data("disable"),
          block: $inp.data("block"),

          extra_classes: $inp.data("extraClasses"),
      };
      config_from_data.values = config_from_data.values && config_from_data.values.split(",");

      for (prop in config_from_data) {
          if (config_from_data.hasOwnProperty(prop)) {
              if (config_from_data[prop] === undefined || config_from_data[prop] === "") {
                  delete config_from_data[prop];
              }
          }
      }


      // input value extends default config
      if (val !== undefined && val !== "") {
          val = val.split(config_from_data.input_values_separator || options.input_values_separator || ";");

          if (val[0] && val[0] == +val[0]) {
              val[0] = +val[0];
          }
          if (val[1] && val[1] == +val[1]) {
              val[1] = +val[1];
          }

          if (options && options.values && options.values.length) {
              config.from = val[0] && options.values.indexOf(val[0]);
              config.to = val[1] && options.values.indexOf(val[1]);
          } else {
              config.from = val[0] && +val[0];
              config.to = val[1] && +val[1];
          }
      }



      // js config extends default config
      $.extend(config, options);


      // data config extends config
      $.extend(config, config_from_data);
      this.options = config;



      // validate config, to be sure that all data types are correct
      this.update_check = {};
      this.validate();



      // default result object, returned to callbacks
      this.result = {
          input: this.$cache.input,
          slider: null,

          min: this.options.min,
          max: this.options.max,

          from: this.options.from,
          from_percent: 0,
          from_value: null,

          to: this.options.to,
          to_percent: 0,
          to_value: null
      };



      this.init();
  };

  IonRangeSlider.prototype = {

      /**
       * Starts or updates the plugin instance
       *
       * @param [is_update] {boolean}
       */
      init: function (is_update) {
          this.no_diapason = false;
          this.coords.p_step = this.convertToPercent(this.options.step, true);

          this.target = "base";

          this.toggleInput();
          this.append();
          this.setMinMax();

          if (is_update) {
              this.force_redraw = true;
              this.calc(true);

              // callbacks called
              this.callOnUpdate();
          } else {
              this.force_redraw = true;
              this.calc(true);

              // callbacks called
              this.callOnStart();
          }

          this.updateScene();
      },

      /**
       * Appends slider template to a DOM
       */
      append: function () {
          var container_html = '<span class="irs irs--' + this.options.skin + ' js-irs-' + this.plugin_count + ' ' + this.options.extra_classes + '"></span>';
          this.$cache.input.before(container_html);
          this.$cache.input.prop("readonly", true);
          this.$cache.cont = this.$cache.input.prev();
          this.result.slider = this.$cache.cont;

          this.$cache.cont.html(base_html);
          this.$cache.rs = this.$cache.cont.find(".irs");
          this.$cache.min = this.$cache.cont.find(".irs-min");
          this.$cache.max = this.$cache.cont.find(".irs-max");
          this.$cache.from = this.$cache.cont.find(".irs-from");
          this.$cache.to = this.$cache.cont.find(".irs-to");
          this.$cache.single = this.$cache.cont.find(".irs-single");
          this.$cache.line = this.$cache.cont.find(".irs-line");
          this.$cache.grid = this.$cache.cont.find(".irs-grid");

          if (this.options.type === "single") {
              this.$cache.cont.append(single_html);
              this.$cache.bar = this.$cache.cont.find(".irs-bar");
              this.$cache.edge = this.$cache.cont.find(".irs-bar-edge");
              this.$cache.s_single = this.$cache.cont.find(".single");
              this.$cache.from[0].style.visibility = "hidden";
              this.$cache.to[0].style.visibility = "hidden";
              this.$cache.shad_single = this.$cache.cont.find(".shadow-single");
          } else {
              this.$cache.cont.append(double_html);
              this.$cache.bar = this.$cache.cont.find(".irs-bar");
              this.$cache.s_from = this.$cache.cont.find(".from");
              this.$cache.s_to = this.$cache.cont.find(".to");
              this.$cache.shad_from = this.$cache.cont.find(".shadow-from");
              this.$cache.shad_to = this.$cache.cont.find(".shadow-to");

              this.setTopHandler();
          }

          if (this.options.hide_from_to) {
              this.$cache.from[0].style.display = "none";
              this.$cache.to[0].style.display = "none";
              this.$cache.single[0].style.display = "none";
          }

          this.appendGrid();

          if (this.options.disable) {
              this.appendDisableMask();
              this.$cache.input[0].disabled = true;
          } else {
              this.$cache.input[0].disabled = false;
              this.removeDisableMask();
              this.bindEvents();
          }

          // block only if not disabled
          if (!this.options.disable) {
              if (this.options.block) {
                  this.appendDisableMask();
              } else {
                  this.removeDisableMask();
              }
          }

          if (this.options.drag_interval) {
              this.$cache.bar[0].style.cursor = "ew-resize";
          }
      },

      /**
       * Determine which handler has a priority
       * works only for double slider type
       */
      setTopHandler: function () {
          var min = this.options.min,
              max = this.options.max,
              from = this.options.from,
              to = this.options.to;

          if (from > min && to === max) {
              this.$cache.s_from.addClass("type_last");
          } else if (to < max) {
              this.$cache.s_to.addClass("type_last");
          }
      },

      /**
       * Determine which handles was clicked last
       * and which handler should have hover effect
       *
       * @param target {String}
       */
      changeLevel: function (target) {
          switch (target) {
              case "single":
                  this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_single_fake);
                  this.$cache.s_single.addClass("state_hover");
                  break;
              case "from":
                  this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_from_fake);
                  this.$cache.s_from.addClass("state_hover");
                  this.$cache.s_from.addClass("type_last");
                  this.$cache.s_to.removeClass("type_last");
                  break;
              case "to":
                  this.coords.p_gap = this.toFixed(this.coords.p_pointer - this.coords.p_to_fake);
                  this.$cache.s_to.addClass("state_hover");
                  this.$cache.s_to.addClass("type_last");
                  this.$cache.s_from.removeClass("type_last");
                  break;
              case "both":
                  this.coords.p_gap_left = this.toFixed(this.coords.p_pointer - this.coords.p_from_fake);
                  this.coords.p_gap_right = this.toFixed(this.coords.p_to_fake - this.coords.p_pointer);
                  this.$cache.s_to.removeClass("type_last");
                  this.$cache.s_from.removeClass("type_last");
                  break;
          }
      },

      /**
       * Then slider is disabled
       * appends extra layer with opacity
       */
      appendDisableMask: function () {
          this.$cache.cont.append(disable_html);
          this.$cache.cont.addClass("irs-disabled");
      },

      /**
       * Then slider is not disabled
       * remove disable mask
       */
      removeDisableMask: function () {
          this.$cache.cont.remove(".irs-disable-mask");
          this.$cache.cont.removeClass("irs-disabled");
      },

      /**
       * Remove slider instance
       * and unbind all events
       */
      remove: function () {
          this.$cache.cont.remove();
          this.$cache.cont = null;

          this.$cache.line.off("keydown.irs_" + this.plugin_count);

          this.$cache.body.off("touchmove.irs_" + this.plugin_count);
          this.$cache.body.off("mousemove.irs_" + this.plugin_count);

          this.$cache.win.off("touchend.irs_" + this.plugin_count);
          this.$cache.win.off("mouseup.irs_" + this.plugin_count);

          if (is_old_ie) {
              this.$cache.body.off("mouseup.irs_" + this.plugin_count);
              this.$cache.body.off("mouseleave.irs_" + this.plugin_count);
          }

          this.$cache.grid_labels = [];
          this.coords.big = [];
          this.coords.big_w = [];
          this.coords.big_p = [];
          this.coords.big_x = [];

          cancelAnimationFrame(this.raf_id);
      },

      /**
       * bind all slider events
       */
      bindEvents: function () {
          if (this.no_diapason) {
              return;
          }

          this.$cache.body.on("touchmove.irs_" + this.plugin_count, this.pointerMove.bind(this));
          this.$cache.body.on("mousemove.irs_" + this.plugin_count, this.pointerMove.bind(this));

          this.$cache.win.on("touchend.irs_" + this.plugin_count, this.pointerUp.bind(this));
          this.$cache.win.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));

          this.$cache.line.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
          this.$cache.line.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

          this.$cache.line.on("focus.irs_" + this.plugin_count, this.pointerFocus.bind(this));

          if (this.options.drag_interval && this.options.type === "double") {
              this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
              this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "both"));
          } else {
              this.$cache.bar.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
              this.$cache.bar.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
          }

          if (this.options.type === "single") {
              this.$cache.single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
              this.$cache.s_single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
              this.$cache.shad_single.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

              this.$cache.single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
              this.$cache.s_single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "single"));
              this.$cache.edge.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
              this.$cache.shad_single.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
          } else {
              this.$cache.single.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, null));
              this.$cache.single.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, null));

              this.$cache.from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
              this.$cache.s_from.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
              this.$cache.to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
              this.$cache.s_to.on("touchstart.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
              this.$cache.shad_from.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
              this.$cache.shad_to.on("touchstart.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));

              this.$cache.from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
              this.$cache.s_from.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "from"));
              this.$cache.to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
              this.$cache.s_to.on("mousedown.irs_" + this.plugin_count, this.pointerDown.bind(this, "to"));
              this.$cache.shad_from.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
              this.$cache.shad_to.on("mousedown.irs_" + this.plugin_count, this.pointerClick.bind(this, "click"));
          }

          if (this.options.keyboard) {
              this.$cache.line.on("keydown.irs_" + this.plugin_count, this.key.bind(this, "keyboard"));
          }

          if (is_old_ie) {
              this.$cache.body.on("mouseup.irs_" + this.plugin_count, this.pointerUp.bind(this));
              this.$cache.body.on("mouseleave.irs_" + this.plugin_count, this.pointerUp.bind(this));
          }
      },

      /**
       * Focus with tabIndex
       *
       * @param e {Object} event object
       */
      pointerFocus: function (e) {
          if (!this.target) {
              var x;
              var $handle;

              if (this.options.type === "single") {
                  $handle = this.$cache.single;
              } else {
                  $handle = this.$cache.from;
              }

              x = $handle.offset().left;
              x += ($handle.width() / 2) - 1;

              this.pointerClick("single", {preventDefault: function () {}, pageX: x});
          }
      },

      /**
       * Mousemove or touchmove
       * only for handlers
       *
       * @param e {Object} event object
       */
      pointerMove: function (e) {
          if (!this.dragging) {
              return;
          }

          var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
          this.coords.x_pointer = x - this.coords.x_gap;

          this.calc();
      },

      /**
       * Mouseup or touchend
       * only for handlers
       *
       * @param e {Object} event object
       */
      pointerUp: function (e) {
          if (this.current_plugin !== this.plugin_count) {
              return;
          }

          if (this.is_active) {
              this.is_active = false;
          } else {
              return;
          }

          this.$cache.cont.find(".state_hover").removeClass("state_hover");

          this.force_redraw = true;

          if (is_old_ie) {
              $("*").prop("unselectable", false);
          }

          this.updateScene();
          this.restoreOriginalMinInterval();

          // callbacks call
          if ($.contains(this.$cache.cont[0], e.target) || this.dragging) {
              this.callOnFinish();
          }

          this.dragging = false;
      },

      /**
       * Mousedown or touchstart
       * only for handlers
       *
       * @param target {String|null}
       * @param e {Object} event object
       */
      pointerDown: function (target, e) {
          e.preventDefault();
          var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
          if (e.button === 2) {
              return;
          }

          if (target === "both") {
              this.setTempMinInterval();
          }

          if (!target) {
              target = this.target || "from";
          }

          this.current_plugin = this.plugin_count;
          this.target = target;

          this.is_active = true;
          this.dragging = true;

          this.coords.x_gap = this.$cache.rs.offset().left;
          this.coords.x_pointer = x - this.coords.x_gap;

          this.calcPointerPercent();
          this.changeLevel(target);

          if (is_old_ie) {
              $("*").prop("unselectable", true);
          }

          this.$cache.line.trigger("focus");

          this.updateScene();
      },

      /**
       * Mousedown or touchstart
       * for other slider elements, like diapason line
       *
       * @param target {String}
       * @param e {Object} event object
       */
      pointerClick: function (target, e) {
          e.preventDefault();
          var x = e.pageX || e.originalEvent.touches && e.originalEvent.touches[0].pageX;
          if (e.button === 2) {
              return;
          }

          this.current_plugin = this.plugin_count;
          this.target = target;

          this.is_click = true;
          this.coords.x_gap = this.$cache.rs.offset().left;
          this.coords.x_pointer = +(x - this.coords.x_gap).toFixed();

          this.force_redraw = true;
          this.calc();

          this.$cache.line.trigger("focus");
      },

      /**
       * Keyborard controls for focused slider
       *
       * @param target {String}
       * @param e {Object} event object
       * @returns {boolean|undefined}
       */
      key: function (target, e) {
          if (this.current_plugin !== this.plugin_count || e.altKey || e.ctrlKey || e.shiftKey || e.metaKey) {
              return;
          }

          switch (e.which) {
              case 83: // W
              case 65: // A
              case 40: // DOWN
              case 37: // LEFT
                  e.preventDefault();
                  this.moveByKey(false);
                  break;

              case 87: // S
              case 68: // D
              case 38: // UP
              case 39: // RIGHT
                  e.preventDefault();
                  this.moveByKey(true);
                  break;
          }

          return true;
      },

      /**
       * Move by key
       *
       * @param right {boolean} direction to move
       */
      moveByKey: function (right) {
          var p = this.coords.p_pointer;
          var p_step = (this.options.max - this.options.min) / 100;
          p_step = this.options.step / p_step;

          if (right) {
              p += p_step;
          } else {
              p -= p_step;
          }

          this.coords.x_pointer = this.toFixed(this.coords.w_rs / 100 * p);
          this.is_key = true;
          this.calc();
      },

      /**
       * Set visibility and content
       * of Min and Max labels
       */
      setMinMax: function () {
          if (!this.options) {
              return;
          }

          if (this.options.hide_min_max) {
              this.$cache.min[0].style.display = "none";
              this.$cache.max[0].style.display = "none";
              return;
          }

          if (this.options.values.length) {
              this.$cache.min.html(this.decorate(this.options.p_values[this.options.min]));
              this.$cache.max.html(this.decorate(this.options.p_values[this.options.max]));
          } else {
              var min_pretty = this._prettify(this.options.min);
              var max_pretty = this._prettify(this.options.max);

              this.result.min_pretty = min_pretty;
              this.result.max_pretty = max_pretty;

              this.$cache.min.html(this.decorate(min_pretty, this.options.min));
              this.$cache.max.html(this.decorate(max_pretty, this.options.max));
          }

          this.labels.w_min = this.$cache.min.outerWidth(false);
          this.labels.w_max = this.$cache.max.outerWidth(false);
      },

      /**
       * Then dragging interval, prevent interval collapsing
       * using min_interval option
       */
      setTempMinInterval: function () {
          var interval = this.result.to - this.result.from;

          if (this.old_min_interval === null) {
              this.old_min_interval = this.options.min_interval;
          }

          this.options.min_interval = interval;
      },

      /**
       * Restore min_interval option to original
       */
      restoreOriginalMinInterval: function () {
          if (this.old_min_interval !== null) {
              this.options.min_interval = this.old_min_interval;
              this.old_min_interval = null;
          }
      },



      // =============================================================================================================
      // Calculations

      /**
       * All calculations and measures start here
       *
       * @param update {boolean=}
       */
      calc: function (update) {
          if (!this.options) {
              return;
          }

          this.calc_count++;

          if (this.calc_count === 10 || update) {
              this.calc_count = 0;
              this.coords.w_rs = this.$cache.rs.outerWidth(false);

              this.calcHandlePercent();
          }

          if (!this.coords.w_rs) {
              return;
          }

          this.calcPointerPercent();
          var handle_x = this.getHandleX();


          if (this.target === "both") {
              this.coords.p_gap = 0;
              handle_x = this.getHandleX();
          }

          if (this.target === "click") {
              this.coords.p_gap = this.coords.p_handle / 2;
              handle_x = this.getHandleX();

              if (this.options.drag_interval) {
                  this.target = "both_one";
              } else {
                  this.target = this.chooseHandle(handle_x);
              }
          }

          switch (this.target) {
              case "base":
                  var w = (this.options.max - this.options.min) / 100,
                      f = (this.result.from - this.options.min) / w,
                      t = (this.result.to - this.options.min) / w;

                  this.coords.p_single_real = this.toFixed(f);
                  this.coords.p_from_real = this.toFixed(f);
                  this.coords.p_to_real = this.toFixed(t);

                  this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);
                  this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                  this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);

                  this.coords.p_single_fake = this.convertToFakePercent(this.coords.p_single_real);
                  this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);
                  this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

                  this.target = null;

                  break;

              case "single":
                  if (this.options.from_fixed) {
                      break;
                  }

                  this.coords.p_single_real = this.convertToRealPercent(handle_x);
                  this.coords.p_single_real = this.calcWithStep(this.coords.p_single_real);
                  this.coords.p_single_real = this.checkDiapason(this.coords.p_single_real, this.options.from_min, this.options.from_max);

                  this.coords.p_single_fake = this.convertToFakePercent(this.coords.p_single_real);

                  break;

              case "from":
                  if (this.options.from_fixed) {
                      break;
                  }

                  this.coords.p_from_real = this.convertToRealPercent(handle_x);
                  this.coords.p_from_real = this.calcWithStep(this.coords.p_from_real);
                  if (this.coords.p_from_real > this.coords.p_to_real) {
                      this.coords.p_from_real = this.coords.p_to_real;
                  }
                  this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                  this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                  this.coords.p_from_real = this.checkMaxInterval(this.coords.p_from_real, this.coords.p_to_real, "from");

                  this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

                  break;

              case "to":
                  if (this.options.to_fixed) {
                      break;
                  }

                  this.coords.p_to_real = this.convertToRealPercent(handle_x);
                  this.coords.p_to_real = this.calcWithStep(this.coords.p_to_real);
                  if (this.coords.p_to_real < this.coords.p_from_real) {
                      this.coords.p_to_real = this.coords.p_from_real;
                  }
                  this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                  this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                  this.coords.p_to_real = this.checkMaxInterval(this.coords.p_to_real, this.coords.p_from_real, "to");

                  this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

                  break;

              case "both":
                  if (this.options.from_fixed || this.options.to_fixed) {
                      break;
                  }

                  handle_x = this.toFixed(handle_x + (this.coords.p_handle * 0.001));

                  this.coords.p_from_real = this.convertToRealPercent(handle_x) - this.coords.p_gap_left;
                  this.coords.p_from_real = this.calcWithStep(this.coords.p_from_real);
                  this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                  this.coords.p_from_real = this.checkMinInterval(this.coords.p_from_real, this.coords.p_to_real, "from");
                  this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

                  this.coords.p_to_real = this.convertToRealPercent(handle_x) + this.coords.p_gap_right;
                  this.coords.p_to_real = this.calcWithStep(this.coords.p_to_real);
                  this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                  this.coords.p_to_real = this.checkMinInterval(this.coords.p_to_real, this.coords.p_from_real, "to");
                  this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

                  break;

              case "both_one":
                  if (this.options.from_fixed || this.options.to_fixed) {
                      break;
                  }

                  var real_x = this.convertToRealPercent(handle_x),
                      from = this.result.from_percent,
                      to = this.result.to_percent,
                      full = to - from,
                      half = full / 2,
                      new_from = real_x - half,
                      new_to = real_x + half;

                  if (new_from < 0) {
                      new_from = 0;
                      new_to = new_from + full;
                  }

                  if (new_to > 100) {
                      new_to = 100;
                      new_from = new_to - full;
                  }

                  this.coords.p_from_real = this.calcWithStep(new_from);
                  this.coords.p_from_real = this.checkDiapason(this.coords.p_from_real, this.options.from_min, this.options.from_max);
                  this.coords.p_from_fake = this.convertToFakePercent(this.coords.p_from_real);

                  this.coords.p_to_real = this.calcWithStep(new_to);
                  this.coords.p_to_real = this.checkDiapason(this.coords.p_to_real, this.options.to_min, this.options.to_max);
                  this.coords.p_to_fake = this.convertToFakePercent(this.coords.p_to_real);

                  break;
          }

          if (this.options.type === "single") {
              this.coords.p_bar_x = (this.coords.p_handle / 2);
              this.coords.p_bar_w = this.coords.p_single_fake;

              this.result.from_percent = this.coords.p_single_real;
              this.result.from = this.convertToValue(this.coords.p_single_real);
              this.result.from_pretty = this._prettify(this.result.from);

              if (this.options.values.length) {
                  this.result.from_value = this.options.values[this.result.from];
              }
          } else {
              this.coords.p_bar_x = this.toFixed(this.coords.p_from_fake + (this.coords.p_handle / 2));
              this.coords.p_bar_w = this.toFixed(this.coords.p_to_fake - this.coords.p_from_fake);

              this.result.from_percent = this.coords.p_from_real;
              this.result.from = this.convertToValue(this.coords.p_from_real);
              this.result.from_pretty = this._prettify(this.result.from);
              this.result.to_percent = this.coords.p_to_real;
              this.result.to = this.convertToValue(this.coords.p_to_real);
              this.result.to_pretty = this._prettify(this.result.to);

              if (this.options.values.length) {
                  this.result.from_value = this.options.values[this.result.from];
                  this.result.to_value = this.options.values[this.result.to];
              }
          }

          this.calcMinMax();
          this.calcLabels();
      },


      /**
       * calculates pointer X in percent
       */
      calcPointerPercent: function () {
          if (!this.coords.w_rs) {
              this.coords.p_pointer = 0;
              return;
          }

          if (this.coords.x_pointer < 0 || isNaN(this.coords.x_pointer)  ) {
              this.coords.x_pointer = 0;
          } else if (this.coords.x_pointer > this.coords.w_rs) {
              this.coords.x_pointer = this.coords.w_rs;
          }

          this.coords.p_pointer = this.toFixed(this.coords.x_pointer / this.coords.w_rs * 100);
      },

      convertToRealPercent: function (fake) {
          var full = 100 - this.coords.p_handle;
          return fake / full * 100;
      },

      convertToFakePercent: function (real) {
          var full = 100 - this.coords.p_handle;
          return real / 100 * full;
      },

      getHandleX: function () {
          var max = 100 - this.coords.p_handle,
              x = this.toFixed(this.coords.p_pointer - this.coords.p_gap);

          if (x < 0) {
              x = 0;
          } else if (x > max) {
              x = max;
          }

          return x;
      },

      calcHandlePercent: function () {
          if (this.options.type === "single") {
              this.coords.w_handle = this.$cache.s_single.outerWidth(false);
          } else {
              this.coords.w_handle = this.$cache.s_from.outerWidth(false);
          }

          this.coords.p_handle = this.toFixed(this.coords.w_handle / this.coords.w_rs * 100);
      },

      /**
       * Find closest handle to pointer click
       *
       * @param real_x {Number}
       * @returns {String}
       */
      chooseHandle: function (real_x) {
          if (this.options.type === "single") {
              return "single";
          } else {
              var m_point = this.coords.p_from_real + ((this.coords.p_to_real - this.coords.p_from_real) / 2);
              if (real_x >= m_point) {
                  return this.options.to_fixed ? "from" : "to";
              } else {
                  return this.options.from_fixed ? "to" : "from";
              }
          }
      },

      /**
       * Measure Min and Max labels width in percent
       */
      calcMinMax: function () {
          if (!this.coords.w_rs) {
              return;
          }

          this.labels.p_min = this.labels.w_min / this.coords.w_rs * 100;
          this.labels.p_max = this.labels.w_max / this.coords.w_rs * 100;
      },

      /**
       * Measure labels width and X in percent
       */
      calcLabels: function () {
          if (!this.coords.w_rs || this.options.hide_from_to) {
              return;
          }

          if (this.options.type === "single") {

              this.labels.w_single = this.$cache.single.outerWidth(false);
              this.labels.p_single_fake = this.labels.w_single / this.coords.w_rs * 100;
              this.labels.p_single_left = this.coords.p_single_fake + (this.coords.p_handle / 2) - (this.labels.p_single_fake / 2);
              this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single_fake);

          } else {

              this.labels.w_from = this.$cache.from.outerWidth(false);
              this.labels.p_from_fake = this.labels.w_from / this.coords.w_rs * 100;
              this.labels.p_from_left = this.coords.p_from_fake + (this.coords.p_handle / 2) - (this.labels.p_from_fake / 2);
              this.labels.p_from_left = this.toFixed(this.labels.p_from_left);
              this.labels.p_from_left = this.checkEdges(this.labels.p_from_left, this.labels.p_from_fake);

              this.labels.w_to = this.$cache.to.outerWidth(false);
              this.labels.p_to_fake = this.labels.w_to / this.coords.w_rs * 100;
              this.labels.p_to_left = this.coords.p_to_fake + (this.coords.p_handle / 2) - (this.labels.p_to_fake / 2);
              this.labels.p_to_left = this.toFixed(this.labels.p_to_left);
              this.labels.p_to_left = this.checkEdges(this.labels.p_to_left, this.labels.p_to_fake);

              this.labels.w_single = this.$cache.single.outerWidth(false);
              this.labels.p_single_fake = this.labels.w_single / this.coords.w_rs * 100;
              this.labels.p_single_left = ((this.labels.p_from_left + this.labels.p_to_left + this.labels.p_to_fake) / 2) - (this.labels.p_single_fake / 2);
              this.labels.p_single_left = this.toFixed(this.labels.p_single_left);
              this.labels.p_single_left = this.checkEdges(this.labels.p_single_left, this.labels.p_single_fake);

          }
      },



      // =============================================================================================================
      // Drawings

      /**
       * Main function called in request animation frame
       * to update everything
       */
      updateScene: function () {
          if (this.raf_id) {
              cancelAnimationFrame(this.raf_id);
              this.raf_id = null;
          }

          clearTimeout(this.update_tm);
          this.update_tm = null;

          if (!this.options) {
              return;
          }

          this.drawHandles();

          if (this.is_active) {
              this.raf_id = requestAnimationFrame(this.updateScene.bind(this));
          } else {
              this.update_tm = setTimeout(this.updateScene.bind(this), 300);
          }
      },

      /**
       * Draw handles
       */
      drawHandles: function () {
          this.coords.w_rs = this.$cache.rs.outerWidth(false);

          if (!this.coords.w_rs) {
              return;
          }

          if (this.coords.w_rs !== this.coords.w_rs_old) {
              this.target = "base";
              this.is_resize = true;
          }

          if (this.coords.w_rs !== this.coords.w_rs_old || this.force_redraw) {
              this.setMinMax();
              this.calc(true);
              this.drawLabels();
              if (this.options.grid) {
                  this.calcGridMargin();
                  this.calcGridLabels();
              }
              this.force_redraw = true;
              this.coords.w_rs_old = this.coords.w_rs;
              this.drawShadow();
          }

          if (!this.coords.w_rs) {
              return;
          }

          if (!this.dragging && !this.force_redraw && !this.is_key) {
              return;
          }

          if (this.old_from !== this.result.from || this.old_to !== this.result.to || this.force_redraw || this.is_key) {

              this.drawLabels();

              this.$cache.bar[0].style.left = this.coords.p_bar_x + "%";
              this.$cache.bar[0].style.width = this.coords.p_bar_w + "%";

              if (this.options.type === "single") {
                  this.$cache.bar[0].style.left = 0;
                  this.$cache.bar[0].style.width = this.coords.p_bar_w + this.coords.p_bar_x + "%";

                  this.$cache.s_single[0].style.left = this.coords.p_single_fake + "%";

                  this.$cache.single[0].style.left = this.labels.p_single_left + "%";
              } else {
                  this.$cache.s_from[0].style.left = this.coords.p_from_fake + "%";
                  this.$cache.s_to[0].style.left = this.coords.p_to_fake + "%";

                  if (this.old_from !== this.result.from || this.force_redraw) {
                      this.$cache.from[0].style.left = this.labels.p_from_left + "%";
                  }
                  if (this.old_to !== this.result.to || this.force_redraw) {
                      this.$cache.to[0].style.left = this.labels.p_to_left + "%";
                  }

                  this.$cache.single[0].style.left = this.labels.p_single_left + "%";
              }

              this.writeToInput();

              if ((this.old_from !== this.result.from || this.old_to !== this.result.to) && !this.is_start) {
                  this.$cache.input.trigger("change");
                  this.$cache.input.trigger("input");
              }

              this.old_from = this.result.from;
              this.old_to = this.result.to;

              // callbacks call
              if (!this.is_resize && !this.is_update && !this.is_start && !this.is_finish) {
                  this.callOnChange();
              }
              if (this.is_key || this.is_click) {
                  this.is_key = false;
                  this.is_click = false;
                  this.callOnFinish();
              }

              this.is_update = false;
              this.is_resize = false;
              this.is_finish = false;
          }

          this.is_start = false;
          this.is_key = false;
          this.is_click = false;
          this.force_redraw = false;
      },

      /**
       * Draw labels
       * measure labels collisions
       * collapse close labels
       */
      drawLabels: function () {
          if (!this.options) {
              return;
          }

          var values_num = this.options.values.length;
          var p_values = this.options.p_values;
          var text_single;
          var text_from;
          var text_to;
          var from_pretty;
          var to_pretty;

          if (this.options.hide_from_to) {
              return;
          }

          if (this.options.type === "single") {

              if (values_num) {
                  text_single = this.decorate(p_values[this.result.from]);
                  this.$cache.single.html(text_single);
              } else {
                  from_pretty = this._prettify(this.result.from);

                  text_single = this.decorate(from_pretty, this.result.from);
                  this.$cache.single.html(text_single);
              }

              this.calcLabels();

              if (this.labels.p_single_left < this.labels.p_min + 1) {
                  this.$cache.min[0].style.visibility = "hidden";
              } else {
                  this.$cache.min[0].style.visibility = "visible";
              }

              if (this.labels.p_single_left + this.labels.p_single_fake > 100 - this.labels.p_max - 1) {
                  this.$cache.max[0].style.visibility = "hidden";
              } else {
                  this.$cache.max[0].style.visibility = "visible";
              }

          } else {

              if (values_num) {

                  if (this.options.decorate_both) {
                      text_single = this.decorate(p_values[this.result.from]);
                      text_single += this.options.values_separator;
                      text_single += this.decorate(p_values[this.result.to]);
                  } else {
                      text_single = this.decorate(p_values[this.result.from] + this.options.values_separator + p_values[this.result.to]);
                  }
                  text_from = this.decorate(p_values[this.result.from]);
                  text_to = this.decorate(p_values[this.result.to]);

                  this.$cache.single.html(text_single);
                  this.$cache.from.html(text_from);
                  this.$cache.to.html(text_to);

              } else {
                  from_pretty = this._prettify(this.result.from);
                  to_pretty = this._prettify(this.result.to);

                  if (this.options.decorate_both) {
                      text_single = this.decorate(from_pretty, this.result.from);
                      text_single += this.options.values_separator;
                      text_single += this.decorate(to_pretty, this.result.to);
                  } else {
                      text_single = this.decorate(from_pretty + this.options.values_separator + to_pretty, this.result.to);
                  }
                  text_from = this.decorate(from_pretty, this.result.from);
                  text_to = this.decorate(to_pretty, this.result.to);

                  this.$cache.single.html(text_single);
                  this.$cache.from.html(text_from);
                  this.$cache.to.html(text_to);

              }

              this.calcLabels();

              var min = Math.min(this.labels.p_single_left, this.labels.p_from_left),
                  single_left = this.labels.p_single_left + this.labels.p_single_fake,
                  to_left = this.labels.p_to_left + this.labels.p_to_fake,
                  max = Math.max(single_left, to_left);

              if (this.labels.p_from_left + this.labels.p_from_fake >= this.labels.p_to_left) {
                  this.$cache.from[0].style.visibility = "hidden";
                  this.$cache.to[0].style.visibility = "hidden";
                  this.$cache.single[0].style.visibility = "visible";

                  if (this.result.from === this.result.to) {
                      if (this.target === "from") {
                          this.$cache.from[0].style.visibility = "visible";
                      } else if (this.target === "to") {
                          this.$cache.to[0].style.visibility = "visible";
                      } else if (!this.target) {
                          this.$cache.from[0].style.visibility = "visible";
                      }
                      this.$cache.single[0].style.visibility = "hidden";
                      max = to_left;
                  } else {
                      this.$cache.from[0].style.visibility = "hidden";
                      this.$cache.to[0].style.visibility = "hidden";
                      this.$cache.single[0].style.visibility = "visible";
                      max = Math.max(single_left, to_left);
                  }
              } else {
                  this.$cache.from[0].style.visibility = "visible";
                  this.$cache.to[0].style.visibility = "visible";
                  this.$cache.single[0].style.visibility = "hidden";
              }

              if (min < this.labels.p_min + 1) {
                  this.$cache.min[0].style.visibility = "hidden";
              } else {
                  this.$cache.min[0].style.visibility = "visible";
              }

              if (max > 100 - this.labels.p_max - 1) {
                  this.$cache.max[0].style.visibility = "hidden";
              } else {
                  this.$cache.max[0].style.visibility = "visible";
              }

          }
      },

      /**
       * Draw shadow intervals
       */
      drawShadow: function () {
          var o = this.options,
              c = this.$cache,

              is_from_min = typeof o.from_min === "number" && !isNaN(o.from_min),
              is_from_max = typeof o.from_max === "number" && !isNaN(o.from_max),
              is_to_min = typeof o.to_min === "number" && !isNaN(o.to_min),
              is_to_max = typeof o.to_max === "number" && !isNaN(o.to_max),

              from_min,
              from_max,
              to_min,
              to_max;

          if (o.type === "single") {
              if (o.from_shadow && (is_from_min || is_from_max)) {
                  from_min = this.convertToPercent(is_from_min ? o.from_min : o.min);
                  from_max = this.convertToPercent(is_from_max ? o.from_max : o.max) - from_min;
                  from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
                  from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
                  from_min = from_min + (this.coords.p_handle / 2);

                  c.shad_single[0].style.display = "block";
                  c.shad_single[0].style.left = from_min + "%";
                  c.shad_single[0].style.width = from_max + "%";
              } else {
                  c.shad_single[0].style.display = "none";
              }
          } else {
              if (o.from_shadow && (is_from_min || is_from_max)) {
                  from_min = this.convertToPercent(is_from_min ? o.from_min : o.min);
                  from_max = this.convertToPercent(is_from_max ? o.from_max : o.max) - from_min;
                  from_min = this.toFixed(from_min - (this.coords.p_handle / 100 * from_min));
                  from_max = this.toFixed(from_max - (this.coords.p_handle / 100 * from_max));
                  from_min = from_min + (this.coords.p_handle / 2);

                  c.shad_from[0].style.display = "block";
                  c.shad_from[0].style.left = from_min + "%";
                  c.shad_from[0].style.width = from_max + "%";
              } else {
                  c.shad_from[0].style.display = "none";
              }

              if (o.to_shadow && (is_to_min || is_to_max)) {
                  to_min = this.convertToPercent(is_to_min ? o.to_min : o.min);
                  to_max = this.convertToPercent(is_to_max ? o.to_max : o.max) - to_min;
                  to_min = this.toFixed(to_min - (this.coords.p_handle / 100 * to_min));
                  to_max = this.toFixed(to_max - (this.coords.p_handle / 100 * to_max));
                  to_min = to_min + (this.coords.p_handle / 2);

                  c.shad_to[0].style.display = "block";
                  c.shad_to[0].style.left = to_min + "%";
                  c.shad_to[0].style.width = to_max + "%";
              } else {
                  c.shad_to[0].style.display = "none";
              }
          }
      },



      /**
       * Write values to input element
       */
      writeToInput: function () {
          if (this.options.type === "single") {
              if (this.options.values.length) {
                  this.$cache.input.prop("value", this.result.from_value);
              } else {
                  this.$cache.input.prop("value", this.result.from);
              }
              this.$cache.input.data("from", this.result.from);
          } else {
              if (this.options.values.length) {
                  this.$cache.input.prop("value", this.result.from_value + this.options.input_values_separator + this.result.to_value);
              } else {
                  this.$cache.input.prop("value", this.result.from + this.options.input_values_separator + this.result.to);
              }
              this.$cache.input.data("from", this.result.from);
              this.$cache.input.data("to", this.result.to);
          }
      },



      // =============================================================================================================
      // Callbacks

      callOnStart: function () {
          this.writeToInput();

          if (this.options.onStart && typeof this.options.onStart === "function") {
              if (this.options.scope) {
                  this.options.onStart.call(this.options.scope, this.result);
              } else {
                  this.options.onStart(this.result);
              }
          }
      },
      callOnChange: function () {
          this.writeToInput();

          if (this.options.onChange && typeof this.options.onChange === "function") {
              if (this.options.scope) {
                  this.options.onChange.call(this.options.scope, this.result);
              } else {
                  this.options.onChange(this.result);
              }
          }
      },
      callOnFinish: function () {
          this.writeToInput();

          if (this.options.onFinish && typeof this.options.onFinish === "function") {
              if (this.options.scope) {
                  this.options.onFinish.call(this.options.scope, this.result);
              } else {
                  this.options.onFinish(this.result);
              }
          }
      },
      callOnUpdate: function () {
          this.writeToInput();

          if (this.options.onUpdate && typeof this.options.onUpdate === "function") {
              if (this.options.scope) {
                  this.options.onUpdate.call(this.options.scope, this.result);
              } else {
                  this.options.onUpdate(this.result);
              }
          }
      },




      // =============================================================================================================
      // Service methods

      toggleInput: function () {
          this.$cache.input.toggleClass("irs-hidden-input");

          if (this.has_tab_index) {
              this.$cache.input.prop("tabindex", -1);
          } else {
              this.$cache.input.removeProp("tabindex");
          }

          this.has_tab_index = !this.has_tab_index;
      },

      /**
       * Convert real value to percent
       *
       * @param value {Number} X in real
       * @param no_min {boolean=} don't use min value
       * @returns {Number} X in percent
       */
      convertToPercent: function (value, no_min) {
          var diapason = this.options.max - this.options.min,
              one_percent = diapason / 100,
              val, percent;

          if (!diapason) {
              this.no_diapason = true;
              return 0;
          }

          if (no_min) {
              val = value;
          } else {
              val = value - this.options.min;
          }

          percent = val / one_percent;

          return this.toFixed(percent);
      },

      /**
       * Convert percent to real values
       *
       * @param percent {Number} X in percent
       * @returns {Number} X in real
       */
      convertToValue: function (percent) {
          var min = this.options.min,
              max = this.options.max,
              min_decimals = min.toString().split(".")[1],
              max_decimals = max.toString().split(".")[1],
              min_length, max_length,
              avg_decimals = 0,
              abs = 0;

          if (percent === 0) {
              return this.options.min;
          }
          if (percent === 100) {
              return this.options.max;
          }


          if (min_decimals) {
              min_length = min_decimals.length;
              avg_decimals = min_length;
          }
          if (max_decimals) {
              max_length = max_decimals.length;
              avg_decimals = max_length;
          }
          if (min_length && max_length) {
              avg_decimals = (min_length >= max_length) ? min_length : max_length;
          }

          if (min < 0) {
              abs = Math.abs(min);
              min = +(min + abs).toFixed(avg_decimals);
              max = +(max + abs).toFixed(avg_decimals);
          }

          var number = ((max - min) / 100 * percent) + min,
              string = this.options.step.toString().split(".")[1],
              result;

          if (string) {
              number = +number.toFixed(string.length);
          } else {
              number = number / this.options.step;
              number = number * this.options.step;

              number = +number.toFixed(0);
          }

          if (abs) {
              number -= abs;
          }

          if (string) {
              result = +number.toFixed(string.length);
          } else {
              result = this.toFixed(number);
          }

          if (result < this.options.min) {
              result = this.options.min;
          } else if (result > this.options.max) {
              result = this.options.max;
          }

          return result;
      },

      /**
       * Round percent value with step
       *
       * @param percent {Number}
       * @returns percent {Number} rounded
       */
      calcWithStep: function (percent) {
          var rounded = Math.round(percent / this.coords.p_step) * this.coords.p_step;

          if (rounded > 100) {
              rounded = 100;
          }
          if (percent === 100) {
              rounded = 100;
          }

          return this.toFixed(rounded);
      },

      checkMinInterval: function (p_current, p_next, type) {
          var o = this.options,
              current,
              next;

          if (!o.min_interval) {
              return p_current;
          }

          current = this.convertToValue(p_current);
          next = this.convertToValue(p_next);

          if (type === "from") {

              if (next - current < o.min_interval) {
                  current = next - o.min_interval;
              }

          } else {

              if (current - next < o.min_interval) {
                  current = next + o.min_interval;
              }

          }

          return this.convertToPercent(current);
      },

      checkMaxInterval: function (p_current, p_next, type) {
          var o = this.options,
              current,
              next;

          if (!o.max_interval) {
              return p_current;
          }

          current = this.convertToValue(p_current);
          next = this.convertToValue(p_next);

          if (type === "from") {

              if (next - current > o.max_interval) {
                  current = next - o.max_interval;
              }

          } else {

              if (current - next > o.max_interval) {
                  current = next + o.max_interval;
              }

          }

          return this.convertToPercent(current);
      },

      checkDiapason: function (p_num, min, max) {
          var num = this.convertToValue(p_num),
              o = this.options;

          if (typeof min !== "number") {
              min = o.min;
          }

          if (typeof max !== "number") {
              max = o.max;
          }

          if (num < min) {
              num = min;
          }

          if (num > max) {
              num = max;
          }

          return this.convertToPercent(num);
      },

      toFixed: function (num) {
          num = num.toFixed(20);
          return +num;
      },

      _prettify: function (num) {
          if (!this.options.prettify_enabled) {
              return num;
          }

          if (this.options.prettify && typeof this.options.prettify === "function") {
              return this.options.prettify(num);
          } else {
              return this.prettify(num);
          }
      },

      prettify: function (num) {
          var n = num.toString();
          return n.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, "$1" + this.options.prettify_separator);
      },

      checkEdges: function (left, width) {
          if (!this.options.force_edges) {
              return this.toFixed(left);
          }

          if (left < 0) {
              left = 0;
          } else if (left > 100 - width) {
              left = 100 - width;
          }

          return this.toFixed(left);
      },

      validate: function () {
          var o = this.options,
              r = this.result,
              v = o.values,
              vl = v.length,
              value,
              i;

          if (typeof o.min === "string") o.min = +o.min;
          if (typeof o.max === "string") o.max = +o.max;
          if (typeof o.from === "string") o.from = +o.from;
          if (typeof o.to === "string") o.to = +o.to;
          if (typeof o.step === "string") o.step = +o.step;

          if (typeof o.from_min === "string") o.from_min = +o.from_min;
          if (typeof o.from_max === "string") o.from_max = +o.from_max;
          if (typeof o.to_min === "string") o.to_min = +o.to_min;
          if (typeof o.to_max === "string") o.to_max = +o.to_max;

          if (typeof o.grid_num === "string") o.grid_num = +o.grid_num;

          if (o.max < o.min) {
              o.max = o.min;
          }

          if (vl) {
              o.p_values = [];
              o.min = 0;
              o.max = vl - 1;
              o.step = 1;
              o.grid_num = o.max;
              o.grid_snap = true;

              for (i = 0; i < vl; i++) {
                  value = +v[i];

                  if (!isNaN(value)) {
                      v[i] = value;
                      value = this._prettify(value);
                  } else {
                      value = v[i];
                  }

                  o.p_values.push(value);
              }
          }

          if (typeof o.from !== "number" || isNaN(o.from)) {
              o.from = o.min;
          }

          if (typeof o.to !== "number" || isNaN(o.to)) {
              o.to = o.max;
          }

          if (o.type === "single") {

              if (o.from < o.min) o.from = o.min;
              if (o.from > o.max) o.from = o.max;

          } else {

              if (o.from < o.min) o.from = o.min;
              if (o.from > o.max) o.from = o.max;

              if (o.to < o.min) o.to = o.min;
              if (o.to > o.max) o.to = o.max;

              if (this.update_check.from) {

                  if (this.update_check.from !== o.from) {
                      if (o.from > o.to) o.from = o.to;
                  }
                  if (this.update_check.to !== o.to) {
                      if (o.to < o.from) o.to = o.from;
                  }

              }

              if (o.from > o.to) o.from = o.to;
              if (o.to < o.from) o.to = o.from;

          }

          if (typeof o.step !== "number" || isNaN(o.step) || !o.step || o.step < 0) {
              o.step = 1;
          }

          if (typeof o.from_min === "number" && o.from < o.from_min) {
              o.from = o.from_min;
          }

          if (typeof o.from_max === "number" && o.from > o.from_max) {
              o.from = o.from_max;
          }

          if (typeof o.to_min === "number" && o.to < o.to_min) {
              o.to = o.to_min;
          }

          if (typeof o.to_max === "number" && o.from > o.to_max) {
              o.to = o.to_max;
          }

          if (r) {
              if (r.min !== o.min) {
                  r.min = o.min;
              }

              if (r.max !== o.max) {
                  r.max = o.max;
              }

              if (r.from < r.min || r.from > r.max) {
                  r.from = o.from;
              }

              if (r.to < r.min || r.to > r.max) {
                  r.to = o.to;
              }
          }

          if (typeof o.min_interval !== "number" || isNaN(o.min_interval) || !o.min_interval || o.min_interval < 0) {
              o.min_interval = 0;
          }

          if (typeof o.max_interval !== "number" || isNaN(o.max_interval) || !o.max_interval || o.max_interval < 0) {
              o.max_interval = 0;
          }

          if (o.min_interval && o.min_interval > o.max - o.min) {
              o.min_interval = o.max - o.min;
          }

          if (o.max_interval && o.max_interval > o.max - o.min) {
              o.max_interval = o.max - o.min;
          }
      },

      decorate: function (num, original) {
          var decorated = "",
              o = this.options;

          if (o.prefix) {
              decorated += o.prefix;
          }

          decorated += num;

          if (o.max_postfix) {
              if (o.values.length && num === o.p_values[o.max]) {
                  decorated += o.max_postfix;
                  if (o.postfix) {
                      decorated += " ";
                  }
              } else if (original === o.max) {
                  decorated += o.max_postfix;
                  if (o.postfix) {
                      decorated += " ";
                  }
              }
          }

          if (o.postfix) {
              decorated += o.postfix;
          }

          return decorated;
      },

      updateFrom: function () {
          this.result.from = this.options.from;
          this.result.from_percent = this.convertToPercent(this.result.from);
          this.result.from_pretty = this._prettify(this.result.from);
          if (this.options.values) {
              this.result.from_value = this.options.values[this.result.from];
          }
      },

      updateTo: function () {
          this.result.to = this.options.to;
          this.result.to_percent = this.convertToPercent(this.result.to);
          this.result.to_pretty = this._prettify(this.result.to);
          if (this.options.values) {
              this.result.to_value = this.options.values[this.result.to];
          }
      },

      updateResult: function () {
          this.result.min = this.options.min;
          this.result.max = this.options.max;
          this.updateFrom();
          this.updateTo();
      },


      // =============================================================================================================
      // Grid

      appendGrid: function () {
          if (!this.options.grid) {
              return;
          }

          var o = this.options,
              i, z,

              total = o.max - o.min,
              big_num = o.grid_num,
              big_p = 0,
              big_w = 0,

              small_max = 4,
              local_small_max,
              small_p,
              small_w = 0,

              result,
              html = '';



          this.calcGridMargin();

          if (o.grid_snap) {
              big_num = total / o.step;
          }

          if (big_num > 50) big_num = 50;
          big_p = this.toFixed(100 / big_num);

          if (big_num > 4) {
              small_max = 3;
          }
          if (big_num > 7) {
              small_max = 2;
          }
          if (big_num > 14) {
              small_max = 1;
          }
          if (big_num > 28) {
              small_max = 0;
          }

          for (i = 0; i < big_num + 1; i++) {
              local_small_max = small_max;

              big_w = this.toFixed(big_p * i);

              if (big_w > 100) {
                  big_w = 100;
              }
              this.coords.big[i] = big_w;

              small_p = (big_w - (big_p * (i - 1))) / (local_small_max + 1);

              for (z = 1; z <= local_small_max; z++) {
                  if (big_w === 0) {
                      break;
                  }

                  small_w = this.toFixed(big_w - (small_p * z));

                  html += '<span class="irs-grid-pol small" style="left: ' + small_w + '%"></span>';
              }

              html += '<span class="irs-grid-pol" style="left: ' + big_w + '%"></span>';

              result = this.convertToValue(big_w);
              if (o.values.length) {
                  result = o.p_values[result];
              } else {
                  result = this._prettify(result);
              }

              html += '<span class="irs-grid-text js-grid-text-' + i + '" style="left: ' + big_w + '%">' + result + '</span>';
          }
          this.coords.big_num = Math.ceil(big_num + 1);



          this.$cache.cont.addClass("irs-with-grid");
          this.$cache.grid.html(html);
          this.cacheGridLabels();
      },

      cacheGridLabels: function () {
          var $label, i,
              num = this.coords.big_num;

          for (i = 0; i < num; i++) {
              $label = this.$cache.grid.find(".js-grid-text-" + i);
              this.$cache.grid_labels.push($label);
          }

          this.calcGridLabels();
      },

      calcGridLabels: function () {
          var i, label, start = [], finish = [],
              num = this.coords.big_num;

          for (i = 0; i < num; i++) {
              this.coords.big_w[i] = this.$cache.grid_labels[i].outerWidth(false);
              this.coords.big_p[i] = this.toFixed(this.coords.big_w[i] / this.coords.w_rs * 100);
              this.coords.big_x[i] = this.toFixed(this.coords.big_p[i] / 2);

              start[i] = this.toFixed(this.coords.big[i] - this.coords.big_x[i]);
              finish[i] = this.toFixed(start[i] + this.coords.big_p[i]);
          }

          if (this.options.force_edges) {
              if (start[0] < -this.coords.grid_gap) {
                  start[0] = -this.coords.grid_gap;
                  finish[0] = this.toFixed(start[0] + this.coords.big_p[0]);

                  this.coords.big_x[0] = this.coords.grid_gap;
              }

              if (finish[num - 1] > 100 + this.coords.grid_gap) {
                  finish[num - 1] = 100 + this.coords.grid_gap;
                  start[num - 1] = this.toFixed(finish[num - 1] - this.coords.big_p[num - 1]);

                  this.coords.big_x[num - 1] = this.toFixed(this.coords.big_p[num - 1] - this.coords.grid_gap);
              }
          }

          this.calcGridCollision(2, start, finish);
          this.calcGridCollision(4, start, finish);

          for (i = 0; i < num; i++) {
              label = this.$cache.grid_labels[i][0];

              if (this.coords.big_x[i] !== Number.POSITIVE_INFINITY) {
                  label.style.marginLeft = -this.coords.big_x[i] + "%";
              }
          }
      },

      // Collisions Calc Beta
      // TODO: Refactor then have plenty of time
      calcGridCollision: function (step, start, finish) {
          var i, next_i, label,
              num = this.coords.big_num;

          for (i = 0; i < num; i += step) {
              next_i = i + (step / 2);
              if (next_i >= num) {
                  break;
              }

              label = this.$cache.grid_labels[next_i][0];

              if (finish[i] <= start[next_i]) {
                  label.style.visibility = "visible";
              } else {
                  label.style.visibility = "hidden";
              }
          }
      },

      calcGridMargin: function () {
          if (!this.options.grid_margin) {
              return;
          }

          this.coords.w_rs = this.$cache.rs.outerWidth(false);
          if (!this.coords.w_rs) {
              return;
          }

          if (this.options.type === "single") {
              this.coords.w_handle = this.$cache.s_single.outerWidth(false);
          } else {
              this.coords.w_handle = this.$cache.s_from.outerWidth(false);
          }
          this.coords.p_handle = this.toFixed(this.coords.w_handle  / this.coords.w_rs * 100);
          this.coords.grid_gap = this.toFixed((this.coords.p_handle / 2) - 0.1);

          this.$cache.grid[0].style.width = this.toFixed(100 - this.coords.p_handle) + "%";
          this.$cache.grid[0].style.left = this.coords.grid_gap + "%";
      },



      // =============================================================================================================
      // Public methods

      update: function (options) {
          if (!this.input) {
              return;
          }

          this.is_update = true;

          this.options.from = this.result.from;
          this.options.to = this.result.to;
          this.update_check.from = this.result.from;
          this.update_check.to = this.result.to;

          this.options = $.extend(this.options, options);
          this.validate();
          this.updateResult(options);

          this.toggleInput();
          this.remove();
          this.init(true);
      },

      reset: function () {
          if (!this.input) {
              return;
          }

          this.updateResult();
          this.update();
      },

      destroy: function () {
          if (!this.input) {
              return;
          }

          this.toggleInput();
          this.$cache.input.prop("readonly", false);
          $.data(this.input, "ionRangeSlider", null);

          this.remove();
          this.input = null;
          this.options = null;
      }
  };

  $.fn.ionRangeSlider = function (options) {
      return this.each(function() {
          if (!$.data(this, "ionRangeSlider")) {
              $.data(this, "ionRangeSlider", new IonRangeSlider(this, options, plugin_count++));
          }
      });
  };



  // =================================================================================================================
  // http://paulirish.com/2011/requestanimationframe-for-smart-animating/
  // http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

  // requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

  // MIT license

  (function() {
      var lastTime = 0;
      var vendors = ['ms', 'moz', 'webkit', 'o'];
      for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
          window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
          window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
              || window[vendors[x]+'CancelRequestAnimationFrame'];
      }

      if (!window.requestAnimationFrame)
          window.requestAnimationFrame = function(callback, element) {
              var currTime = new Date().getTime();
              var timeToCall = Math.max(0, 16 - (currTime - lastTime));
              var id = window.setTimeout(function() { callback(currTime + timeToCall); },
                  timeToCall);
              lastTime = currTime + timeToCall;
              return id;
          };

      if (!window.cancelAnimationFrame)
          window.cancelAnimationFrame = function(id) {
              clearTimeout(id);
          };
  }());

}));




var addSliderNews = function () {
  $('.news__slider').slick({
    slidesToShow: 4,
    slidesToScroll: 4,
    dots: true,
    prevArrow: '<button class="news__slider-btn slick-arrow__btnprev" aria-label="arrow previous"><img src="images/icon-arrow-left.svg" alt="arrow previous" width="30" height="11"></button>',
    nextArrow: '<button class="news__slider-btn slick-arrow__btnnext" aria-label="arrow next"><img src="images/icon-arrow-right.svg" alt="arrow next" width="30" height="11"></button>',
    responsive: [
      {
        breakpoint: 1023,
        settings: {
          slidesToScroll: 2,
          slidesToShow: 2,
          prevArrow: '<button class="news__slider-btn slick-arrow__btnprev" aria-label="arrow previous"><img src="images/icon-arrow-left-tablet.svg" alt="arrow previous" width="30" height="11"></button>',
          nextArrow: '<button class="news__slider-btn slick-arrow__btnnext" aria-label="arrow next"><img src="images/icon-arrow-right-tablet.svg" alt="arrow next" width="30" height="11"></button>',
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToScroll: 2,
          slidesToShow: 2,
          arrows: false,
          dots: true,
          dotsClass: 'slider-paging-number',
          customPaging: function (slick, index) {
            var slidesPerPage = 2
            var maxPages = Math.ceil(slick.slideCount/slidesPerPage);
            return (index + 1) + ' of ' + maxPages;
          }
        }
      }
    ]
  });
};

if (document.querySelector('.news__slider')) {
  addSliderNews();
}


var addAsideToggle = function () {
  $('.aside__item-title').on('click', function(){
    $(this).next().slideToggle(200);
    $(this).toggleClass('aside__item-title--active');
  });
};

if (document.querySelector('.aside')) {
  addAsideToggle();
}


var addRangeSlider = function () {
  $(".js-range-slider").ionRangeSlider({
    type: "double",
    from: 55,
    to: 155,
    prefix: "$ "
  });
};

if (document.querySelector('.js-range-slider')) {
  addRangeSlider();
}


// слайдер для product

var addSlider = function () {
  if (!document.querySelector('.product-card__preview.slick-slider')) {
    $('.product-card__preview').slick({
      responsive: [
        {
          breakpoint: 2040,
          settings: "unslick"
        },
        {
          breakpoint: 768,
          settings: {
            slidesToScroll: 1,
            slidesToShow: 1,
            dotsClass: 'slider-paging-number',
            dots: true,
            arrows: false,
            customPaging: function (slick, index) {
              var slidesPerPage = 1
              var maxPages = Math.ceil(slick.slideCount/slidesPerPage);
              return (index + 1) + ' of ' + maxPages;
            }

          }
        }
      ]
    });
  }
};

if (document.querySelector('.product-card__preview')) {
  addSlider();
  window.addEventListener('resize', addSlider);
}
