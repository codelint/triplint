Element.prototype.wxImeEmojiFix = function(){
    // return if it's not wx browser
    if(!~navigator.userAgent.toLowerCase().indexOf("micromessenger")){
        return;
    }
    var textarea = this,
        wxief = {
            // target textarea/input
            _textarea: textarea,
            // input position
            _posi: 0,
            // need for calculation
            _calcPosition: true,
            // all emoji unicode from sougou input
            _emojis: {
                "E001": "%uD83D%uDC66", "E002": "%uD83D%uDC67", "E003": "%uD83D%uDC8B", "E004": "%uD83D%uDC68", "E005": "%uD83D%uDC69", "E006": "%uD83D%uDC5A", "E007": "%uD83D%uDC5E", "E008": "%uD83D%uDCF7", "E009": "", "E00A": "", "E00B": "%uD83D%uDCE0", "E00C": "%uD83D%uDCBB", "E00D": "%uD83D%uDC4A", "E00E": "%uD83D%uDC4D", "E00F": "", "E010": "%u270A", "E011": "%u270C", "E012": "", "E013": "%uD83C%uDFBF", "E014": "%u26F3", "E015": "%uD83C%uDFBE", "E016": "%u26BE", "E017": "%uD83C%uDFC4", "E018": "%u26BD", "E019": "%uD83D%uDC1F", "E01A": "%uD83D%uDC34", "E01B": "%uD83D%uDE97", "E01C": "%u26F5", "E01D": "%u2708", "E01E": "%uD83D%uDE83", "E01F": "%uD83D%uDE85", "E020": "%u2753", "E021": "%u2757", "E022": "%u2764", "E023": "%uD83D%uDC94", "E024": "%uD83D%uDD50", "E025": "%uD83D%uDD51", "E026": "%uD83D%uDD52", "E027": "%uD83D%uDD53", "E028": "%uD83D%uDD54", "E029": "%uD83D%uDD55", "E02A": "%uD83D%uDD56", "E02B": "%uD83D%uDD57", "E02C": "%uD83D%uDD58", "E02D": "%uD83D%uDD59", "E02E": "%uD83D%uDD5A", "E02F": "%uD83D%uDD5B", "E030": "%uD83C%uDF38", "E031": "%uD83D%uDD31", "E032": "%uD83C%uDF39", "E033": "%uD83C%uDF84", "E034": "%uD83D%uDC8D", "E035": "%uD83D%uDC8E", "E036": "%uD83C%uDFE0", "E037": "%u26EA", "E038": "%uD83C%uDFE2", "E039": "%uD83D%uDE89", "E03A": "%u26FD", "E03B": "%uD83D%uDDFB", "E03C": "%uD83C%uDFA4", "E03D": "%uD83C%uDFA5", "E03E": "%uD83C%uDFB5", "E03F": "", "E040": "%uD83C%uDFB7", "E041": "%uD83C%uDFB8", "E042": "%uD83C%uDFBA", "E043": "", "E044": "", "E045": "%u2615", "E046": "%uD83C%uDF70", "E047": "%uD83C%uDF7A", "E048": "%u26C4", "E049": "%u2601", "E04A": "%u2600", "E04B": "%u2614", "E04C": "%uD83C%uDF19", "E04D": "%uD83C%uDF04", "E04E": "%uD83D%uDC7C", "E04F": "%uD83D%uDC31", "E050": "%uD83D%uDC2F", "E051": "%uD83D%uDC3B", "E052": "%uD83D%uDC36", "E053": "%uD83D%uDC2D", "E054": "%uD83D%uDC33", "E055": "%uD83D%uDC27", "E056": "%uD83D%uDE0A", "E057": "%uD83D%uDE03", "E058": "%uD83D%uDE1E", "E059": "%uD83D%uDE20", "E05A": "%uD83D%uDCA9", "E05B": "", "E101": "%uD83D%uDCEC", "E102": "%uD83D%uDCEE", "E103": "", "E104": "", "E105": "%uD83D%uDE1C", "E106": "%uD83D%uDE0D", "E107": "%uD83D%uDE31", "E108": "%uD83D%uDE13", "E109": "%uD83D%uDC35", "E10A": "%uD83D%uDC19", "E10B": "%uD83D%uDC37", "E10C": "%uD83D%uDC7D", "E10D": "%uD83D%uDE80", "E10E": "%uD83D%uDC51", "E10F": "%uD83D%uDCA1", "E110": "%uD83C%uDF40", "E111": "%uD83D%uDC8F", "E112": "%uD83C%uDF81", "E113": "%uD83D%uDD2B", "E114": "%uD83D%uDD0D", "E115": "%uD83C%uDFC3", "E116": "%uD83D%uDD28", "E117": "%uD83C%uDF86", "E118": "%uD83C%uDF41", "E119": "%uD83C%uDF42", "E11A": "%uD83D%uDC7F", "E11B": "%uD83D%uDC7B", "E11C": "%uD83D%uDC80", "E11D": "%uD83D%uDD25", "E11E": "%uD83D%uDCBC", "E11F": "%uD83D%uDCBA", "E120": "%uD83C%uDF54", "E121": "%u26F2", "E122": "%u26FA", "E123": "%u2668", "E124": "%uD83C%uDFA1", "E125": "%uD83C%uDFAB", "E126": "%uD83D%uDCBF", "E127": "%uD83D%uDCC0", "E128": "%uD83D%uDCFB", "E129": "%uD83D%uDCFC", "E12A": "%uD83D%uDCFA", "E12B": "%uD83D%uDC7E", "E12C": "%u303D", "E12D": "%uD83C%uDC04", "E12E": "%uD83C%uDD9A", "E12F": "%uD83D%uDCB0", "E130": "%uD83C%uDFAF", "E131": "%uD83C%uDFC6", "E132": "%uD83C%uDFC1", "E133": "%uD83C%uDFB0", "E134": "%uD83D%uDC0E", "E135": "%uD83D%uDEA4", "E136": "%uD83D%uDEB2", "E137": "%uD83D%uDEA7", "E138": "%uD83D%uDEB9", "E139": "%uD83D%uDEBA", "E13A": "%uD83D%uDEBC", "E13B": "%uD83D%uDC89", "E13C": "%uD83D%uDCA4", "E13D": "%u26A1", "E13E": "%uD83D%uDC60", "E13F": "%uD83D%uDEC0", "E140": "%uD83D%uDEBD", "E141": "%uD83D%uDD0A", "E142": "%uD83D%uDCE2", "E143": "%uD83C%uDF8C", "E144": "", "E145": "", "E146": "%uD83C%uDF06", "E147": "%uD83C%uDF73", "E148": "", "E149": "%uD83D%uDCB1", "E14A": "", "E14B": "%uD83D%uDCE1", "E14C": "%uD83D%uDCAA", "E14D": "%uD83C%uDFE6", "E14E": "%uD83D%uDEA5", "E14F": "%uD83C%uDD7F", "E150": "%uD83D%uDE8F", "E151": "%uD83D%uDEBB", "E152": "%uD83D%uDC6E", "E153": "%uD83C%uDFE3", "E154": "%uD83C%uDFE7", "E155": "%uD83C%uDFE5", "E156": "%uD83C%uDFEA", "E157": "%uD83C%uDFEB", "E158": "%uD83C%uDFE8", "E159": "%uD83D%uDE8C", "E15A": "%uD83D%uDE95", "E200": "", "E201": "%uD83D%uDEB6", "E202": "%uD83D%uDEA2", "E203": "%uD83C%uDE01", "E204": "%uD83D%uDC9F", "E205": "%u2734", "E206": "%u2733", "E207": "%uD83D%uDD1E", "E208": "%uD83D%uDEAD", "E209": "%uD83D%uDD30", "E20A": "%u267F", "E20B": "", "E20C": "%u2665", "E20D": "%u2666", "E20E": "%u2660", "E20F": "%u2663", "E210": "%23%u20E3", "E211": "%u27BF", "E212": "%uD83C%uDD95", "E213": "%uD83C%uDD99", "E214": "%uD83C%uDD92", "E215": "%uD83C%uDE36", "E216": "%uD83C%uDE1A", "E217": "%uD83C%uDE37", "E218": "%uD83C%uDE38", "E219": "", "E21A": "", "E21B": "%u2B1C", "E21C": "1%u20E3", "E21D": "2%u20E3", "E21E": "3%u20E3", "E21F": "4%u20E3", "E220": "5%u20E3", "E221": "6%u20E3", "E222": "7%u20E3", "E223": "8%u20E3", "E224": "9%u20E3", "E225": "0%u20E3", "E226": "%uD83C%uDE50", "E227": "%uD83C%uDE39", "E228": "%uD83C%uDE02", "E229": "%uD83C%uDD94", "E22A": "%uD83C%uDE35", "E22B": "%uD83C%uDE33", "E22C": "%uD83C%uDE2F", "E22D": "%uD83C%uDE3A", "E22E": "%uD83D%uDC46", "E22F": "%uD83D%uDC47", "E230": "%uD83D%uDC48", "E231": "%uD83D%uDC49", "E232": "%u2B06", "E233": "%u2B07", "E234": "%u27A1", "E235": "%u2B05", "E236": "%u2197", "E237": "%u2196", "E238": "%u2198", "E239": "%u2199", "E23A": "%u25B6", "E23B": "%u25C0", "E23C": "%u23E9", "E23D": "%u23EA", "E23E": "", "E23F": "%u2648", "E240": "%u2649", "E241": "%u264A", "E242": "%u264B", "E243": "%u264C", "E244": "%u264D", "E245": "%u264E", "E246": "%u264F", "E247": "%u2650", "E248": "%u2651", "E249": "%u2652", "E24A": "%u2653", "E24B": "%u26CE", "E24C": "%uD83D%uDD1D", "E24D": "%uD83C%uDD97", "E24E": "%A9", "E24F": "%AE", "E250": "", "E251": "", "E252": "%u26A0", "E253": "%uD83D%uDC81", "E300": "", "E301": "", "E302": "%uD83D%uDC54", "E303": "%uD83C%uDF3A", "E304": "%uD83C%uDF37", "E305": "%uD83C%uDF3B", "E306": "%uD83D%uDC90", "E307": "%uD83C%uDF34", "E308": "%uD83C%uDF35", "E309": "%uD83D%uDEBE", "E30A": "%uD83C%uDFA7", "E30B": "%uD83C%uDF76", "E30C": "%uD83C%uDF7B", "E30D": "%u3297", "E30E": "%uD83D%uDEAC", "E30F": "%uD83D%uDC8A", "E310": "%uD83C%uDF88", "E311": "%uD83D%uDCA3", "E312": "%uD83C%uDF89", "E313": "%u2702", "E314": "%uD83C%uDF80", "E315": "%u3299", "E316": "%uD83D%uDCBE", "E317": "%uD83D%uDCE3", "E318": "%uD83D%uDC52", "E319": "%uD83D%uDC57", "E31A": "%uD83D%uDC61", "E31B": "%uD83D%uDC62", "E31C": "%uD83D%uDC84", "E31D": "%uD83D%uDC85", "E31E": "%uD83D%uDC86", "E31F": "%uD83D%uDC87", "E320": "%uD83D%uDC88", "E321": "%uD83D%uDC58", "E322": "%uD83D%uDC59", "E323": "%uD83D%uDC5C", "E324": "%uD83C%uDFAC", "E325": "%uD83D%uDD14", "E326": "%uD83C%uDFB6", "E327": "", "E328": "%uD83D%uDC97", "E329": "%uD83D%uDC98", "E32A": "%uD83D%uDC99", "E32B": "%uD83D%uDC9A", "E32C": "%uD83D%uDC9B", "E32D": "%uD83D%uDC9C", "E32E": "%u2728", "E32F": "%u2B50", "E330": "%uD83D%uDCA8", "E331": "%uD83D%uDCA6", "E332": "%u2B55", "E333": "%u274C", "E334": "%uD83D%uDCA2", "E335": "%uD83C%uDF1F", "E336": "%u2754", "E337": "%u2755", "E338": "%uD83C%uDF75", "E339": "%uD83C%uDF5E", "E33A": "%uD83C%uDF66", "E33B": "%uD83C%uDF5F", "E33C": "%uD83C%uDF61", "E33D": "%uD83C%uDF58", "E33E": "%uD83C%uDF5A", "E33F": "%uD83C%uDF5D", "E340": "%uD83C%uDF5C", "E341": "%uD83C%uDF5B", "E342": "%uD83C%uDF59", "E343": "%uD83C%uDF62", "E344": "%uD83C%uDF63", "E345": "%uD83C%uDF4E", "E346": "%uD83C%uDF4A", "E347": "%uD83C%uDF53", "E348": "%uD83C%uDF49", "E349": "%uD83C%uDF45", "E34A": "%uD83C%uDF46", "E34B": "%uD83C%uDF82", "E34C": "%uD83C%uDF71", "E34D": "%uD83C%uDF72", "E34E": "", "E34F": "", "E401": "%uD83D%uDE25", "E402": "%uD83D%uDE0F", "E403": "%uD83D%uDE14", "E404": "%uD83D%uDE01", "E405": "%uD83D%uDE09", "E406": "%uD83D%uDE23", "E407": "%uD83D%uDE16", "E408": "%uD83D%uDE2A", "E409": "%uD83D%uDE1D", "E40A": "%uD83D%uDE0C", "E40B": "%uD83D%uDE28", "E40C": "%uD83D%uDE37", "E40D": "%uD83D%uDE33", "E40E": "%uD83D%uDE12", "E40F": "%uD83D%uDE30", "E410": "%uD83D%uDE32", "E411": "%uD83D%uDE2D", "E412": "%uD83D%uDE02", "E413": "%uD83D%uDE22", "E414": "%u263A", "E415": "%uD83D%uDE04", "E416": "%uD83D%uDE21", "E417": "%uD83D%uDE1A", "E418": "%uD83D%uDE18", "E419": "%uD83D%uDC40", "E41A": "%uD83D%uDC43", "E41B": "%uD83D%uDC42", "E41C": "%uD83D%uDC44", "E41D": "%uD83D%uDE4F", "E41E": "%uD83D%uDC4B", "E41F": "%uD83D%uDC4F", "E420": "%uD83D%uDC4C", "E421": "%uD83D%uDC4E", "E422": "%uD83D%uDC50", "E423": "%uD83D%uDE45", "E424": "%uD83D%uDE46", "E425": "%uD83D%uDC91", "E426": "", "E427": "%uD83D%uDE4C", "E428": "%uD83D%uDC6B", "E429": "%uD83D%uDC6F", "E42A": "%uD83C%uDFC0", "E42B": "%uD83C%uDFC8", "E42C": "%uD83C%uDFB1", "E42D": "%uD83C%uDFCA", "E42E": "%uD83D%uDE99", "E42F": "%uD83D%uDE9A", "E430": "%uD83D%uDE92", "E431": "%uD83D%uDE91", "E432": "%uD83D%uDE93", "E433": "%uD83C%uDFA2", "E434": "%uD83D%uDE87", "E435": "%uD83D%uDE84", "E436": "%uD83C%uDF8D", "E437": "%uD83D%uDC9D", "E438": "%uD83C%uDF8E", "E439": "%uD83C%uDF93", "E43A": "%uD83C%uDF92", "E43B": "%uD83C%uDF8F", "E43C": "%uD83C%uDF02", "E43D": "%uD83D%uDC92", "E43E": "%uD83C%uDF0A", "E43F": "%uD83C%uDF67", "E440": "%uD83C%uDF87", "E441": "%uD83D%uDC1A", "E442": "%uD83C%uDF90", "E443": "%uD83C%uDF00", "E444": "%uD83C%uDF3E", "E445": "%uD83C%uDF83", "E446": "%uD83C%uDF91", "E447": "%uD83C%uDF43", "E448": "%uD83C%uDF85", "E449": "%uD83C%uDF05", "E44A": "%uD83C%uDF07", "E44B": "%uD83C%uDF03", "E44C": "%uD83C%uDF08", "E500": "", "E501": "%uD83C%uDFE9", "E502": "%uD83C%uDFA8", "E503": "%uD83C%uDFA9", "E504": "%uD83C%uDFEC", "E505": "%uD83C%uDFEF", "E506": "%uD83C%uDFF0", "E507": "%uD83C%uDFA6", "E508": "%uD83C%uDFED", "E509": "%uD83D%uDDFC", "E50A": "", "E50B": "%uD83C%uDDEF%uD83C%uDDF5", "E50C": "%uD83C%uDDFA%uD83C%uDDF8", "E50D": "%uD83C%uDDEB%uD83C%uDDF7", "E50E": "%uD83C%uDDE9%uD83C%uDDEA", "E50F": "%uD83C%uDDEE%uD83C%uDDF9", "E510": "%uD83C%uDDEC%uD83C%uDDE7", "E511": "", "E512": "", "E513": "%uD83C%uDDE8%uD83C%uDDF3", "E514": "%uD83C%uDDF0%uD83C%uDDF7", "E515": "%uD83D%uDC71", "E516": "%uD83D%uDC72", "E517": "%uD83D%uDC73", "E518": "%uD83D%uDC74", "E519": "%uD83D%uDC75", "E51A": "%uD83D%uDC76", "E51B": "%uD83D%uDC77", "E51C": "%uD83D%uDC78", "E51D": "%uD83D%uDDFD", "E51E": "%uD83D%uDC82", "E51F": "%uD83D%uDC83", "E520": "%uD83D%uDC2C", "E521": "%uD83D%uDC26", "E522": "%uD83D%uDC20", "E523": "%uD83D%uDC24", "E524": "%uD83D%uDC39", "E525": "%uD83D%uDC1B", "E526": "%uD83D%uDC18", "E527": "%uD83D%uDC28", "E528": "%uD83D%uDC12", "E529": "%uD83D%uDC11", "E52A": "%uD83D%uDC3A", "E52B": "%uD83D%uDC2E", "E52C": "%uD83D%uDC30", "E52D": "%uD83D%uDC0D", "E52E": "%uD83D%uDC14", "E52F": "%uD83D%uDC17", "E530": "%uD83D%uDC2B", "E531": "%uD83D%uDC38", "E532": "%uD83C%uDD70", "E533": "%uD83C%uDD71", "E534": "%uD83C%uDD8E", "E535": "%uD83C%uDD7E", "E536": "%uD83D%uDC3E", "E537": "%u2122"
            },
            // detect emoji from input string
            _wxEmojiDetect: function(){
                // get the input string and find out emoji code
                var val = escape(wxief._textarea.value),
                    patt = /%uE[0-5][0-5][0-9A-F]%20/g;
                // replace the emojis
                val = val.replace(patt, function(matchedStr){
                    var str = matchedStr.substr(2, matchedStr.length - 5).toUpperCase();
                    if(wxief._emojis[str])
                        return wxief._emojis[str];
                    else
                        return matchedStr;
                });
                // fill back the string with correct emoji
                wxief._textarea.value = unescape(val);
                // set input cursor to the correct position
                if(wxief._textarea.setSelectionRange){
                    wxief._textarea.focus();
                    wxief._textarea.setSelectionRange(wxief._posi, wxief._posi);
                }else if(wxief._textarea.createTextRange){
                    var range = wxief._textarea.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', wxief._posi);
                    range.moveStart('character', wxief._posi);
                    range.select();
                }
                wxief._calcPosition = true;
                wxief._getPosition();
                wxief._removeEvent(wxief._textarea, "input", wxief._setFix);
                wxief._addEvent(wxief._textarea, "input", wxief._setFix);
            },
            // find the input position of the input
            _selectedPosition: function(){
                if(document.selection){
                    sel = document.selection.createRange();
                    var secondPosi = sel.text.length;
                    sel.moveStart("character", (0 - wxief._textarea.value.length));
                    return sel.text.length;
                }
                else{
                    if(wxief._textarea.selectionStart || wxief._textarea.selectionStart == '0')
                        return wxief._textarea.selectionStart
                    else
                        return wxief._textarea.value.length;
                }
            },
            // bind or unbind detection
            _setFix: function(){
                wxief._calcPosition = false;
                wxief._removeEvent(wxief._textarea, "input", wxief._setFix);
                setTimeout(function(){
                    wxief._wxEmojiDetect();
                }, 10);
            },
            // input position detection loop
            _getPosition: function(){
                wxief._posi = wxief._selectedPosition();
                if(wxief._calcPosition)
                    setTimeout(wxief._getPosition, 10);
            },
            _addEvent: function(target, evt, func){
                if(target.addEventListener)
                    target.addEventListener(evt, func, false);
                else if(target.attachEvent)
                    target.attachEvent("on" + evt, func);
                else target["on" + evt] = func;
            },
            _removeEvent: function(target, evt, func){
                if(target.removeEventListener)
                    target.removeEventListener(evt, func, false);
                else if(target.detachEvent)
                    target.detachEvent("on" + evt, func);
                else target["on" + evt] = null;
            },
            _init: function(){
                if(!!~navigator.userAgent.toLowerCase().indexOf("micromessenger")){
                    wxief._addEvent(wxief._textarea, "input", wxief._setFix);
                    wxief._getPosition();
                }
            }
        };
    wxief._init();
};