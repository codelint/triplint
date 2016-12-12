WikiEngine = (function(){
    return {
        toHtml: function(str){
            str = str.replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace( /(^|\n)= ([^\n]*) =(\n|$)/g , '$1<h1>$2</h1>$3')
                .replace( /(^|\n)== ([^\n]*) ==(\n|$)/g , '$1<h2>$2</h2>$3')
                .replace( /(^|\n)=== ([^\n]*) ===(\n|$)/g , '$1<h3>$2</h3>$3')
//                .replace( /(((^|\n)[0-9]+\s+([^\n<>]*))+)/g , '<ul>$1</ul>')
//                .replace( /(((^|\n)\*\s+([^\n<>]*))+)/g , '<ul>$1</ul>')
                .replace( /(^|\n)\*\s+([^<>\n]*)/g , '<li>$2</li>')
                .replace( /(^|\n)[0-9]+\s+([^<>\n]*)/g , '<ol>$2</ol>')
                .replace(/\n/g, '<br>');
            return str;
        }
    }
})();
String.prototype.wiki2html = function(){
    return WikiEngine.toHtml(this.toString());
};