// tinymce.init({
//   selector: '#mytextarea',
//   plugins: ['imageslider', 'lists', 'advlist', 'decoratedlist', 'code'],
//   toolbar: 'undo redo | blocks styleselect | bold italic | numlist bullist decoratedlist | imageslider | code',
//   contextmenu: 'link image table',
//   advlist_bullet_styles: "circle disc square inghams checkmark arrowhead asterisk counter",
// });

tinymce.init({
  selector: '#mytextarea',
  plugins: 'lists custombullist | code', // Include both standard lists and our custom plugin
  toolbar: 'bullist | numlist | code', // Now this will show our enhanced dropdown
  // Make sure custom styles appear in content
  content_style: `
    ul { 
      list-style-type: disc; 
      padding-left: 1.5em; 
    }
    ul[style*="circle"] { 
      list-style-type: circle !important; 
    }
    ul[style*="square"] { 
      list-style-type: square !important; 
    }
  `,
  // Extend valid elements to allow custom list styles
  extended_valid_elements: 'ul[class|style]'
});