# angular-editor-fabric-js

> Drag-and-drop editor based on Fabricjs for Angular v5 with multiple options

### Preview

![](https://s1.gifgif.io/0qQV2a.gif)

### Example

![Imgur](https://i.imgur.com/sQsL8G4.png)

### Output

![Imgur](https://i.imgur.com/hgTEb20.png)

### Features

- Export to image
- Export to SVG
- Save to localStorage
- Load From LocalStorage
- Clean workspace
- Resize workspace
- Add text
- Add Images
- Upload Images
- Add figures (Rectangle, Triangle, Square, Circle)
- Render to JSON
- Clone Object
- Sent to front Object
- Sent to back Object
- Delete Object
- Unselect Object
- Add ID to Object
- Opacity to Object
- Color to Object
- Font Famility to Object
- Text Align to Object
- Style to Object
- Font Size to Object
- Line Height To Object
- Char Spacing to Object

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.6.5.

## Installation

```bash
git clone https://github.com/kevoj/angular-editor-fabric-js.git
cd angular-editor-fabric-js
npm install
```

## Start

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## License

MIT © [Leonardo Rico](https://github.com/kevoj/angular-editor-fabric-js/blob/master/LICENSE)
/_"../node_modules/emojione/extras/css/emojione-awesome.css",_/

<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <title></title>
    <meta http-equiv="content-type" content="text/html; charset=UTF-8">
    <meta name="robots" content="noindex, nofollow">
    <meta name="googlebot" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <script type="text/javascript" src="jquery.min.js"></script>

    <link rel="stylesheet" type="text/css" href="jquery-ui.css">
    <style type="text/css">

    </style>
    <!-- TODO: Missing CoffeeScript 2 -->

    <script type="text/javascript">
        $(window).load(function() {

            $('.content:not(.focus)').keyup(function() {


                var value = $(this).val();
                var contentAttr = $(this).attr('name');

                $('.' + contentAttr + '').html(value.replace(/\r?\n/g, '<br/>'));

            })


        });
    </script>

</head>

<body>
    start typeing in textarea whatever text you type it will also apear in div which has class <strong>'content'</strong> but when I press enter for new line in textarea when i get the problem div named <strong>'content'</strong> will not making new line
    please help

    <br />
    <textarea name="mas" rows="15" class="content"></textarea>
    <p>&nbsp;</p>
    <div class="mas">Texts Comes here</div>

</body>

</html>
