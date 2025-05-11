/**
 * @file list-plugin.js
 * @description This is a TinyMCE plugin that adds a button to the toolbar for changing the list style
 * It allows users to select a list style from a dropdown menu and applies the corresponding class to the list
 * The plugin uses the TinyMCE API to create a menu button with predefined list styles
 * @module listPlugin
 * @requires tinymce
 * @requires umbraco
 */

// using Umbraco.Cms.Core.Composing;
// using Umbraco.Cms.Core.DependencyInjection;
// using Umbraco.Cms.Core.RichTextEditor;

// public class TinyMceCustomListComposer : IComposer
// {
//     public void Compose(IUmbracoBuilder builder)
//     {
//         builder.TinyMce()
//             .AddPlugin("decoratedlist", "/js/listPlugin.js")
//             .AppendToolbar("decoratedList");
//     }
// }

(function () {
  tinymce.PluginManager.add("decoratedlist", function (editor) {
    const items = [
      { text: "Inghams", value: "c-list--inghams" },
      { text: "Checkmark", value: "c-list--checkmark" },
      { text: "Arrowhead", value: "c-list--arrowhead" },
      { text: "Asterisk", value: "c-list--asterisk" },
      { text: "Counter", value: "c-list--counter" }
    ];

    editor.ui.registry.addMenuButton("decoratedList", {
      text: "List bullets",
      fetch: function (callback) {
        callback(
          items.map((item) => ({
            type: "menuitem",
            text: item.text,
            onAction: () => {
              const ul = editor.dom.getParent(editor.selection.getNode(), "ul");
              if (ul) {
                items.forEach(({ value }) => {
                  editor.dom.removeClass(ul, value);
                });

                if (!editor.dom.hasClass(ul, "c-list")) {
                  editor.dom.addClass(ul, "c-list");
                }
                editor.dom.addClass(ul, item.value);
              }
            }
          }))
        );
      }
    });
  });
})();
