/**
 * @file image-slider-plugin.js
 * @description This is a TinyMCE plugin that adds a button to the toolbar for inserting an image slider
 * It allows users to enter image URLs and generates the HTML for a slider using the Splide.js library
 * The plugin uses the TinyMCE API to create a window with a textarea for entering image URLs
 * @module imageSliderPlugin
 * @requires tinymce
 * @requires umbraco
 * @requires splide
 */

// public class TinyMceSliderPluginComposer : IComposer
// {
//     public void Compose(IUmbracoBuilder builder)
//     {
//         builder.TinyMce()
//             .AddPlugin("imageslider", "/js/imageSliderPlugin.js")
//             .AppendToolbar("imageSlider");
//     }
// }

(function () {
  tinymce.PluginManager.add("imageslider", function (editor) {
    function injectPluginStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .tox-dialog[aria-label="Add slider images"]  {
          min-height: 400px;
          max-width: 700px !important;
          font-family: monospace;
        }

        .tox-dialog[aria-label="Add slider images"] .sliderImages__description {
          font-size: 14px !important;
          font-family: sans-serif;
          margin-bottom: 15px;
        }

        .tox-dialog[aria-label="Add slider images"] .sliderImages__lead {
          margin-bottom: 15px;
        }

        .tox-dialog[aria-label="Add slider images"] textarea {
          font-size: 12px !important;
          line-height: 1.5;
        }
      `;
      document.head.appendChild(style);
    }
    injectPluginStyles();

    editor.ui.registry.addButton("imageSlider", {
      text: "Add Slider",
      icon: "gallery",
      onAction: function () {
        editor.windowManager.open({
          title: "Add slider images",
          classes: 'slider-dialog',
          body: {
            type: "panel",
            items: [
              {
                type: 'htmlpanel',
                name: 'label-panel',
                html: `
                  <div class="sliderImages__description">
                    <div class="sliderImages__lead"><strong>Enter Image URLs</strong></div>
                    <p>Before hitting <strong>insert</strong>, <span style="color: red;">double-check</span> that you've added all your image URLs. If there's an error, you'll need to remove the entire red image grid and begin the process again.</p>
                    <p>* Leave an empty line between each image URL.</p>
                  </div>
                `.trim()
              },
              {
                type: "textarea",
                name: "sliderImages",
                placeholder: "One image URL per line",
              }
            ]
          },
          buttons: [
            {
              type: "cancel",
              text: "Cancel"
            },
            {
              type: "submit",
              text: "Insert",
              primary: true
            }
          ],
          onSubmit: function (api) {
            const data = api.getData();
            const urls = data.sliderImages
              .split("\n")
              .map((url) => url.trim())
              .filter((url) => {
                const urlPattern = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|svg))$/i;
                return urlPattern.test(url);
              });


            if (urls.length === 0) {
              api.close();
              return;
            }

            const uid = Math.random().toString(36).substring(2, 9);
            const sliderId = `rte-image-slider-${uid}`;
            const listItems = urls
              .map(
                (url) => `
                  <li class="splide__slide">
                    <img src="${url}" alt="alt" />
                  </li>
                `
              )
              .join("");

            const sliderHtml = `
              <div class="c-rte-image-slider" id="${sliderId}" contenteditable="false" data-slider-block="${uid}">
                <div class="splide" id="splidey js-slider" role="slider"
                  data-config="slider" data-module="splidey"
                  data-option-arrows="false"
                  data-option-breakpoint-1024-arrows="true"
                  data-setup-breakpoint-1024-indicator="of"
                  data-option-autoplay="true"
                  data-option-per-page="1"
                  data-option-pagination="true"
                  data-option-breakpoint-1024-pagination="false"
                  aria-labelledby="slider-heading">
                  <div class="splide__track">
                    <ul class="splide__list">
                      ${listItems}
                    </ul>
                  </div>
                </div>
              </div>
            `;

            editor.insertContent(sliderHtml);
            api.close();
          }
        });
      }
    });
  });
})();
