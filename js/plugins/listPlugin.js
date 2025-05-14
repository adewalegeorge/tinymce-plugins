/**
 * @file list-plugin.js
 * @description This is a TinyMCE plugin that adds a button to the toolbar for changing the list style
 * It allows users to select a list style from a dropdown menu and applies the corresponding class to the list
 * The plugin uses the TinyMCE API to create a menu button with predefined list styles
 * @module listPlugin
 * @requires tinymce
 */

(function () {
  tinymce.PluginManager.add("decoratedlist", function (editor) {
    const items = [
      { text: "Default", value: "" },
      { text: "Inghams", value: "inghams" },
      { text: "Checkmark", value: "checkmark" },
      { text: "Arrowhead", value: "arrowhead" },
      { text: "Asterisk", value: "asterisk" },
      { text: "Counter", value: "counter" },
    ];

    const getStyleClass = (value) => value ? `c-list--${value}` : "";

    const removeOldClasses = (ul) => {
      if (!ul) return;
      items.forEach(({ value }) => {
        if (value) {
          editor.dom.removeClass(ul, `c-list--${value}`);
        }
      });
      editor.dom.removeClass(ul, "c-list");
    };

    const iconMap = {
      default: '<svg width="24" height="24"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>',
      inghams: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 12"><g clip-path="url(#a)"><path fill="#232323" d="M0 9.19 2.23 6 0 2.81V0c4.43 1.98 6.91 2.95 10.54 4.4v3.2C6.91 9.05 4.43 10 0 12zm2.98-.96L8.43 6 3 3.77 4.39 6z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h11v12H0z"/></clipPath></defs></svg>',
      checkmark: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M35.7 87.4 0 51.7l10-10 25.7 25.5L90 13l10 10.1z"/></svg>',
      arrowhead: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M100 47.7 0 93.5l33.3-45.8L0 6z"/></svg>',
      asterisk: '<svg width="24" height="24"><path d="M12 2 V22 M2 12 H22 M4 4 L20 20 M4 20 L20 4" stroke="currentColor" stroke-width="2"/></svg>',
      counter: '<svg width="24" height="24"><text x="8" y="17" font-size="14" fill="currentColor">1.</text></svg>',
    };

    Object.entries(iconMap).forEach(([name, svg]) => {
      editor.ui.registry.addIcon(`icon-${name}`, svg);
    });


    editor.on("PreInit", () => {
      const advlist = editor.plugins.advlist;
      if (advlist && advlist.applyListFormat) {
        const originalApply = advlist.applyListFormat;

        advlist.applyListFormat = function (listType, styleValue) {
          originalApply.call(this, listType, styleValue);

          if (listType === "UL") {
            const ul = editor.dom.getParent(editor.selection.getNode(), "ul");
            if (ul) {
              removeOldClasses(ul);
              if (styleValue) {
                editor.dom.addClass(ul, "c-list");
                editor.dom.addClass(ul, getStyleClass(styleValue));
              }
            }
          }
        };
      }
    });

    editor.on("init", () => {
      editor.dom.addStyle(`
        ul[style="list-style-type: inghams;"] li{
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 12"><g clip-path="url(%23a)"><path fill="%23232323" d="M0 9.19 2.23 6 0 2.81V0c4.43 1.98 6.91 2.95 10.54 4.4v3.2C6.91 9.05 4.43 10 0 12zm2.98-.96L8.43 6 3 3.77 4.39 6z"/></g><defs><clipPath id="a"><path fill="%23fff" d="M0 0h11v12H0z"/></clipPath></defs></svg>');
        }

        ul[style="list-style-type: checkmark;"] li{
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="%23000" d="M35.7 87.4 0 51.7l10-10 25.7 25.5L90 13l10 10.1z"/></svg>');
        }

        ul[style="list-style-type: arrowhead;"] li{
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="%23000" d="M100 47.7 0 93.5l33.3-45.8L0 6z"/></svg>');
        }

        ul[style="list-style-type: asterisk;"] li{
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,<svg width="24" height="24"><path d="M12 2 V22 M2 12 H22 M4 4 L20 20 M4 20 L20 4" stroke="currentColor" stroke-width="2"/></svg>');
        }

        ul[class~="mce-list-inghams"] li{
          list-style-type: none;
          list-style-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 12"><g clip-path="url(%23a)"><path fill="%23232323" d="M0 9.19 2.23 6 0 2.81V0c4.43 1.98 6.91 2.95 10.54 4.4v3.2C6.91 9.05 4.43 10 0 12zm2.98-.96L8.43 6 3 3.77 4.39 6z"/></g><defs><clipPath id="a"><path fill="%23fff" d="M0 0h11v12H0z"/></clipPath></defs></svg>');
        }
      `);
    });


    editor.on("NodeChange", (e) => {
      const ul = editor.dom.getParent(editor.selection.getNode(), "ul");
      if (!ul) return;

      const style = ul.getAttribute("data-mce-style") || "";
      const classList = ul.className.split(" ");

      const currentStyle = items.find(item => classList.includes(`c-list--${item.value}`));
      if (!currentStyle && style.includes("list-style-type")) {
        // Guess style from inline style if class not applied
        const match = style.match(/list-style-type:\s*([^;]+);?/);
        if (match) {
          const guessed = match[1].trim();
          const item = items.find(i => i.value === guessed);
          if (item) {
            removeOldClasses(ul);
            editor.dom.addClass(ul, "c-list");
            editor.dom.addClass(ul, getStyleClass(item.value));
          }
        }
      }
    });
  });
})();