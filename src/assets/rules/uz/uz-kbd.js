( function ( $ ) {
	'use strict';

	var uzKbd = {
		id: 'uz-kbd',
		name: 'Uzbek keyboard',
		description: 'Uzbek input method with Russian keyboard layout',
		date: '2013-02-12',
		URL: 'http://github.com/wikimedia/jquery.ime',
		author: 'Parag Nemade',
		license: 'GPLv3',
		version: '1.0',
		patterns: [
			[ '`', 'ё' ],
			[ 'q', 'й' ],
			[ 'w', 'ц' ],
			[ 'e', 'у' ],
			[ 'r', 'к' ],
			[ 't', 'е' ],
			[ 'y', 'н' ],
			[ 'u', 'г' ],
			[ 'i', 'ш' ],
			[ 'o', 'ў' ],
			[ 'p', 'з' ],
			[ '\\[', 'х' ],
			[ '\\]', 'ъ' ],
			[ 'a', 'ф' ],
			[ 's', 'қ' ],
			[ 'd', 'в' ],
			[ 'f', 'а' ],
			[ 'g', 'п' ],
			[ 'h', 'р' ],
			[ 'j', 'о' ],
			[ 'k', 'л' ],
			[ 'l', 'д' ],
			[ ';', 'ж' ],
			[ '\'', 'э' ],
			[ '\\\\', '\\' ],
			[ 'z', 'я' ],
			[ 'x', 'ч' ],
			[ 'c', 'с' ],
			[ 'v', 'м' ],
			[ 'b', 'и' ],
			[ 'n', 'т' ],
			[ 'm', 'ь' ],
			[ ',', 'б' ],
			[ '\\.', 'ю' ],
			[ '/', '.' ],
			[ '\\!', '!' ],
			[ '\\@', '\"' ],
			[ '\\#', '№' ],
			[ '\\$', ';' ],
			[ '\\%', '%' ],
			[ '\\^', ':' ],
			[ '\\&', '?' ],
			[ '\\*', '*' ],
			[ '\\(', '(' ],
			[ '\\)', ')' ],
			[ '\\-', 'ғ' ],
			[ '\\_', 'Ғ' ],
			[ '\\=', 'ҳ' ],
			[ '\\+', 'Ҳ' ],
			[ '\\~', 'Ё' ],
			[ 'Q', 'Й' ],
			[ 'W', 'Ц' ],
			[ 'E', 'У' ],
			[ 'R', 'К' ],
			[ 'T', 'Е' ],
			[ 'Y', 'Н' ],
			[ 'U', 'Г' ],
			[ 'I', 'Ш' ],
			[ 'O', 'Ў' ],
			[ 'P', 'З' ],
			[ '\\{', 'Х' ],
			[ '\\}', 'Ъ' ],
			[ 'A', 'Ф' ],
			[ 'S', 'Қ' ],
			[ 'D', 'В' ],
			[ 'F', 'А' ],
			[ 'G', 'П' ],
			[ 'H', 'Р' ],
			[ 'J', 'О' ],
			[ 'K', 'Л' ],
			[ 'L', 'Д' ],
			[ ':', 'Ж' ],
			[ '\"', 'Э' ],
			[ '\\|', '|' ],
			[ 'Z', 'Я' ],
			[ 'X', 'Ч' ],
			[ 'C', 'С' ],
			[ 'V', 'М' ],
			[ 'B', 'И' ],
			[ 'N', 'Т' ],
			[ 'M', 'Ь' ],
			[ '\\<', 'Б' ],
			[ '\\>', 'Ю' ],
			[ '\\?', ',' ]
		]
	};
	$.ime.register( uzKbd );

}( jQuery ) );
