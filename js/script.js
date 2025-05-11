tinymce.init({
  selector: '#mytextarea',
  plugins: ['imageslider', 'decoratedlist', 'lists', 'code'],
  toolbar: 'undo redo | blocks styleselect | bold italic | bullist numlist decoratedlist | outdent indent | imageslider | code',
  content_style: `
    .mce-content-body .c-rte-image-slider {
      border: 1px solid #a3a2a2;
      margin: 30px 0 10px;
      position: relative; 
    }

    .mce-content-body .c-rte-image-slider:before {
      content: "Image Slider";
      display: block;
      font-weight: bold;
      font-size: 12px;
      padding: 2px 10px;
      position: absolute;
      top: -10px;
      left: 10px;
      background-color: #fff;
      border: 1px solid #a3a2a2;
    }

    .mce-content-body .c-rte-image-slider .splide__list {
      padding: 0;
      margin: 0;
      display: flex;
      overflow: hidden;
      gap: 10px;
      justify-content: center;
    }
    .mce-content-body .c-rte-image-slider .splide__slide {
      list-style: none;
      margin: 0;
      padding: 0;
      display: inline-block;
    }
    .mce-content-body .c-rte-image-slider img {
      max-width: 100%;
      max-height: 200px;
      height: auto;
    }
  `
});