/**
 * @file custombullist.js
 * @description This is a TinyMCE plugin that adds a custom bullet list button to the toolbar
 * It allows users to select a custom bullet style from a dropdown menu and applies the corresponding class to the list
 * The plugin uses the TinyMCE API to create a menu button with predefined bullet styles
 * @module custombullist
 * @requires tinymce
 */

tinymce.PluginManager.add('custombullist', function (editor, url) {
  const customListStyleTypes = [
    {
      text: 'Inghams',
      value: 'inghams',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 12 12"><g clip-path="url(#a)"><path fill="#232323" d="M0 9.19 2.23 6 0 2.81V0c4.43 1.98 6.91 2.95 10.54 4.4v3.2C6.91 9.05 4.43 10 0 12zm2.98-.96L8.43 6 3 3.77 4.39 6z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h11v12H0z"/></clipPath></defs></svg>'
    },
    {
      text: 'Checkmark',
      value: 'checkmark',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M35.7 87.4 0 51.7l10-10 25.7 25.5L90 13l10 10.1z"/></svg>'
    },
    {
      text: 'Arrowhead',
      value: 'arrowhead',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M100 47.7 0 93.5l33.3-45.8L0 6z"/></svg>'
    },
    {
      text: 'Asterisk',
      value: 'asterisk',
      svg: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 17"><path fill="#232323" d="M11.136 8.346 17 6.173l-1.214-3.34-5.667 3.643L10.747 0H6.88l.405 6.173-5.667-3.744L0 5.667l6.253 2.68L0 11.332l1.214 3.238 6.072-3.642L6.88 17h3.643l-.405-6.476 4.857 3.643L17 10.79l-5.864-2.444Z" /></svg>'
    }
  ];

  customListStyleTypes.forEach(style => {
    editor.ui.registry.addIcon(`icon-${style.value}`, style.svg);
  });

  function injectPluginStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .tox .tox-collection--list .tox-collection__item {
        padding: 15px !important;
      }
      .tox-collection__group {
        gap: 10px;
      }
      .tox-collection__group .tox-collection__item-icon {
        margin: 5px;
        width: 18px !important;
        height: 18px !important;
      }
    `;
    document.head.appendChild(style);
  }
  injectPluginStyles();

  editor.on('init', function () {
    customListStyleTypes.forEach(style => {
      editor.formatter.register(`${style.value}List`, {
        selector: 'ul',
        styles: { 'list-style-type': style.value }
      });
    });
  });

  editor.on('init', function () {
    let styleContent = `
      .mce-content-body .c-list li::marker {
        // font-size: 20px;
      }
    `;

    customListStyleTypes.forEach(style => {
      const encodedSVG = encodeURIComponent(style.svg.replace(/\s+/g, ' ').trim());

      styleContent += `
        ul[style="list-style-type: ${style.value};"] li {
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,${encodedSVG}');
          padding-left: 0.5em;
        }
      `;
    });

    if (editor.dom && editor.dom.addStyle) {
      editor.dom.addStyle(styleContent);
    } else {
      const styleId = 'custom-bullist-styles';
      const doc = editor.getDoc();
      let styleElement = doc.getElementById(styleId);

      if (!styleElement) {
        styleElement = doc.createElement('style');
        styleElement.id = styleId;
        doc.head.appendChild(styleElement);
      }
      styleElement.innerHTML = styleContent;
    }
  });

  editor.ui.registry.addSplitButton('bullist', {
    icon: 'unordered-list',
    tooltip: 'Bullet list',

    fetch: function (callback) {
      const items = [
        // Default styles
        {
          type: 'choiceitem',
          text: 'Default',
          icon: 'list-bull-default',
          value: { 'list-style-type': 'disc' }
        },
        {
          type: 'choiceitem',
          text: 'Circle',
          icon: 'list-bull-circle',
          value: { 'list-style-type': 'circle' }
        },
        {
          type: 'choiceitem',
          text: 'Square',
          icon: 'list-bull-square',
          value: { 'list-style-type': 'square' }
        },
        // Custom styles
        ...customListStyleTypes.map(style => ({
          type: 'choiceitem',
          text: style.text,
          icon: `icon-${style.value}`,
          value: { 'list-style-type': style.value }
        }))
      ];
      callback(items);
    },
    onAction: function () {
      editor.execCommand('InsertUnorderedList');
    },
    onItemAction: function (api, value) {
      editor.execCommand('InsertUnorderedList', false, value);
      api

      const listType = value['list-style-type'];

      // Defer DOM updates to allow the list to render
      setTimeout(() => {
        const node = editor.selection.getNode();
        const ul = editor.dom.getParent(node, 'ul');

        if (ul) {
          // Reset styles and classes first
          editor.dom.setStyle(ul, 'list-style-type', listType);

          editor.dom.removeClass(ul, 'c-list');
          customListStyleTypes.forEach(style => {
            editor.dom.removeClass(ul, `c-list--${style.value}`);
          });

          const isCustom = customListStyleTypes.some(style => style.value === listType);
          if (isCustom) {
            editor.dom.addClass(ul, 'c-list');
            editor.dom.addClass(ul, `c-list--${listType}`);
          }
        }
      }, 0); // Ensures it runs after DOM updates
    },
    select: function (value) {
      try {
        const node = editor.selection.getNode();
        const ul = editor.dom.getParent(node, 'ul');

        if (!ul) return false;

        const currentType = editor.dom.getStyle(ul, 'list-style-type');
        return currentType === value['list-style-type'];
      } catch (e) {
        console.log('Error in select function:', e);
        return false;
      }
    },
    columns: 3
  });
});