
function Class(fromClass, constructor) {
fromClass = fromClass || Function;
if (!constructor || constructor.constructor != Function) { constructor = function () { }; }
if (fromClass.constructor == Function) {
constructor.prototype = new fromClass;
constructor.prototype.constructor = constructor;
constructor.prototype.parent = fromClass.prototype;
} else {
constructor.prototype = fromClass;
constructor.prototype.constructor = constructor;
constructor.prototype.parent = fromClass;
}
return constructor;
}
RegExp.prototype.family = 'RegExp';
String.from = function (obj) {
return (obj + '');
};
String.prototype.trim = String.prototype.trim || function () {
return this.replace(/^\s+|\s+$/g, '');
};
String.prototype.clean = function () {
return this.replace(/\s+/g, ' ').trim();
};
String.prototype.startsWith = function (str) {
return (this.indexOf(str) == 0);
};
String.prototype.endsWith = function (str) {
return (this.match(str + '$') == str);
};
String.prototype.repeat = function (times) {
return new Array(times + 1).join(this);
};
String.prototype.contains = function (str, separator) {
return (separator) ? (separator + this + separator).indexOf(separator + str + separator) > -1 : this.indexOf(str) > -1;
};
String.prototype.camelCase = function () {
return this.replace(/-\D/g, function (match) {
return match.charAt(1).toUpperCase();
});
};
String.prototype.hyphenate = function () {
return this.replace(/[A-Z]/g, function (match) {
return ('-' + match.charAt(0).toLowerCase());
});
};
String.escapeQuotes = function (html) {
return (String.from(html)).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
};
String.prototype.escapeRegExp = function () {
return this.replace(/([-.*+?^${}()|[\]\/\\])/g, '\\$1');
};
String.stripScripts = function (html) {
var scripts = '';
var text = (String.from(html)).replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, function (all, code) {
scripts += code + '\n';
return '';
});
return {
text: text,
scripts: scripts
};
};
String.parseQueryString = function (queryString, decodeKeys, decodeValues) {
var result = {};
var queryItem, queryIndex;
var items, index, keys, itemValue, itemKey, keyIndex, obj, current;
if (typeof queryString != 'string') { return null; }
queryString = queryString.replace(/^\?/, '');
items = queryString.split(/[&;]/);
if (!items.length) { return result; }
if (decodeKeys == null) { decodeKeys = true; } 
if (decodeValues == null) { decodeValues = true; } 
for (queryIndex = 0; queryIndex < items.length; queryIndex++) {
queryItem = items[queryIndex];
index = queryItem.indexOf('=') + 1;
itemValue = index ? queryItem.substr(index) : '';
obj = result;
keys = index ? queryItem.substr(0, index - 1).match(/([^\]\[]+|(\B)(?=\]))/g) : [queryItem];
if (keys.length) {
if (decodeValues) { itemValue = decodeURIComponent(itemValue); }
for (keyIndex = 0; keyIndex < keys.length; keyIndex++) {
itemKey = keys[keyIndex];
if (decodeKeys) { itemKey = decodeURIComponent(itemKey); }
current = obj[itemKey];
if (keyIndex < keys.length - 1) { obj = obj[itemKey] = current || {}; }
else {
if (Object.typeOf(current) == 'array') { current.push(itemValue); }
else { obj[itemKey] = current != null ? [current, itemValue] : itemValue; }
}
};
}
}
return result;
};
(function () {
var _parts = ['scheme', 'user', 'password', 'host', 'port', 'directory', 'file', 'query', 'fragment'];
var _schemes = { http: 80, https: 443, ftp: 21, rtsp: 554, mms: 1755, file: 0 };
var _match = (/^(?:(\w+):)?(?:\/\/(?:(?:([^:@\/]*):?([^:@\/]*))?@)?([^:\/?#]*)(?::(\d*))?)?(\.\.?$|(?:[^?#\/]*\/)*)([^?#]*)(?:\?([^#]*))?(?:#(.*))?/);
var _uri = '';
var _uriParts = null;
String.parseURI = function (uri, part) {
var result, values;
var uriParts = null;
if (part != null && !Array.contains(_parts, part) && part != 'data') { return null; } 
if (typeof uri != 'string' || uri.trim() == '') { uri = document.location.href; } 
uri = uri.trim();
if (_uri == uri) { uriParts = _uriParts; }
if (uriParts == null) {
values = uri.match(_match);
if (values != null) {
values.shift(); 
uriParts = Array.associate(values, _parts);
uriParts['port'] = uriParts['port'] || (uriParts['scheme'] ? _schemes[uriParts['scheme'].toLowerCase()] : '');
_uri = uri;
_uriParts = uriParts;
}
}
if (uriParts != null) {
if (part == null) { return uriParts; } 
if (part == 'data') { return String.parseQueryString(uriParts['query'] || ''); } 
return uriParts[part] || ''; 
}
return null;
};
})();
Function.prototype.bind = Function.prototype.bind || function (bindTo) {
var self = this;
var args = (arguments.length > 1) ? Array.slice(arguments, 1) : null;
return function () {
if (!args && !arguments.length) { return self.call(bindTo); }
if (args && arguments.length) { return self.apply(bindTo, args.concat(Array.from(arguments))); }
return self.apply(bindTo, args || arguments);
};
};
Function.prototype.pass = function () {
var self = this;
var args = arguments;
return function () {
return self.apply(null, args || arguments);
};
};
Function.prototype.objectIterationSetter = function () {
var self = this;
return function (target, key, value) {
var keyItem;
if (key == null) { return this; }
if (typeof key != 'string') {
for (keyItem in key) {
if (key.hasOwnProperty(keyItem)) { self.call(this, target, keyItem, key[keyItem]); }
}
}
else { self.call(this, target, key, value); }
return this;
};
};
Function.prototype.objectPrototypeIterationSetter = function () {
var self = this;
return function (key, value) {
var keyItem;
if (key == null) { return this; }
if (typeof key != 'string') {
for (keyItem in key) {
if (key.hasOwnProperty(keyItem)) { self.call(this, keyItem, key[keyItem]); }
}
}
else { self.call(this, key, value); }
return this;
};
};
Array.prototype.indexOf = Array.prototype.indexOf || function (item, startPosition) {
var index;
startPosition = (startPosition < 0) ? Math.max(0, this.length + startPosition) : startPosition || 0;
for (index = startPosition; index < this.length; index++) {
if (this[index] === item) { return index; }
}
return -1;
};
Array.from = function (obj) {
if (obj == null) { return []; }
return (Object.isEnumerable(obj) && typeof obj != 'string') ? (Object.typeOf(obj) == 'array') ? obj : Array.prototype.slice.call(obj) : [obj];
};
(function () {
var _arrayFrom = Array.from;
try {
_arrayFrom(document.documentElement.childNodes);
} catch (e) {
Array.from = function (obj) {
var itemCounter, result;
if (typeof obj != 'string' && Object.isEnumerable(obj) && Object.typeOf(obj) != 'array') {
itemCounter = obj.length;
result = new Array(itemCounter);
while (itemCounter--) { result[itemCounter] = obj[itemCounter]; }
return result;
}
return _arrayFrom(obj);
};
}
})();
(function () {
function _compareSimple(compareValue, value) {
return compareValue === value;
}
function _compareRegExp(compareValue, regExpValue) {
return regExpValue.test(compareValue);
}
Array.contains = function (obj, value) {
var compareMethod = _compareSimple;
var key;
if (Object.typeOf(value) == 'regexp') { compareMethod = _compareRegExp; }
for (key in obj) {
if (Object.prototype.hasOwnProperty.call(obj, key) && compareMethod(obj[key], value)) { return true; }
}
return false;
}
})();
Array.prototype.forEach = Array.prototype.forEach || function (method, bindTo) {
var index;
for (index = 0; index < this.length; index++) {
if (index in this) { method.call(bindTo, this[index], index, this); }
}
};
Array.prototype.filter = Array.prototype.filter || function (method, bindTo) {
var result = [];
var index;
for (index = 0; index < this.length; index++) {
if ((index in this) && method.call(bindTo, this[index], index, this)) { result.push(this[index]); }
}
return result;
};
Array.filter = function (obj, method, bindTo) {
var result = [];
var key;
for (key in obj) {
if (Object.prototype.hasOwnProperty.call(obj, key) && method.call(bindTo, obj[key], key, obj)) { result[key] = obj[key]; }
}
return result;
};
Array.prototype.map = Array.prototype.map || function (method, bindTo) {
var result = [];
var index;
for (index = 0; index < this.length; index++) {
if (index in this) { result[index] = method.call(bindTo, this[index], index, this); }
}
return result;
};
Array.map = function (obj, method, bindTo) {
var result = [];
var key;
for (key in obj) {
if (Object.prototype.hasOwnProperty.call(obj, key)) { result[key] = method.call(bindTo, obj[key], key, obj); }
}
return result;
};
Array.associate = function (values, keys) {
var result = {};
var length, counter;
if (values.length == 1 || Object.typeOf(values) != 'array') {
values = Array.from(values)[0];
length = keys.length;
for (counter = 0; counter < length; counter++) {
result[keys[counter]] = values;
}
return result;
}
length = Math.min(values.length, keys.length);
for (counter = 0; counter < length; counter++) {
result[keys[counter]] = values[counter];
}
return result;
}
Object.isEnumerable = function (obj) {
return (obj != null && typeof obj.length == 'number' && Object.prototype.toString.call(obj) != '[object Function]');
};
Object.forEach = function (obj, method, bindTo) {
var key;
for (key in obj) {
if (Object.prototype.hasOwnProperty.call(obj, key)) { method.call(bindTo, obj[key], key, obj); }
}
};
Object.typeOf = function (obj) {
if (obj === undefined) { return 'undefined'; }
if (obj == null) { return 'null'; }
if (obj.nodeName) {
if (obj.nodeType == 1) { return 'element'; }
if (obj.nodeType == 3) { return (/\S/).test(obj.nodeValue) ? 'textnode' : 'whitespace'; }
} else {
if (typeof obj.length == 'number') {
if (obj.callee) { return 'arguments'; }
if (obj.pop) { return 'array'; }
if (obj.item) { return 'collection'; }
} else {
if (obj.family) { return obj.family.toLowerCase(); }
}
}
return typeof obj;
};
(function () {
function _cloneOf(obj) {
switch (Object.typeOf(obj)) {
case 'array': return Array.clone(obj);
case 'object': return Object.clone(obj);
default: return obj;
}
}
Array.clone = function (obj) {
var size = obj.length;
var clone = new Array(size);
while (size--) {
clone[size] = _cloneOf(obj[size]);
}
return clone;
};
Object.clone = function (obj) {
var clone = {};
var key;
for (key in obj) {
clone[key] = _cloneOf(obj[key]);
}
return clone;
};
})();
(function () {
function _mergeSingle(target, key, current) {
switch (Object.typeOf(current)) {
case 'object':
if (Object.typeOf(target[key]) == 'object') { Object.merge(target[key], current); }
else { target[key] = Object.clone(current); }
break;
case 'array':
target[key] = Array.clone(current);
break;
default: target[key] = current;
}
return target;
};
Object.merge = function (target, key, value) {
var arg, argIndex, argLength;
if (Object.typeOf(key) == 'string') return _mergeSingle(target, key, value);
for (argIndex = 1, argLength = arguments.length; argIndex < argLength; argIndex++) {
arg = arguments[argIndex];
if (arg) {
for (key in arg) {
_mergeSingle(target, key, arg[key]);
}
}
}
return target;
}
})();
Object.set = function (target, key, value) {
target[key] = value;
}
.objectIterationSetter();
Object.append = function (target, key, value) {
if (target[key] == null) {
target[key] = value;
}
}
.objectIterationSetter();
Object.map = function (source, method, bindTo) {
var result = {};
var key;
for (key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) { result[key] = method.call(bindTo, source[key], key, source); }
}
return result;
};
Object.getKeys = function (source) {
var result = [];
var key;
for (key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) { result.push(key); }
}
return result;
};
Object.getValues = function (source) {
var result = [];
var key;
for (key in source) {
if (Object.prototype.hasOwnProperty.call(source, key)) { result.push(source[key]); }
}
return result;
};
if (!Array.contains(['testvalue'], 'testvalue')) {
Object.prototype.hasOwnProperty = Array.prototype.hasOwnProperty = function (key) {
return (typeof this[key] !== 'undefined' && typeof this.constructor.prototype[key] === 'undefined');
}
}
var Utils = {};
(function () {
var _attributeJSTranslations = {
'float': function () {
if (document.documentElement && document.documentElement.style && document.documentElement.style.cssFloat == null) { return 'styleFloat'; }
return 'cssFloat';
} (),
'-moz-opacity': 'opacity',
'-webkit-opacity': 'opacity',
'-o-opacity': 'opacity',
'-ms-opacity': 'opacity'
};
var _attributeCSSTranslations = {
'styleFloat': 'float',
'cssFloat': 'float'
};
function _translateStyleAttribute(attribute, targetContext) {
var result = {};
var attributeTranslations = _attributeJSTranslations;
var transform = String.prototype.camelCase;
var key, itemProperty, itemValue;
targetContext = targetContext || 'JS';
if (!Array.contains(['JS', 'CSS'], targetContext)) { targetContext = 'JS'; }
if (targetContext == 'CSS') {
attributeTranslations = _attributeCSSTranslations;
transform = String.prototype.hyphenate;
}
if (Object.typeOf(attribute) == 'array') { attribute = attribute.join(';'); } 
if (Object.typeOf(attribute) == 'string') {
if (attribute.indexOf(':') == -1 && attribute.indexOf(';') == -1) { return transform.call(attributeTranslations[attribute] || attribute); } 
if (attribute.indexOf(':') > -1) {
attribute.split(';').forEach(function (item) {
if ((item = item.clean()) != '') {
itemProperty = item.substr(0, item.indexOf(':'));
itemValue = item.substr(item.indexOf(':') + 1);
key = transform.call(attributeTranslations[itemProperty] || itemProperty);
result[key] = itemValue;
}
});
return result;
}
else {
result = attribute.split(';').map(function (item) {
if ((item = item.clean()) != '') { return transform.call(attributeTranslations[item] || item); }
});
return result;
}
}
if (Object.typeOf(attribute) == 'object') {
Object.forEach(attribute, function (value, key) {
key = transform.call(attributeTranslations[key] || key);
result[key] = value;
});
return result;
}
return attribute;
}
Utils.TranslateStyleAttributeJS = function (attribute) {
return _translateStyleAttribute(attribute, 'JS');
};
Utils.TranslateStyleAttributeCSS = function (attribute) {
return _translateStyleAttribute(attribute, 'CSS');
};
})();
(function () {
var _features = {
'cssOpacity': function () {
var element = document.createElement('div');
var elemStyle;
if (!element) { return null; }
elemStyle = element.style;
elemStyle.cssText = 'opacity:.55;-webkit-opacity:.55;-moz-opacity:.55;-o-opacity:.55;-ms-opacity:.55;';
return /^0.55$/.test(elemStyle.opacity);
},
'cssFilter': function () {
var element = document.createElement('div');
var elemStyle;
if (!element) { return null; }
elemStyle = element.style;
elemStyle.cssText = 'filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=55)';
return !!elemStyle.filter;
},
'cookie': function () {
return navigator && navigator.cookieEnabled || false;
},
'flash': function () {
var plugins, pluginItem, counter;
if (window.ActiveXObject) {
try {
new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
return true;
} catch (e) { return false; }
} else {
plugins = Array.from(navigator.plugins);
for (counter = 0; counter < plugins.length; counter++) {
pluginItem = plugins[counter];
if (pluginItem.name.match(/flash/gim)) { return true; }
}
}
return false;
}
};
Utils.CheckFeature = function (feature) {
var featureList, counter, featureCheck;
if (!feature) { return null; }
featureList = Array.from(feature); 
for (counter = 0; counter < featureList.length; counter++) {
feature = featureList[counter];
featureCheck = _features[feature];
if (featureCheck == null) { return null; } 
if (typeof featureCheck == 'function') {
featureCheck = featureCheck(); 
if (featureCheck == null) { return null; } 
else { _features[feature] = featureCheck; } 
}
if (!featureCheck) { return false; } 
}
return true; 
};
Utils.GetFeatures = function (withData) {
var featureList = [];
var feature, featureData;
featureList = Object.getKeys(_features);
if (!withData) { return featureList; }
featureData = Array.associate(featureList.map(function (feature) {
return this.CheckFeature(feature);
}, this), featureList);
return featureData;
};
})();
var cbIEDetectionData = Array.associate(false, ['ie', 'ie6', 'ie7', 'ie8', 'ie9', 'ie10']);
document.write('<!--[IF IE]><scr' + 'ipt>cbIEDetectionData[\'ie\'] = true;</scr' + 'ipt><![ENDIF]-->' +
'<!--[IF IE 6]><scr' + 'ipt>cbIEDetectionData[\'ie6\'] = true;</scr' + 'ipt><![ENDIF]-->' +
'<!--[IF IE 7]><scr' + 'ipt>cbIEDetectionData[\'ie7\'] = true;</scr' + 'ipt><![ENDIF]-->' +
'<!--[IF IE 8]><scr' + 'ipt>cbIEDetectionData[\'ie8\'] = true;</scr' + 'ipt><![ENDIF]-->' +
'<!--[IF IE 9]><scr' + 'ipt>cbIEDetectionData[\'ie9\'] = true;</scr' + 'ipt><![ENDIF]-->' +
'<!--[IF IE 10]><scr' + 'ipt>cbIEDetectionData[\'ie10\'] = true;</scr' + 'ipt><![ENDIF]-->');
(function () {
function _isOpera() {
var data = window.opera;
if (!data || Object.typeOf(data) != 'object') { return false; }
if (!(data['defineMagicFunction'] && data['collect'] && data['addEventListener'])) { return false; }
return true;
}
function _checkBrowser(browser) {
var browserCheck;
if (!browser) { return null; }
browserCheck = _browsers[browser];
if (browserCheck == null) { return null; } 
if (typeof browserCheck == 'function') {
browserCheck = browserCheck(); 
if (browserCheck == null) { return null; } 
else { _browsers[browser] = browserCheck; } 
}
if (!browserCheck) { return false; } 
return true;
}
var _browsers = Object.merge({
'opera': function () {
return _isOpera();
},
'opera8': function () {
var data = window.opera;
if (!_isOpera()) { return false; }
if (!data['openInSourceViewer']) { return false; }
return true;
},
'opera9': function () {
var data = window.opera;
if (!_isOpera()) { return false; }
if (!(!data['deleteDatabase'] && data['getPreference'])) { return false; }
return true;
},
'opera10': function () {
var data = window.opera;
if (!_isOpera()) { return false; }
if (!(data['deleteDatabase'] && data['disconnect'])) { return false; }
return true;
},
'opera11': function () {
var data = window.opera;
if (!_isOpera()) { return false; }
if (!(data['deleteDatabase'] && !data['disconnect'])) { return false; }
return true;
}
}, cbIEDetectionData);
Utils.CheckBrowser = function (browser) {
var result;
if (browser && typeof browser == 'string') { return _checkBrowser(browser); }
result = Object.getKeys(_browsers).filter(function (browser) {
return _checkBrowser(browser);
});
if (result.length == 0) { return null; }
return result;
};
})();
var DomLoaded;
(function () {
var _queue = [];
var _queueLoaded = false;
function _loadQueue() {
var counter;
if (arguments.callee.done) { return; }
arguments.callee.done = true;
for (counter = 0; counter < _queue.length; counter++) { _queue[counter](); }
_queueLoaded = true;
Document.domReady = true;
}
DomLoaded = {
Load: function (callback) {
var isFrame = true;
var _timer;
if (_queueLoaded) { callback(); return; }
_queue.push(callback);
if (document.addEventListener) { document.addEventListener('DOMContentLoaded', _loadQueue, null); } 
else if (/KHTML|WebKit/i.test(navigator.userAgent)) {
_timer = setInterval(function () {
if (/loaded|complete/.test(document.readyState)) {
clearInterval(_timer);
_loadQueue();
}
}, 10);
} else if (document.attachEvent) {
try { isFrame = window.frameElement != null; }
catch (e) { }
if (document.documentElement.doScroll && !isFrame) {
(function () {
try {
document.documentElement.doScroll('left');
_loadQueue();
} catch (e) { setTimeout(arguments.callee, 0); } 
})();
} else {
document.attachEvent('onreadystatechange', function () {
if (document.readyState === 'complete') { _loadQueue(); }
});
}
}
window.onload = _loadQueue;
}
};
})();
if (window.onload != null) { DomLoaded.Load(window.onload); }
DomLoaded.Load(function () {
window.onbeforeunload = function () {
var formList = document.getElementsByTagName('form');
var formSize, formElements, counter;
Array.from(formList).forEach(function (form) {
formElements = form.elements;
formSize = formElements.length;
for (counter = 0; counter < formSize; counter++) {
formElements[counter].blur();
}
});
};
});
var Runtime;
(function () {
var _dictionary = {};
var _declarations = {};
var _uniqueDigits = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
Runtime = {
Put: function (key, value) {
_dictionary[key] = value;
return value;
},
Get: function (key) {
return _dictionary[key] || null;
},
Remove: function (key) {
if (this.Get(key) != null) { delete _dictionary[key]; }
},
Clear: function () {
var key;
for (key in _dictionary) {
this.Remove(key);
}
},
Declare: function (key) {
_declarations[key] = true;
this.Put(key + 'Storage', {});
this.Put(key + 'Environment', {});
},
IsDeclared: function (key) {
return _declarations[key] === true;
},
CollectGarbage: function (item) {
function _collectAll(value, key) {
classObject = window[key];
Object.forEach(classObject.instances, function (itemInstance, itemInstanceKey) {
if (itemInstance.Remove && !Document.IsDOM(itemInstanceKey)) { itemInstance.Remove(); }
});
}
function _collectElement(value, key) {
classObject = window[key];
if (classObject && classObject.instances) {
instance = classObject.instances[elementId];
if (instance && instance.Remove) { instance.Remove(); }
}
}
var elementId, instance, classObject, collectMethod;
if (!item || !Document.IsElement(item)) { collectMethod = _collectAll; }
else if (item && item.id && !Document.IsDOM(item)) {
collectMethod = _collectElement;
elementId = item.id;
}
if (collectMethod) {
Object.forEach(_declarations, collectMethod);
return true;
}
return false;
},
GetUniqueId: function (prefix, size) {
var result = '';
var digitLength = _uniqueDigits.length - 1;
var counter;
if (typeof prefix == 'string') { result = prefix; }
if (typeof size == 'number') { size = Math.floor(Math.abs(size)); }
else { size = 10; }
for (counter = 0; counter < size; counter++) {
result += _uniqueDigits[Math.round(Math.random() * digitLength)];
}
return result;
}
};
})();
Runtime.Put('ClassNamePrefix', 'CB');
var Dimension = function () {
function _getCurrentStyle(element) {
return element.currentStyle || window.getComputedStyle(element, null) || element.style;
}
function _getPosition(obj, checkRelative) {
var curLeft = 0;
var curTop = 0;
var position, parent, parentPosition, border, padding;
if (obj.offsetParent) {
do {
if (position == 'fixed') {
checkRelative = true;
curTop += Document.GetBodyScrollTop();
curLeft += Document.GetBodyScrollLeft();
}
curLeft += obj.offsetLeft;
curTop += obj.offsetTop;
position = _getCurrentStyle(obj).position;
parent = obj.offsetParent;
if (parent != null) { parentPosition = _getCurrentStyle(parent).position; }
obj = parent;
}
while (obj && (!checkRelative || (checkRelative && parentPosition == 'static')));
}
return [curLeft, curTop];
}
function _getOffsetWidth(element) { return element.offsetWidth || 0; }
function _getOffsetHeight(element) { return element.offsetHeight || 0; }
function _getWidth(element, isOuter) {
var padding, border, innerOuterValue, csWidth;
if (Array.contains([window, document], element)) { return (window.innerWidth || (document.documentElement && document.documentElement.clientWidth ? document.documentElement.clientWidth : null) || Document.body.clientWidth || 0) - (Dimension.GetScrollTop(element) > 0 ? 20 : 0); }
else {
padding = _getPadding(element);
border = _getBorderWidth(element);
innerOuterValue = padding.left + padding.right + border.left + border.right;
csWidth = _getCurrentStyle(element).width;
return parseInt(element.width && !String.from(element.width).contains('%') ? element.width : '') || parseInt(csWidth.contains('px') ? parseInt(csWidth) + (isOuter ? innerOuterValue : 0) : _getOffsetWidth(element) - (isOuter ? 0 : innerOuterValue)) || 0;
}
}
function _getHeight(element, isOuter) {
var padding, border, innerOuterValue, csHeight;
if (Array.contains([window, document], element)) { return (window.innerHeight || (document.documentElement && document.documentElement.clientHeight ? document.documentElement.clientHeight : null) || Document.body.clientHeight || 0) - (Dimension.GetScrollLeft(element) > 0 ? 20 : 0); }
else {
padding = _getPadding(element);
border = _getBorderWidth(element);
innerOuterValue = padding.top + padding.bottom + border.top + border.bottom;
csHeight = _getCurrentStyle(element).height;
return parseInt(element.height && !String.from(element.height).contains('%') ? element.height : '') || parseInt(csHeight.contains('px') ? parseInt(csHeight) + (isOuter ? innerOuterValue : 0) : _getOffsetHeight(element) - (isOuter ? 0 : innerOuterValue)) || 0;
}
}
function _getBorderWidth(element) {
var currentStyle = _getCurrentStyle(element);
return {
top: parseInt(currentStyle.borderTopWidth) || 0,
right: parseInt(currentStyle.borderRightWidth) || 0,
bottom: parseInt(currentStyle.borderBottomWidth) || 0,
left: parseInt(currentStyle.borderLeftWidth) || 0
};
}
function _getPadding(element) {
var currentStyle = _getCurrentStyle(element);
return {
top: parseInt(currentStyle.paddingTop) || 0,
right: parseInt(currentStyle.paddingRight) || 0,
bottom: parseInt(currentStyle.paddingBottom) || 0,
left: parseInt(currentStyle.paddingLeft) || 0
};
}
return {
GetPositionType: function (element) { return _getCurrentStyle(element).position; },
GetLevel: function (element) { return _getCurrentStyle(element).zIndex; },
GetPosition: function (element) {
var currentStyle = element.style;
var position = _getPosition(element, true);
return {
x: currentStyle.pixelLeft || position[0] || 0,
y: currentStyle.pixelTop || position[1] || 0
};
},
GetX: function (element) { return Dimension.GetPosition(element).x; },
GetY: function (element) { return Dimension.GetPosition(element).y; },
GetPagePosition: function (element) {
var pagePosition = _getPosition(element, false);
return { x: pagePosition[0], y: pagePosition[1] };
},
GetPageX: function (element) { return Dimension.GetPagePosition(element).x; },
GetPageY: function (element) { return Dimension.GetPagePosition(element).y; },
GetSize: function (element) { return { width: _getWidth(element, false), height: _getHeight(element, false) }; },
GetOuterSize: function (element) { return { width: _getWidth(element, true), height: _getHeight(element, true) }; },
GetBorderWidth: function (element) { return _getBorderWidth(element); },
GetPadding: function (element) { return _getPadding(element); },
GetWidth: function (element) { return _getWidth(element, false); },
GetHeight: function (element) { return _getHeight(element, false); },
GetOuterWidth: function (element) { return _getWidth(element, true); },
GetOuterHeight: function (element) { return _getHeight(element, true); },
GetScroll: function (element) { return { left: Dimension.GetScrollLeft(element), top: Dimension.GetScrollTop(element) }; },
GetScrollLeft: function (element) {
if (Array.contains([window, document, Document.body], element)) { return window.pageXOffset || Document.body.scrollLeft || (document.documentElement ? document.documentElement.scrollLeft : 0) || 0; }
else { return element.scrollLeft || 0; }
},
GetScrollTop: function (element) {
if (Array.contains([window, document, Document.body], element)) { return window.pageYOffset || Document.body.scrollTop || (document.documentElement ? document.documentElement.scrollTop : 0) || 0; }
else { return element.scrollTop || 0; }
}
};
} ();
var Document = {
body: null,
domReady: false,
Get: function () { return document; },
Execute: function (script) {
var scriptElement, headElement;
if (!script) return null;
headElement = document.getElementsByTagName('head')[0];
scriptElement = Document.CreateElement('script', {
type: 'text/javascript',
text: script
});
headElement.appendChild(scriptElement);
try { headElement.removeChild(scriptElement); } 
catch (e) {}
return script;
},
GetElementInFrames: function (elementId, check) {
var result = (check === true ? false : null); 
var counter, frame, element;
if (window.frames.length > 0) {
for (counter = 0; counter < window.frames.length; counter++) {
try {
frame = window.frames[counter];
var frameDoc = frame.document ? frame.document
: frame.contentDocument ? frame.contentDocument
: frame.contentWindow.document ? frame.contentWindow.document
: null;
if (frameDoc != null) {
element = this.GetElementOfFrameDocument(frameDoc, elementId);
if (element != null) {
element.frame = frame;
break;
}
}
} catch (e) { }
}
result = (check === true ? element != null : (element || null));
}
return result;
},
GetElementOfFrameDocument: function (frameDoc, elementId) {
try {
var element = frameDoc.getElementById(elementId);
if (element != null) {
element.frameDocument = frameDoc;
return element;
}
} catch (e) { }
return null;
},
GetElement: function (obj) {
if (this.IsElement(obj)) { return obj; }
if (typeof obj == 'string') { return document.getElementById(obj) || this.GetElementInFrames(obj); }
if (obj && obj.toElement) { return obj.toElement(); }
return null;
},
IsElement: function (element) {
return (Object.typeOf(element) == 'element');
},
IsDOM: function (obj, frameDoc) {
var element = this.GetElement(obj);
if (element) {
element.id = element.id || Runtime.GetUniqueId();
if (!frameDoc) { return document.getElementById(element.id) != null; } 
if (Object.typeOf(frameDoc) == 'object') { return frameDoc.getElementById(element.id) != null; } 
if (frameDoc === true) { return this.GetElementInFrames(element.id, true); } 
}
return false;
},
AddElementToDOM: function (element, targetElement, position, skipElementCheck) {
if (!skipElementCheck && (!element || !this.IsElement(element))) { return null; }
targetElement = targetElement || this.body;
position = position || 'bottom';
switch (position) {
case 'top': return targetElement.insertBefore(element, targetElement.firstChild);
case 'bottom': return targetElement.appendChild(element);
case 'before': if (targetElement.parentNode) { return targetElement.parentNode.insertBefore(element, targetElement); }
case 'after': if (targetElement.parentNode) { return targetElement.parentNode.insertBefore(element, targetElement.nextSibling); }
default: return targetElement.appendChild(element);
};
return null;
},
RemoveElementFromDOM: function (element, collectGarbage) {
if (!element || !this.IsElement(element)) { return null; }
if (element.parentNode) {
element = element.parentNode.removeChild(element);
if (collectGarbage !== false) { Runtime.CollectGarbage(element); }
return element;
}
return null;
},
RemoveElement: function (element) {
element = this.RemoveElementFromDOM(element);
if (element) { element = null; }
},
MoveElement: function (element, targetElement, position, collectGarbage, enableRelocation) {
if (targetElement == null && element != null) { targetElement = element.parentNode; }
if (enableRelocation) {
element.id = element.id || Runtime.GetUniqueId();
Runtime.Put('original_parent_' + element.id, {
parent: element.parentNode,
css: element.className,
style: element.style
});
}
return this.AddElementToDOM(this.RemoveElementFromDOM(element), targetElement, position);
},
ClearElement: function (element, relocate) {
var containerData;
if (!this.IsElement(element)) { return null; }
Array.from(element.childNodes).forEach(function (childElement) {
if (relocate) {
containerData = Runtime.Get('original_parent_' + childElement.id);
if (containerData) {
this.MoveElement(childElement, containerData.parent);
childElement.className = containerData.css;
childElement.style = containerData.style;
Runtime.Remove('original_parent_' + childElement.id);
}
else { this.RemoveElement(childElement, true); }
}
else { this.RemoveElement(childElement, true); }
}, this);
Document.SetElementAttribute(element, 'text', ''); 
return element;
},
GetWidth: function () { return Dimension.GetWidth(document); },
GetHeight: function () { return Dimension.GetHeight(document); },
GetBodyWidth: function () { return Dimension.GetWidth(this.body); },
GetBodyHeight: function () { return Dimension.GetHeight(this.body); },
GetBodyScrollLeft: function () { return Dimension.GetScrollLeft(this.body); },
GetBodyScrollTop: function () { return Dimension.GetScrollTop(this.body); }
};
Document.SetElementStyle = function (element, property, value) {
var data = {};
var translation, value;
if (!(this.IsElement(element) && element.style != null)) { return null; }
translation = Utils.TranslateStyleAttributeJS(property); 
if (typeof translation == 'string') { data[translation] = value; }
else data = translation;
if (data['opacity'] != null && Utils.CheckFeature('cssFilter')) {
value = Number(data['opacity']);
data['filter'] = (data['filter'] || '') + ' progid:DXImageTransform.Microsoft.Alpha(Opacity=' + value * 100 + ')';
}
Object.set(element.style, data); 
return element;
};
Document.GetElementStyle = function (element, property) {
var translation, value;
if (!(this.IsElement(element) && element.style != null)) { return null; }
translation = Utils.TranslateStyleAttributeJS(property);
if (translation == 'opacity') {
if (Utils.CheckFeature('cssFilter')) {
value = (element.style.filter || '').match(/opacity=(\d*)/i);
if (value && value.length > 1) { return Number(value[1]) / 100; }
}
if (Utils.CheckFeature('cssOpacity')) {
value = element.style.opacity;
if (value != null) { return Number(value); }
}
return 1;
}
return element.style[translation];
};
(function () {
var _attributeJSTranslations = {
'value': 'value',
'defaultValue': 'defaultValue',
'class': 'className',
'className': 'className',
'for': 'htmlFor',
'html': 'innerHTML',
'text': function (element) {
if (element.nodeName.toLowerCase() == 'script') { return 'text'; }
return (element.textContent == null) ? 'innerText' : 'textContent';
}
};
var _booleanAttributes = ['compact', 'nowrap', 'ismap', 'declare', 'noshade', 'checked', 'disabled', 'readOnly', 'multiple', 'selected', 'noresize', 'defer', 'defaultChecked'];
var _formFields = ['input', 'textarea'];
var _formFieldTypes = ['text', 'password', 'hidden', 'button', 'submit', 'reset', 'checkbox', 'radio', 'number'];
Document.SetElementAttribute = function (element, attribute, value) {
var attributeList = attribute;
var translatedAttributeKey;
var nodeName, nodeType;
if (Object.typeOf(element) != 'element') { return null; }
nodeName = element.nodeName.toLowerCase();
nodeType = element.getAttribute('type');
if (nodeType != null) { nodeType = nodeType.toLowerCase(); }
if (typeof attribute == 'string') {
attributeList = {};
attributeList[attribute] = value;
}
Object.forEach(attributeList, function (attributeValue, attributeKey) {
if (attributeKey == 'text' && Array.contains(_formFields, nodeName) && (nodeType != null && Array.contains(_formFieldTypes, nodeType) || nodeType == null)) { attributeKey = 'value'; } 
translatedAttributeKey = _attributeJSTranslations[attributeKey]; 
if (translatedAttributeKey) {
if (typeof translatedAttributeKey == 'function') { translatedAttributeKey = translatedAttributeKey(element); }
element[translatedAttributeKey] = attributeValue;
}
else {
if (attributeKey == 'style') {
if (element.style.cssText != null) { element.style.cssText = attributeValue; }
else { element.setAttribute(attributeKey, attributeValue); } 
} else {
if (Array.contains(_booleanAttributes, attributeKey)) {
attributeValue = (attributeValue == '') ? false : !!attributeValue;
element[attributeKey] = attributeValue;
} else {
(attributeValue == '') ? element.removeAttribute(attributeKey) : element.setAttribute(attributeKey, String.from(attributeValue));
}
}
}
});
return element;
};
Document.GetElementAttribute = function (element, attribute) {
var result = null;
var translatedAttribute;
var nodeName, nodeType;
if (Object.typeOf(element) != 'element') { return null; }
nodeName = element.nodeName.toLowerCase();
nodeType = element.getAttribute('type');
if (nodeType != null) { nodeType = nodeType.toLowerCase(); }
if (attribute == 'text' && Array.contains(_formFields, nodeName) && (nodeType != null && Array.contains(_formFieldTypes, nodeType) || nodeType == null)) { attribute = 'value'; } 
translatedAttribute = _attributeJSTranslations[attribute]; 
if (translatedAttribute) {
if (typeof translatedAttribute == 'function') { translatedAttribute = translatedAttribute(element); }
result = element[translatedAttribute];
}
else {
if (attribute == 'style') {
if (element.style.cssText != null) { result = element.style.cssText; }
else { result = element.getAttribute(attribute); } 
} else {
if (Array.contains(_booleanAttributes, attribute)) { result = !!element[attribute]; } 
else { result = element.getAttribute(attribute); }
}
}
return result;
};
})();
Document.RemoveElementAttribute = function (element, attribute) {
var attributeObject = {};
switch (Object.typeOf(attribute)) {
case 'string':
attributeObject[attribute] = '';
break;
case 'array':
attribute.forEach(function (attributeName) {
attributeObject[attributeName] = '';
});
break;
case 'object':
Object.forEach(attribute, function (attributeValue, attributeKey) {
attributeObject[attributeKey] = '';
});
}
this.SetElementAttribute(element, attributeObject);
};
(function () {
function _getClassNamePrefix() {
return Runtime.Get('ClassNamePrefix') || '';
}
Document.CheckElementClass = function (element, className) {
var prefix = _getClassNamePrefix().toLowerCase();
var elementClassName = element.className.clean().toLowerCase();
className = (className || '').clean().toLowerCase();
if (className == '') { return true; }
return elementClassName.contains(className, ' ') || elementClassName.contains(prefix + className, ' ');
};
Document.AddElementClass = function (element, className) {
var prefix = _getClassNamePrefix();
var classes = className;
var classLength, counter, name, namePrefix;
if (typeof className == 'string') { classes = className.clean().split(' '); }
if (Object.typeOf(classes) == 'array') {
for (counter = 0, classLength = classes.length; counter < classLength; counter++) {
name = classes[counter].clean();
if (name != '') {
if (name.toLowerCase().startsWith(prefix.toLowerCase())) { namePrefix = ''; } 
else { namePrefix = prefix; }
if (!Document.CheckElementClass(element, name)) { element.className = (element.className + ' ' + namePrefix + name).trim(); }
}
}
}
return element;
};
Document.RemoveElementClass = function (element, className) {
var prefix = _getClassNamePrefix();
var classes = className;
var classLength, counter, name;
var regExpClean, regExpPrefix;
if (typeof className == 'string') { classes = className.clean().split(' '); }
if (Object.typeOf(classes) == 'array') {
for (counter = 0, classLength = classes.length; counter < classLength; counter++) {
name = classes[counter].clean();
if (name != '') {
regExpClean = new RegExp('(^|\\s)' + name + '(?:\\s|$)', 'i');
regExpPrefix = new RegExp('(^|\\s)' + prefix + name + '(?:\\s|$)', 'i');
element.className = element.className.replace(regExpClean, '$1').replace(regExpPrefix, '$1').trim();
}
}
}
return element;
};
Document.ToggleElementClass = function (element, className) {
if (Document.CheckElementClass(element, className)) { Document.RemoveElementClass(element, className); }
else { Document.AddElementClass(element, className); }
return element;
};
})();
(function () {
var _testElement;
var _createElementFallback = false;
try {
_testElement = document.createElement('<input name=\"_test_\">');
_createElementFallback = (_testElement.name == '_test_');
} catch (e) { };
Document.CreateElement = function (tagName, options) {
var element, targetElement, frameSource;
options = options || {};
if (_createElementFallback) { 
if (tagName == 'input') {
tagName = '<' + tagName;
if (options.name) { tagName += ' name=\"' + String.escapeQuotes(options.name) + '\"'; }
if (options.type) { tagName += ' type=\"' + String.escapeQuotes(options.type) + '\"'; }
tagName += '>';
delete options.name;
delete options.type;
}
if (tagName == 'iframe') {
tagName = '<' + tagName;
if (options.frameborder != null) { tagName += ' frameborder=\"' + options.frameborder + '\"'; } 
tagName += '>';
if (options.src) { frameSource = options.src; }
delete options.frameborder;
delete options.src;
}
}
element = document.createElement(tagName);
if (!element) { return null; }
targetElement = options.targetElement;
delete options.targetElement;
Document.SetElementAttribute(element, options);
if (Object.typeOf(targetElement) == 'element') {
Document.AddElementToDOM(element, targetElement, options.position);
delete options.position;
}
if (frameSource) { element.src = frameSource; }
return element;
};
})();
(function () {
var _positionCorrections = {
'before': 'top',
'after': 'bottom'
};
var _positionTranslations = {
'top': 'afterbegin',
'bottom': 'beforeend',
'before': 'beforebegin',
'after': 'afterend'
};
function _cloneElement(element, options) {
var contentNodes = [];
var childNodes, nodesLength, node, content, counter, document, range, fragment;
var targetElement, position, onlyContent, executeScripts;
var cleanContent, scriptContent;
if (!element || typeof element != 'string' && !Document.IsElement(element)) { return false; }
options = options || {};
targetElement = options.targetElement || Document.body;
position = options.position || 'bottom';
if (targetElement === Document.body) { position = _positionCorrections[position] || position; } 
position = _positionTranslations[options.position] || _positionTranslations['bottom'];
onlyContent = !!options.onlyContent || false;
executeScripts = options.executeScripts || false;
if (typeof element == 'string') { content = element; } 
else {
if (onlyContent) { content = Document.GetInnerXML(element); }
else { content = Document.GetOuterXML(element); }
if (!content) { 
content = '';
if (onlyContent) {
childNodes = element.childNodes;
for (counter = 0, nodesLength = childNodes.length; counter < nodesLength; counter++) {
contentNodes.push(childNodes[counter]);
}
} else { contentNodes.push(element); }
for (counter = 0, nodesLength = contentNodes.length; counter < nodesLength; counter++) {
node = contentNodes[counter];
try { content += (new XMLSerializer()).serializeToString(node); }
catch (e) {
try { content += node.xml; }
catch (e) { }
}
}
}
}
if (!content) { return false; } 
content = content.replace(/<\!\[CDATA\[([\s\S]*?)\]\]>/g, '$1'); 
cleanContent = String.stripScripts(content); 
scriptContent = cleanContent.scripts;
content = cleanContent.text;
if (executeScripts || !options.ignoreComments) { content = content.replace(/<!--[\s\S]*?-->/g, ''); } 
if ('insertAdjacentHTML' in targetElement) {
targetElement.insertAdjacentHTML(position, content);
if (executeScripts && scriptContent) { Document.Execute(scriptContent); }
return true;
}
else if ('createRange' in (document = Document.Get())) {
range = document.createRange();
if ('createContextualFragment' in range) {
fragment = range.createContextualFragment(content);
Document.AddElementToDOM(fragment, targetElement, options.position || 'bottom', true);
if (executeScripts && scriptContent) { Document.Execute(scriptContent); }
return true;
}
}
return false;
}
Document.CloneElement = function (element, targetElement, options) {
options = options || {};
options.targetElement = targetElement;
return _cloneElement(element, options);
};
Document.CloneElementContent = function (element, targetElement, options) {
options = options || {};
options.targetElement = targetElement;
options.onlyContent = true;
return _cloneElement(element, options);
};
Document.InsertElementContent = function (content, targetElement, options) {
options = options || {};
options.targetElement = targetElement;
return _cloneElement(content, options);
}
})();
(function () {
function _getXML(content, convertToLowerCase) {
var regExpTags = /<\/?\w+((\s+\w+(\s*=\s*(?:".*?"|'.*?'|[^\'\">\s]+))?)+\s*|\s*)\/?>/g;
var regExpTagName = /(<?\w+)|(<\/?\w+)\s/;
var regExpAttributes = /\=[a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9]+[?\s+|?>]/g;
var regExpTagAttribute = /(\=)([a-zA-Z\.\:\[\]_\(\)\&\$\%#\@\!0-9]+)?([\s+|?>])/g;
var data = content;
var tagMatches = data.match(regExpTags);
var tagMatchCounter, savedTagMatch, attributeMatch, attributeMatchLength, attributeMatchCounter;
if (tagMatches) {
for (tagMatchCounter = 0; tagMatchCounter < tagMatches.length; tagMatchCounter++) {
savedTagMatch = tagMatches[tagMatchCounter];
tagMatches[tagMatchCounter] = tagMatches[tagMatchCounter].replace(regExpTagName, function (tagName) {
return tagName.toLowerCase();
});
attributeMatch = tagMatches[tagMatchCounter].match(regExpAttributes);
if (attributeMatch) {
attributeMatchCounter = 0;
attributeMatchLength = attributeMatch.length;
while (attributeMatchCounter < attributeMatchLength) {
tagMatches[tagMatchCounter] = tagMatches[tagMatchCounter].replace(attributeMatch[attributeMatchCounter], attributeMatch[attributeMatchCounter].replace(regExpTagAttribute, function () {
var args = Array.prototype.slice.call(arguments);
return '=\"' + (convertToLowerCase ? args[2].toLowerCase() : args[2]) + '\"' + args[3];
}));
attributeMatchCounter++;
}
}
data = data.replace(savedTagMatch, tagMatches[tagMatchCounter]);
}
}
return data;
}
Document.GetInnerXML = function (element) {
if (!element.innerHTML || element.innerHTML == '') { return ''; }
return _getXML(element.innerHTML);
};
Document.GetOuterXML = function (element) {
if (!element.outerHTML || element.outerHTML == '') { return ''; }
return _getXML(element.outerHTML);
};
})();
(function () {
var _queryData = null;
var _queryDataDecoded = null;
Document.GetQuery = function (key, decodeValue) {
if (decodeValue == null) { decodeValue = true; } 
if (_queryData == null) {
_queryData = String.parseQueryString(location.search, true, false);
_queryDataDecoded = String.parseQueryString(location.search);
}
if (arguments.length == 0) {
if (!decodeValue) { return _queryData; }
return _queryDataDecoded;
}
if (key != null && key in _queryData) {
if (!decodeValue) { return _queryData[key]; }
return _queryDataDecoded[key];
}
return null;
};
})();
DomLoaded.Load(function () {
Document.body = document.body || document.documentElement; 
});
function BindInlineEvent(handlerString, element, event) {
Util.EventBinding.ExecutiveBind(handlerString, element, event);
}
function Listener(eventType, eventHandler) {
this.family = 'EventListener';
this.toString = function () { return '[object ' + this.family + ']'; };
this.id = Runtime.GetUniqueId();
this.type = eventType;
this.handler = eventHandler;
this.dispatcher = function () { };
return this;
}
var EventTrigger;
(function () {
function _verifyEvent(event, target) {
if (Document.IsDOM(target)) {
this.srcWindow = window;
this.srcDocument = document;
} else if (Document.IsElement(target) && Document.GetElementInFrames(target)) {
this.srcWindow = target.frame;
this.srcDocument = target.frameDocument;
} else {
Array.from(window.frames).forEach(function (frame) {
try {
if (frame.event) {
event = frame.event;
this.srcWindow = frame;
this.srcDocument = frame.document || frame.contentDocument || (frame.contentWindow ? frame.contentWindow.document : null);
}
} catch (e) { }
}, this);
}
return event;
}
EventTrigger = function (event) {
var target, type, pageX, pageY, targetBorder, targetPadding, targetPosition;
this.family = 'EventTrigger';
this.toString = function () { return '[object ' + this.family + ']'; };
target = event.target || event.srcElement;
event = _verifyEvent.call(this, event, target);
type = event.type.toLowerCase();
pageX = event.pageX || event.clientX + Document.GetBodyScrollLeft() || 0;
pageY = event.pageY || event.clientY + Document.GetBodyScrollTop() || 0;
this.element = target; 
this.type = type;
this.keyCode = event.charCode || event.keyCode || event.which || 0;
this.originalElement = event.originalElement || target; 
this.currentElement = event.currentTarget || null; 
if (type == 'mouseover') { this.fromElement = event.relatedTarget || event.fromElement; }
else if (type == 'mouseout') { this.toElement = event.relatedTarget || event.toElement; }
this.GetEvent = function () { return event; };
this.GetX = function () { return pageX; };
this.GetY = function () { return pageY; };
this.GetDeltaX = function () {
targetPosition = targetPosition || Dimension.GetPagePosition(target);
targetBorder = targetBorder || Dimension.GetBorderWidth(target);
targetPadding = targetPadding || Dimension.GetPadding(target);
return pageX - targetPosition.x + targetBorder.left + targetPadding.left;
};
this.GetDeltaY = function () {
targetPosition = targetPosition || Dimension.GetPagePosition(target);
targetBorder = targetBorder || Dimension.GetBorderWidth(target);
targetPadding = targetPadding || Dimension.GetPadding(target);
return pageY - targetPosition.y + targetBorder.top + targetPadding.top;
};
this.PreventDefault = function () {
if (event.preventDefault) { event.preventDefault(); }
event.returnValue = false;
};
this.StopPropagation = function () {
if (event.stopPropagation) { event.stopPropagation(); }
event.cancelBubble = true;
};
};
})();
var FormObject;
(function () {
var _formNodeNameList = ['input', 'select', 'textarea', 'form', 'label', 'button'];
var _nodeNameList = ['select', 'textarea', 'form', 'label', 'button'];
var _nodeTypeList = ['radio', 'checkbox', 'submit', 'button', 'text', 'password', 'hidden'];
FormObject = function (element) {
var storage = [];
var nodeName, nodeType;
this.family = 'FormObject';
this.toString = function () { return '[object ' + this.family + ']'; };
element = Document.GetElement(element);
if (element == null) { return null; }
element.id = element.id || Runtime.GetUniqueId();
this.element = element;
nodeName = element.nodeName.toLowerCase();
if (!Array.contains(_formNodeNameList, nodeName)) { return null; } 
this.IsTypeOf = function (type) {
if (type == nodeName && Array.contains(_nodeNameList, nodeName)) { return true; }
if (element.type) {
nodeType = element.type.toLowerCase();
if (type == nodeType && Array.contains(_nodeTypeList, nodeType)) { return true; }
}
return false;
};
this.Store = function (key, value) {
storage[key] = value;
return this;
};
this.Retrieve = function (key) {
return storage[key] || null;
};
this.Remove = function () {
Object.forEach(storage, function (value, key) {
delete storage[key];
});
delete FormObject.instances[this.element.id];
};
FormObject.instances[element.id] = this; 
};
FormObject.Get = function (element) {
var nodeName, instance;
element = Document.GetElement(element);
if (element == null) { return null; }
nodeName = element.nodeName.toLowerCase();
if (!Array.contains(_formNodeNameList, nodeName)) { return null; } 
element.id = element.id || Runtime.GetUniqueId();
instance = FormObject.instances[element.id];
return (instance && instance.element == element) ? instance : new FormObject(element);
};
})();
FormObject.instances = {};
FormObject.GetFormQueryString = function (form) {
var result = [];
var formLength, counter, field, fieldQueryString;
if (!form || form.nodeName && form.nodeName.toLowerCase() != 'form') { return null; }
formLength = form.elements.length;
for (counter = 0; counter < formLength; counter++) {
field = form.elements[counter];
fieldQueryString = this.GetQueryString(field);
if (fieldQueryString) { result.push(fieldQueryString); }
}
if (result.length == 0) { return null; }
return result.join('&');
};
FormObject.GetQueryString = function (element) {
var multiple = [];
var nodeName = (element.nodeName || '').toLowerCase();
var type = (element.type || '').toLowerCase();
var name = element.name || '';
var optionLength, counter, option;
if (element.disabled || name == '' || Array.contains(['submit', 'reset', 'file', 'image'], type)) { return null; }
if (nodeName == 'select') {
optionLength = element.options.length;
if (optionLength > 1 && Document.GetElementAttribute(element, 'multiple')) {
for (counter = 0; counter < optionLength; counter++) {
option = element.options[counter];
if (option.selected) { multiple.push(name + '=' + encodeURIComponent(option.value)); }
}
return multiple.join('&');
} else { return (name + '=' + encodeURIComponent(element.options[element.selectedIndex].value)); }
}
if (type != '' && Array.contains(['checkbox', 'radio'], type)) { return element.checked ? name + '=' + encodeURIComponent(element.value) : null; }
if (Array.contains(['input', 'textarea'], nodeName)) { return (name + '=' + encodeURIComponent(element.value)); }
return null;
};
FormObject.GetNearest = function (element) {
var formElement, counter, parentElement, siblings, formObject;
element = Document.GetElement(element);
if (element == null) { return null; }
formElement = FormObject.Get(element);
if (formElement != null) { return formElement; }
if (element.nodeName.toLowerCase() == 'form' && element.elements.length > 0) { return FormObject.Get(element.elements[element.elements.length - 1]); }
parentElement = element.parentNode;
if (parentElement != null && parentElement != element) {
siblings = parentElement.childNodes;
for (counter = 0; counter < siblings.length; counter++) {
formObject = FormObject.Get(siblings[counter]);
if (formObject != null) { return formObject; }
}
}
return this.GetNearest(parentElement);
};
FormObject.prototype.GetForm = function () {
var form, counter;
var formLength = document.forms.length;
for (counter = 0; counter < formLength; counter++) {
form = document.forms[counter];
if(form == this.element) {
return form;
}
if (form.elements[this.element.id]) {
return form;
}
}
return null;
};
FormObject.prototype.GetFormQueryString = function () {
return FormObject.GetFormQueryString(this.GetForm());
};
FormObject.prototype.GetQueryString = function () {
return FormObject.GetQueryString(this.element);
};
FormObject.prototype.Clear = function () {
if (this.element.value) {
delete this.element.value;
return true;
}
return false;
};
FormObject.prototype.Select = function (value) {
function _getIndex(element, optionValue) {
var counter;
for (counter = 0; counter < element.options.length; counter++) {
if (element.options[counter].value == optionValue) { return counter; }
}
return 0;
}
var isSelect = this.IsTypeOf('select');
var selectIndex, selectValue;
if (value == null && isSelect) { return false; }
if (isSelect) {
selectIndex = typeof value == 'number' ? value : null;
selectValue = selectIndex == null && value != null ? value : null;
if (selectIndex != null) {
this.element.options.selectedIndex = selectIndex;
} else if (selectValue != null) {
this.element.options.selectedIndex = _getIndex(this.element, selectValue);
}
} else if (this.IsTypeOf('radio') || this.IsTypeOf('checkbox')) {
if (value == null || this.element.value == value) { this.element.checked = true; }
else { this.element.checked = false; }
}
return null;
};
FormObject.prototype.Deselect = function () {
var isSelect = this.IsTypeOf('select');
if (isSelect) {
this.element.options.selectedIndex = -1;
return true;
}
if (this.IsTypeOf('radio') || this.IsTypeOf('checkbox')) {
this.element.checked = false;
return true;
}
return false;
};
FormObject.prototype.DispatchEvent = function (eventType) {
var obj = NodeObject.Get(this.element);
if (obj != null) { obj.DispatchEvent(eventType); }
};
Runtime.Declare('FormObject');
var NodeObject = function (element) {
var storage = [];
element = Document.GetElement(element);
if (element == null) { return null; }
element.id = element.id || Runtime.GetUniqueId();
this.element = element;
this.listener = {};
this.Store = function (key, value) {
storage[key] = value;
return this;
};
this.Retrieve = function (key) {
return storage[key] || null;
};
this.GetX = Dimension.GetX.pass(this.element);
this.GetY = Dimension.GetY.pass(this.element);
this.GetWidth = Dimension.GetWidth.pass(this.element);
this.GetHeight = Dimension.GetHeight.pass(this.element);
this.GetPageX = Dimension.GetPageX.pass(this.element);
this.GetPageY = Dimension.GetPageY.pass(this.element);
this.Remove = function () {
Object.forEach(storage, function (item, key) { delete storage[key]; });
delete NodeObject.instances[this.element.id];
};
NodeObject.instances[element.id] = this; 
};
NodeObject.instances = {};
NodeObject.Get = function (element) {
var instance;
element = Document.GetElement(element);
if (element == null) { return null; }
element.id = element.id || Runtime.GetUniqueId();
instance = NodeObject.instances[element.id];
return (instance && instance.element === element) ? instance : new NodeObject(element);
};
NodeObject.prototype.IsChildOf = function (parentElement) {
var node;
parentElement = Document.GetElement(parentElement);
if (!parentElement) { return false; }
node = this.element;
while (node = node.parentNode) {
if (node === parentElement) { return true; }
}
return false;
};
NodeObject.prototype.AddListener = function (listener) {
if (Object.typeOf(listener) != 'eventlistener') { return null; }
this.listener[listener.type] = this.listener[listener.type] || {};
if (this.listener[listener.type][listener.id]) { return this; } 
this.listener[listener.type][listener.id] = listener; 
listener.dispatcher = function (evt) { listener.handler(new EventTrigger(evt)) };
if (this.element.attachEvent && this.element.addEventListener) { this.element.attachEvent(listener.type, listener.dispatcher); }
if (this.element.addEventListener) { this.element.addEventListener(listener.type, listener.dispatcher, true); }
else if (this.element.attachEvent) { this.element.attachEvent('on' + listener.type, listener.dispatcher); }
return this;
};
NodeObject.prototype.RemoveListener = function (listener) {
if (Object.typeOf(listener) != 'eventlistener') { return null; }
if (this.listener[listener.type] != null && this.listener[listener.type][listener.id] == listener) {
if (this.element.detachEvent && this.element.removeEventListener) { this.element.detachEvent(listener.type, listener.dispatcher); }
if (this.element.removeEventListener) { this.element.removeEventListener(listener.type, listener.dispatcher, true); }
else if (this.element.detachEvent) { this.element.detachEvent('on' + listener.type, listener.dispatcher); }
delete this.listener[listener.type][listener.id]; 
return this;
}
return null;
};
NodeObject.prototype.DispatchEvent = function (event) {
var resultEvent;
var eventType = null;
if (typeof event == 'object') { eventType = event.type; }
if (typeof event == 'string') {
eventType = event;
event = {
view: window,
detail: 0,
screenX: 0,
screenY: 0,
clientX: 0,
clientY: 0,
ctrlKey: false,
altKey: false,
shiftKey: false,
metaKey: false,
button: 0,
relatedTarget: null,
currentTarget: null,
srcElement: null
};
}
if (eventType == null) { return; }
if (document.createEvent) {
if (eventType.startsWith('mouse') || eventType == 'click') {
resultEvent = document.createEvent('MouseEvents');
resultEvent.initMouseEvent(eventType, true, true, event.view, event.detail, event.screenX, event.screenY, event.clientX, event.clientY, event.ctrlKey, event.altKey, event.shiftKey, event.metaKey, event.button, event.relatedTarget);
} else {
resultEvent = document.createEvent('Events');
resultEvent.initEvent(eventType, true, true);
}
resultEvent.originalElement = event.currentTarget;
this.element.dispatchEvent(resultEvent);
} else if (document.createEventObject) {
resultEvent = document.createEventObject();
resultEvent.originalElement = event.srcElement;
this.element.fireEvent('on' + eventType, resultEvent);
}
};
NodeObject.prototype.GetInnerXML = function () { return Document.GetInnerXML(this.element); };
NodeObject.prototype.GetOuterXML = function () { return Document.GetOuterXML(this.element); };
Runtime.Declare('NodeObject');
var AjaxRequest;
(function () {
function _createNativeAjaxRequest() {
try { return new XMLHttpRequest(); } catch (e) {}
try { return new ActiveXObject('MSXML2.XMLHTTP'); } catch (e) {}
try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch (e) {}
return null;
}
function _isSuccess(status) {
return (status >= 200 && status < 300);
}
function _fireEvent(type) {
var args = Array.from(arguments);
args.shift();
var handler = this['on' + type];
if (handler != null) { handler.apply(this, args); }
}
function _onSuccess(responseText, responseXML) {
_fireEvent.call(this, 'complete'); 
_fireEvent.call(this, 'load', responseText, responseXML); 
}
function _onError() {
_fireEvent.call(this, 'complete'); 
_fireEvent.call(this, 'error', this.xhr); 
}
function _onStateChange() {
var status;
var xhr = this.xhr;
var debugXml, debugElement, debugData, debugTarget, debugField;
if (xhr.readyState != 4 || !this.running) return;
this.running = false;
this.status = 0;
try {
status = xhr.status;
this.status = (status == 1223) ? 204 : status; 
} catch (e) {}
xhr.onreadystatechange = function () {}; 
this.response = {
text: this.xhr.responseText || null,
xml: this.xhr.responseXML || null
};
if (this.options.isSuccess.call(this, this.status)) {
_onSuccess.call(this, this.response.text, this.response.xml);
debugXml = this.response.xml;
if (debugXml != null && (debugElement = debugXml.getElementsByTagName('debugString').item(0)) != null) {
debugData = debugElement.firstChild.data.replace('<h2>', '<h2> Ajax ');
debugTarget = document.getElementById('cbAjaxDebugString') || Document.CreateElement('div', {
id: 'cbAjaxDebugString',
targetElement: Document.body
});
if (debugTarget != null) {
Document.SetElementAttribute(debugTarget, 'html', debugData);
debugTarget.appendChild(document.createElement('h2').appendChild(document.createTextNode('Ajax Debug Last Call')));
debugField = document.getElementById('cbAjaxDebugLastCall') || Document.CreateElement('input', {
type: 'text',
id: 'cbAjaxDebugLastCall'
});
if (debugField != null) {
debugField.value = _url + '&' + _requestData;
debugTarget.appendChild(debugField);
}
}
}
}
else { _onError.call(this); }
}
function _getFormQueryString(element) {
var result;
var obj = FormObject.Get(element) || element;
if (obj != null) { result = obj.GetFormQueryString(); } 
return result || '';
}
var _events = ['request', 'complete', 'load', 'error', 'failure', 'abort', 'exception'];
var _url, _requestData; 
AjaxRequest = function (options) {
this.family = 'AjaxRequest';
this.toString = function () { return '[object ' + this.family + ']'; };
this.options = {
url: null,
data: '',
headers: {
'X-Requested-With': 'XMLHttpRequest',
'Accept': 'text/javascript, text/html, application/xml, text/xml, */*'
},
async: true,
method: 'get',
isSuccess: _isSuccess,
urlEncoded: true,
encoding: 'utf-8',
user: null,
password: null
};
this.xhr = null;
this.running = false;
this.status = 0;
this.response = null;
this.Initialize = function (options) {
this.xhr = _createNativeAjaxRequest();
if (this.xhr == null) { return false; }
Object.merge(this.options, options);
_events.forEach(function (name) {
this['on' + name] = this.options['on' + name] || this['on' + name];
}, this);
return true;
};
this.SetHeader = function (name, value) {
this.options.headers[name] = value;
return this;
};
this.GetHeader = function (name) {
var result = {};
var xhr = this.xhr;
var headers, splitPosition;
if (name != null) { return xhr.getResponseHeader(name) || null; }
else if (xhr.getAllResponseHeaders != null) {
headers = xhr.getAllResponseHeaders();
if (headers != null) {
headers = headers.split(/\r|\n/);
headers.forEach(function (item) {
if (item != '') {
splitPosition = item.indexOf(':');
result[item.substr(0, splitPosition).trim()] = item.substr(splitPosition + 1).trim();
}
});
}
return result;
}
return null;
};
this.Load = function (url, options) {
var settings = {};
var optionsType;
var data, method, encoding, headers;
var trimPosition;
var xhr = this.xhr;
this.running = true;
Object.merge(settings, this.options);
options = options || {};
optionsType = Object.typeOf(options);
if (optionsType == 'string' || optionsType == 'element') { settings.data = options; }
if (optionsType == 'object') { Object.merge(settings, options); }
if (Array.contains(['element', 'formobject'], Object.typeOf(settings.data))) { data = _getFormQueryString(settings.data); }
else { data = settings.data; }
method = settings.method.toLowerCase();
headers = settings.headers;
if (settings.urlEncoded && Array.contains(['post', 'put'], method)) {
encoding = (settings.encoding) ? '; charset=' + settings.encoding : '';
headers['Content-type'] = 'application/x-www-form-urlencoded' + encoding;
}
url = url || settings.url || document.location.pathname;
trimPosition = url.lastIndexOf('/');
if (trimPosition > -1 && (trimPosition = url.indexOf('#')) > -1) { url = url.substr(0, trimPosition); }
if (method == 'get' && typeof data == 'string' && data != '') {
url += (/\?/.test(url) ? '&' : '?') + data;
data = null;
}
var dataParams = data.split(/&amp;|&/);
var previewParam;
dataParams = dataParams.filter(function (param, index) {
if(param.indexOf('preview=') == 0) {
previewParam = param;
return false;
}
return true;
});
if (previewParam) {
url += '&' + previewParam;
data = dataParams.join('&');
}
_url = url;
_requestData = data;
try { xhr.open(method.toUpperCase(), url, settings.async, settings.user, settings.password); } 
catch (e) {
_fireEvent.call(this, 'request'); 
_fireEvent.call(this, 'complete'); 
_fireEvent.call(this, 'error', this.xhr); 
_fireEvent.call(this, 'failure'); 
return this;
}
if (settings.user != null && 'withCredentials' in xhr) { xhr.withCredentials = true; }
xhr.onreadystatechange = _onStateChange.bind(this);
Object.forEach(headers, function(value, key) {
try { xhr.setRequestHeader(key, value); } 
catch (e) { _fireEvent('exception', key, value); } 
}, this);
_fireEvent.call(this, 'request'); 
try { xhr.send(data); } 
catch (e) { _fireEvent.call(this, 'failure'); } 
if (!settings.async) { _onStateChange.call(this); }
return this;
};
this.Get = function (url, data) {
return this.Load(url, {
method: 'get',
data: data || this.options.data
});
};
this.Post = function (url, data) {
return this.Load(url, {
method: 'post',
data: data || this.options.data
});
};
this.Put = function (url, data) {
return this.Load(url, {
method: 'put',
data: data || this.options.data
});
};
this.Delete = function (url, data) {
return this.Load(url, {
method: 'delete',
data: data || this.options.data
});
};
this.Abort = function () {
var xhr = this.xhr;
if (!this.running) { return this; }
this.running = false;
xhr.abort();
xhr.onreadystatechange = function () {};
this.xhr = _createNativeAjaxRequest();
_fireEvent.call(this, 'abort'); 
return this;
};
this.GetText = function () {
return this.response.text || null;
};
this.GetXML = function () {
return this.response.xml || null;
};
this.GetXMLNode = function (nodeName) {
var xml = this.response.xml || null;
var hasCDataOnly, CDataNode;
var element, nodeList, node, counter;
if (xml == null) { return null; }
element = xml.getElementsByTagName(nodeName || 'body')[0];
if (element == null) { return null; }
nodeList = element.childNodes;
hasCDataOnly = true;
for (counter = 0; counter < nodeList.length; counter++) {
node = nodeList[counter];
if (node.nodeType == 4) { CDataNode = node; } 
else if (Object.typeOf(node) == 'textnode') { hasCDataOnly = false; } 
}
if (hasCDataOnly && CDataNode != null) { return CDataNode.data; }
return element;
};
if (!this.Initialize(options)) { return null; }
return this;
};
AjaxRequest.Load = function (url, options) {
var request = new AjaxRequest(options);
if (request != null) { request.Load(url); }
return request;
};
})();
Runtime.Declare('AjaxRequest');

var Util = Util || {};
Util.Debug = {
_string: "",
Append: function(string) {
this._string += string + "\n";
return this._string;
},
Get: function() { return this._string; },
Throw: function() { alert(this._string); },
Clear: function() { this._string = ""; }
};
Util.EventBinding = {
ArrayOfListenerType: new Array("click", "dblclick", "mouseover", "mouseout", "change", "focus", "blur", "mouseup", "mousedown", "submit", "contextmenu", "keydown", "keyup", "keypress"),
_StringTypeToType: function(strParam) {
strParam = strParam.replace(/\"/g, '\\\"');
if (strParam.indexOf("list:[") == 0) {
return strParam.replace("list:[", "new Array(\"").replace(",", "\",\"").replace("]", "\")");
} else if (strParam.indexOf("string:[") == 0) {
return strParam.replace("string:[", "new String(\"").replace("]", "\")");
} else if (strParam.indexOf("runtime:") > -1) {
return "Runtime.Get(\"" + strParam.replace("runtime:", "") + "\")";
} else if (strParam.indexOf("this") > -1) {
return strParam.replace("this", "trigger.element");
} else if ((strParam.indexOf("number:") < 0 && strParam.indexOf("bool:") < 0 && strParam != "null") || strParam.indexOf("string:") > -1) {
return "\"" + strParam.replace("string:", "") + "\"";
} else {
return strParam.replace("number:", "").replace("bool:", "");
}
},
_ParamStringToObjectString: function(paramString) {
var paramObjectStr = "{trigger: trigger"; 
if (paramString.indexOf("{") != -1) {
var aStrP = paramString.split("}");
if (aStrP.length > 1) {
paramObjectStr = paramObjectStr + ",";
} 
for (var i = 0; i < aStrP.length && aStrP[i].length > 0; i++) {
var aThisP = aStrP[i].split("{");
if (aThisP.length > 1) {
paramObjectStr += aThisP[0] + ": " + this._StringTypeToType(aThisP[1]); 
}
}
}
paramObjectStr = paramObjectStr + "}";
return paramObjectStr;
},
Transform: function(handlerString) {
var functions = "";
var aStrF = handlerString.split("];");
for (var i = 0; i < aStrF.length && aStrF[i].length > 0; i++) {
var intFirstBrack = aStrF[i].indexOf("[");
var thisStrP = aStrF[i].substring(intFirstBrack + 1);
var thisF = aStrF[i].substring(0, intFirstBrack) + "(" + this._ParamStringToObjectString(thisStrP) + ");";
functions += thisF;
}
return new Function("trigger", "" + functions + "");
},
ExecutiveBind: function(handlerString, element, event) { 
if (!event) { 
event = window.event;
}
element.id = element.id || Runtime.GetUniqueId();
var evtType = event.type;
if (evtType != null && element["on" + evtType] != null) {
var f = this.Transform(handlerString);
if (window.addEventListener) {
f(new EventTrigger(event, element));
} else { 
element["on" + evtType] = null;
NodeObject.Get(element).AddListener(new Listener(evtType, f));
}
}
}
};
Util.Nodes = {
CreateSlidingDoors: function (nodeTo) {
var s = document.createElement("div");
s.className = nodeTo.className == Runtime.Get("ClassNamePrefix") + "Top" ? Runtime.Get("ClassNamePrefix") + "Right"
: nodeTo.className == Runtime.Get("ClassNamePrefix") + "Right" ? Runtime.Get("ClassNamePrefix") + "Bottom"
: nodeTo.className == Runtime.Get("ClassNamePrefix") + "Bottom" ? Runtime.Get("ClassNamePrefix") + "Left" : Runtime.Get("ClassNamePrefix") + "Top";
nodeTo.appendChild(s);
if (s.className == Runtime.Get("ClassNamePrefix") + "Left") {
var c = document.createElement("div");
c.className = Runtime.Get("ClassNamePrefix") + "Content";
s.appendChild(c);
return c;
} else {
return this.CreateSlidingDoors(s);
}
}
};

document.write('<style rel="stylesheet" type="text/css" id="JSEffect" title="JSEffect">.' + Runtime.Get("ClassNamePrefix") + 'JSFold{display: none ! important;} .' + Runtime.Get("ClassNamePrefix") + 'JSHide{visibility: hidden ! important;}</style>');
var Effect = function () { };
(function () {
var _useActiveXCover, _syncActiveXCover;
if (Utils.CheckBrowser('ie6')) {
_syncActiveXCover = function (coverElement) {
var iCurStyle = this.currentStyle;
var iElement = this.element;
var curPos = iCurStyle.position;
var isNeeded = (curPos == 'absolute' || curPos == 'fixed') && iCurStyle.display != 'none' && iCurStyle.visibility != 'hidden';
var oStyle;
if (!isNeeded) {
if (coverElement) { Document.RemoveElement(coverElement); }
return null;
} else if (!coverElement) {
coverElement = iElement.parentNode.appendChild(_useActiveXCover.cloneNode(true));
}
oStyle = coverElement.style;
oStyle.top = Dimension.GetPageY(iElement) + 'px';
oStyle.left = Dimension.GetPageX(iElement) + 'px';
oStyle.width = (Dimension.GetWidth(iElement)) + 'px';
oStyle.height = Dimension.GetHeight(iElement) + 'px';
oStyle.zIndex = iElement.currentStyle.zIndex - 1;
return coverElement;
};
_useActiveXCover = document.createElement('<iframe style="position:absolute;'
+ 'filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=0);"'
+ ' frameborder="0" src="javascript:false;"></iframe>');
}
function _provideSelectorFallback() {
this.initialStyle = this.initialStyle || {};
["position", "width", "height", "top", "right", "bottom", "left", "right", "opacity", "filter", "clip"].forEach(function (value, index) {
if (this.currentStyle[value]) { this.initialStyle[value] = this.currentStyle[value]; }
}, this);
}
function _provideSelector() {
var _providedSelectorText;
var s = Effect.GetStyleSheet();
if (!s || Utils.CheckBrowser('ie6')) { _provideSelectorFallback.call(this); return null; }
_providedSelectorText = this.element.nodeName + "#" + this.element.id;
try { 
var rulesList = s.cssRules || s.rules || null; 
if (!rulesList) { _provideSelectorFallback.call(this); return null; }
for (var ri = 0; ri < rulesList.length; ri++) {
if (rulesList[ri].selectorText.toLowerCase() == _providedSelectorText.toLowerCase()) { return rulesList[ri]; }
}
var prop = "position:" + (this.currentStyle.position || "static");
var selectorIndex;
if (s.insertRule) {
s.insertRule(_providedSelectorText + " {" + prop + "}", rulesList.length);
selectorIndex = rulesList.length - 1;
return s.cssRules[selectorIndex];
}
else if (s.addRule) {
s.addRule(_providedSelectorText, prop, rulesList.length); 
selectorIndex = rulesList.length - 1;
return s.rules[selectorIndex];
}
} catch (e) { _provideSelectorFallback.call(this); }
return null;
}
function _applyPropertyValue(property, value, selector) {
if (selector) { selector.style[property] = value; }
else { this.element.style[property] = value; }
}
Effect = function (element) {
var _storage = [];
var _selector, _activeXCover;
element = Document.GetElement(element);
if (!Document.IsDOM(element)) { return null; }
element.id = element.id || Runtime.GetUniqueId();
this.element = element;
this.currentStyle = this.element.currentStyle || window.getComputedStyle(this.element, null) || null;
if (!this.currentStyle) { return null; }
_selector = _provideSelector.call(this);
this.family = 'Effect';
this.toString = function () { return '[object ' + this.family + ']'; };
this.Sync = function () {
if (_syncActiveXCover) { _activeXCover = _syncActiveXCover.call(this, _activeXCover); }
};
this.ApplyStyle = function (property, value) {
if (typeof property == 'string') { _applyPropertyValue.call(this, property, value, _selector); return this; }
Object.forEach(property, function (itemValue, itemKey) { _applyPropertyValue.call(this, itemKey, itemValue, _selector); } .bind(this));
return this;
};
this.RemoveClass = function (className) { Document.RemoveElementClass(this.element, className); return this; };
this.AddClass = function (className) { Document.AddElementClass(this.element, className); return this; };
this.Store = function (key, item) { _storage[key] = item; return this; };
this.Retrieve = function (key) { return _storage[key] || null; };
this.Remove = function () {
var s = Effect.GetStyleSheet();
_storage.forEach(function (item, key) { delete _storage[key]; });
if (_selector && s) {
var aor = s.rules || s.cssRules || null;
if (aor != null) {
for (var ri = 0; ri < aor.length; ri++) {
if (aor[ri].selectorText.toLowerCase() == _selector.selectorText.toLowerCase()) {
if (s.removeRule) { s.removeRule(ri); }
else if (s.deleteRule) { s.deleteRule(ri); }
break;
}
}
}
}
else if (this.initialStyle) {
for (var p in this.initialStyle) {
this.element.style[p] = this.initialStyle[p];
}
if (this._ie6ActiveXLayer) { Document.RemoveElement(this._ie6ActiveXLayer); }
}
delete Effect.instances[element.id];
};
Effect.instances[element.id] = this;
};
})();
Effect.instances = {};
Effect.Get = function (element) {
element = Document.GetElement(element);
if (!Document.IsDOM(element)) { return null; }
element.id = element.id || Runtime.GetUniqueId();
return Effect.instances[element.id] || new Effect(element.id);
};
(function () {
var _styleSheet = null;
var _checkedStyleSheet = false;
Effect.GetStyleSheet = function(){
if (!_checkedStyleSheet){
Array.from(document.styleSheets).forEach(function (styleSheet) {
if (styleSheet.title == "JSEffect") { _styleSheet = styleSheet; }
}); _checkedStyleSheet = true;
}
return _styleSheet;
};
})();
Effect.prototype.Show = function () {
this.RemoveClass("JSHide");
this.Sync();
return this;
};
Effect.prototype.Hide = function () {
this.AddClass("JSHide");
this.Sync();
return this;
};
Effect.prototype.Display = function () {
this.RemoveClass("JSFold");
this.Sync();
return this;
};
Effect.prototype.Fold = function () {
this.AddClass("JSFold");
this.Sync();
return this;
};
Effect.prototype.MoveTo = function (x, y) {
this.ApplyStyle("position", "absolute"); this.ApplyStyle("left", x + "px"); this.ApplyStyle("top", y + "px");
this.Sync();
return this;
};
Effect.prototype.ScaleTo = function (w, h) {
this.ApplyStyle("width", w + "px"); this.ApplyStyle("height", h + "px");
this.Sync();
return this;
};
Effect.prototype.FadeTo = function (o) {
if (Utils.CheckFeature('cssFilter')) { this.ApplyStyle("filter", "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + parseInt(o) + ")"); }
else { this.ApplyStyle("opacity", o / 100); }
this.currentOpacity = o;
return this;
};
Effect.prototype.ClipTo = function (t, r, b, l) {
this.ApplyStyle("position", "absolute");
this.ApplyStyle("clip", "rect(" + t + "px," + r + "px," + b + "px," + l + "px)");
this.currentClip = [t, r, b, l];
return this;
};
Effect.prototype.Maximize = function () {
var x = Document.GetWidth() - parseInt(this.currentStyle.paddingLeft) - parseInt(this.currentStyle.marginLeft) - parseInt(this.currentStyle.paddingRight) - parseInt(this.currentStyle.marginLeft);
var y = Document.GetHeight() - parseInt(this.currentStyle.paddingTop) - parseInt(this.currentStyle.marginTop) - parseInt(this.currentStyle.paddingBottom) - parseInt(this.currentStyle.marginBottom);
this.ApplyStyle("position", Utils.CheckBrowser('ie6') ? "absolute" : "fixed");
this.ApplyStyle("top", 0 + "px");
this.ApplyStyle("left", 0 + "px");
this.ApplyStyle("zIndex", 419999);
this.ScaleTo(x, y);
this.Sync();
return this;
};
Effect.prototype.EnableDragDrop = function (dragArea) {
dragArea = dragArea || this.element;
this._dd_noDragArea = NodeObject.Get(dragArea);
var noBody = NodeObject.Get(Document.body);
this._dd_noDragArea.element.style.cursor = "move";
this._dd_moveListener = this._dd_moveListener || new Listener("mousemove", function (trigger) {
var x = trigger.GetX() - this.deltaX;
var y = trigger.GetY() - this.deltaY;
this.element.style.top = y + "px";
this.element.style.left = x + "px";
trigger.StopPropagation();
}
.bind(this));
this._dd_stopListener = this._dd_stopListener || new Listener("mouseup", function (trigger) {
noBody.RemoveListener(this._dd_moveListener).RemoveListener(this._dd_stopListener);
if (!this.initialStyle && this.element.style.left && this.element.style.top) { 
var x = this.element.style.left;
var y = this.element.style.top;
this.element.style.left = null; this.element.style.top = null;
this.ApplyStyle("left", x); this.ApplyStyle("top", y);
this.Sync();
if (this.ondrop) {
this.ondrop();
}
}
trigger.StopPropagation();
}
.bind(this));
this._dd_startListener = this._dd_startListener || new Listener("mousedown", function (trigger) {
this.deltaX = trigger.GetX() - Dimension.GetX(this.element);
this.deltaY = trigger.GetY() - Dimension.GetY(this.element);
noBody.AddListener(this._dd_moveListener).AddListener(this._dd_stopListener);
if (this.currentStyle.position != "fixed") { this.ApplyStyle("position", "absolute"); }
trigger.StopPropagation();
trigger.PreventDefault();
}
.bind(this));
this._dd_noDragArea.AddListener(this._dd_startListener);
this.Store("isDragDrop", true);
return this;
};
Effect.prototype.DisableDragDrop = function () {
if (this._dd_noDragArea) {
this._dd_noDragArea.RemoveListener(this._dd_startListener);
delete this._dd_startListener;
delete this._dd_stopListener;
delete this._dd_moveListener;
this._dd_noDragArea.element.style.cursor = "default";
delete this._dd_noDragArea;
this.Store("isDragDrop", false);
}
return this;
};
Runtime.Declare("Effect");

var Layer = function () {
function _createCloseButton(position, persistent) { 
position = Array.contains(['top', 'bottom'], position) ? position : 'top';
var self = this;
var listenerElement, noListener, eLayer;
if (!this.closeNode) {
this.closeNode = Document.CreateElement('div', {
className: Runtime.Get('ClassNamePrefix') + 'Close'
});
listenerElement = Document.CreateElement('a', {
className: Runtime.Get('ClassNamePrefix') + 'Close',
href: 'javascript:void(0);',
targetElement: this.closeNode
});
this.closeLabel = Document.CreateElement('span', {
className: Runtime.Get('ClassNamePrefix') + 'CloseLabel',
text: '!close!',
targetElement: listenerElement
});
switch (position) {
case 'top':
Document.AddElementToDOM(this.closeNode, this.headNode, 'before');
break;
case 'bottom':
Document.AddElementToDOM(this.closeNode, this.footNode, 'after');
break;
}
noListener = NodeObject.Get(listenerElement);
if (Runtime.IsDeclared('Effect')) { eLayer = Effect.Get(this.element); }
if (persistent) {
noListener.AddListener(new Listener('click', function () {
if (self.onclose) { self.onclose(this); }
if (eLayer) { eLayer.Fold(); }
else { self.style.visibility = 'hidden'; }
Layer.EnableContent();
}));
} else {
noListener.AddListener(new Listener('click', function () {
if (self.onclose) { self.onclose(this); }
if (eLayer) { eLayer.Fold(); }
self.Remove();
Layer.EnableContent();
}));
}
}
}
function _createSubmitButton(position, persistent) { 
position = Array.contains(['top', 'bottom'], position) ? position : 'bottom';
var self = this;
var listenerElement, noListener, eLayer;
if (!this.submitNode) {
this.submitNode = Document.CreateElement('div', {
className: Runtime.Get('ClassNamePrefix') + 'AddToCartLink'
});
listenerElement = Document.CreateElement('a', {
className: Runtime.Get('ClassNamePrefix') + 'HyperLink',
href: 'javascript:void(0);',
targetElement: this.submitNode
});
this.submitElement = listenerElement;
this.submitLabel = Document.CreateElement('span', {
className: Runtime.Get('ClassNamePrefix') + 'HyperLink',
text: '!submit!',
targetElement: listenerElement
});
switch (position) {
case 'top':
Document.AddElementToDOM(this.submitNode, this.headNode, 'before');
break;
case 'bottom':
Document.AddElementToDOM(this.submitNode, this.footNode, 'before'); 
break;
}
noListener = NodeObject.Get(listenerElement);
if (Runtime.IsDeclared('Effect')) { eLayer = Effect.Get(this.element); }
if (persistent) {
noListener.AddListener(new Listener('click', function () {
if (self.onsubmit) { self.onsubmit(this); }
if (self.onclose) { self.onclose(this); }
if (eLayer) { eLayer.Fold(); }
else { self.style.visibility = 'hidden'; }
Layer.EnableContent();
}));
} else {
noListener.AddListener(new Listener('click', function () {
if (self.onsubmit) { self.onsubmit(this); }
if (self.onclose) { self.onclose(this); }
if (eLayer) { eLayer.Fold(); }
self.Remove();
Layer.EnableContent();
}));
}
}
}
return function (id, options) {
options = options || {};
var _storage = [];
id = id || Runtime.GetUniqueId();
this.element = Document.CreateElement('div', {
id: id,
className: Runtime.Get('ClassNamePrefix') + 'Layer',
targetElement: Document.body
});
if (Runtime.IsDeclared('Effect')) {
Effect.Get(this.element).ApplyStyle({ position: 'absolute', top: '0px', left: '0px', zIndex: Layer.Retrieve('topLevel') });
} else {
Document.SetElementStyle(this.element, { position: 'absolute', top: '0px', left: '0px', zIndex: Layer.Retrieve('topLevel') });
}
this.contentNode = Util.Nodes.CreateSlidingDoors(this.element);
this.headNode = Document.CreateElement('div', {
className: Runtime.Get('ClassNamePrefix') + 'Head'
});
Document.AddElementToDOM(this.headNode, this.contentNode, 'before');
this.footNode = Document.CreateElement('div', {
className: Runtime.Get('ClassNamePrefix') + 'Foot'
});
Document.AddElementToDOM(this.footNode, this.contentNode, 'after');
this.family = 'Layer';
this.toString = function() { return '[object ' + this.family + ']'; };
this.EnablePersistentClose = function(position) {
_createCloseButton.call(this, position, true);
this.Store('isPersistentCloseEnabled', true);
return this;
};
this.EnableClose = function(position) {
_createCloseButton.call(this, position, false);
this.Store('isCloseEnabled', true);
return this;
};
this.DisableClose = function() {
if (this.closeNode) {
Document.RemoveElement(this.closeNode);
this.Store('isCloseEnabled', false);
this.Store('isPersistentCloseEnabled', false);
}
return this;
};
this.EnablePersistentSubmit = function(position) {
_createSubmitButton.call(this, position, true);
this.Store('isPersistentSubmitEnabled', true);
return this;
};
this.EnableSubmit = function(position) {
_createSubmitButton.call(this, position, false);
this.Store('isSubmitEnabled', true);
return this;
};
this.DisableSubmit = function() {
if (this.submitNode) {
Document.RemoveElement(this.submitNode);
this.Store('isSubmitEnabled', false);
this.Store('isPersistentSubmitEnabled', false);
}
return this;
};
this.Store = function(key, item) {
_storage[key] = item;
return this;
};
this.Retrieve = function(key) { return _storage[key] || null; };
this.Remove = function() {
_storage.forEach(function(item, key) { delete _storage[key]; });
delete Layer.instances[this.element.id];
if (this.headNode) {
Document.RemoveElement(this.headNode);
}
if (this.footNode) {
Document.RemoveElement(this.footNode);
}
if (this.closeNode) {
Document.RemoveElement(this.closeNode);
}
if (this.submitNode) {
Document.RemoveElement(this.submitNode);
}
if (this.contentNode) {
Document.RemoveElement(this.contentNode);
}
Document.RemoveElement(this.element);
};
Layer.instances[id] = this;
};
} ();
Layer.instances = {};
Layer.Get = function (id) {
id = id || Runtime.GetUniqueId();
return Layer.instances[id] || new Layer(id);
};
(function () {
var _staticStorage = { topLevel: 1000, contentDisabler: null };
Layer.Store = function (key, item) { _staticStorage[key] = item; };
Layer.Retrieve = function (key) { return _staticStorage[key] || null; };
Layer.DisableContent = function () {
var eContentDisabler;
if (Utils.CheckBrowser('ie6')) { return this; }
if (!_staticStorage.contentDisabler) {
_staticStorage.contentDisabler = Document.CreateElement('div', {
id: Runtime.GetUniqueId(),
className: Runtime.Get('ClassNamePrefix') + 'LayerContentDisabler',
targetElement: Document.body
});
if (Runtime.IsDeclared('EffectAnim')) {
eContentDisabler = Effect.Get(_staticStorage.contentDisabler);
eContentDisabler.Fold().ApplyStyle({ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: '#000' });
}
}
if (Runtime.IsDeclared('Effect')) {
eContentDisabler = eContentDisabler || Effect.Get(_staticStorage.contentDisabler);
if (Runtime.IsDeclared('EffectAnim')) {
eContentDisabler.ApplyStyle('zIndex', _staticStorage.topLevel - 2);
eContentDisabler.FadeTo(1).Display();
eContentDisabler.AnimFadeTo(50);
} else {
eContentDisabler = eContentDisabler || Effect.Get(_staticStorage.contentDisabler);
eContentDisabler.Display().ApplyStyle('zIndex', _staticStorage.topLevel - 2);
}
}
else {
_staticStorage.contentDisabler.style.display = 'block';
_staticStorage.contentDisabler.style.zIndex = _staticStorage.topLevel - 2;
}
_staticStorage.isContentDisabled = true;
};
Layer.EnableContent = function () {
var eContentDisabler;
if (Utils.CheckBrowser('ie6')) { return this; }
if (_staticStorage.contentDisabler && _staticStorage.isContentDisabled) {
if (Runtime.IsDeclared('Effect')) {
eContentDisabler = Effect.Get(_staticStorage.contentDisabler);
if (Runtime.IsDeclared('EffectAnim')) {
eContentDisabler.onreadystate = function() { eContentDisabler.Fold(); };
eContentDisabler.AnimFadeTo(1);
} else {
eContentDisabler.Fold();
}
}
else { _staticStorage.contentDisabler.style.display = 'none'; }
}
_staticStorage.isContentDisabled = false;
};
})();
Layer.prototype.SetContentDirection = function (dir) { Document.SetElementAttribute(this.element, 'dir', dir); };
Layer.prototype.EnableDragDrop = function () {
if (Runtime.IsDeclared('Effect') && !this.Retrieve('isDragDropEnabled')) {
Effect.Get(this.element).EnableDragDrop(this.headNode);
this.Store('isDragDropEnabled', true);
}
return this;
};
Layer.prototype.ForceTopLevel = function (intZIndex) {
intZIndex = intZIndex ? intZIndex : Layer.Retrieve('topLevel') + 2;
Layer.Store('topLevel', intZIndex);
this.element.style.zIndex = intZIndex;
};
Runtime.Declare('Layer');

var Serializer = {};
(function () {
var _SerializerSettings = function (options) {
function _decodeFilter(filter) {
var namespace = '*';
var tagName = filter;
if (filter.indexOf(':') > -1) {
namespace = filter.replace(/:.*/, '');
tagName = filter.replace(/^.*:/, '');
}
if (namespace == '') { namespace = '*'; }
if (tagName == '') { tagName = '*'; }
return {
namespace: namespace.toLowerCase(),
tagName: tagName.toLowerCase()
};
}
function _setHook(filter, handler, processType) {
var filterList, filterParts;
processType = (Array.contains(['preProcess', 'postProcess'], processType) ? processType : 'preProcess'); 
filterList = Array.from(filter);
filterList.forEach(function (filter) {
filterParts = _decodeFilter(filter);
if (_hooks[processType][filterParts.namespace] == null) { _hooks[processType][filterParts.namespace] = []; }
_hooks[processType][filterParts.namespace][filterParts.tagName] = handler;
});
}
function _removeHook(filter, processType) {
var filterList, filterParts;
processType = (Array.contains(['preProcess', 'postProcess'], processType) ? processType : 'preProcess'); 
if (!Array.contains(['string', 'array'], Object.typeOf(filter))) {
_hooks[processType] = [];
return;
}
filterList = Array.from(filter);
filterList.forEach(function (filter) {
filterParts = _decodeFilter(filter);
if (_hooks[processType][filterParts.namespace] != null && _hooks[processType][filterParts.namespace][filterParts.tagName] != null) { _hooks[processType][filterParts.namespace][filterParts.tagName] = null; }
});
}
var _hooks = {
preProcess: [],
postProcess: []
};
var _Settings = {
family: 'SerializerSettings',
options: {},
GetTemplate: function (obj, config) {
var result;
var attributesList, counter, level;
if (Object.typeOf(obj) != 'object') { return null; }
result = Object.clone(obj);
if (config.__cleanAttributes == null) { return result; }
config.__cleanAttributes.forEach(function (attribute) {
if (attribute.indexOf('.') > -1) {
attributesList = attribute.split('.');
level = result;
counter = 0;
while (counter < attributesList.length - 1) {
level = level[attributesList[counter]];
counter++;
}
delete level[attributesList[counter]];
} else { delete result[attribute]; }
});
return result;
},
SetPreProcessHook: function (filter, handler) {
_setHook(filter, handler, 'preProcess');
return this;
},
SetPostProcessHook: function (filter, handler) {
_setHook(filter, handler, 'postProcess');
return this;
},
RemovePreProcessHook: function (filter) {
_removeHook(filter, 'preProcess');
return this;
},
RemovePostProcessHook: function (filter) {
_removeHook(filter, 'postProcess');
return this;
},
RemoveHooks: function (filter) {
this.RemovePreProcessHook(filter);
this.RemovePostProcessHook(filter);
return this;
},
PreProcess: function (data, obj, content, config) {
var result;
var namespace, tagName;
var namespaceHook, handlerHook;
var filter;
if (obj.name == null) { return null; }
filter = {
namespace: obj.namespace,
name: obj.name
};
namespace = obj.namespace || '*';
tagName = obj.name.toLowerCase();
namespaceHook = _hooks.preProcess[namespace] || _hooks.preProcess['*'];
if (namespaceHook != null) { handlerHook = _hooks.preProcess[namespace][tagName] || _hooks.preProcess[namespace]['*']; }
if (handlerHook != null) { result = handlerHook.call(this, data, obj, content, config); }
config.__filter = filter;
return result;
},
PostProcess: function (data, obj, element, config) {
var namespace, tagName;
var namespaceHook, handlerHook;
if (obj.name == null) { return null; }
config.__filter = config.__filter || {};
namespace = config.__filter.namespace || obj.namespace || '*';
tagName = (config.__filter.name || obj.name).toLowerCase();
delete config.__filter;
namespaceHook = _hooks.postProcess[namespace] || _hooks.postProcess['*'];
if (namespaceHook != null) { handlerHook = _hooks.postProcess[namespace][tagName] || _hooks.postProcess[namespace]['*']; }
if (handlerHook != null) { return handlerHook.call(this, data, obj, element, config); }
return null;
}
};
options = options || {};
Object.set(_Settings.options, options);
_Settings.toString = function () { return '[object ' + _Settings.family + ']'; };
return _Settings;
};
var _SerializerInstance = function (options) {
var _settings = null; 
var _textConverter;
function _createElement(options) {
var textNode, text;
var tagName = options.name;
if (tagName != null) { return Document.CreateElement(tagName, options.attributes || {}); } 
if (!Array.contains([null, ''], options.text)) {
_textConverter = _textConverter || document.createElement('div'); 
_textConverter.innerHTML = options.text; 
text = _textConverter.firstChild.nodeValue; 
textNode = document.createTextNode(text);
if (textNode != null && options.parentElement != null) { options.parentElement.appendChild(textNode); }
}
return null;
}
function _objectToElement(obj, parentElement, data, config) {
var resultElement;
var childItems, childItemsLength, counter;
if (Object.typeOf(obj) == 'array') {
childItems = obj;
childItemsLength = obj.length;
for (counter = 0; counter < childItemsLength; counter++) {
_objectToElement(childItems[counter], parentElement, data, config);
}
return;
}
config = config || {};
config.callback = _objectToElement; 
obj.children = obj.children || [];
obj.attributes = Object.map(obj.attributes, function (value) {
return decodeURIComponent(value);
});
obj.text = decodeURIComponent(obj.text);
if (obj.content != null) { obj.attributes.html = obj.content; }
if (Object.typeOf(parentElement) == 'element') {
obj.parentElement = parentElement;
obj.attributes.targetElement = parentElement;
}
if (Array.contains([null, undefined, ''], obj.namespace)) { obj.namespace = null; }
config.__cleanAttributes = ['attributes.html', 'parentElement', 'attributes.targetElement'];
resultElement = _settings.PreProcess(data, obj, obj.children, config); 
delete config.__cleanAttributes;
if (resultElement == null) {
resultElement = _createElement(obj);
if (resultElement == null) { return null; }
_settings.PostProcess(data, obj, resultElement, config); 
childItems = obj.children;
childItemsLength = childItems.length;
for (counter = 0; counter < childItemsLength; counter++) {
_objectToElement(childItems[counter], resultElement, data, config);
}
} else { _settings.PostProcess(data, obj, resultElement, config); } 
return resultElement;
}
function _elementToObject(element) {
var resultObj;
var tagName, cleanTagName;
var counter, attributes, attributeItem, attributeName;
var childIndex, childItem, childObject;
if (element) {
switch (element.nodeType) {
case 1: 
resultObj = {};
tagName = element.nodeName.toLowerCase();
cleanTagName = tagName.replace(/^.*:/, '');
if (typeof element.scopeName == 'string' && element.scopeName.toLowerCase() != 'html') { resultObj.namespace = element.scopeName.toLowerCase(); }
else { resultObj.namespace = tagName.replace(new RegExp(cleanTagName + '$'), '').replace(/:$/, ''); }
resultObj.name = cleanTagName;
if (element.attributes.length > 0) {
resultObj.attributes = {};
attributes = element.attributes;
for (counter = 0; counter < attributes.length; counter++) {
attributeItem = attributes[counter];
attributeName = attributeItem.nodeName.toLowerCase();
if (attributeItem.nodeValue != null && !/^on/i.test(attributeName) && !/^aria/i.test(attributeName) && attributeItem.nodeValue != '' && attributeItem.nodeValue != 'inherit' && attributeItem.nodeValue != 'style') {
resultObj.attributes[attributeName] = encodeURIComponent(attributeItem.nodeValue);
}
if (element.style.cssText) {
resultObj.attributes.style = encodeURIComponent(element.style.cssText);
}
}
}
if (element.childNodes.length > 0) {
resultObj["children"] = [];
for (counter = 0; counter < element.childNodes.length; counter++) {
childItem = element.childNodes[counter];
if (childItem.nodeType) {
childObject = _elementToObject(childItem);
if (childObject) { resultObj["children"].push(childObject); }
}
}
}
break;
case 3: 
if (element.data.match(/\S+/) != null) { resultObj = { 'text': element.data.replace(/\s+/g, ' ') }; }
}
}
return resultObj;
}
var _data = {};
var _Serializer = {
family: 'Serializer',
options: {},
UseSettings: function (settings) {
if (Object.typeOf(settings) == 'serializersettings') { _settings = settings; }
return this;
},
UseData: function (data) {
_data = data || {};
return this;
},
ToElement: function (value, options) {
var result, obj;
options = options || {};
switch (Object.typeOf(value)) {
case 'string':
try {
obj = JSON.parse(value, options.reviver, options.strict);
result = this.ToElement(obj, options);
} catch (e) { result = null; }
break;
case 'object':
result = _objectToElement(value, options.targetElement, _data);
break;
case 'element':
result = value;
break;
default: result = null;
}
return result;
},
ToObject: function (value, options) {
var result;
options = options || {};
switch (Object.typeOf(value)) {
case 'string':
try { result = JSON.parse(value, options.reviver, options.strict); }
catch (e) { result = null; }
break;
case 'object':
result = value;
break;
case 'element':
result = _elementToObject(value);
break;
default: result = null;
}
return result;
},
ToJSON: function (value, options) {
var result, obj;
options = options || {};
if (options.strict !== false) { options.strict = true; }
switch (Object.typeOf(value)) {
case 'string':
try {
obj = this.ToObject(value, options);
result = this.ToJSON(obj, options);
} catch (e) { result = null; }
break;
case 'object':
result = JSON.stringify(value, options.replacer, options.space);
break;
case 'element':
try {
obj = this.ToObject(value, options);
result = this.ToJSON(obj, options);
} catch (e) { result = null; }
break;
default: result = null;
}
return result;
}
};
options = options || {};
Object.set(_Serializer.options, options);
_settings = new _SerializerSettings(_Serializer.options);
_Serializer.toString = function () { return '[object ' + _Serializer.family + ']'; };
return _Serializer;
};
(function () {
var _serializer = null;
function _initialize(options) {
options = options || {};
_serializer = _serializer || new _SerializerInstance();
if (options.settings != null) { _serializer.UseSettings(options.settings); }
if (options.data != null) { _serializer.UseData(options.data); }
return options;
}
Serializer.Settings = _SerializerSettings; 
Serializer.ToElement = function (value, options) {
_initialize(options);
return _serializer.ToElement(value, options);
};
Serializer.ToObject = function (value, options) {
_initialize(options);
return _serializer.ToObject(value, options);
};
Serializer.ToJSON = function (value, options) {
options = _initialize(options);
return _serializer.ToJSON(value, options);
};
})();
})();
Runtime.Declare('Serializer');
var JSON;
if (!JSON) { JSON = {}; }
(function () {
"use strict";
function f(n) {
return n < 10 ? '0' + n : n;
}
if (typeof Date.prototype.toJSON !== 'function') {
Date.prototype.toJSON = function (key) {
return isFinite(this.valueOf()) ?
this.getUTCFullYear() + '-' +
f(this.getUTCMonth() + 1) + '-' +
f(this.getUTCDate()) + 'T' +
f(this.getUTCHours()) + ':' +
f(this.getUTCMinutes()) + ':' +
f(this.getUTCSeconds()) + 'Z' : null;
};
String.prototype.toJSON =
Number.prototype.toJSON =
Boolean.prototype.toJSON = function (key) {
return this.valueOf();
};
}
var cx = new RegExp('[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g'),
escapable = new RegExp('[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]', 'g'),
gap,
indent,
meta = { 
'\b': '\\b',
'\t': '\\t',
'\n': '\\n',
'\f': '\\f',
'\r': '\\r',
'"': '\\"',
'\\': '\\\\'
},
rep;
function quote(string) {
escapable.lastIndex = 0;
return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
var c = meta[a];
return typeof c === 'string' ? c :
'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
}) + '"' : '"' + string + '"';
}
function str(key, holder) {
var i, 
k, 
v, 
length,
mind = gap,
partial,
value = holder[key];
if (value && typeof value === 'object' &&
typeof value.toJSON === 'function') {
value = value.toJSON(key);
}
if (typeof rep === 'function') {
value = rep.call(holder, key, value);
}
switch (typeof value) {
case 'string':
return quote(value);
case 'number':
return isFinite(value) ? String(value) : 'null';
case 'boolean':
case 'null':
return String(value);
case 'object':
if (!value) {
return 'null';
}
gap += indent;
partial = [];
if (Object.prototype.toString.apply(value) === '[object Array]') {
length = value.length;
for (i = 0; i < length; i += 1) {
partial[i] = str(i, value) || 'null';
}
v = partial.length === 0 ? '[]' : gap ?
'[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' :
'[' + partial.join(',') + ']';
gap = mind;
return v;
}
if (rep && typeof rep === 'object') {
length = rep.length;
for (i = 0; i < length; i += 1) {
if (typeof rep[i] === 'string') {
k = rep[i];
v = str(k, value);
if (v) {
partial.push(quote(k) + (gap ? ': ' : ':') + v);
}
}
}
} else {
for (k in value) {
if (Object.prototype.hasOwnProperty.call(value, k)) {
v = str(k, value);
if (v) {
partial.push(quote(k) + (gap ? ': ' : ':') + v);
}
}
}
}
v = partial.length === 0 ? '{}' : gap ?
'{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' :
'{' + partial.join(',') + '}';
gap = mind;
return v;
}
}
if (typeof JSON.stringify !== 'function') {
JSON.stringify = function (value, replacer, space) {
var i;
gap = '';
indent = '';
if (typeof space === 'number') {
for (i = 0; i < space; i += 1) {
indent += ' ';
}
} else if (typeof space === 'string') {
indent = space;
}
rep = replacer;
if (replacer && typeof replacer !== 'function' &&
(typeof replacer !== 'object' ||
typeof replacer.length !== 'number')) {
throw new Error('JSON.stringify');
}
return str('', { '': value });
};
}
if (typeof JSON.parse !== 'function') {
JSON.parse = function (text, reviver) {
var j;
function walk(holder, key) {
var k, v, value = holder[key];
if (value && typeof value === 'object') {
for (k in value) {
if (Object.prototype.hasOwnProperty.call(value, k)) {
v = walk(value, k);
if (v !== undefined) {
value[k] = v;
} else {
delete value[k];
}
}
}
}
return reviver.call(holder, key, value);
}
text = String(text);
cx.lastIndex = 0;
if (cx.test(text)) {
text = text.replace(cx, function (a) {
return '\\u' +
('0000' + a.charCodeAt(0).toString(16)).slice(-4);
});
}
if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {
j = eval('(' + text + ')');
return typeof reviver === 'function' ?
walk({ '': j }, '') : j;
}
throw new SyntaxError('JSON.parse');
};
}
} ());

var FileLoader = {
LoadJS: function (fileUrl, options) {
var scriptElement, documentObject;
var loadHandler, errorHandler;
var eventCheckTimeout = 5000; 
var eventCheckInterval = 100; 
var loadedSuccessCount, loadedErrorCount;
var eventHandled = false;
var syncReadyState = { prop: false, event: false };
var usePolling, useAlternativePolling;
var loadEvent, errorEvent;
var timeStartPolling, pollingTimer, alternativePollingTimer;
loadHandler = errorHandler = function () { };
loadedSuccessCount = loadedErrorCount = 0;
usePolling = useAlternativePolling = false;
options = options || {};
documentObject = options.document || document;
loadEvent = options.onload;
errorEvent = options.onerror;
if (loadEvent) {
loadHandler = function () {
eventHandled = true;
if (++loadedSuccessCount == 1) { loadEvent(scriptElement); }
}
}
if (errorEvent) {
errorHandler = function () {
if (eventHandled) { return; }
eventHandled = true;
if (++loadedErrorCount == 1) { errorEvent(scriptElement); }
}
}
delete options.onload;
delete options.onerror;
delete options.document;
scriptElement = Document.CreateElement('script', {
targetElement: documentObject.getElementsByTagName('head')[0],
src: fileUrl,
id: 'JSLoaded' + (new Date().getMilliseconds()) + (Math.ceil(Math.random(1, 9) * 1000)),
type: 'text/javascript'
});
useAlternativePolling = scriptElement.readyState != null && (scriptElement.readyState.toLowerCase() == 'interactive' || scriptElement.readyState.toLowerCase() == 'loading'); 
usePolling = !useAlternativePolling && scriptElement.all != null && (scriptElement.filters == null && Date.now == null || Date.now == null); 
/*@cc_on
        @if(@_jscript_version < 7)
        usePolling = true;
        @end
        @if(@_jscript_version < 6)
        usePolling = false;
        useAlternativePolling = true;
        @end
        @*/
if (usePolling) {
timeStartPolling = new Date().getTime();
pollingTimer = setInterval(function () {
if (new Date().getTime() - timeStartPolling >= eventCheckTimeout) {
clearInterval(pollingTimer); 
errorHandler();
return;
}
if (scriptElement.text != '') {
clearInterval(pollingTimer); 
loadHandler();
}
}, eventCheckInterval);
} else {
if (useAlternativePolling) {
scriptElement.onload = function () {
syncReadyState.event = true;
if (!syncReadyState.prop) {
clearInterval(alternativePollingTimer); 
loadHandler();
}
};
scriptElement.onerror = function () {
clearInterval(alternativePollingTimer); 
errorHandler();
};
alternativePollingTimer = setInterval(function () {
if (Array.contains(['loaded', 'complete'], scriptElement.readyState.toLowerCase()) || syncReadyState.prop) {
if (syncReadyState.prop) {
clearInterval(alternativePollingTimer);
if (!syncReadyState.event) { loadHandler(); } 
}
syncReadyState.prop = true; 
}
}, eventCheckInterval);
} else {
scriptElement.onload = loadHandler;
scriptElement.onerror = errorHandler;
scriptElement.onreadystatechange = function () {
if (this.readyState == 'complete') { loadHandler(); }
};
}
}
return scriptElement;
},
LoadCSS: function (fileUrl, options) {
function _checkRulesList() {
rulesList = styleSheet.cssRules || styleSheet.rules || null;
if (rulesList && rulesList.length > 0) {
loadHandler();
return 'loaded';
}
if (rulesList && rulesList.length == 0) {
errorHandler();
return 'error';
}
loadHandler();
return 'security';
}
var loadHandler, errorHandler, loadEvent, errorEvent;
var loadedSuccessCount, loadedErrorCount;
var styleElement, targetElement, styleSheet, oldStyleSheetLength, styleSheetIndex, rulesList, styleSheetOwner, styleSheetCounter;
var mode, responseState, helperElement, processHelperResponse;
loadHandler = errorHandler = function () { };
loadedSuccessCount = loadedErrorCount = 0;
options = options || {};
loadEvent = options.onload;
errorEvent = options.onerror;
if (loadEvent) {
loadHandler = function () {
if (++loadedSuccessCount == 1) { loadEvent(styleElement); }
}
}
if (errorEvent) {
errorHandler = function () {
if (++loadedErrorCount == 1) { errorEvent(styleElement); }
}
}
delete options.onload;
delete options.onerror;
if (document.styleSheets == null) { errorHandler(); return null; } 
oldStyleSheetLength = styleSheetIndex = document.styleSheets.length; 
styleElement = Document.CreateElement('link', {
type: 'text/css',
rel: 'stylesheet',
id: 'JSLoaded' + (new Date().getMilliseconds()) + (Math.ceil(Math.random(1, 9) * 1000)),
media: 'screen',
href: fileUrl
});
if (Runtime.IsDeclared('Effect')) {
styleSheet = Effect.GetStyleSheet();
targetElement = styleSheet.ownerNode || styleSheet.owningElement;
Array.from(document.styleSheets).forEach(function (item, ix) {
if (item.title == styleSheet.title) { styleSheetIndex = ix; }
});
}
if (targetElement) { Document.AddElementToDOM(styleElement, targetElement, 'before'); }
else { Document.AddElementToDOM(styleElement, document.getElementsByTagName('head')[0]); }
styleSheet = document.styleSheets[styleSheetIndex];
if (Utils.CheckBrowser('ie') || Utils.CheckBrowser('opera')) { mode = 'onload'; } 
else if (oldStyleSheetLength == document.styleSheets.length) { mode = 'sheet'; } 
switch (mode) {
case 'sheet':
function _sheetCallBack() {
if (styleElement.sheet) {
styleSheet = styleElement.sheet;
_checkRulesList();
return styleElement;
}
setTimeout(_sheetCallBack, 100);
}
setTimeout(_sheetCallBack, 1);
break;
case 'onload':
styleElement.onload = function () {
try {
_checkRulesList();
return styleElement;
}
catch (e) {
if (Utils.CheckBrowser('opera')) {
processHelperResponse = 'clear';
loadHandler();
return styleElement;
}
errorHandler();
return styleElement;
}
};
if (Utils.CheckBrowser('opera')) { 
function _helperResponseCallback() {
if (processHelperResponse == 'clear') {
return styleElement;
}
if (processHelperResponse == 'done') {
errorHandler();
return styleElement;
}
setTimeout(_helperResponseCallback, 100);
}
helperElement = Document.CreateElement('img', { src: fileUrl, targetElement: Document.body });
helperElement.onerror = function () {
if (processHelperResponse != 'clear') {
processHelperResponse = 'done';
_helperResponseCallback();
}
Document.RemoveElement(helperElement);
};
}
break;
default:
function _statusCallBack() {
try {
_checkRulesList();
return styleElement;
} catch (e) {
switch (e.code) {
case 15:
setTimeout(_statusCallBack, 100);
break;
case 1000:
loadHandler();
break;
}
}
}
setTimeout(_statusCallBack, 1);
}
return styleElement;
},
LoadImage: function (fileUrl, options) {
var loadHandler, errorHandler, loadEvent, errorEvent;
var loadedSuccessCount, loadedErrorCount;
var imageElement = new Image();
loadHandler = errorHandler = function () { };
loadedSuccessCount = loadedErrorCount = 0;
options = options || {};
loadEvent = options.onload;
errorEvent = options.onerror;
if (loadEvent) {
loadHandler = function () {
if (++loadedSuccessCount == 1) { loadEvent(imageElement); }
}
}
if (errorEvent) {
errorHandler = function () {
if (++loadedErrorCount == 1) { errorEvent(imageElement); }
}
}
delete options.onload;
delete options.onerror;
imageElement.onload = loadHandler;
imageElement.onerror = errorHandler;
imageElement.src = fileUrl;
return imageElement;
},
LoadQueue: function () {
var _emptyFunction = function () { };
var _defaultOptions = {
synchronous: false,
onprogress: _emptyFunction, 
onerror: _emptyFunction, 
onsuccess: _emptyFunction, 
onfailure: _emptyFunction, 
properties: {}
};
return function (fileUrlList, options) {
function _completed() {
if (fileCounter == fileUrlList.length) {
if (completeStatus) { options.onsuccess(); }
else { options.onfailure(failureList); }
}
}
var result;
var fileCounter = 0;
var completeStatus = true;
var failureList = [];
fileUrlList = Array.from(fileUrlList);
Object.append(options, _defaultOptions);
if (options.synchronous) {
} else {
result = fileUrlList.map(function (fileUrl, index) {
var loadFileHandler = null;
if ((/\.js(\?|$)/i).test(fileUrl)) { loadFileHandler = this.LoadJS; } 
if ((/\.css(\?|$)/i).test(fileUrl)) { loadFileHandler = this.LoadCSS; } 
if ((/\.(gif|jpg|jpeg|png)(\?|$)/i).test(fileUrl)) { loadFileHandler = this.LoadImage; } 
if (loadFileHandler != null) {
Object.append(options.properties, {
onload: function (resultElement) {
fileCounter++;
options.onprogress.call(this, resultElement, fileCounter, index, fileUrl);
_completed();
},
onerror: function (resultElement) {
fileCounter++; completeStatus = false; failureList.push(fileUrl);
options.onerror.call(this, resultElement, fileCounter, index, fileUrl);
_completed();
}
});
return loadFileHandler.call(this, fileUrl, options.properties);
}
return null;
}, this);
}
return result;
};
} ()
};
Runtime.Declare('FileLoader');

var Format = {};
(function () {
var _formats = {};
function _checkPriceFormat(format){
var result = true;
format.split(';').forEach(function (formatString){
result = result && /[^#]*#*[^#]*#*0+0*[^0]*$/.test(formatString);
});
return result;
}
Format.ToPrice = function (price, format) {
var result = '';
var priceString, formatData, formatExpander;
var indexStartPrice, indexStartFormat, indexPrice, indexFormat;
var priceChar, formatChar;
if (typeof format != 'string' || !_checkPriceFormat(format) || isNaN(price)) { return ''; }
price = Number(price);
if (_formats[format] != null) {
formatData = _formats[format];
}
else {
formatData = {};
_formats[format] = formatData;
if (format.indexOf(';') > -1) {
formatData.positive = format.split(';')[0];
formatData.negative = format.split(';')[1];
} else { formatData.positive = formatData.negative = format; }
if (price >= 0) { format = formatData.positive; }
else { format = formatData.negative; }
formatData.format = format.replace(/^[^#]*/, '').replace(/[^0]*$/, '');
formatData.zero = formatData.positive.replace(/^.*#/, '').replace(/[^0]*$/, '');
formatData.delimiter = formatData.zero.replace(/0/g, '');
formatData.prefixPositive = format.replace(/#.+$/, '');
formatData.prefixNegative = formatData.negative.replace(/#.+$/, '');
formatData.suffix = format.replace(/^.+0/, '');
}
if (price >= 0) { formatData.prefix = formatData.prefixPositive; }
else { formatData.prefix = formatData.prefixNegative; }
if (price == 0) { result = formatData.zero; }
else {
if (price < 0) { price = (-1) * price; }
priceString = String.from(price);
if (parseInt(price) != price) { indexStartPrice = String.from(parseInt(price)).length; }
else { indexStartPrice = priceString.length; }
formatExpander = formatData.format.match(/^#+[^#]+/)[0];
while (indexStartPrice > formatData.format.match(/#/g).length) {
formatData.format = formatExpander + formatData.format;
}
if (formatData.delimiter != '' && formatData.format.indexOf(formatData.delimiter) > -1) { indexStartFormat = formatData.format.indexOf(formatData.delimiter); }
else { indexStartFormat = formatData.format.length; }
indexPrice = indexStartPrice;
indexFormat = indexStartFormat;
while ((formatChar = formatData.format.charAt(indexFormat)) != '') {
priceChar = priceString.charAt(indexPrice);
if (priceChar != '' && formatChar != formatData.delimiter) { result += priceChar; }
else { result += formatChar; }
indexPrice++;
indexFormat++;
}
indexPrice = indexStartPrice - 1;
indexFormat = indexStartFormat - 1;
while ((priceChar = priceString.charAt(indexPrice)) != '') {
formatChar = formatData.format.charAt(indexFormat);
switch (formatChar) {
case '0': case '#':
result = priceChar + result;
break;
default:
result = formatChar + result;
indexPrice++;
}
indexPrice--;
indexFormat--;
}
}
result = formatData.prefix + result + formatData.suffix;
return result;
};
})();
String.prototype.formatPrice = function (format) {
return Format.ToPrice(this, format);
};
Number.prototype.formatPrice = function (format) {
return Format.ToPrice(this, format);
};

function cbBind(handlerString, element, event) {
if (!Document.domReady) { return; }
Util.EventBinding.ExecutiveBind(handlerString, element, event);
}
function _GetCBValidRequestTriple(url) {
var method = null;
var location = null;
var paramStr = null;
if (url.contains("?")) {
var up = url.split("?");
method = "post";
location = up[0];
var upp = up[1].split("&");
for (var i = 0; i < upp.length; i++) {
if (upp[i].startsWith("scope=") || upp[i].startsWith("id=")) {
location += location.contains("?") ? "&" + upp[i] : "?" + upp[i];
}
else {
paramStr = paramStr == null ? upp[i] : paramStr + "&" + upp[i];
}
}
}
else {
method = "get";
location = url;
}
return { method: method, location: location, paramStr: paramStr };
}
function _EnableCBValidation(params) {
var fo = params.trigger && params.trigger.element != null ? FormObject.Get(params.trigger.element) : null;
if (fo == null) {
return;
}
var vType = params.validation ? params.validation : "server";
var vButtonName = params.buttonName ? params.buttonName : "buttonupdate";
var form = fo.GetForm();
if (form.action != null && params.trigger.element != null) {
var of = NodeObject.Get(form);
of.crel = "&crel=" + params.trigger.element.name;
if (!of.addedSubmitListener) {
of.addedSubmitListener = true;
of.AddListener(new Listener("submit", function () {
of.element.action = of.element.action + of.crel;
}
));
}
}
if (vType == "server" && !params.buttonName) {
var foundSubmittingFormObject = false;
var foundSubmittingFormObjectCount = 0;
for (var i = 0; i < form.elements.length; i++) {
var thisFormElement = form.elements[i];
if (thisFormElement.type && thisFormElement.type.toLowerCase() == "submit") {
vButtonName = thisFormElement.name;
if (foundSubmittingFormObject) {
foundSubmittingFormObjectCount++;
}
} else {
if (foundSubmittingFormObjectCount > 0) {
break;
}
}
if (thisFormElement == fo.element) {
foundSubmittingFormObject = true;
}
}
if (foundSubmittingFormObjectCount > 1) {
params.trigger.PreventDefault();
return false;
}
}
form.onsubmit = function() {
var eventSubmit = Document.GetElement("cbJsSubmitButton");
if (eventSubmit == null) {
var es = document.createElement("input");
es.type = "hidden";
es.id = "cbJsSubmitButton";
es.name = vButtonName;
form.appendChild(es);
es.value = "javascript:" + params.trigger.element.name;
}
else {
eventSubmit.name = vButtonName;
eventSubmit.value = "javascript:" + params.trigger.element.name;
}
};
return true;
}
function _CheckCBConditionalValue(params) {
var target = params.targetId ? Document.GetElement(params.targetId) : null;
var listener = params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
if (target == null && listener == null) { return true; }
var doCheck = function (node, strWhiteList, strBlackList, boolCheckedState, strCurrentWhiteList, strCurrentBlackList, strCurrentSelectedValue) {
if (strWhiteList == null && strBlackList == null && boolCheckedState == null && strCurrentWhiteList == null && strCurrentWhiteList == null) {
return true;
}
var fo = FormObject.Get(node);
if (fo != null) {
if (fo.IsTypeOf("select")) { 
var wl = function () { 
if (strWhiteList == null) { return true; }
else if (strWhiteList != null && node.options[node.selectedIndex].value != ""
&& (strWhiteList.contains("," + node.options[node.selectedIndex].value) || strWhiteList.contains("," + node.options[node.selectedIndex].value))) {
return true;
}
return false;
}
var bl = function () { 
if (strBlackList == null) { return true; }
else if (strBlackList != null && node.options[node.selectedIndex].value != ""
&& (!strBlackList.contains("," + node.options[node.selectedIndex].value) && !strBlackList.contains("," + node.options[node.selectedIndex].value))) {
return true;
}
return false;
}
var cwl = function () { 
if (strCurrentWhiteList == null) { return true; }
else if (strCurrentSelectedValue != null && strCurrentWhiteList.contains("," + strCurrentSelectedValue)) {
return true;
}
return false;
}
var cbl = function () {
if (strCurrentBlackList == null) { return true; }
else if (strCurrentSelectedValue != null && strCurrentBlackList.contains("," + strCurrentSelectedValue)) {
return true;
}
return false;
}
return (wl() && bl() && cwl() && cbl());
}
else { 
if (strWhiteList != null && node.value && node.value != "" && strWhiteList.contains("," + node.value)) {
return true;
}
else if (strBlackList != null && node.value && node.value != "" && (!strBlackList.contains("," + node.value))) {
return true;
}
else if (boolCheckedState != null && node.checked == boolCheckedState) {
return true;
}
return false;
}
return false;
}
else {
return false; 
}
}
var strListenerWhiteList = params.listenerValueWhiteList ? "," + params.listenerValueWhiteList.toString() : null;
var strListenerBlackList = params.listenerValueBlackList ? "," + params.listenerValueBlackList.toString() : null;
var strListenerCurrentWhiteList = params.listenerCurrentValueWhiteList ? "," + params.listenerCurrentValueWhiteList.toString() : null;
var strListenerCurrentBlackList = params.listenerCurrentValueBlackList ? "," + params.listenerCurrentValueBlackList.toString() : null;
var boolListenerCheckedState = params.listenerCheckedState == true || params.listenerCheckedState == false ? params.listenerCheckedState : null;
var strListenerCurrentSelectedValue = params.listenerCurrentSelectedValue ? params.listenerCurrentSelectedValue : null;
var boolMayListener = listener != null ?
doCheck(listener, strListenerWhiteList, strListenerBlackList, boolListenerCheckedState, strListenerCurrentWhiteList, strListenerCurrentBlackList, strListenerCurrentSelectedValue)
: true;
var strTargetWhiteList = params.targetValueWhiteList ? "," + params.targetValueWhiteList.toString() : null;
var strTargetBlackList = params.targetValueBlackList ? "," + params.targetValueBlackList.toString() : null;
var strTargetCurrentWhiteList = params.targetCurrentValueWhiteList ? "," + params.targetCurrentValueWhiteList.toString() : null;
var strTargetCurrentBlackList = params.targetCurrentValueBlackList ? "," + params.targetCurrentValueBlackList.toString() : null;
var boolTargetCheckedState = params.targetCheckedState == true || params.targetCheckedState == false ? params.targetCheckedState : null;
var strTargetCurrentSelectedValue = params.targetCurrentSelectedValue ? params.targetCurrentSelectedValue : null;
var boolMayTarget = target != null ?
doCheck(target, strTargetWhiteList, strTargetBlackList, boolTargetCheckedState, strTargetCurrentBlackList, strTargetCurrentWhiteList, strTargetCurrentSelectedValue)
: true;
return (boolMayListener && boolMayTarget);
}
function _CanApplyCBLayerContents(params) {
var lo = params.layer ? params.layer : params.layerId ? Layer.Get(params.layerId) : null;
if (lo == null) { return false; }
if (lo.closeLabel) {
Document.ClearElement(lo.closeLabel);
if (params.layerCloseString) { Document.SetElementAttribute(lo.closeLabel, 'text', params.layerCloseString); }
else if (params.layerCloseNodeId) {
var acl = cbGetAjaxLayerContent(params.layerCloseNodeId);
if (acl != null) { lo.closeLabel.innerHTML = acl; }
else {
var ccl = Document.GetElement(params.layerCloseNodeId);
if (ccl != null) { Document.MoveElement(ccl, lo.closeLabel); }
else { return false; }
}
}
}
Document.ClearElement(lo.headNode);
if (params.layerHeadString) { Document.SetElementAttribute(lo.headNode, 'text', params.layerHeadString); }
else if (params.layerHeadNodeId) {
var ah = cbGetAjaxLayerContent(params.layerHeadNodeId);
if (ah != null) { lo.headNode.innerHTML = ah; }
else {
var ch = Document.GetElement(params.layerHeadNodeId);
if (ch != null) { Document.MoveElement(ch, lo.headNode); }
else { return false; }
}
}
Document.ClearElement(lo.contentNode, true);
if (params.layerContentString) { Document.SetElementAttribute(lo.contentNode, 'text', params.layerContentString); }
else if (params.layerContentNodeId) {
var ac = cbGetAjaxLayerContent(params.layerContentNodeId);
if (ac != null) { lo.contentNode.innerHTML = ac; }
else {
var cn = Document.GetElement(params.layerContentNodeId);
if (cn != null) { Document.MoveElement(cn, lo.contentNode, null, null, true); }
else { return false; }
}
}
if (lo.submitLabel) {
Document.ClearElement(lo.submitLabel);
if (params.submitUrl && lo.submitElement) {
if (params.layerSubmitString) { Document.SetElementAttribute(lo.submitLabel, 'text', params.layerSubmitString); }
else if (params.layerSubmitNodeId) {
var as = cbGetAjaxLayerContent(params.layerSubmitNodeId);
if (as != null) { lo.submitLabel.innerHTML = as; }
else {
var cas = Document.GetElement(params.layerSubmitNodeId);
if (cas != null) { Document.MoveElement(cas, lo.submitLabel, null, null, true); }
else { return false; }
}
}
Document.SetElementAttribute(lo.submitElement, 'href', params.submitUrl);
}
}
Document.ClearElement(lo.footNode);
if (params.layerFootString) { Document.SetElementAttribute(lo.footNode, 'text', params.layerFootString); }
else if (params.layerFootNodeId) {
var af = cbGetAjaxLayerContent(params.layerFootNodeId);
if (af != null) { lo.footNode.innerHTML = af; }
else {
var cf = Document.GetElement(params.layerFootNodeId);
if (cf != null) { Document.MoveElement(cf, lo.footNode); }
else { return false; }
}
}
return true;
}
function _GetCBLayerPositionTuple(params) {
var lo = params.layer ? params.layer : params.layerId ? Layer.Get(params.layerId) : null;
if (lo == null) { return { x: 0, y: 0 }; }
var trigger = params.trigger && params.trigger.element ? params.trigger : null;
var posKey = (params.layerPosition == "screen"
|| params.layerPosition == "mouseRight"
|| params.layerPosition == "mouseLeft")
? params.layerPosition : "mouse"; 
var x = trigger != null ? trigger.GetX() : 0;
var y = trigger != null ? trigger.GetY() : 0;
var lh = NodeObject.Get(lo.element).GetHeight();
var lw = NodeObject.Get(lo.element).GetWidth();
var ch = Document.GetHeight();
var cw = Document.GetWidth();
var st = Document.GetBodyScrollTop();
var sl = Document.GetBodyScrollLeft();
var getMouseLeftX = function () { return (x + 10); }
var getMouseRightX = function () { return (x - 10 - lw); }
var getMouseY = function () {
var down = y + 10; var up = y - lh - 10;
return down + lh > ch ? up < st ? down : up : down; 
}
if (posKey == "screen") {
x = cw < lw ? 0 + sl : parseInt((cw - lw) / 2) + sl;
y = ch < lh ? 50 + st : parseInt((ch - lh) / 2) + st;
}
else if (posKey == "mouse") {
var nx = getMouseLeftX();
if ((nx + lw) < cw) { x = nx; }
else {
nx = getMouseRightX();
if (nx > 0) { x = nx; }
else {
if (x < parseInt(cw / 2)) { var deltaX = x + lw + 20 - cw; x = x - deltaX; }
else { x = 10; }
}
}
y = getMouseY();
}
else if (posKey == "mouseLeft") { x = getMouseLeftX(); y = getMouseY(); }
else if (posKey == "mouseRight") { x = getMouseRightX(); y = getMouseY(); }
else if (posKey == "mouseCenter") { x = x - parseInt(lw / 2); y = y; }
return { x: x, y: y };
}
function cbProvideAjaxLayerContent(url) {
var request, gp, pp;
if (url != null) {
gp = url.substring(0, url.indexOf('&'));
pp = url.substring(url.indexOf('&'));
request = new AjaxRequest({
data: pp,
onload: function () {
Runtime.Put('AjaxLayerContentResponse', this);
}
});
if (request != null) { request.Post(gp); }
}
}
function cbGetAjaxLayerContent(key) {
var request = Runtime.Get('AjaxLayerContentResponse');
if (request != null) { return request.GetXMLNode(key); }
return null;
}
function cbRuntimePut(params) {
if (params.key && params.value && _CheckCBConditionalValue(params)) {
Runtime.Put(params.key, params.value);
}
}
function cbRuntimeGet(params) {
if (params.key) { return Runtime.Get(key); }
return null;
}
function cbCheckKeySubmit(params) {
var trigger = params.trigger && params.trigger.element != null ? params.trigger : null;
if (trigger != null && trigger.keyCode && trigger.keyCode == 13) {
_EnableCBValidation({ trigger: params.trigger, validation: "server" });
}
}
function cbWriteString(params) {
var node = params.targetId ? Document.GetElement(params.targetId) : null;
var mayExecute = _CheckCBConditionalValue(params);
if (node != null && params.stringValue && mayExecute) {
Document.SetElementAttribute(node, 'text', params.stringValue);
}
}
function cbFire(params) {
var noTarget = NodeObject.Get(params.targetId);
if (noTarget && params.targetEventList && _CheckCBConditionalValue(params)) {
for (var i = 0; i < params.targetEventList.length; i++) {
noTarget.DispatchEvent(params.targetEventList[i]);
}
}
}
function cbSelectFormElement(params) {
var fo = params.targetId ? FormObject.Get(params.targetId) : null;
if (fo && _CheckCBConditionalValue(params)) {
if (typeof params.targetSelectIndex == 'number') { 
fo.Select(params.targetSelectIndex);
} else if (params.targetSelectValue) {
fo.Select(params.targetSelectValue);
}
}
}
function cbDisableFormElement(params) {
var fo = params.formObject ? params.formObject : params.targetId ? FormObject.Get(params.targetId) : params.trigger && params.trigger.element != null ? FormObject.Get(params.trigger.element) : null;
if (fo) { fo.element.disabled = true; }
}
function cbEnableFormElement(params) {
var fo = params.formObject ? params.formObject : params.targetId ? FormObject.Get(params.targetId) : params.trigger && params.trigger.element != null ? FormObject.Get(params.trigger.element) : null;
if (fo != null) {
fo.element.disabled = false;
}
}
function cbDisableChildFormElements(params) {
var node = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
var mayExecute = _CheckCBConditionalValue(params);
if (node != null && mayExecute) {
var fo = FormObject.Get(node);
if (fo != null) { 
cbDisableFormElement({ formObject: fo });
}
else {
var nfo = FormObject.GetNearest(node);
if (nfo != null) { 
var f = nfo.GetForm();
for (var i = 0; i < f.elements.length; i++) {
var thisFO = NodeObject.Get(f.elements[i]);
if (thisFO != null && thisFO.IsChildOf(node)) {
cbDisableFormElement({ formObject: thisFO });
}
}
}
}
}
}
function cbEnableChildFormElements(params) {
var node = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
var mayExecute = _CheckCBConditionalValue(params);
if (node != null && mayExecute) {
var fo = FormObject.Get(node);
if (fo != null) { 
cbEnableFormElement({ formObject: fo });
}
else {
var nfo = FormObject.GetNearest(node);
if (nfo != null) { 
var f = nfo.GetForm();
for (var i = 0; i < f.elements.length; i++) {
var thisFO = NodeObject.Get(f.elements[i]);
if (thisFO != null && thisFO.IsChildOf(node)) {
cbEnableFormElement({ formObject: thisFO });
}
}
}
}
}
}
function cbAddClass(params) {
var mayExecute = _CheckCBConditionalValue(params);
var node = params.targetId ? Document.GetElement(params.targetId) : null;
if (node != null && mayExecute && params.className) {
node.className = node.className.replace(" " + params.className, "").replace(params.className + " ", "").replace(params.className, "") + " " + params.className;
}
}
function cbRemoveClass(params) {
var mayExecute = _CheckCBConditionalValue(params);
var node = params.targetId ? Document.GetElement(params.targetId) : null;
if (node != null && mayExecute && params.className) {
node.className = node.className.replace(" " + params.className, "").replace(params.className + " ", "").replace(params.className, "");
}
}
function cbToggleClass(params) {
var target = Document.GetElement(params.targetId);
if (target && params.className) { Document.ToggleElementClass(target, params.className); }
}
function cbToggleDisplay(params) {
var target = Document.GetElement(params.targetId);
if (target) { Document.ToggleElementClass(target, 'CBJSFold'); }
}
function cbShow(params) {
var mayExecute = _CheckCBConditionalValue(params);
var target = Document.GetElement(params.node) || Document.GetElement(params.targetId);
if (target && mayExecute) { Effect.Get(target).Show(); }
}
function cbDisplay(params) {
var mayExecute = _CheckCBConditionalValue(params);
var target = Document.GetElement(params.node) || Document.GetElement(params.targetId);
if (target && mayExecute) { Effect.Get(target).Display(); }
}
function cbHide(params) {
var mayExecute = _CheckCBConditionalValue(params);
var target = Document.GetElement(params.node) || Document.GetElement(params.targetId);
if (target && mayExecute) { Effect.Get(target).Hide(); }
}
function cbFold(params) {
var mayExecute = _CheckCBConditionalValue(params);
var target = Document.GetElement(params.node) || Document.GetElement(params.targetId);
if (target && mayExecute) { Effect.Get(target).Fold(); }
}
function cbActivate(params) {
var n = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
var myMainClass = n.className.indexOf(" ") > -1 ? n.className.substring(0, n.className.indexOf(" ")) : n.className;
var doIt = function (x) {
x.className = x.className.replace(" CBActive", "").replace("CBActive ", "").replace("CBActive", "") + " CBActive";
}
doIt(n);
var p = function (x) {
if (x.parentNode != null && (x.parentNode.className.startsWith(myMainClass + " ") || x.parentNode.className == myMainClass)) {
doIt(x.parentNode);
p(x.parentNode);
}
}
p(n);
var c = function (x) {
for (var i = 0; i < x.childNodes.length; i++) {
if (x.childNodes[i].className && (x.childNodes[i].className.startsWith(myMainClass + " ") || x.childNodes[i].className == myMainClass)) {
doIt(x.childNodes[i]);
c(x.childNodes[i]);
}
}
}
c(n);
}
function cbDeactivate(params) {
var n = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
var myMainClass = n.className.indexOf(" ") > -1 ? n.className.substring(0, n.className.indexOf(" ")) : n.className;
var doIt = function (x) {
x.className = x.className.replace(" CBActive", "").replace("CBActive ", "").replace("CBActive", "");
}
doIt(n);
var p = function (x) {
if (x.parentNode != null && (x.parentNode.className.startsWith(myMainClass + " ") || x.parentNode.className == myMainClass) && x.parentNode.className.contains("CBActive")) {
doIt(x.parentNode);
p(x.parentNode);
}
}
p(n);
var c = function (x) {
for (var i = 0; i < x.childNodes.length; i++) {
if (x.childNodes[i].className && (x.childNodes[i].className.startsWith(myMainClass + " ") || x.childNodes[i].className == myMainClass) && x.childNodes[i].className.contains("CBActive")) {
doIt(x.childNodes[i]);
c(x.childNodes[i]);
}
}
}
c(n);
}
function cbSequenceDeactivate(params) { 
if (params.targetId) {
var cs = 1; 
var ce = 0; 
while (ce < 10) { 
if (Document.GetElement(params.targetId + cs) != null) {
cbDeactivate({ targetId: params.targetId + cs });
cs++;
ce = 0;
}
else {
cs++;
ce++;
}
}
}
}
function cbFocus(params) {
var node = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
if (node != null) {
node.className = node.className.replace(" CBJSFocus", "").replace("CBJSFocus ", "").replace("CBJSFocus", "") + " CBJSFocus";
var ti = function (n, c) {
if (n.parentNode && n.parentNode.className.contains("interact ")) {
return n.parentNode;
}
else if (c < 5) {
return ti(n.parentNode, c + 1);
}
else {
return null;
}
}
var pi = ti(node, 0);
if (pi != null) {
pi.className = pi.className.replace(" CBJSFocus", "").replace("CBJSFocus ", "").replace("CBJSFocus", "") + " CBJSFocus";
}
}
}
function cbBlur(params) {
var node = params.targetId ? Document.GetElement(params.targetId) : params.trigger && params.trigger.element != null ? Document.GetElement(params.trigger.element) : null;
if (node != null) {
node.className = node.className.replace(" CBJSFocus", "").replace("CBJSFocus ", "").replace("CBJSFocus", "");
var ti = function (n, c) {
if (n.parentNode && n.parentNode.className.contains("interact ")) {
return n.parentNode;
}
else if (c < 5) {
return ti(n.parentNode, c + 1);
}
else {
return null;
}
}
var pi = ti(node, 0);
if (pi != null) {
pi.className = pi.className.replace(" CBJSFocus", "").replace("CBJSFocus ", "").replace("CBJSFocus", "");
}
}
}
function cbPopLayer(params) {
var layer, layerEffect, noTrigger, layerPosition;
if (params.layerId && params.trigger && params.trigger.element != null) {
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
noTrigger = NodeObject.Get(params.trigger.element);
layer = Layer.Get(params.layerId);
if (contentDirection) { layer.SetContentDirection(contentDirection); }
layerEffect = Effect.Get(layer.element);
layerEffect.Hide().Display();
noTrigger.addedPopOutListener = noTrigger.addedPopOutListener || {};
if (noTrigger.addedPopOutListener[params.layerId] == null) {
noTrigger.AddListener(new Listener("mouseout", function () {
layerEffect.Fold();
}));
noTrigger.addedPopOutListener[params.layerId] = true;
}
if (_CanApplyCBLayerContents(params)) {
layerPosition = _GetCBLayerPositionTuple(params);
layerEffect.MoveTo(layerPosition.x, layerPosition.y);
layerEffect.Show();
}
}
}
function cbPopLayerAjax(params) {
var layer, layerEffect, noTrigger, layerPosition, contentDirection, request;
if (params.layerId && params.trigger && params.trigger.element != null) {
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
noTrigger = NodeObject.Get(params.trigger.element);
layer = Layer.Get(params.layerId);
if (contentDirection) { layer.SetContentDirection(contentDirection); }
layerEffect = Effect.Get(layer.element);
layerEffect.Hide().Display();
noTrigger.addedPopOutListener = noTrigger.addedPopOutListener || {};
if (noTrigger.addedPopOutListener[params.layerId] == null) {
noTrigger.AddListener(new Listener("mouseout", function() {
layerEffect.Fold();
}));
noTrigger.addedPopOutListener[params.layerId] = true;
}
request = new AjaxRequest({
onload: function() {
if (_CanApplyCBLayerContents(params)) {
Document.CloneElementContent(this.GetXMLNode('ajaxXmlObject'), layer.contentNode);
layerPosition = _GetCBLayerPositionTuple(params);
layerEffect.MoveTo(layerPosition.x, layerPosition.y);
layerEffect.Show();
}
}
});
layerEffect.Hide().Display();
var axajUrl = params.url + '&ri=' + Runtime.GetUniqueId();
request.Get(axajUrl);
}
}
function cbOpenLayer(params) {
var layer, layerEffect, layerPosition, contentDirection;
if (params.layerId && params.trigger && params.trigger.element != null) {
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
layer = Layer.Get(params.layerId);
if (contentDirection) { layer.SetContentDirection(contentDirection); }
layerEffect = Effect.Get(layer.element);
layerEffect.Hide().Display();
layer.EnablePersistentClose();
Layer.DisableContent();
if (_CanApplyCBLayerContents(params)) {
layerPosition = _GetCBLayerPositionTuple(params);
layerEffect.MoveTo(layerPosition.x, layerPosition.y);
layerEffect.Show();
}
}
}
function cbOpenLayerAjax(params) {
var layer, layerEffect, layerPosition, contentDirection, request, requestTriple;
if (params.layerId && params.trigger && params.trigger.element != null) {
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
layer = Layer.Get(params.layerId);
layer.EnableClose();
if (contentDirection) { layer.SetContentDirection(contentDirection); }
Layer.DisableContent();
layerEffect = Effect.Get(layer.element);
request = new AjaxRequest({
onload: function () {
if (_CanApplyCBLayerContents(params)) {
Document.CloneElementContent(this.GetXMLNode('ajaxXmlObject'), layer.contentNode);
layerPosition = _GetCBLayerPositionTuple(params);
layerEffect.MoveTo(layerPosition.x, layerPosition.y);
layerEffect.Show();
}
}
});
layerEffect.Hide().Display();
if (request != null) { request.Get(params.url); }
}
}
function cbOpenLayerIFrame(params) {
var layer, layerEffect, layerPosition, contentDirection;
if (params.layerId && params.trigger && params.trigger.element != null) {
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
layer = Layer.Get(params.layerId);
if (params.layerClass) { Document.AddElementClass(layer.element, params.layerClass); }
layer.EnableClose();
if (params.submitUrl && (params.layerSubmitString || params.layerSubmitNodeId)) { layer.EnableSubmit(); } 
if (contentDirection) { layer.SetContentDirection(contentDirection); }
layerEffect = Effect.Get(layer.element);
layerEffect.Hide().Display();
if (_CanApplyCBLayerContents(params)) {
if (layer.submitNode) { Document.MoveElement(layer.submitNode, layer.contentNode, 'bottom'); }
Document.CreateElement('iframe', {
targetElement: layer.submitNode || layer.contentNode,
position: layer.submitNode ? 'before' : 'bottom',
src: params.url,
frameborder: 0,
style: params.autoSize ? 'width:100%;height:100%' : ''
});
layerPosition = _GetCBLayerPositionTuple(params);
layerEffect.MoveTo(layerPosition.x, layerPosition.y);
layerEffect.Show();
}
params.trigger.PreventDefault();
Layer.DisableContent();
}
}
function cbLoadAjax(params) {
var targetElement = params.targetId ? Document.GetElement(params.targetId) : null;
var request, eTargetElement, lLoad, eLoad;
if (targetElement != null && params.url) {
lLoad = Layer.Get("cbLayerLoading");
eLoad = Effect.Get(lLoad.element);
eTargetElement = Effect.Get(targetElement);
var lp = _GetCBLayerPositionTuple({ layer: lLoad, layerPosition: "screen" });
eLoad.MoveTo(lp.x, lp.y);
eLoad.Fold();
eTargetElement.Fold();
request = new AjaxRequest({
onload: function () {
Document.ClearElement(targetElement); 
Document.CloneElementContent(this.GetXMLNode('ajaxXmlObject'), targetElement);
eLoad.Fold();
eTargetElement.Display();
Layer.EnableContent();
lLoad.Remove();
}
});
Layer.DisableContent();
eLoad.Display();
if (request != null) { request.Get(params.url); }
}
}
function cbLoadIFrame(params) {
var n = params.targetId ? Document.GetElement(params.targetId) : null;
if (n != null && params.url) {
if (n.tagName.toLowerCase() == "iframe") {
n.src = params.url;
} else {
Document.CreateElement('iframe', {
targetElement: n,
src: params.url,
frameborder: 0
});
}
}
}
function cbLocation(params) {
if (params.url) { top.location.href = params.url; }
}
function cbOpenWindow(params) {
if (params.trigger != null) { params.trigger.PreventDefault(); }
if (params.url) {
var targetId = params.targetId ? params.targetId : "";
var windowParams = params.windowParams ? params.windowParams : "";
var win = window.open(params.url, targetId, windowParams);
win.focus();
}
}
function cbSubmit(params) {
var trigger = params.trigger && params.trigger.element != null ? params.trigger : null;
var t = params.targetId ? Document.GetElement(params.targetId) : null;
if (trigger == null) {
return false;
}
var mayExecute = _CheckCBConditionalValue(params);
if (!mayExecute) {
return false;
}
if (!params.ignoreKeyCode && (trigger.type == "keypress" || trigger.type == "keyup" || trigger.type == "keydown") && (trigger.keyCode == null || (trigger.keyCode != null && trigger.keyCode != 13))) {
return false;
}
if (t == null) { 
var fo = FormObject.GetNearest(trigger.element);
if (fo != null) {
var form = fo.GetForm();
if (form != null && form.action != null) {
_EnableCBValidation(params);
var tfo = NodeObject.Get(form);
if (tfo.listener && tfo.listener.submit) {
for (var x in tfo.listener.submit) {
tfo.listener.submit[x].handler();
}
}
if (params.languageId) {
form.action = form.action + "&language=" + params.languageId;
params.trigger.PreventDefault();
}
form.submit();
}
}
}
else {
if (t.nodeName.toLowerCase() == "form") {
form.action = params.url ? params.url : form.action ? form.action : null;
if (form.action != null) {
_EnableCBValidation(params);
var fo = NodeObject.Get(form);
if (fo.listener && fo.listener.submit) {
for (var x in fo.listener.submit) {
fo.listener.submit[x].handler();
}
}
form.submit();
}
else {
return;
}
}
else if (t.nodeName.toLowerCase() == "iframe" && params.url) {
var fo = FormObject.GetNearest(trigger.element);
if (fo != null) {
var qs = fo.GetFormQueryString();
var url = qs != null && qs.length > -1 ? params.url.contains("?") ? params.url + "&" + qs : params.url + "?" + qs : params.url;
t.src = url;
}
}
else if (params.url) {
var fo = FormObject.Get(trigger.element);
var request;
if (fo != null) {
var f = fo.GetForm();
var onsubmit = f.onsubmit;
f.onsubmit = function () {
this.onsubmit = onsubmit;
return false;
}
}
var l = Layer.Get("cbLayerLoading");
var le = Effect.Get(l.element);
var lp = _GetCBLayerPositionTuple({ layer: l, layerPosition: "screen" });
var e = Effect.Get(t);
le.Fold();
le.MoveTo(lp.x, lp.y);
request = new AjaxRequest({
onload: function () {
Document.ClearElement(t);
Document.CloneElementContent(this.GetXMLNode('ajaxXmlObject'), t, { executeScripts: true });
Layer.EnableContent();
l.Remove();
e.Display();
}
});
e.Fold();
Layer.DisableContent();
le.Display();
var fo = FormObject.GetNearest(trigger.element);
var url = params.url;
if (request != null) { request.Post(params.url, fo); }
}
}
}

var Cart = {};
(function () {
var _itemTotalKeys = { total: "total", subTotal: "subTotal" };
var _itemPotentialKeys = { potentialSubTotal: "subTotal", potentialTotal: "total", potentialDiscount: "discount" };
var _itemKeyExtensionList = ["Net", "Gross", "Vat"];
var _cart, _targets, _precisionFactor, _priceFormat, _pageUpdateState, _floatPercentFormat, _intPercentFormat;
function _init(){
_cart = _cart || window.cbCart || {};
_targets = _targets || window.cbCartTargets || {};
_precisionFactor = _precisionFactor || _cart.precisionFactor || 100;
_priceFormat = _priceFormat || _cart.priceFormatString || "$###.##0,00;-$###.##0,00";
_floatPercentFormat = _floatPercentFormat || _cart._floatPercentFormat || "###,##0.00 %;-###,##0.00 %";
_intPercentFormat = _intPercentFormat || _cart._intPercentFormat || "###,##0 %;-###,##0 %";
}
function _addIntValues(priceObj) {
if (priceObj.prices && !priceObj.integers && _cart.precisionFactor) {
if (priceObj.potentialPrices && priceObj.quantity == 0) {
_itemKeyExtensionList.forEach(function (keyExtension, ix) {
Object.forEach(_itemPotentialKeys, function (potentialKey, key) {
if (!priceObj.prices[key + keyExtension]) { priceObj.prices[potentialKey + keyExtension] = 0; }
});
});
}
priceObj.integers = {};
Object.forEach(priceObj.prices, function (price, key) { priceObj.integers[key] = Math.round(price * _precisionFactor); });
Object.forEach(priceObj.potentialPrices, function (price, key) { priceObj.integers[key] = Math.round(price * _precisionFactor); });
}
}
function _updatePrices(priceObj) {
if (priceObj.integers && _cart.precisionFactor) {
Object.forEach(priceObj.integers, function (price, key) { priceObj.prices[key] = price / _precisionFactor; });
}
}
function _calcTotals(priceObj, operation) {
var totals = [];
var intFrom, intTo;
if (priceObj.clientVatSetTypeId) {
_addIntValues(priceObj);
if (_cart.totals) {
if (_cart.totals[priceObj.clientVatSetTypeId]){
_addIntValues(_cart.totals[priceObj.clientVatSetTypeId]);
totals.push(_cart.totals[priceObj.clientVatSetTypeId]);
}
_addIntValues(_cart.totals['None']);
totals.push(_cart.totals['None']);
}
}
totals.forEach(function (totalObj) {
Object.forEach(_itemTotalKeys, function (itemTotalKey, key) {
_itemKeyExtensionList.forEach(function (keyExtension, ix) {
intFrom = priceObj.integers;
intTo = totalObj.integers;
if (!isNaN(intFrom[key + keyExtension]) && !isNaN(intTo[itemTotalKey + keyExtension])) {
intTo[itemTotalKey + keyExtension] = operation == 'subtract'
? intTo[itemTotalKey + keyExtension] - intFrom[key + keyExtension]
: intTo[itemTotalKey + keyExtension] + intFrom[key + keyExtension];
}
});
});
_updatePrices(totalObj);
});
}
function _calcItem(item, quantity) {
var intFrom, newQuantity;
_addIntValues(item);
intFrom = item.integers;
if (item.potentialQuantity) {
_itemKeyExtensionList.forEach(function(keyExtension){
intFrom["unitTotal" + keyExtension] = intFrom["potentialUnitTotal" + keyExtension];
intFrom["unitPrice" + keyExtension] = intFrom["potentialUnitPrice" + keyExtension];
intFrom["unitDiscount" + keyExtension] = intFrom["potentialUnitDiscount" + keyExtension];
});
if (item.potentialQuantity == item.quantity) {
_itemKeyExtensionList.forEach(function(keyExtension){
intFrom["total" + keyExtension] = intFrom["potentialTotal" + keyExtension];
intFrom["subTotal" + keyExtension] = intFrom["potentialSubTotal" + keyExtension];
intFrom["discount" + keyExtension] = intFrom["potentialDiscount" + keyExtension];
});
}
}
newQuantity = quantity > item.maxQuantity ? item.maxQuantity : quantity < item.minQuantity && (item.isXSelling || item.allowZeroQuantity) ? 0 : quantity < item.minQuantity ? item.minQuantity : quantity;
if ((!isNaN(item.jsCalculationMaxQuantity) && newQuantity > item.jsCalculationMaxQuantity) ||
(!isNaN(item.jsCalculationMinQuantity) && newQuantity < item.jsCalculationMinQuantity)
) {
item.quantity = newQuantity;
_pageUpdateState = true;
return;
}
_calcTotals(item, 'subtract');
item.quantity = newQuantity;
_itemKeyExtensionList.forEach(function (extensionKey, ix) {
if (intFrom["unitPrice" + extensionKey]) {
intFrom["subTotal" + extensionKey] = item.quantity == item.potentialQuantity ? intFrom["potentialSubTotal" + extensionKey] : (intFrom["unitPrice" + extensionKey] * item.quantity);
}
if (intFrom["unitTotal" + extensionKey]) {
intFrom["total" + extensionKey] = item.quantity == item.potentialQuantity ? intFrom["potentialTotal" + extensionKey] : (intFrom["unitTotal" + extensionKey] * item.quantity);
}
});
_calcTotals(item, 'add');
_updatePrices(item);
if (item.hasShipping) {
_pageUpdateState = true;
}
}
function _updateTargets(itemId){
var priceItem, la_targetElement, la_price, la_property, la_propertyValue;
if (!_targets){ return; }
if (itemId && _targets.items){
priceItem = _cart.items[itemId];
_targets.items[itemId].forEach(function(targetItem, ix){
la_targetElement = Document.GetElement(targetItem.id);
if (la_targetElement && targetItem.priceTypeId) {
la_price = priceItem.prices[targetItem.priceTypeId];
if (la_price != null) { Document.SetElementAttribute(la_targetElement, 'text', la_price.toString().formatPrice(_priceFormat)); }
}
if (la_targetElement && targetItem.propertyId) {
la_property = targetItem.propertyId;
la_propertyValue = priceItem[la_property];
if (la_property == 'quantity'){ la_propertyValue = parseInt(la_propertyValue) * (parseInt(targetItem.quantityMultiplier) || 1); }
Document.SetElementAttribute(la_targetElement, 'text', la_propertyValue.toString()); 
if (la_property == 'quantity' && la_targetElement.type == 'checkbox'){ la_targetElement.checked = parseInt(la_propertyValue) > 0 ? true : false; }
}
}); 
}
if (_targets.totals){
_targets.totals.forEach(function (targetItem, ix) {
priceItem = _cart.totals[targetItem.clientVatSetTypeId];
la_targetElement = Document.GetElement(targetItem.id);
if (la_targetElement && targetItem.priceTypeId) {
la_price = priceItem.prices[targetItem.priceTypeId];
if (la_price != null) { Document.SetElementAttribute(la_targetElement, 'text', la_price.toString().formatPrice(_priceFormat)); }
}
});
}
if (_targets.subtotals){
_targets.subtotals.forEach(function (targetItem, ix) {
priceItem = _cart.totals[targetItem.clientVatSetTypeId];
la_targetElement = Document.GetElement(targetItem.id);
if (la_targetElement && targetItem.priceTypeId) {
la_price = priceItem.prices[targetItem.priceTypeId];
if (la_price != null) { Document.SetElementAttribute(la_targetElement, 'text', la_price.toString().formatPrice(_priceFormat)); }
}
});
}
}
Cart.GetPageUpdateState = function () { return (_pageUpdateState != null); };
Cart.GetItemQuantity = function (itemId) {
_init();
return _cart.items && _cart.items[itemId] ? (_cart.items[itemId].quantity || 0) : 0;
};
Cart.AddItem = function (itemId) {
_init();
var newQ;
var item = _cart.items ? _cart.items[itemId] : null;
if (item) {
newQ = item.isOptional && item.potentialQuantity? item.potentialQuantity : item.quantity + 1;
if (item.isXSelling) {
newQ = item.quantity == 0 ? item.potentialQuantity
: item.quantity + 1;
}
_calcItem(item, newQ);
_updateTargets(itemId);
}
};
Cart.RemoveItem = function (itemId) {
_init();
var newQ;
var item = _cart.items ? _cart.items[itemId] : null;
if (item) {
newQ = item.isOptional ? 0 : item.quantity - 1;
_calcItem(item, newQ);
_updateTargets(itemId);
}
};
Cart.SetItemQuantity = function (itemId, quantity) {
_init();
var newQ;
var item = _cart.items ? _cart.items[itemId] : null;
if (item) {
newQ = quantity;
if (item.isXSelling) {
if (quantity == 0) {
newQ = 0;
}
else if (quantity < item.potentialQuantity ||
item.quantity == 0 && newQ == 0) {
newQ = item.potentialQuantity;
} 
else {
newQ = quantity;
}
}
_calcItem(item, newQ);
_updateTargets(itemId);
}
};
Cart.SetItemPrice = function(itemId, priceObj){
_init();
var item = _cart.items ? _cart.items[itemId] : null;
if (item) {
_calcTotals(item, 'subtract');
delete item.prices;
delete item.integers;
item.prices = priceObj;
_calcItem(item, item.quantity);
_calcTotals(item, 'add');
_updateTargets(itemId);
}
};
Cart.UpdateWidgetCartCookie = function () {
if (!Runtime.IsDeclared('ShoppingCartWidget')) {
return;
}
_init();
ShoppingCartWidget.SetRawCookie(_cart);
};
})();
var cbCalcCartItem;
(function() {
var _fieldDelay = 1000;
var _fieldDelayTimer;
var _oldQuantity, _newQuantity;
cbCalcCartItem = function(params) {
var targetElement, noTarget, charCode;
if (params.trigger && params.trigger.element != null && params.trigger.element.nodeName.toLowerCase() == "a") {
params.trigger.PreventDefault();
}
if (!_CheckCBConditionalValue(params) || !params.cartItem || !params.operation) {
return;
}
switch (params.operation.toLowerCase()) {
case 'additem':
Cart.AddItem(params.cartItem);
if (Cart.GetPageUpdateState()) {
cbSubmit({ trigger: params.trigger, buttonName: "update" });
}
break;
case 'removeitem':
Cart.RemoveItem(params.cartItem);
if (Cart.GetPageUpdateState()) {
cbSubmit({ trigger: params.trigger, buttonName: "update" });
}
break;
case 'setitemquantity':
var oEvent = params.trigger.GetEvent();
var charCode = params.trigger.keyCode;
function checkKeyExecution() {
if (oEvent.metaKey || oEvent.ctrlKey || oEvent.altKey) {
return true;
}
if (charCode == 13) {
params.trigger.PreventDefault();
cbSubmit({ trigger: params.trigger, ignoreKeyCode: true, buttonName: "update" });
} else if (charCode >= 48 && charCode <= 57 || 
charCode >= 96 && charCode <= 105 || 
charCode == 46 || 
charCode == 8 || 
charCode >= 37 && charCode <= 40 && !oEvent.shiftKey || 
charCode < 32 ||
charCode > 126) {
return true;
}
return false;
}
function keyExecution() {
_newQuantity = parseInt(Document.GetElementAttribute(targetElement, 'text'), 10);
if (!isNaN(_newQuantity) && _newQuantity != _oldQuantity) {
Cart.SetItemQuantity(params.cartItem, _newQuantity);
if (Cart.GetPageUpdateState()) {
cbSubmit({ trigger: params.trigger, ignoreKeyCode: true, buttonName: "update" });
}
}
}
targetElement = Document.GetElement(params.targetId) || Document.GetElement(params.trigger.element);
noTarget = NodeObject.Get(targetElement);
if (!noTarget.Retrieve('cbCalcCartItem.blurListener')) {
noTarget.AddListener(new Listener("blur", function(trigger) {
clearTimeout(_fieldDelayTimer);
keyExecution();
}));
noTarget.Store('cbCalcCartItem.blurListener', true);
}
_oldQuantity = parseInt(Document.GetElementAttribute(targetElement, 'text'));
clearTimeout(_fieldDelayTimer);
if (checkKeyExecution()) {
_fieldDelayTimer = setTimeout(keyExecution, _fieldDelay);
}
break;
case 'togglezeroquantity':
_newQuantity = params.trigger.element.checked ? 1 : 0;
Cart.SetItemQuantity(params.cartItem, _newQuantity);
break;
}
};
})();
DomLoaded.Load(function () {
Cart.UpdateWidgetCartCookie(); 
});
function cbPrepareProductSelection() {
var selectionContainer = Document.GetElement('cleverSelectionSubscriptionUpgrade');
if (selectionContainer == null) { return false; }
var lists = selectionContainer.getElementsByTagName('ul');
if (lists.length == 0) { return false; }
var optionList = lists[lists.length - 1];
var options = Array.from(optionList.getElementsByTagName('input')).filter(function (item) {
return item.type == 'radio';
});
if (options.length == 0) { return false; }
var firstOptionSelected = false;
if (options.length > 0) {
if (options[0].checked) { firstOptionSelected = true; }
options[0].disabled = true;
Document.RemoveElementClass(options[0].parentNode, 'CBSelected');
}
if (options.length > 1) {
if (firstOptionSelected) { options[1].checked = true; }
for (var index = 1; index < options.length; index++) {
if (options[index].checked) {
Document.AddElementClass(options[index].parentNode, 'CBSelected');
break;
}
}
}
return true;
}
function cbPrepareLicenseDevices() {
var testPattern = new RegExp('[0-9]+[DM]-[0-9]D-[AM]R', 'i');
var matchPattern = /([0-9]+)([DM])-([0-9])+D/i;
function _handleMark(mark) {
var container = mark.parentElement;
var dataContainer = Array.from(container.getElementsByTagName('span')).filter(function (item) {
return item.className == 'jsLicenseDeviceData';
});
if (dataContainer.length != 1) { return; }
var data = dataContainer[0].innerHTML;
var test = testPattern.test(data);
if (test === false) { return; }
var dataMatches = data.match(matchPattern);
var licensePeriod = dataMatches[1];
var licensePeriodUnit = dataMatches[2].toUpperCase();
var numberOfDevices = dataMatches[3];
Array.from(container.getElementsByTagName('span')).forEach(function (item) {
if (item.className.contains('cbProductLicensePeriod')) {
Array.from(item.getElementsByTagName('span')).forEach(function (valueItem) {
if (valueItem.className.contains('jsLicensePeriodDays') && licensePeriodUnit == 'D' ||
valueItem.className.contains('jsLicensePeriodMonths') && licensePeriodUnit == 'M') {
valueItem.innerHTML = valueItem.innerHTML.replace('%%', licensePeriod);
valueItem.style.display = '';
}
});
}
if (item.className.contains('cbProductNumberDevices')) {
Array.from(item.getElementsByTagName('span')).forEach(function (valueItem) {
if (valueItem.className.contains('jsNumberOfDevices')) {
valueItem.innerHTML = numberOfDevices;
}
});
}
});
}
var marks = Array.from(document.getElementsByTagName('input')).filter(function (item) {
return item.name == 'jsLicenseDeviceData';
});
if (marks.length == 0) { return; }
marks.forEach(function (mark) {
_handleMark(mark);
});
}
var cbCartProductSelection = function () { };
(function () {
var _selection, _selected, _priceObj, _chainDown, _noChain, _options;
function _getSelection(id){ return window.cbProductSelection['s'+id]; }
cbCartProductSelection = function(params){
if (!_CheckCBConditionalValue(params)) { return false; }
_selection = _getSelection(params.selection);
_selected = _selection.selected;
_selected['itm' + params.item] = 'itm' + params.select;
_priceObj = _selection['itm' + params.select].prices;
if (_priceObj){
Cart.SetItemPrice('rNo' + _selection.runningNo, _priceObj);
} else {
_chainDown = _selection[_selected['itm' + params.select]];
if (_chainDown){
_noChain = NodeObject.Get(_chainDown.itemListenerId);
if (_noChain){ _noChain.DispatchEvent('click'); _noChain.DispatchEvent('change'); };
}
}
};
})();
var cbCalcProductItem = function () { };
(function () {
var _storage = {};
var _timer;
cbCalcProductItem = function(params) {
var targetElement = Document.GetElement(params.targetId);
var qty, trigger, triggerElement, max, min, defVal;
var evt, charCode;
if (_CheckCBConditionalValue(params) && params.trigger && params.trigger.element) {
min = parseInt(params.minQuantity) || 0;
max = parseInt(params.maxQuantity);
trigger = params.trigger;
triggerElement = Document.GetElement(params.trigger.element);
triggerElement.id = triggerElement.id || Runtime.GetUniqueId();
defVal = _storage['default_' + targetElement.id] = _storage['default_' + targetElement.id] || targetElement.value;
if (triggerElement.nodeName.toLowerCase() == 'a'){ trigger.PreventDefault(); }
qty = parseInt(targetElement.value, 10) || 0;
switch (params.operation.toLowerCase()) {
case 'additem':
qty++; qty = qty < min ? min : !isNaN(max) && qty > max ? max : qty;
targetElement.value = qty;
break;
case 'removeitem':
qty--; qty = qty == 0 || qty < min ? defVal : qty;
targetElement.value = qty;
break;
case 'setitemquantity':
clearTimeout(_timer);
_timer = setTimeout(function () {
qty = parseInt(targetElement.value, 10) || 0;
qty = qty < min && qty > 0 ? min : !isNaN(max) && qty > max ? max : qty;
targetElement.value = qty <= 0 ? defVal : qty;
}, 200);
break;
}
}
};
})();

var Cookie = function () { };
(function () {
var _encodeReadWriteChars = [';', ',', '=', '\"'];
function _createKey() {
return (new Date().getTime()).toString();
}
function _encodeWrite(value) {
Object.forEach(_encodeReadWriteChars, function (char) {
value = value.replace(new RegExp(encodeURIComponent(char), 'g'), encodeURIComponent(encodeURIComponent(char))); 
value = value.replace(new RegExp(char, 'g'), encodeURIComponent(char)); 
});
return value;
}
function _decodeRead(value) {
Object.forEach(_encodeReadWriteChars, function (char) {
value = value.replace(new RegExp(encodeURIComponent(char), 'g'), char); 
value = value.replace(new RegExp(encodeURIComponent(encodeURIComponent(char)), 'g'), encodeURIComponent(char)); 
});
return value;
}
function _getSubDomain(host) {
var result = host;
var domainParts = host.split('.');
var topLevelDomain = domainParts[domainParts.length - 1];
if (isNaN(topLevelDomain)) {
result = topLevelDomain;
if (domainParts.length > 1) { result = domainParts.slice(domainParts.length - 2).join('.'); }
}
return result;
}
Cookie = function (key, options) {
var _Cookie = {
family: 'Cookie',
key: null,
options: {
path: '/', 
domain: false, 
secure: false, 
duration: false, 
encode: false 
},
Write: function (value, options) {
var settings = '';
options = options || {};
Object.set(this.options, options);
this.options.domain = this.options.domain || String.parseURI(null, 'host');
if (this.options.path) { settings += '; path=' + this.options.path; }
if (this.options.domain) { settings += '; domain=' + _getSubDomain(this.options.domain); }
if (this.options.secure) { settings += '; secure'; }
if (this.options.duration) {
var date = new Date();
date.setTime(date.getTime() + this.options.duration * 24 * 60 * 60 * 1000);
settings += '; expires=' + date.toGMTString();
}
if (options.ignoreEncode !== true) {
if (document.all != null && document.styleSheets == null) { this.options.encode = true; } 
if (this.options.encode) { value = encodeURIComponent(value); }
else { value = _encodeWrite(value); }
}
delete this.options.ignoreEncode;
document.cookie = this.key + '=' + value + settings;
return this;
},
Read: function (options) {
var result = '';
var value = document.cookie.match('(?:^|;)\\s*' + this.key.escapeRegExp() + '=([^;]*)');
options = options || {};
Object.set(options, this.options);
if (value != null) { result = value[1]; }
if (options.ignoreEncode !== true) {
if (document.all != null && document.styleSheets == null) { options.encode = true; } 
if (options.encode) { result = decodeURIComponent(result); }
else { result = _decodeRead(result); }
}
return result;
},
Empty: function () {
this.Write('');
return this;
},
Clear: function () {
this.Write('', { duration: -1 });
return this;
}
};
options = options || {};
if (key == null) {
if (options.noCreate !== true) { key = _createKey(); }
else { return null; }
}
_Cookie.key = key;
Object.set(_Cookie.options, options);
return _Cookie;
};
(function () {
function _getTotalCookieSize() {
var result = 16000; 
/*@cc_on
            @if(@_jscript_version >= 9)
            result = 10000; // MSIE 9 and above
            @end
            @if(@_jscript_version < 9)
            result = 10000; // MSIE 8
            @end
            @if(@_jscript_version < 5.8)
            result = 4000; // MSIE 7 and below
            @end
            @*/
return result;
}
var _config = {
size: {
total: _getTotalCookieSize(), 
reserved: 2000, 
key: 3500 
},
maxKeys: 34 
};
var _reservedKeys = ['cbsession', 'session', 'cbAcAuth', 'enableFlash', 'p0', '__']; 
Cookie.multiPart = true; 
(function () {
var _storage = [];
Cookie.Get = function (key) {
var cookie, cookieKey, options;
switch (Object.typeOf(key)) {
case 'string':
cookie = _storage[key] || new Cookie(key);
_storage[key] = cookie;
break;
case 'cookie':
cookie = key;
break;
case 'object':
options = key;
cookieKey = options.key;
cookie = new Cookie(cookieKey, options);
_storage[cookieKey] = cookie;
break;
default: cookie = null;
}
return cookie;
};
Cookie.Remove = function (key) {
var cookie, cookieKey, options;
switch (Object.typeOf(key)) {
case 'cookie':
cookie = key;
cookieKey = cookie.key;
break;
case 'object':
options = key;
cookieKey = options.key;
break;
default: cookieKey = key;
}
if (cookieKey != null) {
if (_storage[cookieKey]) {
delete _storage[cookieKey];
return true;
}
} else {
Object.forEach(_storage, function (itemValue, itemKey) {
delete _storage[itemKey];
});
return true;
}
return false;
};
})();
function _splitKeyIndex(value, obj, options) {
obj = obj || {};
options = options || {};
obj.key = value.replace(/_[0-9]+$/, '');
obj.index = value.replace(new RegExp('^' + obj.key.escapeRegExp() + '(_)*'), '') || '0';
if (options.indexFormat == 'number') { obj.index = Number(obj.index); }
return obj;
}
(function () {
var _sortKeysAscending = function () {
var _first = {};
var _second = {};
return function (first, second) {
_splitKeyIndex(first, _first, { indexFormat: 'number' });
_splitKeyIndex(second, _second, { indexFormat: 'number' });
return ((_first.key == _second.key && _first.index > _second.index || _first.key != _second.key && _first.key > _second.key) ? 1 : (first == second) ? 0 : -1);
}
} ();
Cookie.GetKeys = function (key, ignoreIntegrity) {
var result = [];
var content = this.ReadAll().split(';');
var multiPart, keyBase, itemKeyBase, itemKeyIndex;
switch (Object.typeOf(key)) {
case 'string':
keyBase = _splitKeyIndex(key).key; 
multiPart = key == keyBase;
ignoreIntegrity = ignoreIntegrity || key != keyBase;
break;
case 'boolean':
multiPart = key;
key = null;
break;
default: multiPart = this.multiPart;
}
if (this.multiPart === false) { multiPart = this.multiPart; }
content = content.map(function (itemValue) {
return itemValue.split('=')[0].trim();
}).sort(_sortKeysAscending);
content.forEach(function (itemKey) {
if (itemKey != '') {
itemKeyBase = _splitKeyIndex(itemKey).key; 
itemKeyIndex = _splitKeyIndex(itemKey).index; 
if (multiPart) {
if (keyBase != null && keyBase == itemKeyBase || keyBase == null && (itemKey == itemKeyBase || !Array.contains(result, itemKeyBase))) { result.push(itemKey); }
} else {
if (key != null) {
if (key == itemKey) { result.push(itemKey); }
} else { result.push(itemKey); }
}
}
});
if (!ignoreIntegrity && multiPart && key != null && result.length > 1 && (result.length - 1) != _splitKeyIndex(result[result.length - 1], null, { indexFormat: 'number' }).index) { result = []; }
return result;
};
})();
Cookie.HasKey = function (key) {
if (key != null) { return Array.contains(this.GetKeys(false), key); }
return false;
};
Cookie.CheckWrite = function () {
function _getReservedSize() {
var result = 0;
var allKeys = Cookie.GetKeys(false).join(';');
var keys;
_reservedKeys.forEach(function (reservedKey) {
if (new RegExp('(^|;)' + reservedKey + '[^;]*(;|$)').test(allKeys)) {
keys = allKeys.match(new RegExp('(?:[\^;]*)(' + reservedKey + '[^;]*)(?:[;$]*)', 'g'));
if (keys != null) {
keys.forEach(function (key) {
if (typeof key == 'string') {
key = key.replace(/;/g, '');
result += key.length + Cookie.Read(key, null, { ignoreEncode: true }).length;
}
});
}
}
});
return result;
}
function _getCustomSize(excludeKey) {
var result = 0;
var allKeys = Cookie.GetKeys();
var reservedSize = _getReservedSize();
allKeys.forEach(function (key) {
if (key != excludeKey) { result += key.length + Cookie.Read(key, null, { ignoreEncode: true }).length; }
});
result -= reservedSize;
return result;
}
function _getReservedKeys() {
var result = 0;
var allKeys = Cookie.GetKeys(false).join(';');
var keys;
_reservedKeys.forEach(function (reservedKey) {
if (new RegExp('(^|;)' + reservedKey + '[^;]*(;|$)').test(allKeys)) {
keys = allKeys.match(new RegExp('(?:[\^;]*)(' + reservedKey + '[^;]*)(?:[;$]*)', 'g'));
if (keys != null) { result += keys.length; }
}
});
return result;
}
function _getCustomKeys(excludeKey) {
var result = 0;
var allKeys = Cookie.GetKeys(false);
var reservedKeys = _getReservedKeys();
allKeys.forEach(function (key) {
if (typeof key == 'string' && _splitKeyIndex(key).key != excludeKey) { result++; }
});
result -= reservedKeys;
return result;
}
function _cleanup(ownKey) {
var result = [];
var obsoleteKeys = Cookie.GetKeys(true);
var allKeys = obsoleteKeys.join(';');
var reservedKeys, keys, keyIndexFrom, keyIndexTo;
reservedKeys = Array.clone(_reservedKeys);
reservedKeys.push(ownKey);
Object.forEach(reservedKeys, function (reservedKey) {
if (new RegExp('(^|;)' + reservedKey + '[^;]*(;|$)').test(allKeys)) {
keys = allKeys.match(new RegExp('[\^;]*(' + reservedKey + '[^;]*)[;$]*', 'g'));
if (keys != null) {
keys = keys.map(function (item) {
if (typeof item == 'string') { return item.replace(/;/g, ''); }
else { return item; }
});
keys.forEach(function (key) {
keyIndexFrom = obsoleteKeys.indexOf(key);
keyIndexTo = keyIndexFrom + 1;
if (keyIndexFrom > -1) { obsoleteKeys[keyIndexFrom] = null; }
});
}
}
});
obsoleteKeys.forEach(function (item) {
if (item != null) { result.push(item); }
});
if (result.length > 0) {
Cookie.Clear(result[0]);
return true;
}
return false;
}
return function (key, value, forceCleanup) {
var availableKeys, reservedKeys, ownKeys;
var availableSize, reservedSize, ownSize;
reservedKeys = _getReservedKeys();
ownKeys = Math.ceil(value.length / _config.size.key);
availableKeys = _config.maxKeys - (reservedKeys - _getCustomKeys());
reservedSize = Math.max(_getReservedSize(), _config.size.reserved);
ownSize = value.length + ownKeys * key.length;
availableSize = _config.size.total - (reservedSize + _getCustomSize(key));
if (ownKeys > availableKeys || ownSize > availableSize) {
if (reservedKeys + ownKeys > _config.maxKeys || reservedSize + ownSize > _config.size.total) { return false; } 
if (forceCleanup) { return Cookie.CheckWrite(key, value, _cleanup(key)); }
else { return false; }
}
return true;
};
} ();
Cookie.Write = function (key, value, options) {
var cookie, cookieKey;
var counter, parts, partContent, partCookie;
options = options || {};
options.ignoreEncode = false;
if (options.ignoreEncode !== true) {
if (options.encode) { value = encodeURIComponent(value); }
else { value = _encodeWrite(value); }
options.ignoreEncode = true;
}
if (!this.CheckWrite(key, value, true)) {
this.Clear(cookieKey, true); 
return null;
}
switch (Object.typeOf(key)) {
case 'string':
cookieKey = key;
cookie = this.Get(cookieKey);
break;
case 'cookie':
cookie = key;
cookieKey = cookie.key;
break;
case 'object':
cookie = this.Get(key);
cookieKey = cookie.key;
}
this.Clear(cookieKey, true); 
parts = Math.ceil(value.length / _config.size.key); // Amount of keys needed to store the value
for (counter = 0; counter < parts; counter++) {
partContent = value.substr(counter * _config.size.key, _config.size.key);
partCookie = this.Get(cookieKey + (counter == 0 ? '' : '_' + counter));
partCookie.Write(partContent, options);
}
return cookie;
};
Cookie.Read = function (key, ignoreIntegrity, options) {
var result = '';
var cookie, cookieKey, cookieOptions;
var keys, counter;
switch (Object.typeOf(key)) {
case 'string':
cookieKey = key;
cookie = this.Get(key);
cookieOptions = cookie.options || {};
break;
case 'cookie':
cookie = key;
cookieOptions = cookie.options;
cookieKey = cookie.key;
break;
case 'object':
cookieOptions = key;
cookieKey = options.key;
break;
default: cookieKey = null;
}
if (cookieKey == null) { return ''; }
keys = this.GetKeys(cookieKey, ignoreIntegrity);
options = options || {};
Object.set(cookieOptions, options);
for (counter = 0; counter < keys.length; counter++) {
cookie = this.Get(Object.merge({}, cookieOptions, { key: keys[counter] }));
if (cookie != null) { result += cookie.Read({ ignoreEncode: true }); }
}
if (cookieOptions.ignoreEncode !== true) {
if (cookieOptions.encode) { result = decodeURIComponent(result); }
else { result = _decodeRead(result); }
}
return result;
};
Cookie.ReadAll = function () {
return document.cookie || '';
};
Cookie.Empty = function (key) {
var cookie, cookieKey, options;
var keys, counter, loopCookie;
switch (Object.typeOf(key)) {
case 'string':
cookieKey = key;
cookie = this.Get(cookieKey);
options = cookie.options || {};
break;
case 'cookie':
cookie = key;
cookieKey = cookie.key;
options = cookie.options;
break;
case 'object':
options = key;
cookieKey = options.key;
cookie = this.Get(Object.merge({}, options, { key: cookieKey }));
break;
default: cookieKey = null;
}
if (cookieKey == null) { return null; }
keys = this.GetKeys(cookieKey, true);
for (counter = 0; counter < keys.length; counter++) {
loopCookie = this.Get(Object.merge({}, options, { key: keys[counter] }));
loopCookie.Empty();
}
return cookie || null;
};
Cookie.Clear = function (key) {
var cookie, cookieKey, options;
var keys, counter, loopCookie;
switch (Object.typeOf(key)) {
case 'string':
cookieKey = key;
cookie = this.Get(cookieKey);
options = cookie.options || {};
break;
case 'cookie':
cookie = key;
cookieKey = cookie.key;
options = cookie.options;
break;
case 'object':
options = key;
cookieKey = options.key;
cookie = this.Get(Object.merge({}, options, { key: cookieKey }));
break;
default: cookieKey = null;
}
if (cookieKey == null) { return false; }
keys = this.GetKeys(cookieKey, true);
for (counter = 0; counter < keys.length; counter++) {
loopCookie = this.Get(Object.merge({}, options, { key: keys[counter] }));
loopCookie.Clear();
this.Remove(keys[counter]);
}
return cookie != null;
};
})();
})();
Runtime.Declare('Cookie');

var TemplateParser = function () {
var _originalData = {};
var _types = {
'ForEachType': {
'edition': ['cartItem', 'vatSetType']
},
'IfType': {
'test': ['purchaseHasItems', '!purchaseHasItems', 'isEvenItem', '!isEvenItem', 'isOddItem', '!isOddItem', 'propertyIsSet', '!propertyIsSet', 'propertyHasValue', '!propertyHasValue', 'itemIsReadOnly', '!itemIsReadOnly', 'itemIsOptional', '!itemIsOptional', 'itemIsRemovable', '!itemIsRemovable'],
'type': null,
'property': null,
'value': null
},
'ElseType': {},
'ChooseType': {},
'ItemAttributeType': {
'property': null
},
'PriceType': {
'type': ['net', 'vat', 'gross'],
'price': null,
'formatted': ['true', 'false']
},
'CountType': {
'edition': ['cartItem'],
'condition': ['propertyIsSet', '!propertyIsSet', 'propertyHasValue', '!propertyHasValue', 'itemIsReadOnly', '!itemIsReadOnly', 'itemIsOptional', '!itemIsOptional', 'itemIsRemovable', '!itemIsRemovable'],
'type': null,
'property': null,
'value': null
}
};
var _vocabulary = {
'foreach': 'ForEachType',
'if': 'IfType',
'else': 'ElseType',
'choose': 'ChooseType',
'item': 'ItemAttributeType',
'itemprice': 'PriceType',
'cartprice': 'PriceType',
'count': 'CountType'
};
var _translations = {
'PriceType': {
'item': {
'regularPrice': 'unitPrice',
'subtotal': 'subtotal',
'discount': 'unitDiscount',
'discountTotal': 'discount',
'unitTotal': 'unitTotal',
'total': 'total'
},
'cart': {
'shipping': 'shippings',
'subtotal': 'subtotals',
'total': 'totals'
}
}
};
var _methods = function () {
function _if(data, attributes) {
var result, tested, inverse;
var attributes, attrTest, attrType, attrSubType, attrSubSubType, attrProperty, attrAttribute, attrValue;
var itemData = data.data || data;
result = tested = inverse = false;
attrTest = attributes.test || attributes.condition || '';
if (/^\!/.test(attrTest)) {
inverse = true;
attrTest = attrTest.substr(1);
}
switch (attrTest) {
case 'purchaseHasItems':
tested = true;
if (Object.typeOf(data.items) == 'array' && data.items.length > 0) { result = true; }
break;
case 'isEvenItem': case 'isOddItem':
tested = true;
if (data.position != null) { result = (attrTest == 'isEvenItem' && parseInt(data.position) % 2 == 0) || (attrTest == 'isOddItem' && parseInt(data.position) % 2 != 0); }
break;
case 'propertyIsSet':
tested = true;
attrProperty = attributes.property;
if (attrProperty != null && attrProperty in itemData) { result = true; }
break;
case 'propertyHasValue':
tested = true;
attrProperty = attributes.property;
attrValue = attributes.value;
if (attrProperty != null && attrValue != null && itemData[attrProperty] == attrValue) { result = true; }
break;
case 'itemIsReadOnly': case 'itemIsOptional': case 'itemIsRemovable':
tested = true;
if (String.from(data[attrCondition.replace(/^itemis/i, 'is')]) === 'true') { result = true; }
break;
default: result = true;
}
if (tested && inverse) { result = !result; }
return result;
}
return {
'ForEachType': function (data, options, content, config) {
var counter, dataLength;
var iterationData, attributes;
attributes = _checkAttributes('ForEachType', options.attributes);
switch (attributes.edition) {
case 'cartItem':
if (Object.typeOf(data.items) == 'array') {
dataLength = data.items.length;
for (counter = 0; counter < dataLength; counter++) {
config.callback(content, options.parentElement, data.items[counter], config);
}
}
break;
}
return true;
},
'IfType': function (data, options, content, config) {
var result, attributes;
attributes = _checkAttributes('IfType', options.attributes);
result = _if(data, attributes);
if (result == true) { config.callback(content, options.parentElement, data, config); }
return result;
},
'ElseType': function (data, options, content, config) {
config.callback(content, options.parentElement, data, config);
return true;
},
'ChooseType': function (data, options, content, config) {
var counter, childItems, childItemsLength;
childItems = content;
childItemsLength = childItems.length;
for (counter = 0; counter < childItemsLength; counter++) {
if (config.callback(childItems[counter], options.parentElement, data, config) === true) { break; }
}
return true;
},
'ItemAttributeType': function (data, options, content, config) {
var attributes, value, dataValue;
var itemData = data.data || data;
attributes = _checkAttributes('ItemAttributeType', options.attributes);
if (attributes.property != null) {
value = attributes.property;
dataValue = data[value] || itemData[value];
if (dataValue != null) {
_createElement({
'text': dataValue,
'parentElement': options.parentElement
});
}
}
return true;
},
'PriceType': function (data, options, content, config) {
var attributes, priceData, priceValue;
var vatsetTypeId = 'none';
var counter;
attributes = _checkAttributes('PriceType', options.attributes);
switch (options.name.toLowerCase()) {
case 'itemprice':
if (data.prices != null && data.prices.length > 0) { priceData = data.prices[0]; }
if (priceData != null && attributes.price != null && attributes.type != null) {
if (_translations['PriceType'].item[attributes.price]) { attributes.price = _translations['PriceType'].item[attributes.price]; }
}
break;
case 'cartprice':
if (_translations['PriceType'].cart[attributes.price]) { attributes.price = _translations['PriceType'].cart[attributes.price]; }
if (_originalData[attributes.price] != null) {
for (counter = 0; counter < _originalData[attributes.price].length; counter++) {
if (_originalData[attributes.price][counter].clientVatsetTypeId.toLowerCase() == vatsetTypeId) {
priceData = _originalData[attributes.price][counter];
break;
}
}
attributes.price = 'total';
}
}
if (priceData != null && priceData[attributes.price] != null && priceData[attributes.price].notZero === true) { priceValue = priceData[attributes.price][attributes.type]; }
else { priceValue = 0; }
if (priceValue != null) {
if (attributes.formatted == 'true') { priceValue = priceValue.formatPrice(_originalData.displayCurrencyInfo.priceFormatString); } 
_createElement({
'text': priceValue,
'parentElement': options.parentElement
});
}
return true;
},
'CountType': function (data, options, content, config) {
var itemCount = 0;
var attributes, result, items;
attributes = _checkAttributes('ForEachType', options.attributes);
switch (attributes.edition) {
case 'cartItem':
if (Object.typeOf(data.items) == 'array') { items = data.items; }
}
if (items != null) {
items.forEach(function (countItem) {
result = _if(countItem.data, attributes);
if (result == true) { itemCount++; }
});
}
_createElement({
'text': itemCount,
'parentElement': options.parentElement
});
return true;
}
};
} ();
function _checkAttributes(type, attributes) {
var result = {};
var key, value, definitionValue;
var definition = _types[type];
if (!definition) { return null; }
for (key in attributes) {
if (attributes.hasOwnProperty(key)) {
value = attributes[key];
definitionValue = definition[key];
if (Object.typeOf(definitionValue) == 'array') {
if (Array.contains(definitionValue, value)) { result[key] = value; }
}
else { result[key] = value; }
}
}
return result;
}
var _textConverter;
function _createElement(options) {
var textNode, text;
var tagName = options.name;
if (tagName != null) { return Document.CreateElement(tagName, options.attributes || {}); } 
if (!Array.contains([null, ''], options.text)) {
_textConverter = _textConverter || document.createElement('div'); 
_textConverter.innerHTML = options.text; 
text = _textConverter.firstChild.nodeValue; 
textNode = document.createTextNode(text);
if (textNode != null) { options.parentElement.appendChild(textNode); }
}
return null;
}
function _hookHandler(data, item, content, config) {
var result = null;
var itemType;
itemType = _vocabulary[item.name.toLowerCase()];
if (_methods[itemType]) { result = _methods[itemType](data, item, content, config); }
return result;
}
var _serializerSettings = null;
var _TemplateParser = {
hookHandler: _hookHandler,
UseSettings: function (settings) {
if (Object.typeOf(settings) != 'serializersettings') { return; }
_serializerSettings = settings;
},
ProcessTemplate: function (item, offsetElement, data, config) {
_originalData = data;
Serializer.ToElement(item, {
settings: _serializerSettings,
data: data,
targetElement: offsetElement
});
}
};
return _TemplateParser;
} ();
Runtime.Declare('TemplateParser');

var Widget = function (options) {
var _escapeChars = { '\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '\"': '\\\"', '\'': '\\\'', '\\': '\\\\' };
function _escape(chr) {
return _escapeChars[chr] || '\\u' + ('0000' + chr.charCodeAt(0).toString(16)).slice(-4);
}
function _validate(value) {
value = value.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').replace(/(?:^|:|,)(?:\s*\[)+/g, '');
return (/^[\],:{}\s]*$/).test(value);
};
function _getKey(obj, value) {
var testExpression = new RegExp('_' + value + '$');
var key;
for (key in obj) {
if (obj.hasOwnProperty(key) && (obj[key] === value || testExpression.test(key))) { return key; }
}
return null;
}
function _splitKeyIndex(value, obj) {
obj = obj || {};
obj.key = value.replace(/_[0-9]+$/, '');
obj.index = value.replace(new RegExp('^' + obj.key.escapeRegExp() + '(_)*'), '') || 0;
return obj;
}
function _encode(tpl, obj, definition) {
var result = [];
var resultItem, arrayResult, arrayItem;
var tplKey, tplValue, index;
var objKey, objValue;
var counter, itemCount;
for (tplKey in tpl) {
if (tpl.hasOwnProperty(tplKey)) {
tplValue = tpl[tplKey];
if (tplValue != null) {
switch (Object.typeOf(tplValue)) {
case 'number':
if (obj != null && obj[tplKey] != null) {
resultItem = obj[tplKey];
switch (Object.typeOf(resultItem)) {
case 'string': resultItem = '\"' + encodeURIComponent(resultItem.replace(/[\x00-\x1f\\"]/g, _escape)) + '\"';
}
result.push(tplValue + ':' + resultItem);
}
break;
case 'string':
objKey = _splitKeyIndex(tplKey).key; 
index = _splitKeyIndex(tplKey).index; 
if (obj && obj[objKey] != null) {
objValue = obj[objKey];
switch (Object.typeOf(objValue)) {
case 'array':
tplValue = tplValue.replace(/^array of /, ''); 
arrayResult = [];
itemCount = objValue.length;
for (counter = 0; counter < itemCount; counter++) {
arrayItem = '{' + _encode(definition[tplValue], objValue[counter], definition) + '}';
if (arrayItem != null) { arrayResult.push(arrayItem); }
}
result.push(index + ':[' + arrayResult.join(',') + ']');
break;
case 'object':
result.push(index + ':{' + _encode(definition[tplValue], objValue, definition) + '}');
}
}
break;
case 'object':
objKey = _splitKeyIndex(tplKey).key; 
index = _splitKeyIndex(tplKey).index; 
if (obj && obj[objKey] != null) {
objValue = obj[objKey];
result.push(index + ':{' + _encode(tpl[tplKey], objValue, definition) + '}');
}
}
}
}
}
return result.join(',');
}
function _decode(obj, tpl, definition) {
var result = {};
var objKey, objValue;
var tplKey, tplKeyClean, tplValue, index;
var counter, itemCount;
for (objKey in obj) {
if (obj.hasOwnProperty(objKey)) {
objValue = obj[objKey];
if (objValue != null) {
switch (Object.typeOf(objValue)) {
case 'array':
tplKey = _getKey(tpl, parseInt(objKey));
if (tplKey != null) {
tplKeyClean = _splitKeyIndex(tplKey).key; 
tplValue = tpl[tplKey].replace(/^array of /, ''); 
result[tplKeyClean] = [];
itemCount = objValue.length;
for (counter = 0; counter < itemCount; counter++) {
result[tplKeyClean].push(_decode(objValue[counter], definition[tplValue], definition));
}
}
break;
case 'object':
tplKey = _getKey(tpl, parseInt(objKey));
if (tplKey != null) {
tplKeyClean = _splitKeyIndex(tplKey).key; 
tplValue = tpl[tplKey];
switch (typeof tplValue) {
case 'string':
if (!(/^array of /.test(tplValue))) { result[tplKeyClean] = _decode(obj[objKey], definition[tplValue], definition); } 
break;
default: result[tplKeyClean] = _decode(obj[objKey], tpl[tplKey], definition);
}
}
break;
default:
tplKey = _getKey(tpl, parseInt(objKey));
if (tplKey != null) { result[tplKey] = typeof objValue == 'string' ? decodeURIComponent(objValue) : objValue; }
}
}
}
}
return result;
}
var _Widget = {
family: 'Widget',
options: {},
cookie: {
name: '',
originalName: '',
options: {},
data: {},
structure: {
definition: {},
template: {}
}
},
templateHost: '',
defaultLanguage: null,
defaultTemplate: null,
defaultTemplateHolder: null,
container: null,
content: null,
parserSettings: null,
toString: function () {
return '[object ' + this.family + ']';
},
Initialize: function (options) {
options = options || {};
options.cookie = options.cookie || {};
options.cookie.name = options.cookie.name || this.cookie.name;
this.SetOptions(options);
if (this.parserSettings == null) {
this.parserSettings = new Serializer.Settings();
this.parserSettings.SetPreProcessHook('ct:*', TemplateParser.hookHandler);
}
},
SetOptions: function (options) {
options = options || {};
Object.set(this.options, options);
this.options.client = this.options.client || '';
if (options.cookie && typeof options.cookie.name == 'string') {
this.cookie.name = options.cookie.name;
this.cookie.originalName = this.cookie.name; 
}
this.cookie.name = this.cookie.originalName + this.options.client; 
},
UseData: function (data) {
if (Object.typeOf(data) != 'object') {
return;
}
this.cookie.data = data;
},
UseContent: function (content) {
if (!Array.contains(['object', 'array', 'element'], Object.typeOf(content))) {
return;
}
this.content = content;
},
LoadContent: function (options) {
var fileUrl, templateData;
var loadLayout = false;
options = options || {};
options.client = options.client || Document.GetQuery('jsclient'); 
if (options.client != null) {
this.options.client = options.client;
if (this.cookie.originalName == this.cookie.name) { this.cookie.name += this.options.client; } 
}
options.language = options.language || Document.GetQuery('jslanguage') || this.defaultLanguage || null; 
options.template = options.template || Document.GetQuery('jstemplate') || this.defaultTemplate || null; 
if (options.template == null) { return false; }
options.targetElement = options.targetElement || document.body;
if (options.targetElement == null) { return false; }
this.GetCookie(); 
options.layout = options.layout || Array.contains(['yes', 'true'], Document.GetQuery('jslayout')) || loadLayout;
if (options.layout) {
this.LoadLayout({
client: options.client,
template: options.template
});
}
switch (typeof options.template) {
case 'string':
if (!Runtime.IsDeclared('FileLoader')) {
throw new Error('Missing FileLoader class definition');
return;
}
if (Document.GetQuery('jsnocache') == '') { templateData = (this.defaultTemplateHolder || 'RandomTemplateHolder') + new Date().getTime(); } 
else { templateData = templateData || options.templateHolder || this.defaultTemplateHolder || null; } 
fileUrl = '//' + this.templateHost + '/' + (options.client != null ? options.client + '/' : '') + 'tpl/' + (options.language != null ? options.language + '/' : '') + (templateData != null ? templateData + '/' : '') + options.template + '.js';
FileLoader.LoadJS(fileUrl, {
onload: function () {
if (window[templateData] == null) {
return;
}
this.UseContent(window[templateData]);
this.ParseContent(options.targetElement);
if (Object.typeOf(options.onload) == 'function') { options.onload(); }
} .bind(this),
onerror: function () {
if (Object.typeOf(options.onerror) == 'function') { options.onerror(); }
}
});
break;
default:
this.UseContent(options.template);
this.ParseContent(options.targetElement);
}
return true;
},
LoadLayout: function (options) {
var fileUrl;
options = options || {};
options.client = options.client || Document.GetQuery('jsclient'); 
options.template = options.template || Document.GetQuery('jstemplate') || this.defaultTemplate || null; 
if (options.template == null) { return false; }
if (!Runtime.IsDeclared('FileLoader')) {
throw new Error('Missing FileLoader class definition');
return;
}
if (typeof options.template == 'string') {
fileUrl = '//' + this.templateHost + '/mycontent/' + (options.client != null ? options.client + '/' : '') + options.template + '.css';
FileLoader.LoadCSS(fileUrl);
return true;
}
},
ClearContent: function () {
var children, counter;
if (this.container == null) { return; }
children = this.container.childNodes;
for (counter = children.length - 1; counter >= 0; counter--) {
Document.RemoveElement(children[counter]);
}
},
RefreshContent: function () {
this.GetCookie(); 
this.ClearContent(); 
this.ParseContent(); 
},
ParseContent: function (target) {
target = target || this.container || document.body;
if (Object.typeOf(target) != 'element') {
return;
}
if (!Runtime.IsDeclared('TemplateParser')) { return; }
this.container = target;
TemplateParser.UseSettings(this.parserSettings);
TemplateParser.ProcessTemplate(this.content, target, this.cookie.data);
},
EncodeCookie: function (data) {
return '{' + _encode(this.cookie.structure.template, data, this.cookie.structure.definition) + '}';
},
DecodeCookie: function (cookieString) {
var tempCookieData;
if (typeof cookieString == 'string') {
cookieString = cookieString.trim();
if (/^\{/.test(cookieString) && /\}$/.test(cookieString) && _validate(cookieString)) {
try { tempCookieData = eval('(' + cookieString + ')'); }
catch (e) { return null; }
return _decode(tempCookieData, this.cookie.structure.template, this.cookie.structure.definition);
}
}
return null;
},
SetCookie: function () {
var cookieString = this.EncodeCookie(this.cookie.data);
if (!Runtime.IsDeclared('Cookie')) {
throw new Error('Missing Cookie class definition!');
return;
}
Cookie.Write(this.cookie.name, cookieString, this.cookie.options);
},
GetCookie: function () {
var cookieString;
if (!Runtime.IsDeclared('Cookie')) {
throw new Error('Missing Cookie class definition!');
return;
}
cookieString = Cookie.Read(this.cookie.name);
this.cookie.data = this.DecodeCookie(cookieString) || {};
}
};
_Widget.Initialize(options);
return _Widget;
} ();
Runtime.Declare('Widget');

var ShoppingCartWidget;
(function () {
var _shoppingCartWidget = null;
ShoppingCartWidget = new Class(Widget, function(options) {
this.cookie.name = 'scd';
this.cookie.options = {
duration: 1
};
this.cookie.structure = {
definition: {
price: {
notZero: 0,
net: 1,
vat: 2,
gross: 3
},
itemprice: {
currencyId: 0,
vatPct: 1,
discountPct: 2,
unitPrice_3: 'price',
subtotal_4: 'price',
unitDiscount_5: 'price',
discount_6: 'price',
unitTotal_7: 'price',
total_8: 'price'
},
item: {
runningNo: 0,
position: 1,
positionTypeId: 2,
type: 3,
isOptional: 4,
isReadOnly: 5,
isHidden: 6,
isRemovable: 7,
isRefunded: 8,
isLod: 9,
allowZeroQuantity: 10,
data_11: {
quantity: 0,
potentialQuantity: 1,
productId: 2,
name: 3,
nameExtension: 4,
internalProductId: 5,
clientVatsetId: 6,
clientVatsetTypeId: 7,
refBundleRunningNo: 8,
refSubsellingRunningNo: 9,
refXsellingRunningNo: 10,
refUpsellingProductId: 11,
minQuantity: 12,
maxQuantity: 13,
jsCalculationMinQuantity: 14,
jsCalculationMaxQuantity: 15,
coupon: 16,
isCallYourPrice: 17,
isDynamicPrice: 18,
shipperServiceId: 19,
previousLicense: 20
},
prices_12: 'array of itemprice'
},
subtotalPrice: {
currencyId: 0,
clientVatsetTypeId: 1,
vatPct: 2,
discountPct: 3,
unitPrice_4: 'price',
subtotal_5: 'price',
unitDiscount_6: 'price',
discount_7: 'price',
unitTotal_8: 'price',
total_9: 'price'
},
shippingPrice: {
currencyId: 0,
clientVatsetTypeId: 1,
vatPct: 2,
discountPct: 3,
unitPrice_4: 'price',
subtotal_5: 'price',
unitDiscount_6: 'price',
discount_7: 'price',
unitTotal_8: 'price',
total_9: 'price'
},
totalPrice: {
currencyId: 0,
clientVatsetTypeId: 1,
vatPct: 2,
discountPct: 3,
unitPrice_4: 'price',
subtotal_5: 'price',
unitDiscount_6: 'price',
discount_7: 'price',
unitTotal_8: 'price',
total_9: 'price'
},
vatset: {
id: 0,
vatsetTypeId: 1
}
},
template: {
data_0: {
wwwSessionId: 0,
configurationClientId: 1,
currencyId: 2,
displayCurrencyId: 3,
businessmodelId: 4
},
items_1: 'array of item',
subtotals_2: 'array of subtotalPrice',
shippings_3: 'array of shippingPrice',
totals_4: 'array of totalPrice',
clientVatsets_5: 'array of vatset',
displayCurrencyInfo_6: {
precisionFactor: 0,
priceFormatString: 1,
floatPercentFormatString: 2,
intPercentFormatString: 3
},
shippingOptions: 7,
shippingNotes: 8
}
};
this.templateHost = 'static.cleverbridge.com';
this.defaultLanguage = 'en';
this.defaultTemplate = 'ShoppingCartWidget';
this.defaultTemplateHolder = 'CartWidgetTemplateHolder';
this.AddCartItem = function (action, options) {
function _prepareAction(action) {
var result = action;
var hashIndex;
var hashString = '';
action = action.trim();
hashIndex = action.indexOf('#');
if (hashIndex > -1) {
hashString = action.substring(hashIndex);
result = action.substring(0, hashIndex);
}
result += (result.indexOf('?') > -1 ? '&' : '?') + 'scope=cartjs&cookie=true';
result += '&' + new Date().getTime(); 
result += hashString;
return result;
}
options = options || {};
if (typeof action != 'string' || action.trim() == '') {
if (typeof options.onfailure == 'function') { options.onfailure(); }
return;
}
action = _prepareAction(action);
window.cbCart = null; 
FileLoader.LoadJS(action, {
onload: function () {
ShoppingCartWidget.SetRawCookie(window.cbCart);
if (typeof options.onsuccess == 'function') { options.onsuccess(); }
},
onerror: function () {
if (typeof options.onfailure == 'function') { options.onfailure(); }
}
});
};
this.Initialize(options);
_shoppingCartWidget = _shoppingCartWidget || this; 
return this;
});
ShoppingCartWidget.AddToCart = function (action) {
var event, triggerElement;
var formObject, formElement, formAction;
if (_shoppingCartWidget == null) { throw new TypeError('Please create a Shopping Cart Widget instance before calling AddToCart'); }
if (action == null) { throw new TypeError('AddToCart needs a valid action'); }
if (typeof action == 'string') {
action = action.trim();
if (action == '') { throw new TypeError('action must not be empty'); }
} else {
event = action;
triggerElement = event.originalTarget || event.target;
if (triggerElement == null) { throw new TypeError('trigger element is required but cannot be determined'); }
formObject = FormObject.Get(triggerElement);
if (formObject == null) { throw new TypeError('trigger element is not a valid form element'); }
formElement = formObject.GetForm();
if (formElement == null || !formElement.action) { throw new TypeError('form action is required but cannot be determined'); }
formAction = formElement.action;
action = formAction + (formAction.contains('?') ? '&' : '?') + FormObject.GetFormQueryString(formElement);
if (triggerElement.type == 'submit') { action += '&' + triggerElement.name + '=' + triggerElement.value; } 
if (event.stopPropagation) { event.stopPropagation(); }
event.cancelBubble = true;
if (event.preventDefault) { event.preventDefault(); }
event.returnValue = false;
}
_shoppingCartWidget.AddCartItem(action, {
onsuccess: function() {
_shoppingCartWidget.RefreshContent();
}
});
};
})();
(function () {
var _shoppingCartWidget = null;
ShoppingCartWidget.SetCookie = function (data, options) {
if (_shoppingCartWidget == null) { _shoppingCartWidget = new ShoppingCartWidget(options); }
else { _shoppingCartWidget.SetOptions(options); }
_shoppingCartWidget.UseData(data);
_shoppingCartWidget.SetCookie();
};
ShoppingCartWidget.GetCookie = function (options) {
if (_shoppingCartWidget == null) { _shoppingCartWidget = new ShoppingCartWidget(options); }
else { _shoppingCartWidget.SetOptions(options); }
_shoppingCartWidget.GetCookie();
return _shoppingCartWidget.cookie.data;
};
ShoppingCartWidget.SetRawCookie = function () {
function _cleanPrice(price) {
Object.forEach(price, function (subPrice, subPriceKey) {
subPrice.notZero = (subPrice.net + subPrice.vat + subPrice.gross > 0);
if (!subPrice.notZero) { delete price[subPriceKey]; }
else {
Object.forEach(subPrice, function (subPriceType, subPriceTypeKey) {
if (subPriceType == 0) { delete subPrice[subPriceTypeKey]; }
});
}
});
}
return function (cartData, options) {
var result;
var item, sourcePrice, price, subPrice;
var shipping, subtotal, total;
cartData = cartData || {};
options = options || {};
result = {
data: {},
items: [],
subtotals: [],
shippings: [],
totals: [],
clientVatsets: [],
displayCurrencyInfo: {
precisionFactor: cartData.precisionFactor,
priceFormatString: cartData.priceFormatString,
floatPercentFormatString: cartData.floatPercentFormatString,
intPercentFormatString: cartData.intPercentFormatString
}
};
if (cartData.enableWidgetCart !== true) { return; } 
Object.forEach(cartData.items, function (sourceItem) {
if (parseInt(sourceItem.quantity) == 0) { return; } 
item = {
runningNo: sourceItem.runningNo,
type: sourceItem.type,
isOptional: sourceItem.isOptional,
isReadOnly: sourceItem.isReadOnly,
isHidden: sourceItem.isHidden,
isRemovable: sourceItem.isRemovable,
data: {
name: sourceItem.name || '',
nameExtension: sourceItem.nameExtension || '',
quantity: sourceItem.quantity,
clientVatsetTypeId: sourceItem.clientVatSetTypeId
},
prices: []
};
sourcePrice = sourceItem.prices;
price = {
unitPrice: {
net: sourcePrice.unitPriceNet || 0,
vat: sourcePrice.unitPriceVat || 0,
gross: sourcePrice.unitPriceGross || 0
},
subtotal: {
net: sourcePrice.subTotalNet || 0,
vat: sourcePrice.subTotalVat || 0,
gross: sourcePrice.subTotalGross || 0
},
unitDiscount: {
net: sourcePrice.unitDiscountNet || 0,
vat: sourcePrice.unitDiscountVat || 0,
gross: sourcePrice.unitDiscountGross || 0
},
discount: {
net: sourcePrice.discountNet || 0,
vat: sourcePrice.discountVat || 0,
gross: sourcePrice.discountGross || 0
},
unitTotal: {
net: sourcePrice.unitTotalNet || 0,
vat: sourcePrice.unitTotalVat || 0,
gross: sourcePrice.unitTotalGross || 0
},
total: {
net: sourcePrice.totalNet || 0,
vat: sourcePrice.totalVat || 0,
gross: sourcePrice.totalGross || 0
}
};
_cleanPrice(price);
item.prices.push(price);
result.items.push(item);
});
Object.forEach(cartData.shippings, function (sourceShipping) {
sourcePrice = sourceShipping.prices;
shipping = {
total: {
net: sourcePrice.totalNet,
vat: sourcePrice.totalVat,
gross: sourcePrice.totalGross
}
};
_cleanPrice(shipping);
shipping.clientVatsetTypeId = sourceShipping.clientVatSetTypeId;
result.shippings.push(shipping);
});
Object.forEach(cartData.subtotals, function (sourceSubtotal) {
sourcePrice = sourceSubtotal.prices;
subtotal = {
total: {
net: sourcePrice.totalNet,
vat: sourcePrice.totalVat,
gross: sourcePrice.totalGross
}
};
_cleanPrice(subtotal);
subtotal.clientVatsetTypeId = sourceSubtotal.clientVatSetTypeId;
result.subtotals.push(subtotal);
});
Object.forEach(cartData.totals, function (sourceTotal) {
sourcePrice = sourceTotal.prices;
total = {
total: {
net: sourcePrice.totalNet,
vat: sourcePrice.totalVat,
gross: sourcePrice.totalGross
}
};
_cleanPrice(total);
total.clientVatsetTypeId = sourceTotal.clientVatSetTypeId;
result.totals.push(total);
});
options.client = cartData.clientId;
ShoppingCartWidget.SetCookie(result, options);
};
} ();
})();
Runtime.Declare('ShoppingCartWidget');

if (!PluginDetect) {
var PluginDetect = {
getNum: function (b, c) {
if (!this.num(b)) {
return null
}
var a;
if (typeof c == "undefined") {
a = /[\d][\d\.\_,-]*/.exec(b)
}
else {
a = (new RegExp(c)).exec(b)
}
return a ? a[0].replace(/[\.\_-]/g, ",") : null
}, hasMimeType: function (c) {
if (PluginDetect.isIE) { return null } var b, a, d, e = c.constructor == String ? [c] : c;
for (d = 0; d < e.length; d++) {
b = navigator.mimeTypes[e[d]];
if (b && b.enabledPlugin) {
a = b.enabledPlugin;
if (a.name || a.description) {
return b
}
}
}
return null
}
, findNavPlugin: function (g, d) {
var a = g.constructor == String ? g : g.join(".*"), e = d === false ? "" : "\\d", b, c = new RegExp(a + ".*" + e + "|" + e + ".*" + a, "i"), f = navigator.plugins;
for (b = 0; b < f.length; b++) {
if (c.test(f[b].description) || c.test(f[b].name)) {
return f[b]
}
}
return null
}
, AXO: window.ActiveXObject, getAXO: function (b, a) {
var f = null, d, c = false;
try {
f = new this.AXO(b);
c = true
}
catch (d) {
}
if (typeof a != "undefined") {
delete f;
return c
}
return f
}
, num: function (a) {
return (typeof a != "string" ? false : (/\d/).test(a))
}, compareNums: function (g, e) {
var d = this, c, b, a, f = window.parseInt;
if (!d.num(g) || !d.num(e)) {
return 0
}
if (d.plugin && d.plugin.compareNums) {
return d.plugin.compareNums(g, e)
}
c = g.split(",");
b = e.split(",");
for (a = 0; a < Math.min(c.length, b.length); a++) {
if (f(c[a], 10) > f(b[a], 10)) {
return 1
}
if (f(c[a], 10) < f(b[a], 10)) {
return -1
}
}
return 0
}
, formatNum: function (b) {
if (!this.num(b)) {
return null
}
var a, c = b.replace(/\s/g, "").replace(/[\.\_]/g, ",").split(",").concat(["0", "0", "0", "0"]);
for (a = 0; a < 4; a++) {
if (/^(0+)(.+)$/.test(c[a])) { c[a] = RegExp.$2 } 
} if (!(/\d/).test(c[0])) { c[0] = "0" } return c[0] + "," + c[1] + "," + c[2] + "," + c[3]
}, initScript: function () {
var $ = this, userAgent = navigator.userAgent;
$.isIE = /*@cc_on!@*/
false;
$.IEver = $.isIE && ((/MSIE\s*(\d\.?\d*)/i).exec(userAgent)) ? parseFloat(RegExp.$1, 10) : -1;
$.ActiveXEnabled = false;
if ($.isIE) {
var x, progid = ["Msxml2.XMLHTTP", "Msxml2.DOMDocument", "Microsoft.XMLDOM", "ShockwaveFlash.ShockwaveFlash", "TDCCtl.TDCCtl", "Shell.UIHelper", "Scripting.Dictionary", "wmplayer.ocx"];
for (x = 0; x < progid.length; x++) {
if ($.getAXO(progid[x], 1)) {
$.ActiveXEnabled = true;
break
}
}
$.head = typeof document.getElementsByTagName != "undefined" ? document.getElementsByTagName("head")[0] : null
}
$.isGecko = !$.isIE && typeof navigator.product == "string" && (/Gecko/i).test(navigator.product) && (/Gecko\s*\/\s*\d/i).test(userAgent) ? true : false;
$.GeckoRV = $.isGecko ? $.formatNum((/rv\s*\:\s*([\.\,\d]+)/i).test(userAgent) ? RegExp.$1 : "0.9") : null;
$.isSafari = !$.isIE && (/Safari\s*\/\s*\d/i).test(userAgent) ? true : false;
$.isChrome = (/Chrome\s*\/\s*\d/i).test(userAgent) ? true : false;
$.onWindowLoaded(0)
}
, init: function (c, a) {
if (typeof c != "string") {
return -3
}
c = c.toLowerCase().replace(/\s/g, "");
var b = this, d;
if (typeof b[c] == "undefined") {
return -3
}
d = b[c];
b.plugin = d;
if (typeof d.installed == "undefined" || a == true) {
d.installed = null;
d.version = null;
d.version0 = null;
d.getVersionDone = null;
d.$ = b
}
b.garbage = false;
if (b.isIE && !b.ActiveXEnabled) {
if (b.plugin != b.java) {
return -2
}
}
return 1
}
, isMinVersion: function (g, e, c, b) {
return -3
}
, getVersion: function (e, b, a) {
var d = PluginDetect, c = d.init(e), f;
if (c < 0) {
return null
}
f = d.plugin;
if (f.getVersionDone != 1) {
f.getVersion(b, a);
if (f.getVersionDone === null) {
f.getVersionDone = 1
}
}
d.cleanup();
return (f.version || f.version0);
;
return null
}
, getInfo: function (f, c, b) {
var a = {
};
;
return a
}
, cleanup: function () {
var a = this;
if (a.garbage && typeof window.CollectGarbage != "undefined") {
window.CollectGarbage()
}
}
, isActiveXObject: function (b) {
var d = this, a, g, f = "/", c = '<object width="1" height="1" style="display:none" ' + d.plugin.getCodeBaseVersion(b) + ">" + d.plugin.HTML + "<" + f + "object>";
if (d.head.firstChild) {
d.head.insertBefore(document.createElement("object"), d.head.firstChild)
}
else {
d.head.appendChild(document.createElement("object"))
}
d.head.firstChild.outerHTML = c;
try {
d.head.firstChild.classid = d.plugin.classID
}
catch (g) {
}
a = false;
try {
if (d.head.firstChild.object) {
a = true
}
}
catch (g) {
}
try {
if (a && d.head.firstChild.readyState < 4) {
d.garbage = true
}
}
catch (g) {
}
d.head.removeChild(d.head.firstChild);
return a;
}
, codebaseSearch: function (c) {
var e = this;
if (!e.ActiveXEnabled) {
return null
}
if (typeof c != "undefined") {
return e.isActiveXObject(c)
};
var j = [0, 0, 0, 0], g, f, b = e.plugin.digits, i = function (k, m) {
var l = (k == 0 ? m : j[0]) + "," + (k == 1 ? m : j[1]) + "," + (k == 2 ? m : j[2]) + "," + (k == 3 ? m : j[3]);
return e.isActiveXObject(l)
};
var h, d, a = false;
for (g = 0; g < b.length; g++) {
h = b[g] * 2;
j[g] = 0;
for (f = 0; f < 20; f++) {
if (h == 1 && g > 0 && a) {
break
}
if (h - j[g] > 1) {
d = Math.round((h + j[g]) / 2);
if (i(g, d)) {
j[g] = d;
a = true
}
else {
h = d
}
}
else {
if (h - j[g] == 1) {
h--;
if (!a && i(g, h)) {
a = true
}
break
}
else {
if (!a && i(g, h)) {
a = true
}
break
}
}
}
if (!a) {
return null
}
}
return j.join(",");
}
, dummy1: 0
}
}
PluginDetect.onDetectionDone = function (g, e, d, a) {
return -1
};
PluginDetect.onWindowLoaded = function (c) {
};
;
PluginDetect.quicktime = {
mimeType: ["video/quicktime", "application/x-quicktimeplayer", "image/x-macpaint", "image/x-quicktime"], progID: "QuickTimeCheckObject.QuickTimeCheck.1", progID0: "QuickTime.QuickTime", classID: "clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B", minIEver: 7, HTML: '<param name="src" value="A14999.mov" /><param name="controller" value="false" />', getCodeBaseVersion: function (a) {
return 'codebase="#version=' + a + '"'
}
, digits: [8, 64, 16, 0], clipTo3digits: function (f) {
if (f === null || typeof f == "undefined") {
return null
}
var e, d, h, g = this.$;
e = f.split(",");
if (g.compareNums(f, "7,60,0,0") < 0 && g.compareNums(f, "7,50,0,0") >= 0) {
d = e[0] + "," + e[1].charAt(0) + "," + e[1].charAt(1) + "," + e[2]
}
else {
d = e[0] + "," + e[1] + "," + e[2] + "," + e[3]
}
h = d.split(",");
return h[0] + "," + h[1] + "," + h[2] + ",0"
}
, getVersion: function () {
var a = null, d, b = this.$, e = true;
if (!b.isIE) {
if (navigator.platform && (/linux/i).test(navigator.platform)) { e = false } if (e) {
d = b.findNavPlugin(["QuickTime", "(Plug-in|Plugin)"]);
if (d && d.name && b.hasMimeType(this.mimeType)) {
a = b.getNum(d.name)
}
}
this.installed = a ? 1 : -1
}
else {
var c;
if (b.IEver >= this.minIEver && b.getAXO(this.progID0, 1)) {
a = b.codebaseSearch()
}
else {
c = b.getAXO(this.progID);
if (c && c.QuickTimeVersion) {
a = c.QuickTimeVersion.toString(16);
a = a.charAt(0) + "." + a.charAt(1) + "." + a.charAt(2)
}
}
this.installed = a ? 1 : (b.getAXO(this.progID0, 1) ? 0 : -1)
}
this.version = this.clipTo3digits(b.formatNum(a))
}
};
;
PluginDetect.devalvr = {
mimeType: "application/x-devalvrx", progID: "DevalVRXCtrl.DevalVRXCtrl.1", classID: "clsid:5D2CF9D0-113A-476B-986F-288B54571614", getVersion: function () {
var a = null, g, c = this.$, f;
if (!c.isIE) {
g = c.findNavPlugin("DevalVR");
if (g && g.name && c.hasMimeType(this.mimeType)) {
a = g.description.split(" ")[3]
}
this.installed = a ? 1 : -1
}
else {
var b, h, d;
h = c.getAXO(this.progID, 1);
if (h) {
b = c.instantiate("object", ["classid", this.classID], ["src", ""]);
d = c.getObject(b);
if (d) {
try {
if (d.pluginversion) {
a = "00000000" + d.pluginversion.toString(16);
a = a.substr(a.length - 8, 8);
a = parseInt(a.substr(0, 2), 16) + "," + parseInt(a.substr(2, 2), 16) + "," + parseInt(a.substr(4, 2), 16) + "," + parseInt(a.substr(6, 2), 16)
}
}
catch (f) {
}
}
c.uninstantiate(b)
}
this.installed = a ? 1 : (h ? 0 : -1)
}
this.version = c.formatNum(a)
}
};
;
PluginDetect.flash = {
mimeType: ["application/x-shockwave-flash", "application/futuresplash"], progID: "ShockwaveFlash.ShockwaveFlash", classID: "clsid:D27CDB6E-AE6D-11CF-96B8-444553540000", getVersion: function () {
var c = function (i) {
if (!i) {
return null
}
var e = /[\d][\d\,\.\s]*[rRdD]{0,1}[\d\,]*/.exec(i);
return e ? e[0].replace(/[rRdD\.]/g, ",").replace(/\s/g, "") : null
};
var j, g = this.$, h, f, b = null, a = null, d = null;
if (!g.isIE) {
j = g.findNavPlugin("Flash");
if (j && j.description && g.hasMimeType(this.mimeType)) {
b = c(j.description)
}
}
else {
for (f = 15; f > 2; f--) {
a = g.getAXO(this.progID + "." + f);
if (a) {
d = f.toString();
break
}
}
if (d == "6") {
try {
a.AllowScriptAccess = "always"
}
catch (h) {
return "6,0,21,0"
}
}
try {
b = c(a.GetVariable("$version"))
}
catch (h) {
}
if (!b && d) {
b = d
}
}
this.installed = b ? 1 : -1;
this.version = g.formatNum(b);
return true
}
};
;
PluginDetect.shockwave = {
mimeType: "application/x-director", progID: "SWCtl.SWCtl", classID: "clsid:166B1BCA-3F9C-11CF-8075-444553540000", getVersion: function () {
var a = null, b = null, f, d, c = this.$;
if (!c.isIE) {
d = c.findNavPlugin("Shockwave for Director");
if (d && d.description && c.hasMimeType(this.mimeType)) {
a = c.getNum(d.description)
}
}
else {
try {
b = c.getAXO(this.progID).ShockwaveVersion("")
}
catch (f) {
}
if (typeof b == "string" && b.length > 0) {
a = c.getNum(b)
}
else {
if (c.getAXO(this.progID + ".8", 1)) {
a = "8"
}
else {
if (c.getAXO(this.progID + ".7", 1)) {
a = "7"
}
else {
if (c.getAXO(this.progID + ".1", 1)) {
a = "6"
}
}
}
}
}
this.installed = a ? 1 : -1;
this.version = c.formatNum(a)
}
};
;
PluginDetect.div = null;
PluginDetect.pluginSize = 1;
PluginDetect.DOMbody = null;
PluginDetect.uninstantiate = function (a) {
var c, b = this;
if (!a) {
return
}
try {
if (a[0] && a[0].firstChild) {
a[0].removeChild(a[0].firstChild)
}
if (a[0] && b.div) {
b.div.removeChild(a[0])
}
if (b.div && b.div.childNodes.length == 0) {
b.div.parentNode.removeChild(b.div);
b.div = null;
if (b.DOMbody && b.DOMbody.parentNode) {
b.DOMbody.parentNode.removeChild(b.DOMbody)
}
b.DOMbody = null
}
a[0] = null
}
catch (c) {
}
};
PluginDetect.getObject = function (b, a) {
var f, c = this, d = null;
try {
if (b && b[0] && b[0].firstChild) {
d = b[0].firstChild
}
}
catch (f) {
}
try {
if (a && d && typeof d.focus != "undefined" && typeof document.hasFocus != "undefined" && !document.hasFocus()) {
d.focus()
}
}
catch (f) {
}
return d
};
PluginDetect.getContainer = function (a) {
var c, b = null;
if (a && a[0]) {
b = a[0]
}
return b
};
PluginDetect.hideObject = function (a) {
var b = this.getObject(a);
if (b && b.style) {
b.style.height = "0"
}
};
PluginDetect.instantiate = function (h, b, c, a) {
var j = function (d) {
var e = d.style;
if (!e) {
return
}
e.border = "0px";
e.padding = "0px";
e.margin = "0px";
e.fontSize = (g.pluginSize + 3) + "px";
e.height = (g.pluginSize + 3) + "px";
e.visibility = "visible";
if (d.tagName && d.tagName.toLowerCase() == "div") {
e.width = "100%";
e.display = "block"
}
else {
if (d.tagName && d.tagName.toLowerCase() == "span") {
e.width = g.pluginSize + "px";
e.display = "inline"
}
}
};
var k, l = document, g = this, p, i = (l.getElementsByTagName("body")[0] || l.body), o = l.createElement("span"), n, f, m = "/";
if (typeof a == "undefined") {
a = ""
}
p = "<" + h + ' width="' + g.pluginSize + '" height="' + g.pluginSize + '" ';
for (n = 0; n < b.length; n = n + 2) {
p += b[n] + '="' + b[n + 1] + '" '
}
p += ">";
for (n = 0; n < c.length; n = n + 2) {
p += '<param name="' + c[n] + '" value="' + c[n + 1] + '" />'
}
p += a + "<" + m + h + ">";
if (!g.div) {
g.div = l.createElement("div");
f = l.getElementById("plugindetect");
if (f) {
j(f);
f.appendChild(g.div)
}
else {
if (i) {
try {
if (i.firstChild && typeof i.insertBefore != "undefined") {
i.insertBefore(g.div, i.firstChild)
}
else {
i.appendChild(g.div)
}
}
catch (k) {
}
}
else {
try {
l.write('<div id="pd33993399">o<' + m + "div>");
i = (l.getElementsByTagName("body")[0] || l.body);
i.appendChild(g.div);
i.removeChild(l.getElementById("pd33993399"))
}
catch (k) {
try {
g.DOMbody = l.createElement("body");
l.getElementsByTagName("html")[0].appendChild(g.DOMbody);
g.DOMbody.appendChild(g.div)
}
catch (k) {
}
}
}
}
j(g.div)
}
if (g.div && g.div.parentNode && g.div.parentNode.parentNode) {
g.div.appendChild(o);
try {
o.innerHTML = p
}
catch (k) {
}
j(o);
return [o]
}
return [null]
};
;
PluginDetect.windowsmediaplayer = {
mimeType: ["application/x-mplayer2", "application/asx"], progID: "wmplayer.ocx", classID: "clsid:6BF52A52-394A-11D3-B153-00C04F79FAA6", getVersion: function () {
var a = null, e = this.$, b = null;
this.installed = -1;
if (!e.isIE) {
if (e.hasMimeType(this.mimeType)) {
if (e.findNavPlugin(["Windows", "Media", "(Plug-in|Plugin)"], false) || e.findNavPlugin(["Flip4Mac", "Windows", "Media"], false)) {
this.installed = 0
}
var d = e.isGecko && e.compareNums(e.GeckoRV, e.formatNum("1.8")) < 0;
if (!d && e.findNavPlugin(["Windows", "Media", "Firefox Plugin"], false)) {
var c = e.instantiate("object", ["type", this.mimeType[0]], []), f = e.getObject(c);
if (f) {
a = f.versionInfo
}
e.uninstantiate(c)
}
}
}
else {
b = e.getAXO(this.progID);
if (b) {
a = b.versionInfo
}
}
if (a) {
this.installed = 1
}
this.version = e.formatNum(a)
}
};
;
PluginDetect.silverlight = {
mimeType: "application/x-silverlight", progID: "AgControl.AgControl", digits: [9, 20, 9, 12, 31], getVersion: function () {
var c = this.$, j = document, g = null, b = null, f = false;
if (!c.isIE) {
var a = [null, null], e = c.findNavPlugin("Silverlight Plug-in", false), h = c.isGecko && c.compareNums(c.GeckoRV, c.formatNum("1.6")) <= 0;
if (e && c.hasMimeType(this.mimeType)) {
g = c.formatNum(e.description);
if (g) {
p = g.split(",");
if (parseInt(p[2], 10) >= 30226 && parseInt(p[0], 10) < 2) {
p[0] = "2"
}
g = p.join(",")
}
if (c.isGecko && !h) {
f = true
}
if (!f && !h && g) {
a = c.instantiate("object", ["type", this.mimeType], []);
b = c.getObject(a);
if (b) {
if (typeof b.IsVersionSupported != "undefined") {
f = true
}
if (!f) {
b.data = "data:" + this.mimeType + ",";
if (typeof b.IsVersionSupported != "undefined") {
f = true
}
}
}
c.uninstantiate(a)
}
}
}
else {
b = c.getAXO(this.progID);
var p = [1, 0, 1, 1, 1], l, k, o, i = function (d) {
return (d < 10 ? "0" : "") + d.toString()
}
, m = function (q, d, s, t, r) {
return (q + "." + d + "." + s + i(t) + i(r) + ".0")
}
, n = function (d, s) {
var q, r = m((d == 0 ? s : p[0]), (d == 1 ? s : p[1]), (d == 2 ? s : p[2]), (d == 3 ? s : p[3]), (d == 4 ? s : p[4]));
try {
return b.IsVersionSupported(r)
}
catch (q) {
}
return false
};
if (b && typeof b.IsVersionSupported != "undefined") {
for (l = 0; l < this.digits.length; l++) {
o = p[l];
for (k = o + (l == 0 ? 0 : 1); k <= this.digits[l]; k++) {
if (n(l, k)) {
f = true;
p[l] = k
}
else {
break
}
}
if (!f) {
break
}
}
if (f) {
g = m(p[0], p[1], p[2], p[3], p[4])
}
}
}
this.installed = f ? 1 : -1;
this.version = c.formatNum(g)
}
};
;

function IPluginDetect() {
PluginDetect.initScript();
return this;
}
IPluginDetect.prototype.GetFlashVersion = function () {
return PluginDetect.getVersion('Flash');
}
IPluginDetect.prototype.GetQuickTimeVersion = function () {
return PluginDetect.getVersion('QuickTime');
}
IPluginDetect.prototype.GetShockwaveVersion = function () {
return PluginDetect.getVersion('Shockwave');
}
IPluginDetect.prototype.GetWindowsMediaPlayerVersion = function () {
return PluginDetect.getVersion('WindowsMediaPlayer');
}
IPluginDetect.prototype.GetSilverlightVersion = function () {
return PluginDetect.getVersion('Silverlight');
}
IPluginDetect.prototype.GetVersionsAsQueryString = function () {
var kv = { 1: "Flash", 2: "QuickTime", 3: "Shockwave", 4: "WindowsMediaPlayer", 5: "Silverlight" }
var s = "";
for (id in kv) {
s += "&" + id + "=" + PluginDetect.getVersion(kv[id]);
}
return s;
}

window.ZeroClipboard = {
version: "1.0.8",
clients: {}, 
moviePath: 'ZeroClipboard.swf', 
nextId: 1, 
$: function(thingy) {
if (typeof(thingy) == 'string') thingy = document.getElementById(thingy);
if (!thingy.addClass) {
thingy.hide = function() { this.style.display = 'none'; };
thingy.show = function() { this.style.display = ''; };
thingy.addClass = function(name) { this.removeClass(name); this.className += ' ' + name; };
thingy.removeClass = function(name) {
var classes = this.className.split(/\s+/);
var idx = -1;
for (var k = 0; k < classes.length; k++) {
if (classes[k] == name) { idx = k; k = classes.length; }
}
if (idx > -1) {
classes.splice( idx, 1 );
this.className = classes.join(' ');
}
return this;
};
thingy.hasClass = function(name) {
return !!this.className.match( new RegExp("\\s*" + name + "\\s*") );
};
}
return thingy;
},
setMoviePath: function(path) {
this.moviePath = path;
},
newClient: function() {
return new ZeroClipboard.Client();
},
dispatch: function(id, eventName, args) {
var client = this.clients[id];
if (client) {
client.receiveEvent(eventName, args);
}
},
register: function(id, client) {
this.clients[id] = client;
},
getDOMObjectPosition: function(obj, stopObj) {
var info = {
left: 0,
top: 0,
width: obj.width ? obj.width : obj.offsetWidth,
height: obj.height ? obj.height : obj.offsetHeight
};
while (obj && (obj != stopObj)) {
info.left += obj.offsetLeft;
info.left += obj.style.borderLeftWidth ? parseInt(obj.style.borderLeftWidth) : 0;
info.top += obj.offsetTop;
info.top += obj.style.borderTopWidth ? parseInt(obj.style.borderTopWidth) : 0;
obj = obj.offsetParent;
}
return info;
},
Client: function(elem) {
this.handlers = {};
this.id = ZeroClipboard.nextId++;
this.movieId = 'ZeroClipboardMovie_' + this.id;
ZeroClipboard.register(this.id, this);
if (elem) this.glue(elem);
}
};
ZeroClipboard.Client.prototype = {
id: 0, 
title: "", 
ready: false, 
movie: null, 
clipText: '', 
handCursorEnabled: true, 
cssEffects: true, 
handlers: null, 
zIndex: 99, 
glue: function(elem, appendElem, stylesToAdd) {
this.domElement = ZeroClipboard.$(elem);
if (this.domElement.style.zIndex) {
this.zIndex = parseInt(this.domElement.style.zIndex, 10) + 1;
}
if (this.domElement.getAttribute("title") != null) {
this.title = this.domElement.getAttribute("title");
}
if (typeof(appendElem) == 'string') {
appendElem = ZeroClipboard.$(appendElem);
}
else if (typeof(appendElem) == 'undefined') {
appendElem = document.getElementsByTagName('body')[0];
}
var box = ZeroClipboard.getDOMObjectPosition(this.domElement, appendElem);
this.div = document.createElement('div');
var style = this.div.style;
style.position = 'absolute';
style.left = '' + box.left + 'px';
style.top = '' + box.top + 'px';
style.width = '' + box.width + 'px';
style.height = '' + box.height + 'px';
style.zIndex = this.zIndex;
if (typeof(stylesToAdd) == 'object') {
for (var addedStyle in stylesToAdd) {
style[addedStyle] = stylesToAdd[addedStyle];
}
}
appendElem.appendChild(this.div);
this.div.innerHTML = this.getHTML( box.width, box.height );
},
getHTML: function(width, height) {
var html = '';
var flashvars = 'id=' + this.id +
'&width=' + width +
'&height=' + height,
title = this.title ? ' title="' + this.title + '"' : '';
if (navigator.userAgent.match(/MSIE/)) {
var protocol = location.href.match(/^https/i) ? 'https://' : 'http://';
html += '<object' + title + ' classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="'+protocol+'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="'+width+'" height="'+height+'" id="'+this.movieId+'"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="'+ZeroClipboard.moviePath+'" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="'+flashvars+'"/><param name="wmode" value="transparent"/></object>';
}
else {
html += '<embed' + title + ' id="'+this.movieId+'" src="'+ZeroClipboard.moviePath+'" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="'+width+'" height="'+height+'" name="'+this.movieId+'" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="'+flashvars+'" wmode="transparent" />';
}
return html;
},
hide: function() {
if (this.div) {
this.div.style.left = '-2000px';
}
},
show: function() {
this.reposition();
},
destroy: function() {
if (this.domElement && this.div) {
this.hide();
this.div.innerHTML = '';
var body = document.getElementsByTagName('body')[0];
try { body.removeChild( this.div ); } catch(e) {}
this.domElement = null;
this.div = null;
}
},
reposition: function(elem) {
if (elem) {
this.domElement = ZeroClipboard.$(elem);
if (!this.domElement) this.hide();
}
if (this.domElement && this.div) {
var box = ZeroClipboard.getDOMObjectPosition(this.domElement);
var style = this.div.style;
style.left = '' + box.left + 'px';
style.top = '' + box.top + 'px';
}
},
setText: function(newText) {
this.clipText = newText;
if (this.ready) this.movie.setText(newText);
},
setTitle: function(newTitle) {
this.title = newTitle;
if (this.ready && this.movie.setTitle) { this.movie.setTitle(newTitle); } 
},
addEventListener: function(eventName, func) {
eventName = eventName.toString().toLowerCase().replace(/^on/, '');
if (!this.handlers[eventName]) this.handlers[eventName] = [];
this.handlers[eventName].push(func);
},
setHandCursor: function(enabled) {
this.handCursorEnabled = enabled;
if (this.ready) this.movie.setHandCursor(enabled);
},
setCSSEffects: function(enabled) {
this.cssEffects = !!enabled;
},
receiveEvent: function(eventName, args) {
eventName = eventName.toString().toLowerCase().replace(/^on/, '');
switch (eventName) {
case 'load':
this.movie = document.getElementById(this.movieId);
if (!this.movie) {
var self = this;
setTimeout( function() { self.receiveEvent('load', null); }, 1 );
return;
}
if (!this.ready && navigator.userAgent.match(/Firefox/) && navigator.userAgent.match(/Windows/)) {
var self = this;
setTimeout( function() { self.receiveEvent('load', null); }, 100 );
this.ready = true;
return;
}
this.ready = true;
this.movie.setText( this.clipText );
if (this.movie.setTitle) { this.movie.setTitle(this.title); } 
this.movie.setHandCursor( this.handCursorEnabled );
break;
case 'mouseover':
if (this.domElement && this.cssEffects) {
this.domElement.addClass('hover');
if (this.recoverActive) this.domElement.addClass('active');
}
break;
case 'mouseout':
if (this.domElement && this.cssEffects) {
this.recoverActive = false;
if (this.domElement.hasClass('active')) {
this.domElement.removeClass('active');
this.recoverActive = true;
}
this.domElement.removeClass('hover');
}
break;
case 'mousedown':
if (this.domElement && this.cssEffects) {
this.domElement.addClass('active');
}
break;
case 'mouseup':
if (this.domElement && this.cssEffects) {
this.domElement.removeClass('active');
this.recoverActive = false;
}
break;
} 
if (this.handlers[eventName]) {
for (var idx = 0, len = this.handlers[eventName].length; idx < len; idx++) {
var func = this.handlers[eventName][idx];
if (typeof(func) == 'function') {
func(this, args);
}
else if ((typeof(func) == 'object') && (func.length == 2)) {
func[0][ func[1] ](this, args);
}
else if (typeof(func) == 'string') {
window[func](this, args);
}
} 
} 
}
};
if (typeof module !== "undefined") {
module.exports = ZeroClipboard;
}

(function () {
function _prepare() {
ZeroClipboard.setMoviePath('/mycontent/1/ZeroClipboard.swf');
}
function _readContentProvider(provider) {
var result = ' ';
var providerTag = provider.nodeName.toLowerCase();
var keys;
if (Array.contains(['input', 'textarea'], providerTag)) { return provider.value; } 
keys = provider.getElementsByTagName('input');
if (keys && keys.length > 0) {
Array.from(keys).forEach(function (keyItem) {
if (Document.GetElementAttribute(keyItem, 'type') == 'radio' && Document.GetElementAttribute(keyItem, 'checked')) {
result = keyItem.value;
}
});
} else {
result = Document.GetElementAttribute(provider, 'text'); 
}
return result;
}
function _selectContentProvider(contentProvider) {
var selectedKeyItem = contentProvider;
var keys = contentProvider.getElementsByTagName('input');
if (keys.length> 0) {
Array.from(keys).forEach(function (keyItem) {
if (Document.GetElementAttribute(keyItem, 'type') == 'radio' && Document.GetElementAttribute(keyItem, 'checked')) {
selectedKeyItem = Document.GetElement('LabelFor' + Document.GetElementAttribute(keyItem, 'id'));
}
});
}
if (selectedKeyItem) {
Document.SelectElement(selectedKeyItem);
}
}
function _setShadowLabel(shadow, label) {
var labelBackup, shadowChildren;
var shadowTag = shadow.nodeName.toLowerCase();
if (label == null) { return null; }
if (Array.contains(['input', 'textarea'], shadowTag)) {
labelBackup = shadow.value; 
shadow.value = label; 
}
else {
labelBackup = shadow.innerHTML; 
shadowChildren = shadow.getElementsByTagName('span');
if (shadowChildren.length > 0) {
shadowChildren[0].innerHTML = label; 
} else {
shadow.innerHTML = label; 
}
}
return labelBackup;
}
function _setShadowTitle(shadow, title) {
var titleBackup;
if (title == null) { return null; }
titleBackup = shadow.title; 
shadow.title = title; 
return titleBackup;
}
function _cleanUp(clip, shadow, label, title, refreshTimer, restoreTimer) {
var movieElement = Document.GetElement(clip.movieId);
if (movieElement == null) { return; }
Document.RemoveElement(movieElement.parentNode);
_setShadowLabel(shadow, label); 
_setShadowTitle(shadow, title); 
clearInterval(refreshTimer);
clearTimeout(restoreTimer);
}
function _throwArgumentError(message) {
if (!_ignoreArgumentErrors) { throw new TypeError(message); }
}
function _prepareCopyData(identifier) {
var dataContainer = Document.GetElement('CopyData' + identifier);
var data, dataItems;
var infoContainer;
if (dataContainer) {
data = Document.GetElementAttribute(dataContainer, 'html');
dataItems = data.split(/<br>|<br\/>/i);
if (dataItems.length > 1) {
Document.SetElementAttribute(dataContainer, 'html', '');
dataItems.forEach(function (item, index) {
var itemContainer = Document.CreateElement('div', {
'class': 'radio'
});
Document.CreateElement('input', {
id: 'CopyDataValue' + identifier + '_' + index,
type: 'radio',
name: 'CopyDataValue' + identifier,
value: item,
'class': 'inputRadio',
targetElement: itemContainer
});
Document.CreateElement('label', {
id: 'LabelForCopyDataValue' + identifier + '_' + index,
'for': 'CopyDataValue' + identifier + '_' + index,
text: item,
targetElement: itemContainer
});
Document.AddElementToDOM(itemContainer, dataContainer);
});
infoContainer = Document.GetElement('CopyListInfo' + identifier);
if (infoContainer) { Document.RemoveElementClass(infoContainer, 'CBJSFold'); }
}
}
}
function _addWindowListener(listener) {
if (Object.typeOf(listener) != 'eventlistener') { return; }
listener.dispatcher = function (evt) {
listener.handler(new EventTrigger(evt));
};
if (window.attachEvent && window.addEventListener) { window.attachEvent(listener.type, listener.dispatcher); }
if (window.addEventListener) { window.addEventListener(listener.type, listener.dispatcher, true); }
else if (window.attachEvent) { window.attachEvent('on' + listener.type, listener.dispatcher); }
}
var _firstUse = true;
var _movieLoadingTimeout = 5000;
var _movieRepositionInterval = 1000;
var _windowResizeTimeout = 500;
var _ignoreArgumentErrors = true;
Document.CreateCopyButton = function (shadowElement, shadowContainer, contentProvider, options) {
function _activateClip() {
clip.show();
}
function _handleWindowResize() {
clip.hide();
clearTimeout(windowResizeTimer);
windowResizeTimer = setTimeout(_activateClip, _windowResizeTimeout);
}
var allOk = false;
var clip, clipRefreshTimer, clipRestoreTimer, windowResizeTimer;
var shadowTitleBackup, shadowLabelBackup, usePointer;
if (arguments.length < 3) {
_throwArgumentError('CreateCopyButton requires more than ' + arguments.length + ' arguments');
return false;
}
shadowElement = Document.GetElement(shadowElement);
if (shadowElement == null) {
_throwArgumentError('Copy element shadow is not valid');
return false;
}
contentProvider = Document.GetElement(contentProvider);
if (contentProvider == null) {
_throwArgumentError('Copy element content provider is not valid');
return false;
}
shadowContainer = Document.GetElement(shadowContainer);
if (shadowContainer == null) { shadowContainer = shadowElement.parentNode; } 
Document.RemoveElementClass(shadowContainer, 'CBJSFold'); 
if (!Utils.CheckFeature('flash')) {
NodeObject.Get(shadowElement).AddListener(new Listener('click', function() {
_selectContentProvider(contentProvider);
}));
return true;
}
options = options || {};
usePointer = options.usePointer != null ? !!options.usePointer : true;
shadowTitleBackup = _setShadowTitle(shadowElement, options.shadowTitle); 
shadowLabelBackup = _setShadowLabel(shadowElement, options.shadowLabel); 
if (_firstUse) {
_firstUse = false;
_prepare();
}
clip = new ZeroClipboard.Client(); 
clip.setHandCursor(usePointer); 
clip.cssEffects = false; 
clip.addEventListener('load', function (client) {
allOk = true;
if (options.onready) { options.onready(client); }
});
clip.addEventListener('error', function (client) {
allOk = false;
_cleanUp(client, shadowElement, shadowLabelBackup, shadowTitleBackup);
if (options.onerror) { options.onerror(client); }
});
clip.addEventListener('cancel', function (client) {
allOk = false;
_cleanUp(client, shadowElement, shadowLabelBackup, shadowTitleBackup);
if (options.onerror) { options.onerror(client); }
});
clip.addEventListener('mouseOver', function (client) {
clip.setText(_readContentProvider(contentProvider)); 
if (options.onhover) { options.onhover(client); }
});
clip.addEventListener('mouseOut', function (client) {
if (options.onleave) { options.onleave(client); }
});
clip.addEventListener('mouseDown', function (client) {
if (options.onpress) { options.onpress(client); }
});
clip.addEventListener('mouseUp', function (client) {
if (options.onrelease) { options.onrelease(client); }
});
clip.addEventListener('complete', function (client, content) {
if (options.oncopy) { options.oncopy(client, content); }
});
clip.glue(shadowElement); 
clipRefreshTimer = setInterval(function () {
clip.reposition(); 
}, _movieRepositionInterval);
clipRestoreTimer = setTimeout(function () {
if (!allOk) { _cleanUp(clip, shadowElement, shadowLabelBackup, shadowTitleBackup, clipRefreshTimer, clipRestoreTimer); } 
}, _movieLoadingTimeout);
_addWindowListener(new Listener('resize', _handleWindowResize)); 
return true; 
};
Document.UseCopyButton = function (condition, identifier, options) {
var _condition, _identifier, _options;
if (arguments.length < 2) {
_throwArgumentError('UseCopyButton requires more than ' + arguments.length + ' arguments');
return false;
}
if (arguments.length == 2) {
_identifier = condition || '';
_options = identifier;
if (Object.typeOf(_options) != 'object') {
_throwArgumentError('Second argument must be a object');
return false;
}
_options = _options || {};
_condition = _options.condition || '';
} else {
_condition = condition || '';
_identifier = identifier || '';
_options = options || {};
}
if (typeof _condition != 'string') {
_throwArgumentError('condition must be a string');
return false;
}
if (typeof _identifier != 'string') {
_throwArgumentError('identifier must be a string');
return false;
}
DomLoaded.Load(function () {
var suffix = _identifier + Runtime.GetUniqueId('_', 5);
if (!_condition || _condition && _condition.toLowerCase() == 'yes') {
delete _options.condition;
var copyButtonElement = Document.GetElement('CopyButton' + _identifier);
var copyAreaElement = Document.GetElement('CopyArea' + _identifier);
var copyDataElement = Document.GetElement('CopyData' + _identifier);
if (copyButtonElement == null || copyAreaElement == null || copyDataElement == null) {
throw new Error('Missing copy button elements (' + _identifier + ')');
}
copyButtonElement.id = 'CopyButton' + suffix;
copyAreaElement.id = 'CopyArea' + suffix;
copyDataElement.id = 'CopyData' + suffix;
if (Document.CreateCopyButton(copyButtonElement, copyAreaElement, copyDataElement, _options)) {
_prepareCopyData(suffix);
}
} else {
var copyInfoElement = Document.GetElement('CopyInfo' + _identifier);
if (copyInfoElement != null) {
copyInfoElement.id = 'CopyInfo' + suffix;
Document.RemoveElementClass(copyInfoElement, 'CBJSFold');
}
}
var copyListInfoElement = Document.GetElement('CopyListInfo' + _identifier);
if (copyListInfoElement != null) {
copyListInfoElement.id = 'CopyListInfo' + suffix;
}
});
return true;
};
Document.SelectElement = function (element) {
var elementTag;
var selection, range;
element = this.GetElement(element);
if (!element) {
_throwArgumentError('SelectElement requires a valid element');
return;
}
element.focus(); 
elementTag = element.nodeName.toLowerCase();
if (elementTag == 'textarea' || elementTag == 'input' && Document.GetElementAttribute(element, 'type') == 'text') {
element.select(); 
return;
}
selection = window.getSelection && window.getSelection();
range = document.createRange && document.createRange() || document.body.createTextRange && document.body.createTextRange();
if (range.moveToElementText && range.select) {
range.moveToElementText(element);
range.select();
} else if (range.selectNodeContents && selection.removeAllRanges && selection.addRange) {
range.selectNodeContents(element);
selection.removeAllRanges();
selection.addRange(range);
} else {
selection.getBaseAndExtent && selection.setBaseAndExtent(element, 0, element, 1);
}
};
})();

document.write('<style type="text/css">div.CBNoJSFold{display: block; visibility: visible;}</style>');
function cbKeyInteractLabel(params) {
var label = Document.GetElement(params.targetId);
var triggerElement = Document.GetElement(params.trigger ? params.trigger.element : null);
var value;
if (triggerElement && label) {
value = triggerElement.value || '';
if (value.length > 0) { cbFold({ trigger: params.trigger, targetId: params.targetId }); }
}
}
function cbChangeInteractLabel(params) {
var label = Document.GetElement(params.targetId);
var triggerElement = Document.GetElement(params.trigger ? params.trigger.element : null);
var value;
if (triggerElement && label) {
value = triggerElement.value || '';
if (value.length > 0) { cbFold({ trigger: params.trigger, targetId: params.targetId }); }
else { cbDisplay({ trigger: params.trigger, targetId: params.targetId }); }
}
}
function cbFocusInteractLabel(params) {
var label = Document.GetElement(params.targetId);
var triggerElement = Document.GetElement(params.trigger ? params.trigger.element : null);
if (triggerElement && label) { Document.AddElementClass(label, 'CBJSFocusInteractLabel'); }
}
function cbBlurInteractLabel(params) {
var label = Document.GetElement(params.targetId);
var triggerElement = Document.GetElement(params.trigger ? params.trigger.element : null);
var value;
if (triggerElement && label) {
Document.RemoveElementClass(label, 'CBJSFocusInteractLabel');
value = triggerElement.value || '';
if (value.length == 0) { cbDisplay({ trigger: params.trigger, targetId: params.targetId }); }
}
}
function cbFormObjectLayer(params) {
var contentDirection;
var no = params.trigger && params.trigger.element != null ? NodeObject.Get(params.trigger.element) : null;
var evtType = params.trigger.type.toLowerCase();
if (params.layerId && no != null) {
var l = Layer.Get(params.layerId);
contentDirection = params.contentDirection || Runtime.Get('ContentDirection');
if (contentDirection) { l.SetContentDirection(contentDirection); }
cbHide({ node: l.element });
l.ForceTopLevel();
var e = Effect.Get(params.layerId);
no.addedMouseOutListener = no.addedMouseOutListener ? no.addedMouseOutListener : false;
var fo = FormObject.Get(no.element);
if (fo != null) {
if (no.element.value) {
no.erroneousValue = no.element.value;
}
no.addedBlurListener = no.addedBlurListener ? no.addedBlurListener : false;
if (!no.addedBlurListener && evtType == "focus") {
var bcl = new Listener("blur", function (trigger) {
var noTriggerElement = NodeObject.Get(trigger.element);
cbHide({ node: l.element });
noTriggerElement.focused = false;
if (trigger.element.value && trigger.element.value.length > 0 && trigger.element.value != noTriggerElement.erroneousValue) {
noTriggerElement.errorHandled = true;
trigger.element.className = trigger.element.className.replace("CBError", "CBJSErrorHandled");
}
else {
if (noTriggerElement.mouseOverArea != null) {
cbDisplay({ node: noTriggerElement.mouseOverArea });
}
}
});
no.AddListener(bcl);
no.addedBlurListener = false;
}
if (fo.IsTypeOf("select") && !no.addedChangeListener) {
var ccl = new Listener("change", function (trigger) {
var noTriggerElement = NodeObject.Get(trigger.element);
noTriggerElement.errorHandled = true;
trigger.element.className = trigger.element.className.replace("CBError", "CBJSErrorHandled");
});
no.AddListener(ccl);
no.addedChangeListener = true;
}
}
if (_CanApplyCBLayerContents(params) && !no.focused && !no.errorHandled) {
e.MoveTo(no.GetPageX(), no.GetPageY() - NodeObject.Get(l.element).GetHeight());
cbShow({ node: l.element });
if (evtType == "focus") { no.focused = true; }
}
}
}
function cbConcatValues(params) {
var _fo = params.trigger && params.trigger.element != null ? FormObject.Get(params.trigger.element).GetForm() : null;
if (_fo == null) { return; }
var _i;
var _hiddenConcatValueInput = document.getElementById('cbHiddenConcatValues') || Document.CreateElement('input', {
type: 'hidden',
id: 'cbHiddenConcatValues',
name: 'previouslicenserno_1',
targetElement: _fo
});
var _targetElements = params.targetList.toString().split(",");
_hiddenConcatValueInput.value = '';
for (_i = 0; _i < _targetElements.length; _i++) {
_hiddenConcatValueInput.value += document.getElementById(_targetElements[_i]).value;
}
}
function cbSetFocusOnJsSubmit() {
var location = String(window.location);
if (location.contains("?")) {
var splittedUrl = location.split("?");
var cleanUrl = splittedUrl[1].split("&");
for (var i = 0; i < cleanUrl.length; i++) {
if (cleanUrl[i].startsWith("crel")) {
var sr = cleanUrl[i].split("=");
if (sr.length == 2) {
if (document.getElementsByName(sr[1])[0] != null) {
document.getElementsByName(sr[1])[0].focus();
}
}
}
}
}
}
DomLoaded.Load(cbSetFocusOnJsSubmit);
function dfb(observedFields, targetType, targetName) {
var counter = {};
function handleCount(form, fieldElementName, fieldIndex, counterType) {
function getCounterValue(index) {
return (counter['keyUp' + index] || 0) + ',' + (counter['mouse' + index] || 0);
}
var counterElement, counterElementName, counterElementValue;
var key = counterType + fieldIndex;
if (counter[key] == undefined) {
counter[key] = 0;
}
counter[key]++;
if (targetType == 'xparam') {
counterElementName = (targetName.toLowerCase().startsWith('x-') ? '' : 'x-') + targetName;
var counterValues = observedFields.map(function (item, index) {
return getCounterValue(index);
});
counterElementValue = counterValues.join(',');
} else {
counterElementName = fieldElementName + 'Count';
counterElementValue = getCounterValue(fieldIndex);
}
counterElement = form[counterElementName] || Document.CreateElement('input', {
type: 'hidden',
name: counterElementName,
targetElement: form
});
if (counterElement != null) {
counterElement.value = counterElementValue;
}
}
targetType = (targetType || '').toLowerCase();
targetType = targetType != 'xparam' ? 'field' : targetType;
if (targetType == 'xparam' && !targetName) {
throw new TypeError('name of X-parameter is required');
}
Array.from(document.forms).forEach(function (form) {
observedFields.forEach(function (fieldName, index) {
var element = form[fieldName];
if (element) {
var formElement = NodeObject.Get(element);
formElement.AddListener(new Listener('mousedown',
function (trigger) {
handleCount(form, trigger.element.name, index, 'mouse');
}));
formElement.AddListener(new Listener('keyup',
function (trigger) {
handleCount(form, trigger.element.name, index, 'keyUp');
}));
}
});
});
}
function ksc() {
var observedFields = [
'deliveryLastname',
'deliveryEmail'
];
dfb(observedFields, 'xparam', 'contactDeliveryCount');
}
function fck() {
var observedFields = [
'paymentCardNumberSecure',
'paymentCreditCardNumberSecure',
'paymentDirectDebitAccountNoSecure',
'paymentDirectDebitBankIdentificationCode'
];
dfb(observedFields);
}
function hsv() {
return "&7=" + (new Date().getTimezoneOffset() / 60);
}
function vfb() {
return new IPluginDetect().GetVersionsAsQueryString()
+ "&6=" + screen.width + "," + screen.height + "," + screen.colorDepth;
}
function fcb() {
var ar = ['Adobe Caslon Pro', 'Adobe Ming Std', 'Aharoni', 'Algerian', 'ANGEL TEARS', 'Bauhaus 93', 'BILLY ARGEL FONT',
'Bitstream Charter', 'Bodoni 72 Oldstyle', 'Book Antiqua', 'Bookman Old Style', 'Braggadocio', 'Cambria', 'Casual',
'Centaur', 'Century Gothic', 'Century Schoolbook', 'Chalkduster', 'Chaparral Pro', 'Colonna MT', 'Comic Sans MS',
'Copperplate Gothic Light', 'Courier New Bold', 'cs_regular', 'DejaVu LGC Sans Mono', 'DejaVu Serif', 'DFKai-SB',
'Didot', 'Engravers MT', 'Eurostile', 'Felix Titling', 'Forte', 'Franklin Gothic Heavy', 'French Script MT', 'friz',
'Gabriola', 'Gentium', 'Georgia', 'Gigi', 'Ginga', 'Gisha', 'Goudy Old Style', 'Gulim', 'GungSeo', 'GungsuhChe',
'Haettenschweiler', 'Harrington', 'Helvetica', 'Hiragino Sans GB', 'Homoarakhn', 'Impact', 'Informal Roman', 'Kino MT',
'Lohit Gujarati', 'Lucida Bright', 'Lucida Fax', 'Magneto', 'Megahertz-In', 'Metal Macabre', 'MingLiU-ExtB', 'Monotype Sorts',
'MoolBoran', 'Morpheus', 'MS PMincho', 'MS Reference Sans Serif', 'Mtcorsva', 'News Gothic MT', 'Niagara Solid', 'Nyala',
'Papyrus', 'Parry Hotter', 'Perpetua', 'Playbill', 'PMingLiU', 'Precious', 'Rachana', 'Rockwell', 'Sawasdee', 'Segoe Print',
'Segoe UI', 'Showcard Gothic', 'SimHei', 'Snap ITC', 'Snell Roundhand', 'Sylfaen', 'Tahoma', 'TeX', 'TlwgMono', 'Trebuchet MS',
'Tuladha Jejeg', 'Tw Cen MT Condensed Extra Bold', 'Ubuntu', 'Umpush', 'Univers', 'Vladimir Script', 'vnibriquet', 'vnimatisse', 'VNI-Times', 'Waltograph'];
var x;
var t = document.getElementById('cleverCart');
if (t && !ip) {
var ip = Document.CreateElement('input', {
type: 'hidden',
name: 'frstat',
value: '',
targetElement: t
});
var se = Document.CreateElement('span', {
style: "font-family: serif; font-size: 82px; visibility: hidden",
text: "mmwwwwMMMWWW--003377wwwwmm",
id: "checkElement",
targetElement: Document.body
});
var seInit = Dimension.GetWidth(se);
for (x = 0; x < ar.length; x++) {
se.style.fontFamily = ar[x] + ',serif';
if (Dimension.GetWidth(se) != seInit) {
ip.value = ip.value + '1';
} else {
ip.value = ip.value + '0';
}
}
Document.RemoveElement(se);
} else { }
}
DomLoaded.Load(function () {
if (window.cbCalendar && window.cbCalendar.scriptURL) {
FileLoader.LoadJS(window.cbCalendar.scriptURL, { onload: function () { ICalendar.Init(); } });
}
});
function cbIESix() {
if (!Utils.CheckBrowser('ie6')) { return; }
var ul, eUl, noDiv;
Array.from(document.getElementsByTagName("div")).forEach(function (div, key) {
if (div.className.contains('CBSelection')) {
ul = Array.from(div.getElementsByTagName("ul"))[0];
if (ul) {
eUl = Effect.Get(ul).Fold();
noDiv = NodeObject.Get(div);
noDiv.AddListener(new Listener('mouseover', function () { eUl.Display(); }));
noDiv.AddListener(new Listener('mouseout', function () { eUl.Fold(); }));
}
}
});
var ropp = Document.GetElement("cleverRecommendationPopupContentDisablerOPP");
var rrpp = Document.GetElement("cleverRecommendationPopupContentDisablerRPP");
var rcpp = Document.GetElement("cleverRecommendationPopupContentDisablerCPP");
var rdap = Document.GetElement("cleverRecommendationPopupContentDisablerDAP");
var rn = ropp != null ? ropp : rrpp != null ? rrpp : rcpp != null ? rcpp : rdap != null ? rdap : null;
if (rn != null) {
var ifr = document.createElement("<iframe frameborder=\"0\" src=\"javascript:false;\"></iframe>");
rn.appendChild(ifr);
ifr.style.width = "100%";
ifr.style.height = "100%";
ifr.style.filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
}
function pngHack(obj) {
obj = obj || document;
var src, pngHolder;
try {
['img', 'h1', 'input', 'span', 'div', 'h2', 'h2', 'a'].forEach(function (tagName, key) {
if (tagName == 'img') {
Array.from(obj.getElementsByTagName(tagName)).forEach(function (image, key) {
if (image.src.toLowerCase().endsWith('.png')) {
pngHolder = image;
src = image.src;
image.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true sizingMethod=image src='" + src + "')";
image.src = '/images/blank.gif';
}
});
} else {
Array.from(obj.getElementsByTagName(tagName)).forEach(function (tag, key) {
if (tag.currentStyle.backgroundImage.toLowerCase().contains('.png')) {
src = '' + tag.currentStyle.backgroundImage;
src = src.replace(/url\(\"/, "").replace(/\"\)/, "");
tag.style.backgroundImage = 'url(/images/blank.gif)';
tag.style.filter = "progid:DXImageTransform.Microsoft.AlphaImageLoader(enabled=true sizingMethod=crop src='" + src + "')";
}
});
}
});
} catch (e) { return true; }
}
var a = Document.GetElement("cleverSecurityVerification");
var b = Document.GetElement("cleverContent");
var c = Document.GetElement("cleverOrderSteps");
if (a != null) { pngHack(a) }
if (b != null) { pngHack(b) }
if (c != null) { pngHack(c) }
}
DomLoaded.Load(cbIESix);
DomLoaded.Load(cbPrepareProductSelection);
DomLoaded.Load(cbPrepareLicenseDevices);
function cbNewsletterOptOut() {
var input = document.getElementsByName("x-newsletter");
var error = (document.getElementById("cleverError") != undefined);
var reload = (window.location.href.indexOf("&crel=") != -1);
var scopepage = document.getElementById("cleverContent");
if (scopepage !== null) {
var scopedefault = (scopepage.firstChild.className.indexOf("CBPagedefault") !== -1);
var review = (scopepage.firstChild.className.indexOf("CBPagereview") !== -1);
var scopecontact = (scopepage.firstChild.className.indexOf("CBPagecontact") !== -1);
if (input.length > 0 && !error && (scopedefault || review || scopecontact) && !reload) {
var selectCountryId = '';
if (typeof document.getElementsByTagName('form')[0] !== 'undefined') {
var formTag = document.getElementsByTagName('form')[0];
if (formTag['deliveryCountryId'] !== undefined) {
if (scopepage.firstChild.className.indexOf("CBScopecheckout") !== -1 && scopepage.firstChild.className.indexOf("CBPagedefault") !== -1) {
selectCountryId = formTag['deliveryCountryId'].value.toLowerCase();
}
}
}
for (var i = 0; i < input.length; i++) {
input[i].checked = false;
}
if(document.getElementsByTagName("html")[0].className.indexOf("cbCountryUs") !== -1 || selectCountryId == 'us') {
if(document.getElementsByTagName("body")[0].className.indexOf("cbNewsletterOptOut") !== -1) {
for (var i = 0; i < input.length; i++)
input[i].checked = true;
} else if (document.getElementById("cleverNewsletterCheckbox") !== null) {
if(document.getElementById("cleverNewsletterCheckbox").className.indexOf("cbNewsletterOptOut") !== -1) {
for (var i = 0; i < input.length; i++)
input[i].checked = true;
}
}
}
}
}
}
DomLoaded.Load(cbNewsletterOptOut);