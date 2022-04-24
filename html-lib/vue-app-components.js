/* global Vue, httpVueLoader */

var appComponents = {
  'PanelMenu': httpVueLoader('./html-lib/components/PanelMenu/PanelMenu.vue'),
  'TextPanel': httpVueLoader('./html-lib/components/TextPanel/TextPanel.vue'),
  'ConfigurationPanel': httpVueLoader('./html-lib/components/ConfigurationPanel/ConfigurationPanel.vue'),

  'ComputedManager': httpVueLoader('./html-lib/components/ComputedManager/ComputedManager.vue'),
}