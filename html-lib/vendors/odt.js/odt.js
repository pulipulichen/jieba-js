/* This file is licensed under the General Public License. */

var ODTDocument = function(odt, options) {
	var zip = new JSZip(odt, options);
	var find = function(object, value) {
		var key;
		Object.keys(object).some(function(_key) {
			if(object[_key] === value) {
				key = _key;
				return true;
			}
		});
		return key;
	};
	var attribute = function(name, value) {
		return name + '="' + value.replace(/"/g, '&quot;') + '"';
	};
	var styles = {
		'fo:text-align': 'text-align',
		'style:font-name': 'font-family',
		'fo:font-size': 'font-size',
		'fo:font-weight': 'font-weight',
		'fo:font-style': 'font-style',
		'fo:color': 'color',
		'fo:padding': 'padding',
		'fo:padding-top': 'padding-top',
		'fo:padding-right': 'padding-right',
		'fo:padding-bottom': 'padding-bottom',
		'fo:padding-left': 'padding-left',
		'fo:border': 'border',
		'fo:border-top': 'border-top',
		'fo:border-right': 'border-right',
		'fo:border-bottom': 'border-bottom',
		'fo:border-left': 'border-left',
		'style:width': 'width',
		'style:column-width': 'width',
	};
	var styleToHTML = function(name, value) {
		if(name === 'style:text-underline-style' && value === 'solid') {
			return 'text-decoration: underline; ' + styleToHTML(name.replace(':', '--'), value);
		} else if(name === 'style:text-position') {
			return 'vertical-align: ' + value.split(' ')[0] + ';' +
				'font-size: ' + value.split(' ')[1] + '; ' +
				styleToHTML(name.replace(':', '--'), value);
		}
		return (styles[name] || name.replace(':', '--')) + ': ' + value + ';';
	};
	var styleToODT = function(name, value) {
		name = find(styles, name);
		return name ? attribute(name, value) : ''; 
	};
	var attributes = {
		'text:style-name': 'class',
		'table:style-name': 'class',
		'table:number-columns-spanned': 'colspan',
		'table:number-rows-spanned': 'rowspan',
		'table:number-columns-repeated': 'span',
		'xlink:href': 'href',
		
		'xml:id': 'id',
	};
	var attributeToHTML = function(name, value) {
		return attribute(attributes[name] || name, value);
	};
	var attributeToODT = function(name, value, elementOdtName) {
		if(name === 'class' && elementOdtName.substr(0, 6) === 'table:') {
			return attribute('table:style-name', value);
		}
		return attribute(find(attributes, name) || name, value);
	};
	var elements = {
		/**
		 * Meaning of the "operators" here:
		 * odtName: htmlName
		 * a: b means that any <a> is replaced with <b>
		 * a>>b: c means that any <a><b/></a> is replaced with <c/>
		 * a: b/c means that any <a> is replaced with <b data-type="c">
		 */
		
		'office:document-content': 'html',
		'office:body>>office:text': 'body',
		
		'office:scripts': 'script',
		
		'text:p': 'p',
		'text:span': 'span',
		'text:a': 'a',
		'text:list': 'ol',
		'text:list-item': 'li',
		'text:line-break': 'br',
		
		'table:table': 'table',
		'table:table-row': 'tr',
		'table:table-column': 'col',
		'table:table-cell': 'td',
		
		'draw:frame>>draw:image': 'img',
		'draw:object': 'object',
		
		'office:automatic-styles': 'style',
		'office:font-face-decls': 'style/fonts',
	};
	var voidElements = ['area', 'base', 'br', 'col', 'command', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'track', 'wbr'];
	var keys = function(map) {
		var keys = [];
		map.forEach(function(value, key) {
			keys.push(key);
		});
		return keys;
	};
	var svmCache = {};
	var nodeToHTML = function(node, contents) {
		if(node.nodeType === node.TEXT_NODE) {
			return (
				node.nodeValue
				.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(/[^\u0009\u000A\u000D\u0020-\uD7FF\uE000-\uFFFD]/g, '')
				.replace(/\u00A0/g, '&nbsp;')
			);
		}
		
		var simpleElementToHTML = function(contents) {
			var htmlNameString = (elements[name] || name).replace(/\/(.*)/, ' data-type="$1"');
			var htmlName = htmlNameString.split(' ')[0];
			return '<' + htmlNameString + keys(attrs).map(function(name) {
				return ' ' + attributeToHTML(name, attrs.get(name));
			}).join('') + '>' + (voidElements.indexOf(htmlName) === -1 ? contents() + '</' + htmlName + '>' : '');
		};
		var commentedElementToHTML = function(contents) {
			return '/*<' + name + keys(attrs).map(function(name) {
				return ' ' + attribute(name, attrs.get(name));
			}).join('') + '>*/\n' + contents() + '\n/*</' + name + '>*/';
		};
		
		// We don't use outerHTML since that includes xmlns attributes.
		var odtNodeHTML = function(node) {
			if(node.nodeType === node.TEXT_NODE) {
				return node.nodeValue.replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}
			return '<' + node.nodeName + odtAttributesHTML(node.attributes) + '>' + [].map.call(node.childNodes, odtNodeHTML).join('') + '</' + node.nodeName + '>';
		};
		var odtAttributesHTML = function(attributes) {
			return [].map.call(attributes, function(attr) {
				return ' ' + attribute(attr.name, attr.value);
			}).join('');
		};
		
		var name = node.nodeName;
		var attrs = new Map();
		for(var i = 0; i < node.attributes.length; i++) {
			attrs.set(node.attributes[i].name, node.attributes[i].value);
		}
		for(var i = 0; i < node.childNodes.length; i++) {
			if(elements[name + '>>' + node.childNodes[i].nodeName]) {
				name += '>>' + node.childNodes[i].nodeName;
				attrs.set('_child_attrs', odtAttributesHTML(node.childNodes[i].attributes));
				attrs.set('_children_before', [].slice.call(node.childNodes, 0, i).map(odtNodeHTML).join(''));
				attrs.set('_children_after', [].slice.call(node.childNodes, i + 1).map(odtNodeHTML).join(''));
				switch(name) {
					case 'draw:frame>>draw:image':
						var href = node.childNodes[i].attributes['xlink:href'].value;
						if(/^[a-z]+:/i.test(href)) {
							attrs.set('src', href);
						} else {
							var path = href.replace(/^\.\//, '');
							var binary = zip.file(path).asBinary();
							if(binary.substr(0, 6) === 'VCLMTF') {
								// StarView Metafile
								if(!svmCache[path]) {
									svmCache[path] = parseSVM(zip.file(path).asArrayBuffer()).toDataURL()
								}
								attrs.set('src', svmCache[path]);
							} else {
								attrs.set('src', 'data:image/png;base64,' + btoa(binary));
							}
						}
						break;
				}
				return simpleElementToHTML(function() {
					return contents().match(/^<[^>]*>([\s\S]*)<\/[^>]*>$/)[1];
				});
			}
		}
		switch(name) {
			case 'text:tab':
				return '<span style="white-space:pre">\t</span>';
			case 'text:note-body':
				contents = (function(contents) {
					return function() {
						return contents().replace(/<(\/?)p\b/g, '<$1text:p');
					};
				})(contents);
				break;
			case 'office:annotation':
				contents = (function(contents) {
					return function() {
						return contents().replace(/<(\/?)p\b/g, '<$1text:p').replace(/<(\/?)ol\b/g, '<$1text:list').replace(/<(\/?)li\b/g, '<$1text:list-item');
					};
				})(contents);
				break;
			case 'style:style':
			case 'text:list-style':
				return commentedElementToHTML(function() {
					return [
						'[class="' + attrs.get('style:name') + '"] {',
						contents(),
						'}',
					].join('\n');
				});
			case 'style:paragraph-properties':
			case 'style:text-properties':
			case 'style:table-properties':
			case 'style:table-column-properties':
			case 'style:table-cell-properties':
			case 'style:graphic-properties':
				return commentedElementToHTML(function() {
					return keys(attrs).map(function(name) {
						return styleToHTML(name, attrs.get(name)) + '\n';
					}).join('') +
					contents();
				});
			case 'draw:object':
				attrs.set('data', 'bla');
				break;
		}
		if(name.substr(0, 6) === 'style:' || name.substr(0, 14) === 'svg:font-face-' || name.substr(0, 22) === 'text:list-level-style-') {
			// Unsupported style element
			return commentedElementToHTML(contents);
		}
		return simpleElementToHTML(contents);
	};
	var nodeToODT = function(node, contents) {
		if(node.nodeType === 3) {
			return node.nodeValue.replace(/&nbsp;/g, '\u00A0');
		}
		
		var simpleElementToODT = function(odtName, attrs, contents) {
			return '<' + odtName + attrs + '>' + contents() + '</' + odtName + '>';
		};
		var simpleAttrsToODT = function(attrs) {
			return keys(attrs).map(function(name) {
				if(name === 'data-type') return '';
				return ' ' + attributeToODT(name, attrs.get(name), odtName);
			}).join('');
		};
		
		var name = node.nodeName.toLowerCase();
		var attrs = new Map();
		for(var i = 0; i < node.attributes.length; i++) {
			attrs.set(node.attributes[i].name, node.attributes[i].value);
		}
		switch(name) {
			case 'html':
				var defaultattrs = {
					'xmlns:office': 'urn:oasis:names:tc:opendocument:xmlns:office:1.0',
					'xmlns:style': 'urn:oasis:names:tc:opendocument:xmlns:style:1.0',
					'xmlns:text': 'urn:oasis:names:tc:opendocument:xmlns:text:1.0',
					'xmlns:table': 'urn:oasis:names:tc:opendocument:xmlns:table:1.0',
					'xmlns:draw': 'urn:oasis:names:tc:opendocument:xmlns:drawing:1.0',
					'xmlns:xlink': 'http://www.w3.org/1999/xlink',
					'office:version': '1.2',
				};
				Object.keys(defaultattrs).forEach(function(name) {
					attrs.set(name, attrs.get(name) || defaultattrs[name]);
				});
				break;
			case 'style':
				if(attrs.get('_odt.js_styles') !== undefined) {
					return '';
				} else {
					contents = (function(contents) {
						return function() {
							return (contents().match(/\/\*.*?\*\//g) || []).map(function(tag) {
								return tag.match(/\/\*(.*?)\*\//)[1].replace(/&lt;/g, '<').replace(/&gt;/g, '>');
							}).join('');
						};
					})(contents);
				}
				break;
			case 'span':
				if(attrs.get('style') === 'white-space:pre' && contents() === '\t') {
					return '<text:tab></text:tab>';
				}
				break;
			case 'img':
				attrs.delete('src');
				break;
			case 'draw:object':
				attrs.delete('data');
				break;
		}
		var odtName = find(elements, name + '/' + attrs.get('data-type')) || find(elements, name) || (name.indexOf(':') !== -1 && name);
		if(!odtName) {
			return contents();
		}
		if(odtName.indexOf('>>') !== -1) {
			var childAttrs = attrs.get('_child_attrs');
			var childrenBefore = attrs.get('_children_before');
			var childrenAfter = attrs.get('_children_after');
			attrs.delete('_child_attrs');
			attrs.delete('_children_before');
			attrs.delete('_children_after');
			return simpleElementToODT(odtName.split('>>')[0], simpleAttrsToODT(attrs), function() {
				return childrenBefore + simpleElementToODT(odtName.split('>>')[1], childAttrs, contents) + childrenAfter;
			});
		}
		return simpleElementToODT(odtName, simpleAttrsToODT(attrs), contents);
	};
	var traverse = function(node, callback) {
		return callback(node, function() {
			return [].map.call(node.childNodes, function(node) {
				if(node.nodeType === 1) {
					return traverse(node, callback);
				}
				return callback(node);
			}).join('');
		});
	};
	var documentToHTML = function(zip) {
		return (
			'<!DOCTYPE html>' +
			traverse(new DOMParser().parseFromString(zip.file('content.xml').asText(), 'text/xml').documentElement, nodeToHTML).replace(/<html[^>]*>/, [
				'$&<head><style _odt.js_styles="">',
				'p {',
				'	margin: 0;',
				'	min-height: 1em;',
				'}',
				'table {',
				'	border-collapse: collapse;',
				'}',
				'office\\:annotation {',
				'	display: none;',
				'}',
				'text\\:note-citation, text\\:note-body {',
				'	vertical-align: super;',
				'	font-size: .83em;',
				'}',
				'text\\:note-body:before {',
				'	content: "\\A0(";',
				'}',
				'text\\:note-body:after {',
				'	content: ")";',
				'}',
				'text\\:tracked-changes {',
				'	display: none;',
				'}',
				'</style>',
			].join('\n')).replace('<body', '</head>$&')
		);
	};
	var documentToODT = function(html) {
		return (
			'<?xml version="1.0" encoding="UTF-8"?>\n' +
			traverse(new DOMParser().parseFromString(html, 'text/html').documentElement, nodeToODT)
			.replace(/'/g, '&apos;')
		);
	};
	var normalize = function(html) {
		return (
			html
			.replace(/<([\w:-]+)([^>]*)><\/\1>/g, '<$1$2/>') // Normalize empty elements
			.replace(/<(\/?)([\w:-]+)\s*([^>]*?)(\/?)>/g, function(tag, close, name, attrString, selfClosing) {
				return '<' + close + name + ' ' + attrString.split(/\s+/).sort().join(' ') + selfClosing + '>'; // Normalize tag spacing and attribute order
			})
			.replace(/<\/?(?:tbody|colgroup) >/g, '') // Remove tags that are removed in nodeToODT
		);
	};
	var getDocHTML = function(doc) {
		var doctype = doc.doctype;
		var doctypeString = doctype ? '<!DOCTYPE '
			+ doctype.name
			+ (doctype.publicId ? ' PUBLIC "' + doctype.publicId + '"' : '')
			+ (!doctype.publicId && doctype.systemId ? ' SYSTEM' : '')
			+ (doctype.systemId ? ' "' + doctype.systemId + '"' : '')
			+ '>' : '';
		return doctypeString + doc.documentElement.outerHTML;
	};
	this.getHTMLUnsafe = function() {
		return documentToHTML(zip);
	};
	this.setHTMLUnsafe = function(html) {
		zip.file('content.xml', documentToODT(html));
	};
	this.getHTML = function() {
		var html = this.getHTMLUnsafe();
		
		// Roundtrip check
		var tidiedHtml = getDocHTML(new DOMParser().parseFromString(html, 'text/html'));
		if(normalize(tidiedHtml) !== normalize(html)) {
			throw new Error("Couldn't parse ODT file: produced invalid HTML.");
		}
		var original = {}, roundTripped = {};
		Object.keys(zip.files).forEach(function(key) {
			original[key] = zip.files[key].asBinary();
			if(key === 'content.xml') {
				original[key] = normalize(original[key]);
			}
		});
		this.setHTMLUnsafe(tidiedHtml);
		Object.keys(zip.files).forEach(function(key) {
			roundTripped[key] = zip.files[key].asBinary();
			if(key === 'content.xml') {
				roundTripped[key] = normalize(roundTripped[key]);
			}
		});
		if(JSON.stringify(roundTripped) !== JSON.stringify(original) || normalize(this.getHTMLUnsafe()) !== normalize(html)) {
			throw new Error("Couldn't parse ODT file: roundtrip failed.");
		}
		
		return html;
	};
	this.setHTML = function(html) {
		this.setHTMLUnsafe(html);
		
		// Roundtrip check
		if(normalize(this.getHTML()) !== normalize(html)) {
			throw new Error("Couldn't generate ODT file: roundtrip failed.");
		}
	};
	this.getODT = function(options) {
		return zip.generate(options);
	};
}

function parseSVM(arrayBuffer, out) {
	// https://quickgit.kde.org/?p=calligra.git&a=blob&h=3dde39ca2ccb2e8b990f7446b29e6f66da367d2d&f=libs%2Fvectorimage%2Flibsvm%2FSPEC&o=plain
	// https://github.com/andiwand/svm/tree/f97cb3a1b6d823ae57571fc76fea609d0fdb89e6/doc
	var data = arrayBuffer instanceof DataView ? arrayBuffer : new DataView(arrayBuffer);
	if(!out) {
		out = {};
	}
	var index = 6;
	var ActionType = {
		META_NULL_ACTION:					0,
		META_PIXEL_ACTION:					100,
		META_POINT_ACTION:					101,
		META_LINE_ACTION:					102,
		META_RECT_ACTION:					103,
		META_ROUNDRECT_ACTION:				104,
		META_ELLIPSE_ACTION:				105,
		META_ARC_ACTION:					106,
		META_PIE_ACTION:					107,
		META_CHORD_ACTION:					108,
		META_POLYLINE_ACTION:				109,
		META_POLYGON_ACTION:				110,
		META_POLYPOLYGON_ACTION:			111,
		META_TEXT_ACTION:					112,
		META_TEXTARRAY_ACTION:				113,
		META_STRETCHTEXT_ACTION:			114,
		META_TEXTRECT_ACTION:				115,
		META_BMP_ACTION:					116,
		META_BMPSCALE_ACTION:				117,
		META_BMPSCALEPART_ACTION:			118,
		META_BMPEX_ACTION:					119,
		META_BMPEXSCALE_ACTION:				120,
		META_BMPEXSCALEPART_ACTION:			121,
		META_MASK_ACTION:					122,
		META_MASKSCALE_ACTION:				123,
		META_MASKSCALEPART_ACTION:			124,
		META_GRADIENT_ACTION:				125,
		META_HATCH_ACTION:					126,
		META_WALLPAPER_ACTION:				127,
		META_CLIPREGION_ACTION:				128,
		META_ISECTRECTCLIPREGION_ACTION:	129,
		META_ISECTREGIONCLIPREGION_ACTION:	130,
		META_MOVECLIPREGION_ACTION:			131,
		META_LINECOLOR_ACTION:				132,
		META_FILLCOLOR_ACTION:				133,
		META_TEXTCOLOR_ACTION:				134,
		META_TEXTFILLCOLOR_ACTION:			135,
		META_TEXTALIGN_ACTION:				136,
		META_MAPMODE_ACTION:				137,
		META_FONT_ACTION:					138,
		META_PUSH_ACTION:					139,
		META_POP_ACTION:					140,
		META_RASTEROP_ACTION:				141,
		META_TRANSPARENT_ACTION:			142,
		META_EPS_ACTION:					143,
		META_REFPOINT_ACTION:				144,
		META_TEXTLINECOLOR_ACTION:			145,
		META_TEXTLINE_ACTION:				146,
		META_FLOATTRANSPARENT_ACTION:		147,
		META_GRADIENTEX_ACTION:				148,
		META_LAYOUTMODE_ACTION:				149,
		META_TEXTLANGUAGE_ACTION:			150,
		META_OVERLINECOLOR_ACTION:			151,
		META_COMMENT_ACTION:				512,
	};
	function extend(object, additionalFields) {
		Object.keys(additionalFields).forEach(function(key) {
			object[key] = additionalFields[key];
		});
	}
	function readObjectArray(type, length) {
		var array = new Array(length);
		for(var i = 0; i < length; i++) {
			array[i] = readObject(type);
		}
		return array;
	}
	function readObjectCompat(fn, type, actionTypeName) {
		var version = readObject('VersionCompat');
		var target = index + version.length;
		var object = fn(version, target);
		if(index !== target) {
			if(object) {
				//console.error('[svm.js] Skipped unknown object fields in type: ' + actionTypeName + ' (' + type + ')');
			}
			index = target;
		}
		return object;
	}
	var charset = 0;
	var toPx = .001 / 2.54 * 96; // thousandth centimeters to inches to pixels.
	function readObject(type, actionTypeName, actionVersion, target) {
		switch(type) {
			case 'uint8':
			case 'bool':
				var uint8 = data.getUint8(index, true);
				index++;
				return uint8;
			case 'int8':
				var int8 = data.getInt8(index, true);
				index++;
				return int8;
			case 'uint16':
				var uint16 = data.getUint16(index, true);
				index += 2;
				return uint16;
			case 'int16':
				var int16 = data.getInt16(index, true);
				index += 2;
				return int16;
			case 'uint32':
				var uint32 = data.getUint32(index, true);
				index += 4;
				return uint32;
			case 'int32':
				var int32 = data.getInt32(index, true);
				index += 4;
				return int32;
			case 'char':
				return String.fromCharCode(readObject('uint8'));
			case 'utf16char':
				return String.fromCharCode(readObject('uint16'));
			case 'Header':
				return readObjectCompat(function(version) {
					return {
						version: version,
						compressionMode: readObject('uint32'),
						mapMode: readObject('MapMode'),
						width: readObject('uint32') * toPx,
						height: readObject('uint32') * toPx,
						actionCount: readObject('uint32'),
					};
				}, 'Header');
			case 'VersionCompat':
				return {
					version: readObject('uint16'),
					length: readObject('uint32'),
					valueOf: function() {
						return this.version;
					},
				};
				break;
			case 'MapMode':
				return readObjectCompat(function(version) {
					return {
						version: version,
						unit: readObject('uint16'),
						origin: readObject('Point'),
						scaleX: readObject('Fraction'),
						scaleY: readObject('Fraction'),
						isSimple: readObject('bool'),
					};
				}, 'MapMode');
			case 'Point':
				return {
					x: readObject('uint32') * toPx,
					y: readObject('uint32') * toPx,
				};
			case 'ByteString':
				return readObjectArray('char', readObject('uint16')).join('');
			case 'String':
				return readObjectArray(charset ? 'utf16char' : 'char', readObject(charset ? 'int32' : 'uint16')).join('');
			case 'Fraction':
				return {
					numerator: readObject('uint32'),
					denominator: readObject('uint32'),
					valueOf: function() {
						return this.numerator / this.denominator;
					},
				};
			case 'Font':
				return readObjectCompat(function(version) {
					var font = {
						version: version,
						family: readObject('ByteString'),
						style: readObject('ByteString'),
						fontWidth: readObject('uint32') * toPx,
						fontHeight: readObject('uint32') * toPx,
						charset: readObject('uint16'),
						family2: readObject('uint16'),
						pitch: readObject('uint16'),
						weight: readObject('uint16'),
						underline: readObject('uint16'),
						strikeout: readObject('uint16'),
						italic: readObject('uint16'),
						language: readObject('uint16'),
						width: readObject('uint16') * toPx,
						orientation: readObject('int16'),
						wordline: readObject('bool'),
						outline: readObject('bool'),
						shadow: readObject('bool'),
						kerning: readObject('uint8'),
					};
					if(version >= 2) {
						extend(font, {
							relief: readObject('int8'),
							language2: readObject('uint16'),
							vertical: readObject('bool'),
							emphasis: readObject('uint16'),
						});
						if(version >= 3) {
							extend(font, {
								overline: readObject('uint16'),
							});
						}
					}
					return font;
				}, 'Font');
			/*case 'Color':
				var colorName = readObject('uint16'); 	// (* if 0x8000 set, user color, else, defined color by code)
				var red = readObject('uint16'); 		// (* only higher 8 bit used and replicated)
				var green = readObject('uint16'); 		// (* only higher 8 bit used and replicated)
				var blue = readObject('uint16'); 		// (* only higher 8 bit used and replicated)
				console.log(colorName, colorName & 0x8000, red, green, blue);
				if(colorName & 0x8000) {
					return null;
				}
				return '#' +
					('0' + (red >> 8).toString(16)).substr(-2) +
					('0' + (green >> 8).toString(16)).substr(-2) +
					('0' + (blue >> 8).toString(16)).substr(-2);*/
			case 'Color':
				return '#' + ('00000' + readObject('uint32').toString(16)).substr(-6);
			case 'Rectangle':
				return {
					left: readObject('int32') * toPx,
					top: readObject('int32') * toPx,
					right: readObject('int32') * toPx,
					bottom: readObject('int32') * toPx,
				};
			case 'Polygon':
			case 'SimplePolygon':
			case 'ComplexPolygon':
				return readObjectArray('Point', readObject('uint16'));
			case 'PolyPolygon':
				return readObjectArray('Polygon', readObject('uint16'));
			case 'indexedComplexPolygon':
				return {
					simplePolygonIndex: readObject('uint16'),
					complexPolygon: readObject('ComplexPolygon'),
				};
			case 'LineInfo':
				return readObjectCompat(function(version) {
					var lineInfo = {
						version: version,
						style: readObject('uint16'),
						width: readObject('int32'),
					};
					if(version >= 2) {
						extend(lineInfo, {
							dashCount: readObject('uint16'),
							dashLength: readObject('int32'),
							dotCount: readObject('uint16'),
							dotLength: readObject('int32'),
							distance: readObject('int32'),
						});
						if(version >= 3) {
							extend(lineInfo, {
								lineJoin: readObject('uint16'),
							});
						}
					}
					return lineInfo;
				}, 'LineInfo');
			case 'Size':
				return {
					width: readObject('uint32') * toPx,
					height: readObject('uint32') * toPx,
				};
			case 'Bitmap':
				readObject('uint16'); // magic id
				var size = readObject('uint32');
				if(index - 6 + size > data.byteLength) {
					size = target - (index - 6);
				}
				var bmp = new DataView(data.buffer, index - 6, size);
				index = index - 6 + size;
				return bmp;
			case 'BitmapEx':
				var bitmapEx = {
					bitmap: readObject('Bitmap'),
					magic1: readObject('uint32'),
					magic2: readObject('uint32'),
					transparentType: readObject('uint8'),
				};
				// enum TransparentType { TRANSPARENT_NONE, TRANSPARENT_COLOR, TRANSPARENT_BITMAP };
				if(bitmapEx.transparentType === 1) {
					extend(bitmapEx, {
						transparentColor: readObject('Color'),
					});
				} else if(bitmapEx.transparentType === 2) {
					extend(bitmapEx, {
						transparentMask: readObject('Bitmap', null, null, target),
					});
				}
				return bitmapEx;
			case 'Gradient':
				// enum GradientStyle { GradientStyle_LINEAR, GradientStyle_AXIAL, GradientStyle_RADIAL, GradientStyle_ELLIPTICAL, GradientStyle_SQUARE, GradientStyle_RECT };
				return readObjectCompat(function(version) {
					return {
						version: version,
						gradientStyle: readObject('uint16'),
						startColor: readObject('Color'),
						endColor: readObject('Color'),
						angle: readObject('uint16'),
						border: readObject('uint16'),
						offsetX: readObject('uint16'),
						offsetY: readObject('uint16'),
						intensityStart: readObject('uint16'),
						intensityEnd: readObject('uint16'),
						stepCount: readObject('uint16'),
					};
				});
			case 'MetaFile':
				var out = {};
				var canvas = parseSVM(new DataView(data.buffer, index), out);
				index += out.bytesRead;
				return canvas;
			/*case 'Region':
				return readObjectCompat(function(version) {
					var region = {
						version: version,
						version2: readObject('uint16'),
						type: readObject('uint16'),
					};
					// enum RegionType { REGION_NULL, REGION_EMPTY, REGION_RECTANGLE, REGION_COMPLEX };
					if(region.type >= 2) {
						extend(region, {
							entries: [],
						});
						// enum StreamEntryType { STREAMENTRY_BANDHEADER, STREAMENTRY_SEPARATION, STREAMENTRY_END };
						var entryType = readObject('uint16');
						while(entryType !== 2) {
							if(entryType === 0) {
								region.entries.push({
									type: entryType,
									top: readObject('int32') * toPx,
									bottom: readObject('int32') * toPx,
								});
							} else {
								region.entries.push({
									type: entryType,
									left: readObject('int32') * toPx,
									right: readObject('int32') * toPx,
								});
							}
							entryType = readObject('uint16');
						}
						extend(region, {
							hasPolyPolygon: readObject('bool'),
						});
						if(region.hasPolyPolygon) {
							extend(region, {
								polyPolygon: readObject('PolyPolygon'),
							});
						}
					}
					return region;
				}, 'Region');*/
			case ActionType.META_FONT_ACTION:
				return {
					font: readObject('Font'),
				};
			case ActionType.META_TEXTARRAY_ACTION:
				var textarray = {
					startPoint: readObject('Point'),
					string: readObject('String'),
					startIndex: readObject('uint16'),
					len: readObject('uint16'),
					dxArray: readObjectArray('int32', readObject('uint32')),
				};
				if(actionVersion >= 2) {
					extend(textarray, {
						string: readObjectArray('utf16char', readObject('uint16')).join(''),
					});
				}
				return textarray;
			case ActionType.META_RECT_ACTION:
				return readObject('Rectangle');
			case ActionType.META_STRETCHTEXT_ACTION:
				var stretchtext = {
					startPoint: readObject('Point'),
					string: readObject('String'),
					width: readObject('uint32') * toPx,
					startIndex: readObject('uint16'),
					len: readObject('uint16'),
				};
				if(actionVersion >= 2) {
					extend(stretchtext, {
						string: readObjectArray('utf16char', readObject('uint16')).join(''),
					});
				}
				return stretchtext;
			case ActionType.META_FILLCOLOR_ACTION:
				return {
					color: readObject('Color'),
					set: readObject('bool'),
				};
			case ActionType.META_LINECOLOR_ACTION:
				return {
					color: readObject('Color'),
					set: readObject('bool'),
				};
			case ActionType.META_TEXTCOLOR_ACTION:
				return {
					color: readObject('Color'),
				};
			case ActionType.META_TEXTFILLCOLOR_ACTION:
				return {
					color: readObject('Color'),
					set: readObject('bool'),
				};
			case ActionType.META_TEXTLINECOLOR_ACTION:
				return {
					color: readObject('Color'),
					set: readObject('bool'),
				};
			case ActionType.META_POLYLINE_ACTION:
				var polyline = {
					simplePolygon: readObject('SimplePolygon'),
				};
				if(actionVersion >= 2) {
					extend(polyline, {
						lineInfo: readObject('LineInfo'),
					});
					if(actionVersion >= 3) {
						extend(polyline, {
							hasFlags: readObject('bool'),
						});
						if(polyline.hasFlags) {
							extend(polyline, {
								polygon: readObject('Polygon'),
							});
						}
					}
				}
				return polyline;
			case ActionType.META_POLYPOLYGON_ACTION:
				var polypolygon = {
					simplePolygons: readObject('PolyPolygon'),
				};
				if(actionVersion >= 2) {
					extend(polypolygon, {
						lineInfo: readObjectArray('indexedComplexPolygon', readObject('uint16')),
					});
				}
				return polypolygon;
			case ActionType.META_TRANSPARENT_ACTION:
				return {
					simplePolygons: readObject('PolyPolygon'),
					transparentPercentage: readObject('uint16'),
				};
			case ActionType.META_BMPEXSCALE_ACTION:
				return {
					bitmap: readObject('BitmapEx', null, null, target - 2 * 2 * 4), // sizeof(point) + sizeof(size)
					point: readObject('Point'),
					size: readObject('Size'),
				};
			case ActionType.META_FLOATTRANSPARENT_ACTION:
				return {
					metaFile: readObject('MetaFile'),
					point: readObject('Point'),
					size: readObject('Size'),
					gradient: readObject('Gradient'),
				};
			/*case ActionType.META_ISECTRECTCLIPREGION_ACTION:
				return {
					rect: readObject('Rectangle'),
				};
			case ActionType.META_ISECTREGIONCLIPREGION_ACTION:
				return {
					region: readObject('Region'),
				};*/
			default:
				if(actionTypeName) {
					//console.error('[svm.js] Unknown object type: ' + actionTypeName + ' (' + type + ')');
					return null;
				} else {
					throw 'Unknown svm object type: ' + type;
				}
		}
	}
	var canvas = document.createElement('canvas');
	var header = readObject('Header');
	canvas.width = header.width;
	canvas.height = header.height;
	var context = canvas.getContext('2d');
	context.fillStyle = 'transparent';
	context.strokeStyle = 'transparent';
	var textFillStyle = '#000';
	var textStrokeStyle = 'transparent';
	var textRotation = 0;
	function textAction(fn, x, y) {
		context.save();
		context.fillStyle = textFillStyle;
		context.strokeStyle = textStrokeStyle;
		context.translate(x, y);
		context.rotate(textRotation / 180 * Math.PI);
		fn();
		context.restore();
	}
	context.setTransform(header.mapMode.scaleX, 0, 0, header.mapMode.scaleY, -header.mapMode.origin.x, -header.mapMode.origin.y);
	var unrecognizedActionTypeNames = [];
	function bitmapUrl(bitmap) {
		// We make a data url instead of an object url because we want to read it synchronously.
		var binary = [];
		for(var j = 0; j < bitmap.byteLength; j++) {
			binary.push(String.fromCharCode(bitmap.getUint8(j, true)));
		}
		return 'data:image/bmp;base64,' + btoa(binary.join(''));
	}
	for(var i = 0; i < header.actionCount; i++) {
		var actionType = readObject('uint16');
		var actionTypeName = Object.keys(ActionType).find(function(key) {
			return ActionType[key] === actionType;
		});
		var action = readObjectCompat(function(version, target) {
			return readObject(actionType, actionTypeName, version, target);
		}, actionType, actionTypeName);
		if(action) {
			//console.log('[svm.js] Action type: ' + actionTypeName + ' (' + actionType + ')', action);
			switch(actionType) {
				case ActionType.META_FONT_ACTION:
					charset = action.font.charset;
					context.font = (
						(action.font.italic === 2 ? 'italic' : action.font.italic === 1 ? 'oblique' : 'normal') + ' ' +
						// skip font-variant
						(action.font.weight >= 1 && action.font.weight <= 10 ? action.font.weight - 1 + '00' : 'normal') + ' ' +
						// skip font-stretch
						action.font.fontHeight + 'px ' +
						// skip line-height
						'"' + action.font.family.replace(/;/g, '", "') + '"'
					);
					textRotation = -action.font.orientation / 10;
					break;
				case ActionType.META_TEXTARRAY_ACTION:
					textAction(function() {
						context.fillText(action.string.substr(action.startIndex, action.len), 0, 0);
						context.strokeText(action.string.substr(action.startIndex, action.len), 0, 0);
					}, action.startPoint.x, action.startPoint.y);
					break;
				case ActionType.META_STRETCHTEXT_ACTION:
					textAction(function() {
						context.fillText(action.string.substr(action.startIndex, action.len), 0, 0, action.width);
						context.strokeText(action.string.substr(action.startIndex, action.len), 0, 0, action.width);
					}, action.startPoint.x, action.startPoint.y);
					break;
				case ActionType.META_FILLCOLOR_ACTION:
					context.fillStyle = action.set ? action.color : 'transparent';
					break;
				case ActionType.META_LINECOLOR_ACTION:
					context.strokeStyle = action.set ? action.color : 'transparent';
					break;
				case ActionType.META_TEXTCOLOR_ACTION:
					textFillStyle = action.color;
					break;
				case ActionType.META_TEXTFILLCOLOR_ACTION:
					// Not sure why we have both textcolor and textfillcolor. We use the last encountered.
					if(action.set) textFillStyle = action.color;
					break;
				case ActionType.META_TEXTLINECOLOR_ACTION:
					textStrokeStyle = action.set ? action.color : 'transparent';
					break;
				case ActionType.META_RECT_ACTION:
					context.rect(action.left, action.top, action.right - action.left, action.bottom - action.top);
					context.fill();
					context.stroke();
					break;
				case ActionType.META_POLYLINE_ACTION:
					context.beginPath();
					context.moveTo(action.simplePolygon[0].x, action.simplePolygon[0].y);
					for(var j = 1; j < action.simplePolygon.length; j++) {
						context.lineTo(action.simplePolygon[j].x, action.simplePolygon[j].y);
					}
					context.fill();
					context.stroke();
					break;
				case ActionType.META_TRANSPARENT_ACTION:
					context.globalAlpha = 1 - action.transparentPercentage / 100;
					// Fall through.
				case ActionType.META_POLYPOLYGON_ACTION:
					action.simplePolygons.forEach(function(simplePolygon) {
						context.beginPath();
						context.moveTo(simplePolygon[0].x, simplePolygon[0].y);
						for(var j = 1; j < simplePolygon.length; j++) {
							context.lineTo(simplePolygon[j].x, simplePolygon[j].y);
						}
						context.fill();
						context.stroke();
					});
					context.globalAlpha = 1;
					break;
				case ActionType.META_BMPEXSCALE_ACTION:
					var img = new Image();
					img.src = 'data:image/svg+xml,' + encodeURIComponent([
						'<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="' + action.size.width + '" height="' + action.size.height + '">',
						'	<defs>',
						'		<filter id="invert">',
						'			<feColorMatrix in="SourceGraphic" type="matrix" values="-1 0 0 0 1',
						'																	0 -1 0 0 1',
						'																	0 0 -1 0 1',
						'																	0 0  0 1 0"/>',
						'		</filter>',
						'		<mask id="maskImage">',
						'			<image x="0" y="0" width="' + action.size.width + '" height="' + action.size.height + '" xlink:href="' + bitmapUrl(action.bitmap.transparentMask) + '" filter="url(#invert)" />',
						'		</mask>',
						'	</defs>',
						'	<image x="0" y="0" width="' + action.size.width + '" height="' + action.size.height + '" xlink:href="' + bitmapUrl(action.bitmap.bitmap) + '" mask="url(#maskImage)" />',
						'</svg>'
					].join('\n'));
					// Chrome parses images in data urls synchronously, but Firefox does not.
					// The proper way to work around this would be to wait for the load event
					// of the image, and switch svm.js and odt.js to an asynchronous API.
					// However, since we're handling a hopefully uncommon case, and the rest
					// of the canvas API is synchronous (as will hopefully in the future be
					// rendering images), and switching to and using an asynchronous API is a
					// lot of work, we use a hack instead.
					// The trick is to use a legacy synchronous construct (like alert, confirm,
					// or, our choice, a synchronous XMLHttpRequest) which blocks javascript
					// execution, but not, apparently, parsing images.
					// img.complete indicates that the image has loaded, and img.naturalWidth
					// indicates that the image has been parsed and is "available" for drawing.
					var syncRequestsMade = 0;
					while(!img.complete || !img.naturalWidth) {
						var req = new window.XMLHttpRequest(); // "window." for the strange environment in Firetext in which this script runs.
						req.open('GET', 'data:text/plain,', false);
						req.send();
						if(++syncRequestsMade > 20) { // In my testing Firefox takes 4 requests to parse an image.
							console.error('[svm.js] Synchronously waiting for the image to be parsed took too long, aborted.');
							break;
						}
					}
					context.drawImage(img, action.point.x, action.point.y, action.size.width, action.size.height);
					break;
				case ActionType.META_FLOATTRANSPARENT_ACTION:
					context.drawImage(action.metaFile, action.point.x, action.point.y, action.size.width, action.size.height);
					break;
				/*case ActionType.META_ISECTRECTCLIPREGION_ACTION:
					console.log('rect region>', action.rect.left, action.rect.top, action.rect.right - action.rect.left, action.rect.bottom - action.rect.top);
					context.rect(action.rect.left, action.rect.top, action.rect.right - action.rect.left, action.rect.bottom - action.rect.top);
					context.clip('evenodd');
					break;
				case ActionType.META_ISECTREGIONCLIPREGION_ACTION:
					if(action.region) {
						var entries = action.region.entries;
						if(entries.length === 2 && entries[0].type === 0 && entries[1].type === 1) {
							console.log('region>', entries[1].left, entries[0].top, entries[1].right - entries[1].left, entries[0].bottom - entries[0].top);
							context.rect(entries[1].left, entries[0].top, entries[1].right - entries[1].left, entries[0].bottom - entries[0].top);
							context.clip('evenodd');
						} else {
							console.error('[svm.js] Only simple band regions with two entries are supported.');
						}
					}
					break;*/
				default:
					console.error('[svm.js] Unknown action type: ' + actionTypeName + ' (' + actionType + ')');
					break;
			}
		} else if(unrecognizedActionTypeNames.indexOf(actionTypeName) === -1) {
			unrecognizedActionTypeNames.push(actionTypeName);
		}
	}
	console.warn('[svm.js] The following action types are unsupported and were ignored: ', unrecognizedActionTypeNames);
	out.bytesRead = index;
	return canvas;
}