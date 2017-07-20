/*
 * View model for OctoPrint-Touchtest
 *
 * Author: Daniel Miller
 * License: AGPLv3
 */
$(function() {
  function TouchtestViewModel(parameters) {
    var self = this;

    self.settings = parameters[0]
    self.loginState = parameters[1]

    self.bedWidth = ko.observable("200.00")
    self.bedDepth = ko.observable("200.00")
    self.edgeOffset = ko.observable("15.00")
    self.feedrate = ko.observable("1000")
    self.isOperational = ko.observable(undefined);
    self.isPrinting = ko.observable(undefined);

    self.testPrint = function(wMult, dMult) {
      var wEffective = self.bedWidth() - 2* self.edgeOffset()
      var dEffective = self.bedDepth() - 2* self.edgeOffset()
      var xPos = 1.0*self.edgeOffset() + (wMult*wEffective);
      var yPos = 1.0*self.edgeOffset() + (dMult*dEffective);
      var code = "G0";
      code += " X" + xPos;
      code += " Y" + yPos;
      code += " F" + self.feedrate();
      OctoPrint.control.sendGcode(code);
      console.log("TouchTest: Sending command \"" + code +"\"");
    }

    self.onBeforeBinding = function() {
      self.bedWidth(self.settings.settings.plugins.touchtest.bedWidth());
      self.bedDepth(self.settings.settings.plugins.touchtest.bedDepth());
      self.edgeOffset(self.settings.settings.plugins.touchtest.edgeOffset());
      self.feedrate(self.settings.settings.plugins.touchtest.feedrate());
    }

    self.fromCurrentData = function(data) {
      self._processStateData(data.state);
    };

    self.fromHistoryData = function(data) {
      self._processStateData(data.state);
    };

    self._processStateData = function(data) {
      self.isOperational(data.flags.operational);
      self.isPrinting(data.flags.printing);
    };

    self.movementEnabled = function() {
      return (self.isOperational() && self.loginState.isUser() && ! self.isPrinting());
    }
  }

  // view model class, parameters for constructor, container to bind to
  OCTOPRINT_VIEWMODELS.push([
    TouchtestViewModel,
    [ "settingsViewModel", "loginStateViewModel" ],
    [ "#sidebar_plugin_touchtest" ]
  ]);
});
