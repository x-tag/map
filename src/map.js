
(function() {

  var setLocation = function(element) {
    if (element.location == 'auto') {
      element.xtag.map.locate({ setView: true, maxZoom: element.zoom });
    }
    else {
      var location = (element.location).replace(' ', '').split(',');
      element.xtag.map.setView(new L.LatLng(Number(location[0]), Number(location[1])), element.zoom);
    }
  };

  var setTileLayer = function() {
    if (this.xtag.tilelayer) this.xtag.map.removeLayer(this.xtag.tilelayer);
    this.xtag.tilelayer = new L.TileLayer(
      'http://{s}.tile.cloudmade.com/' + this.getAttribute('key') + '/' +
      (this.getAttribute('tile-set') || 997) +
      '/256/{z}/{x}/{y}.png',
      this.getAttribute('tile-options') || {}
    );
    this.xtag.map.addLayer(this.xtag.tilelayer);
    setLocation(this);
  };

  xtag.register('x-map', {
    lifecycle:{
      created: function() {
        var element = this;
        this.xtag.map = new L.Map(this);
        setTileLayer.call(this);
        ['load','viewreset','movestart','move','moveend','dragstart',
        'zoomend','layeradd','layerremove','locationfound','drag','dragend',
        'locationerror','popupopen','popupclose'].forEach(function(type) {
          element.xtag.map.on(type, function(event) {
            xtag.fireEvent(element, type);
          });
        });
      }
    },
    accessors:{
      tileSet: {
        get: function() {
          return this.getAttribute('tile-set') || 997;
        },
        set: function(value) {
          this.setAttribute('tile-set', value);
          setTileLayer.call(this);
        }
      },
      zoom: {
        get: function() {
          var zoom = this.getAttribute('zoom');
          return Number(zoom === null ? 13 : zoom);
        },
        set: function(value) {
          this.setAttribute('zoom', value);
          this.xtag.map.setZoom(this.zoom);
        }
      },
      location: {
        get: function() {
          var location = this.getAttribute('location') || '37.3880, -122.0829';
          return location;
        },
        set: function(value) {
          this.setAttribute('location', value);
          setLocation(this);
        }
      }
    }
  });

})();
