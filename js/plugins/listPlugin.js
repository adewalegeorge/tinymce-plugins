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
      { text: "Default", value: "", icon: "icon-default" },
      { text: "Inghams", value: "c-list--inghams", icon: "icon-inghams" },
      { text: "Checkmark", value: "c-list--checkmark", icon: "icon-checkmark" },
      { text: "Arrowhead", value: "c-list--arrowhead", icon: "icon-arrowhead" },
      { text: "Asterisk", value: "c-list--asterisk", icon: "icon-asterisk" },
      { text: "Counter", value: "c-list--counter", icon: "icon-counter" },
    ];

    function applyListStyle(styleClass) {
      const node = editor.selection.getNode();
      const ul = editor.dom.getParent(node, "ul");

      if (!ul) {
        editor.notificationManager.open({
          text: "Please select a list first.",
          type: "info",
          timeout: 2000,
        });
        return;
      }

      items.forEach(({ value }) => {
        if (value) {
          editor.dom.removeClass(ul, value);
        }
      });
      editor.dom.removeClass(ul, "c-list");

      if (styleClass) {
        editor.dom.addClass(ul, "c-list");
        editor.dom.addClass(ul, styleClass);
      }
    }

    editor.ui.registry.addIcon('icon-default', '<svg width="24" height="24"><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>');
    editor.ui.registry.addIcon('icon-inghams', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 11 12"><g clip-path="url(#a)"><path fill="#232323" d="M0 9.19 2.23 6 0 2.81V0c4.43 1.98 6.91 2.95 10.54 4.4v3.2C6.91 9.05 4.43 10 0 12zm2.98-.96L8.43 6 3 3.77 4.39 6z"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h11v12H0z"/></clipPath></defs></svg>');
    editor.ui.registry.addIcon('icon-checkmark', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M35.7 87.4 0 51.7l10-10 25.7 25.5L90 13l10 10.1z"/></svg>');
    editor.ui.registry.addIcon('icon-arrowhead', '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 100 100"><path fill="#000" d="M100 47.7 0 93.5l33.3-45.8L0 6z"/></svg>');
    editor.ui.registry.addIcon('icon-asterisk', '<svg width="24" height="24"><path d="M12 2 V22 M2 12 H22 M4 4 L20 20 M4 20 L20 4" stroke="currentColor" stroke-width="2"/></svg>');
    editor.ui.registry.addIcon('icon-counter', '<svg width="24" height="24"><text x="8" y="17" font-size="14" fill="currentColor">1.</text></svg>');


    editor.ui.registry.addMenuButton("decoratedList", {
      tooltip: "Apply list style",
      fetch: function (callback) {
        callback(
          items.map((item) => ({
            type: "menuitem",
            icon: item.icon,
            text: `${item.text}`,
            onAction: () => applyListStyle(item.value)
          }))
        );
      }
    });
  });
})();