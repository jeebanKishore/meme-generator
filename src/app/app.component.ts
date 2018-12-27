import { Component, OnInit } from '@angular/core';

import 'fabric';
import * as FileSaver from 'file-saver';
import 'textfit';
import 'html2canvas';
import 'blob';
declare const fabric: any;
declare const jquery: any;
declare const $: any;
declare const textFit: any;
declare const myfileSaver: any;
declare const domtoimage: any;
declare const html2canvas: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public canvas: any;
  public props: any = {
    canvasFill: '#ffffff',
    textBackgroundfill: '#ffffff',
    textTLfill: '#000000',
    canvasImage: '',
    id: null,
    opacity: null,
    fill: null,
    fontSize: null,
    lineHeight: null,
    charSpacing: null,
    fontWeight: null,
    fontStyle: null,
    textAlign: null,
    fontFamily: null,
    TextDecoration: ''
  };

  public textString: string;
  public upperTextString: string;
  public lowerTextString: string;
  public url = '';
  public urlBg = '';
  public size: any = {
    width: 540,
    height: 500
  };

  public json: any;
  public globalEditor = false;
  public textEditor = false;
  public imageEditor = false;
  public figureEditor = false;
  public selected: any;

  constructor() {}

  ngOnInit() {
    // setup front side canvas
    this.canvas = new fabric.Canvas('canvas', {
      hoverCursor: 'pointer',
      selection: true,
      selectionBorderColor: 'blue',
      preserveObjectStacking: true
    });
     /*if (window.location.origin !== atob('aHR0cDovL2l0bWVtZXMuY29t')) {
       document.body.innerHTML = '';
     }*/
    this.canvas.backgroundColor = 'white';
    let $ced, ime, $imeSelector, $langSelector;
    $.ime.setPath('/assets/');
    $ced = $('#ced');
    $ced.ime({
      showSelector: false
    });
    ime = $ced.data('ime');
    ime.enable();
    $langSelector = $('select#language');
    $imeSelector = $('select#imeSelector');
    ime.getLanguageCodes().forEach(function(lang) {
      $langSelector.append(
        $('<option/>')
          .attr('value', lang)
          .text(ime.getAutonym(lang))
      );
    });
    $langSelector.on('change', function() {
      const lang = $langSelector.find('option:selected').val() || null;
      ime.setLanguage(lang);
    });
    $ced.on('imeLanguageChange', function() {
      listInputMethods(ime.getLanguage());
    });

    function listInputMethods(lang) {
      $imeSelector.empty();
      ime.getInputMethods(lang).forEach(function(inputMethod) {
        $imeSelector.append(
          $('<option/>')
            .attr('value', inputMethod.id)
            .text(inputMethod.name)
        );
      });
      $imeSelector.trigger('change');
    }

    $imeSelector.on('change', function() {
      const inputMethodId = $imeSelector.find('option:selected').val();
      ime.load(inputMethodId).done(function() {
        ime.setIM(inputMethodId);
      });
    });

    $(function() {
      $('div#upperText, div#lowerText').froalaEditor({
        toolbarInline: true,
        charCounterCount: false,
        toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'subscript', 'superscript', '|', 'fontFamily', 'fontSize', 'color', 'inlineClass', 'inlineStyle', 'paragraphStyle', 'lineHeight', '|', 'paragraphFormat', 'align', 'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertTable', '|', 'emoticons', 'fontAwesome', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|', '|', 'undo', 'redo']
      });
    });

    this.canvas.on({
      'object:moving': e => {},
      'object:modified': e => {},
      'object:selected': e => {
        const selectedObject = e.target;
        this.selected = selectedObject;
        selectedObject.hasRotatingPoint = true;
        selectedObject.transparentCorners = false;
        selectedObject.setControlsVisibility({
          mt: false,
          mb: false,
          ml: false,
          mr: false
        });
        // selectedObject.cornerColor = 'rgba(255, 87, 34, 0.7)';

        this.resetPanels();

        if (selectedObject.type !== 'group' && selectedObject) {
          this.getId();
          this.getOpacity();

          switch (selectedObject.type) {
            case 'rect':
            case 'circle':
            case 'triangle':
              this.figureEditor = true;
              this.getFill();
              break;
            case 'i-text':
              this.textEditor = true;
              this.getLineHeight();
              this.getCharSpacing();
              this.getBold();
              this.getFontStyle();
              this.getFill();
              this.getTextDecoration();
              this.getTextAlign();
              this.getFontFamily();
              this.getCharStroke();
              this.getCharStrokeWidth();
              break;
            case 'image':
              // console.log('image');
              break;
          }
        }
      },
      'selection:cleared': e => {
        this.selected = null;
        this.resetPanels();
      }
    });

    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);

    // get references to the html canvas element & its context
    // this.canvas.on('mouse:down', (e) => {
    // let canvasElement: any = document.getElementById('canvas');
    // console.log(canvasElement)
    // });
  }

  /*------------------------Block elements------------------------*/

  // Block 'Size'
  changeSize(event: any) {
    this.canvas.setWidth(this.size.width);
    this.canvas.setHeight(this.size.height);
    if (this.props.canvasImage) {
      this.setCanvasImage(this.props.canvasImage);
    }
  }

  // Block 'Add text'
  onKey(event) {
    const inputValue = event.target.value;
    // console.log(inputValue);
    this.textString = inputValue;
  }
  addText() {
    const textString = this.textString;
    const text = new fabric.IText(textString, {
      left: 100,
      top: 50,
      fontFamily: 'helvetica',
      angle: 0,
      fill: '#000000',
      scaleX: 0.5,
      scaleY: 0.5,
      fontWeight: '',
      hasRotatingPoint: true
    });
    this.extend(text, this.randomId());
    this.canvas.add(text);
    this.selectItemAfterAdded(text);
    this.textString = '';
  }

  // Block 'Add images'

  getImgPolaroid(event: any) {
    const el = event.target;
    fabric.Image.fromURL(el.src, image => {
      image.set({
        left: 100,
        top: 50,
        angle: 0,
        padding: 10,
        cornersize: 10,
        hasRotatingPoint: true,
        peloas: 12
      });
      image.setWidth(150);
      image.setHeight(150);
      this.extend(image, this.randomId());
      this.canvas.add(image);
      this.selectItemAfterAdded(image);
    });
  }

  // Block 'Upload Image'

  addImageOnCanvas(url) {
    if (url) {
      const img = new Image();
      img.src = url;
      if (img.complete) {
        // was cached
        // alert('img-width: ' + img.width);
      } else {
        // wait for decoding
        img.onload = function() {
          // alert('img-width: ' + img.width);
        };
      }
      fabric.Image.fromURL(url, image => {
        image.set({
          left: 100,
          top: 50,
          angle: 0,
          padding: 10,
          cornersize: 10,
          hasRotatingPoint: true
        });
        const wrh = img.width / img.height;
        let newWidth = 300;
        let newHeight = newWidth / wrh;
        if (newHeight > 300) {
          newHeight = 300;
          newWidth = newHeight * wrh;
        }
        image.setWidth(newWidth);
        image.setHeight(newHeight);
        // image.setWidth(200);
        // image.setHeight(200);
        this.extend(image, this.randomId());
        this.canvas.add(image);
        this.selectItemAfterAdded(image);
      });
    }
  }

  readUrl(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = event => {
        this.url = event.target['result'];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhite(url) {
    this.url = '';
  }

  // Block 'Add figure'

  addFigure(figure) {
    let add: any;
    switch (figure) {
      case 'rectangle':
        add = new fabric.Rect({
          width: 200,
          height: 100,
          left: 10,
          top: 10,
          angle: 0,
          fill: '#3f51b5'
        });
        break;
      case 'square':
        add = new fabric.Rect({
          width: 100,
          height: 100,
          left: 10,
          top: 10,
          angle: 0,
          fill: '#4caf50'
        });
        break;
      case 'triangle':
        add = new fabric.Triangle({
          width: 100,
          height: 100,
          left: 10,
          top: 10,
          fill: '#2196f3'
        });
        break;
      case 'circle':
        add = new fabric.Circle({
          radius: 50,
          left: 10,
          top: 10,
          fill: '#ff5722'
        });
        break;
    }
    this.extend(add, this.randomId());
    this.canvas.add(add);
    this.selectItemAfterAdded(add);
  }

  /*Canvas*/

  cleanSelect() {
    this.canvas.deactivateAllWithDispatch().renderAll();
  }

  selectItemAfterAdded(obj) {
    this.canvas.deactivateAllWithDispatch().renderAll();
    this.canvas.setActiveObject(obj);
  }

  setCanvasFill() {
    if (!this.props.canvasImage) {
      this.canvas.backgroundColor = this.props.canvasFill;
      this.canvas.renderAll();
    }
  }

  extend(obj, id) {
    obj.toObject = (function(toObject) {
      return function() {
        return fabric.util.object.extend(toObject.call(this), {
          id: id
        });
      };
    })(obj.toObject);
  }

  readUrlBackground(event) {
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();
      reader.onload = event => {
        this.urlBg = event.target['result'];
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  }

  removeWhiteBackground(url) {
    this.urlBg = '';
  }
  setCanvasImage(url) {
    const self = this;
    const im = new Image();
    im.src = url;
    im.onload = () => console.log(im.width, im.height);
    if (url) {
      this.props.canvasImage = url;
      this.canvas.setBackgroundImage(
        this.props.canvasImage,
        this.canvas.renderAll.bind(this.canvas),
        {
          scaleX: this.canvas.width / im.width,
          scaleY: this.canvas.height / im.height,
          offsetX: 0,
          offsetY: 0,
          crossOrigin: 'anonymous'
        }
      );
    }
  }

  randomId() {
    return Math.floor(Math.random() * 999999) + 1;
  }

  /*------------------------Global actions for element------------------------*/

  getActiveStyle(styleName, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) {
      return '';
    }

    return object.getSelectionStyles && object.isEditing
      ? object.getSelectionStyles()[styleName] || ''
      : object[styleName] || '';
  }

  setActiveStyle(styleName, value, object) {
    object = object || this.canvas.getActiveObject();
    if (!object) {
      return;
    }

    if (object.setSelectionStyles && object.isEditing) {
      const style = {};
      style[styleName] = value;
      object.setSelectionStyles(style);
      object.setCoords();
    } else {
      object.set(styleName, value);
    }

    object.setCoords();
    this.canvas.renderAll();
  }

  getActiveProp(name) {
    const object = this.canvas.getActiveObject();
    if (!object) {
      return '';
    }

    return object[name] || '';
  }

  setActiveProp(name, value) {
    const object = this.canvas.getActiveObject();
    if (!object) {
      return;
    }
    object.set(name, value).setCoords();
    this.canvas.renderAll();
  }

  clone() {
    const activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      let clone;
      switch (activeObject.type) {
        case 'rect':
          clone = new fabric.Rect(activeObject.toObject());
          break;
        case 'circle':
          clone = new fabric.Circle(activeObject.toObject());
          break;
        case 'triangle':
          clone = new fabric.Triangle(activeObject.toObject());
          break;
        case 'i-text':
          clone = new fabric.IText('', activeObject.toObject());
          break;
        case 'image':
          clone = fabric.util.object.clone(activeObject);
          break;
      }
      if (clone) {
        clone.set({ left: 10, top: 10 });
        this.canvas.add(clone);
        this.selectItemAfterAdded(clone);
      }
    }
  }

  getId() {
    this.props.id = this.canvas.getActiveObject().toObject().id;
  }

  setId() {
    const val = this.props.id;
    const complete = this.canvas.getActiveObject().toObject();
    // console.log(complete);
    this.canvas.getActiveObject().toObject = () => {
      complete.id = val;
      return complete;
    };
  }

  getOpacity() {
    this.props.opacity = this.getActiveStyle('opacity', null) * 100;
  }

  setOpacity() {
    this.setActiveStyle('opacity', parseInt(this.props.opacity) / 100, null);
  }

  getFill() {
    this.props.fill = this.getActiveStyle('fill', null);
  }

  setFill() {
    this.setActiveStyle('fill', this.props.fill, null);
  }

  getLineHeight() {
    this.props.lineHeight = this.getActiveStyle('lineHeight', null);
  }

  setLineHeight() {
    this.setActiveStyle('lineHeight', parseFloat(this.props.lineHeight), null);
  }

  getCharSpacing() {
    this.props.charSpacing = this.getActiveStyle('charSpacing', null);
  }

  setCharSpacing() {
    this.setActiveStyle('charSpacing', this.props.charSpacing, null);
  }

  getFontSize() {
    this.props.fontSize = this.getActiveStyle('fontSize', null);
  }

  setFontSize() {
    this.setActiveStyle('fontSize', parseInt(this.props.fontSize), null);
  }

  getBold() {
    this.props.fontWeight = this.getActiveStyle('fontWeight', null);
  }

  setBold() {
    this.props.fontWeight = !this.props.fontWeight;
    this.setActiveStyle(
      'fontWeight',
      this.props.fontWeight ? 'bold' : '',
      null
    );
  }

  getFontStyle() {
    this.props.fontStyle = this.getActiveStyle('fontStyle', null);
  }

  setFontStyle() {
    this.props.fontStyle = !this.props.fontStyle;
    this.setActiveStyle(
      'fontStyle',
      this.props.fontStyle ? 'italic' : '',
      null
    );
  }

  getTextDecoration() {
    this.props.TextDecoration = this.getActiveStyle('textDecoration', null);
  }

  setTextDecoration(value) {
    let iclass = this.props.TextDecoration;
    if (iclass.includes(value)) {
      iclass = iclass.replace(RegExp(value, 'g'), '');
    } else {
      iclass += ` ${value}`;
    }
    this.props.TextDecoration = iclass;
    this.setActiveStyle('textDecoration', this.props.TextDecoration, null);
  }

  hasTextDecoration(value) {
    return this.props.TextDecoration.includes(value);
  }

  getTextAlign() {
    this.props.textAlign = this.getActiveProp('textAlign');
  }

  setTextAlign(value) {
    this.props.textAlign = value;
    this.setActiveProp('textAlign', this.props.textAlign);
  }

  getFontFamily() {
    this.props.fontFamily = this.getActiveProp('fontFamily');
  }

  setFontFamily() {
    this.setActiveProp('fontFamily', this.props.fontFamily);
  }

  getCharStrokeWidth() {
    this.props.strokeWidth = this.getActiveStyle('strokeWidth', null);
  }
  setCharStrokeWidth() {
    this.setActiveProp('strokeWidth', this.props.strokeWidth);
  }
  getCharStroke() {
    this.props.stroke = this.getActiveStyle('stroke', null);
  }
  setCharStroke() {
    this.setActiveProp('stroke', this.props.stroke);
  }

  /*System*/

  removeSelected() {
    const activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      this.canvas.remove(activeObject);
      // this.textString = '';
    } else if (activeGroup) {
      const objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      const self = this;
      objectsInGroup.forEach(function(object) {
        self.canvas.remove(object);
      });
    }
  }

  bringToFront() {
    const activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.bringToFront();
      // activeObject.opacity = 1;
    } else if (activeGroup) {
      const objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach(object => {
        object.bringToFront();
      });
    }
  }

  sendToBack() {
    const activeObject = this.canvas.getActiveObject(),
      activeGroup = this.canvas.getActiveGroup();

    if (activeObject) {
      activeObject.sendToBack();
      // activeObject.opacity = 1;
    } else if (activeGroup) {
      const objectsInGroup = activeGroup.getObjects();
      this.canvas.discardActiveGroup();
      objectsInGroup.forEach(object => {
        object.sendToBack();
      });
    }
  }

  confirmClear() {
    if (confirm('Are you sure?')) {
      this.canvas.clear();
    }
  }

  rasterize() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert(
        'This browser does not provide means to serialize canvas to an image'
      );
    } else {
      // console.log(this.canvas.toDataURL('png'))
      // window.open(this.canvas.toDataURL('png'));
      // const image = new Image();
      // image.src = this.canvas.toDataURL('png');
      // const blob = new Blob([image], { type: 'image/octet-stream' });
      // const dFile = new File([blob], 'meme.png');
      // let dFile = new File(
      //   [atob(this.canvas.toDataURL('png').split(',')[1])],
      //   'meme.png',
      //   { type: 'image/png' }
      // );
      // window.open(dFile);
      // w.document.write(image.outerHTML);
      /*const imagefileName = 'meme.png';
      const imageType = 'image/png';
      const imageData = this.canvas
        .toDataURL('png')
        .replace(/^data:image\/[a-z]+;base64,/, '');
      const myFile = this.base64ToFile(imageData, imagefileName, imageType);
      FileSaver.saveAs(myFile, imagefileName);*/

      const src = document.getElementById('capture');

      this.takeHighResScreenshot(src, 'png', 4);
    }
  }

  rasterizeJPEG() {
    if (!fabric.Canvas.supports('toDataURL')) {
      alert(
        'This browser does not provide means to serialize canvas to an image'
      );
    } else {
      // console.log(this.canvas.toDataURL('png'))
      // window.open(this.canvas.toDataURL('png'));
      // const image = new Image();
      // image.src = this.canvas.toDataURL('png');
      // const blob = new Blob([image], { type: 'image/octet-stream' });
      // const dFile = new File([blob], 'meme.png');
      // let dFile = new File(
      //   [atob(this.canvas.toDataURL('png').split(',')[1])],
      //   'meme.png',
      //   { type: 'image/png' }
      // );
      // window.open(dFile);
      // w.document.write(image.outerHTML);
      /* const imagefileName = 'meme.jpeg';
      const imageType = 'image/jpeg';
      const imageData = this.canvas
        .toDataURL('image/jpeg', 1.0)
        .replace(/^data:image\/[a-z]+;base64,/, '');
      const myFile = this.base64ToFile(imageData, imagefileName, imageType);
      FileSaver.saveAs(myFile, imagefileName); */
      const src = document.getElementById('capture');

      this.takeHighResScreenshot(src, 'jpg', 4);
    }
  }

  rasterizeSVG() {
    // console.log(this.canvas.toSVG())
    // window.open(
    //   'data:image/svg+xml;utf8,' +
    //   encodeURIComponent(this.canvas.toSVG()));
    // console.log(this.canvas.toSVG())
    // var image = new Image();
    // image.src = this.canvas.toSVG()
    const w = window.open('');
    w.document.write(this.canvas.toSVG());
  }

  saveCanvasToJSON() {
    const json = JSON.stringify(this.canvas);
    localStorage.setItem('Kanvas', json);
    // console.log('json');
    // console.log(json);
  }

  loadCanvasFromJSON() {
    const CANVAS = localStorage.getItem('Kanvas');
    // console.log('CANVAS');
    // console.log(CANVAS);

    // and load everything from the same json
    this.canvas.loadFromJSON(CANVAS, () => {
      // console.log('CANVAS untar');
      // console.log(CANVAS);

      // making sure to render canvas at the end
      this.canvas.renderAll();

      // and checking if object's 'name' is preserved
      // console.log('this.canvas.item(0).name');
      // console.log(this.canvas);
    });
  }

  rasterizeJSON() {
    this.json = JSON.stringify(this.canvas, null, 2);
  }

  resetPanels() {
    this.textEditor = false;
    this.imageEditor = false;
    this.figureEditor = false;
  }

  addTemplates(tValue) {
    if (confirm('Are you sure to clear the canvas?')) {
      this.canvas.clear();

      switch (tValue) {
        case 't1':
          // tslint:disable-next-line:max-line-length
          const CANVAS = '{}';
          // console.log('CANVAS');
          // console.log(CANVAS);
          this.canvas.loadFromJSON(CANVAS, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't2':
          // tslint:disable-next-line:max-line-length
          const CANVAS1 = '{}';
          // console.log('CANVAS1');
          // console.log(CANVAS1);
          this.canvas.loadFromJSON(CANVAS1, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS1);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't3':
          // tslint:disable-next-line:max-line-length
          const CANVAS2 = '{}';
          // console.log('CANVAS2');
          // console.log(CANVAS2);
          this.canvas.loadFromJSON(CANVAS2, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS2);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't4':
          // tslint:disable-next-line:max-line-length
          const CANVAS3 = '{}';
          // console.log('CANVAS1');
          // console.log(CANVAS1);
          this.canvas.loadFromJSON(CANVAS3, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS1);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't5':
          // tslint:disable-next-line:max-line-length
          const CANVAS4 = '{}';
          // console.log('CANVAS1');
          // console.log(CANVAS1);
          this.canvas.loadFromJSON(CANVAS4, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS1);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't6':
          // tslint:disable-next-line:max-line-length
          const CANVAS5 = '{}';
          // console.log('CANVAS');
          // console.log(CANVAS);
          this.canvas.loadFromJSON(CANVAS5, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't7':
          // tslint:disable-next-line:max-line-length
          const CANVAS6 = '{}';
          // console.log('CANVAS');
          // console.log(CANVAS);
          this.canvas.loadFromJSON(CANVAS6, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
        case 't8':
          // tslint:disable-next-line:max-line-length
          const CANVAS7 = '{}';
          // console.log('CANVAS');
          // console.log(CANVAS);
          this.canvas.loadFromJSON(CANVAS7, () => {
            // console.log('CANVAS untar');
            // console.log(CANVAS);
            this.canvas.setWidth(500);
            this.canvas.setHeight(500);
            // making sure to render canvas at the end
            this.canvas.renderAll();

            // and checking if object's 'name' is preserved
            // console.log('this.canvas.item(0).name');
            // console.log(this.canvas);
          });
          break;
      }
    }
  }

  changeSizeTemplate(width, height) {
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
  }
  base64ToFile(base64Data, tempfilename, contentType) {
    contentType = contentType || '';
    const sliceSize = 1024;
    const byteCharacters = atob(base64Data);
    const bytesLength = byteCharacters.length;
    const slicesCount = Math.ceil(bytesLength / sliceSize);
    const byteArrays = new Array(slicesCount);

    for (let sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
      const begin = sliceIndex * sliceSize;
      const end = Math.min(begin + sliceSize, bytesLength);

      const bytes = new Array(end - begin);
      for (let offset = begin, i = 0; offset < end; ++i, ++offset) {
        bytes[i] = byteCharacters[offset].charCodeAt(0);
      }
      byteArrays[sliceIndex] = new Uint8Array(bytes);
    }
    return new File(byteArrays, tempfilename, { type: contentType });
  }

  onKeyUpperText(event) {
    const inputValue = event.target.value;
    //console.log(inputValue);
    this.upperTextString = inputValue;
    this.updateUpperTextvalue();
  }
  updateUpperTextvalue() {
    const contentUpperAttr = document.getElementById('upperText');
    contentUpperAttr.innerHTML = this.upperTextString.replace(
      /(?:\r\n|\r|\n)/g,
      '<br />'
    );
    textFit(contentUpperAttr, {
      alignVert: false,
      alignHoriz: false,
      multiLine: true,
      detectMultiLine: true,
      minFontSize: 6,
      maxFontSize: 80,
      reProcess: true,
      widthOnly: false,
      alignVertWithFlexbox: true
    });
  }
  onKeyLowerText(event) {
    const inputValue = event.target.value;
    //console.log(inputValue);
    this.lowerTextString = inputValue;
    this.updateLowerTextvalue();
  }
  updateLowerTextvalue() {
    const contentLowerAttr = document.getElementById('lowerText');
    contentLowerAttr.innerHTML = this.lowerTextString.replace(
      /(?:\r\n|\r|\n)/g,
      '<br />'
    );
    textFit(contentLowerAttr, {
      alignVert: false,
      alignHoriz: false,
      multiLine: true,
      detectMultiLine: true,
      minFontSize: 6,
      maxFontSize: 80,
      reProcess: true,
      widthOnly: false,
      alignVertWithFlexbox: true
    });
  }
  settextBackgroundfill() {
    const contentUpperAttr = document.getElementById('upperText');
    const contentLowerAttr = document.getElementById('lowerText');
    contentUpperAttr.style.backgroundColor = this.props.textBackgroundfill;
    contentLowerAttr.style.backgroundColor = this.props.textBackgroundfill;
  }
  settextTLfill() {
    const contentUpperAttr = document.getElementById('upperText');
    const contentLowerAttr = document.getElementById('lowerText');
    contentUpperAttr.style.color = this.props.textTLfill;
    contentLowerAttr.style.color = this.props.textTLfill;
  }
  takeHighResScreenshot(srcEl, ext, scaleFactor) {
    // Save original size of element
    const originalWidth = srcEl.offsetWidth;
    const originalHeight = srcEl.offsetHeight;
    // Force px size (no %, EMs, etc)
    srcEl.style.width = originalWidth + 'px';
    srcEl.style.height = originalHeight + 'px';

    // Position the element at the top left of the document because of bugs in html2canvas. The bug exists when supplying a custom canvas, and offsets the rendering on the custom canvas based on the offset of the source element on the page; thus the source element MUST be at 0, 0.
    // See html2canvas issues #790, #820, #893, #922
    srcEl.style.position = 'absolute';
    srcEl.style.top = '0';
    srcEl.style.left = '0';

    // Create scaled canvas
    const scaledCanvas = document.createElement('canvas');
    scaledCanvas.width = originalWidth * scaleFactor;
    scaledCanvas.height = originalHeight * scaleFactor;
    scaledCanvas.style.width = originalWidth + 'px';
    scaledCanvas.style.height = originalHeight + 'px';
    const scaledContext = scaledCanvas.getContext('2d');
    scaledContext.scale(scaleFactor, scaleFactor);

    html2canvas(srcEl, { canvas: scaledCanvas }).then(function(canvas) {
      if (ext == 'png') {
        canvas.toBlob(function(blob) {
          FileSaver.saveAs(blob, 'memeImage.png');
        });
        //srcEl.style.display = 'none';
      } else if (ext == 'jpg') {
        canvas.toBlob(function(blob) {
          FileSaver.saveAs(blob, 'memeImage.jpg');
        });
      }
    });
  }
}
