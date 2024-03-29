function convertPsiFromPm25(pm25Value)
{
  // Testing - uncomment start
  // pm25Value = 55;
  // testing - uncomment end
  // [PSI-min,PSI-max],[PM2.5-min,PM2.5-max]]
  var RANGE_PSIMIN = 0;
  var RANGE_PSIMAX = 1;
  var RANGE_PM25MIN = 0;
  var RANGE_PM25MAX = 1;
  var INDEX_PSIMAP = 0;
  var INDEX_PM25MAP = 1;
  // [ [PSI], [PM25] ]
  var psiMap = [
    [ [0,50],[0,12] ],
    [ [51,100],[13,55] ],
    [ [101,200],[56,150] ],
    [ [201,300],[151,250] ],
    [ [301,400],[251,350] ],
    [ [401,500],[351,500] ]
    ];

  var foundFlag = false;
  var psiLowLimit = 0;
  var psiHighLimit = 0;
  var pm25LowLimit = 0;
  var pm25HighLimit = 0;
  var psiValue = 0;

  for( i=0; i<psiMap.length; i++)
  {
    psiLowLimit = psiMap[i][INDEX_PSIMAP][RANGE_PSIMIN];
    psiHighLimit = psiMap[i][INDEX_PSIMAP][RANGE_PSIMAX];
    pm25LowLimit = psiMap[i][INDEX_PM25MAP][RANGE_PM25MIN];
    pm25HighLimit = psiMap[i][INDEX_PM25MAP][RANGE_PM25MAX];
    if ( pm25Value >= pm25LowLimit && pm25Value <= pm25HighLimit )
    {
      foundFlag = true;
      psiValue = ((pm25Value - pm25LowLimit)/(pm25HighLimit - pm25LowLimit))*(psiHighLimit - psiLowLimit) + psiLowLimit;
      break;
    }
  }
  return psiValue;
}

Vue.component('l-map', Vue2Leaflet.LMap)
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer)
Vue.component('l-marker', Vue2Leaflet.LMarker)
Vue.component('l-popup', Vue2Leaflet.LPopup)
Vue.component('l-control-attribution', Vue2Leaflet.LControlAttribution)

new Vue({
  el: '#app',
  data: function() {
    return{
      info: {},
      pm25Readings: {},
      psiReadings: [],
      region_location: {
        "west": [1.35735,103.7],
        "east": [1.35735,103.94],
        "central":[1.35735,103.82],
        "south": [1.29587,103.82],
        "north": [1.41803,103.82],
      },
      loading: true,
      errored: false,
      url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      zoom: 12,
      center: [1.355407, 103.807928],
    }
  },
  filters: {
    formatDateTime (value) {
      var dateTime = new Date(value);
      var year = dateTime.getFullYear();
      var month = dateTime.getMonth() + 1;
      var day = dateTime.getDate();
      var hour = dateTime.getHours();
      if (hour < 10)
      {
        hour = "0" + hour;
      }
      var mins = dateTime.getMinutes();
      if (mins < 10)
      {
        mins = "0" + mins;
      }
      return( year + "/" + month + "/" + day + " " + hour + ":" + mins )
    },
    formatPsiStatus(value)
    {
      if (value >= 100)
      {
        return("btn-danger");
      }
      else if (value >= 50)
      {
        return("btn-warning");
      }
      else
      {
        return("btn-success");
      }
    },
  },
  mounted () {
    axios
      .get('https://api.data.gov.sg/v1/environment/pm25')
      .then(response => {
        this.info = response.data.items[0];
        this.pm25Readings = response.data.items[0].readings.pm25_one_hourly;
        for (region in this.pm25Readings)
        {
          entry =[
            region,
            this.pm25Readings[region],
            parseFloat(convertPsiFromPm25(this.pm25Readings[region])).toFixed(2)
          ];
          this.psiReadings.push(entry);
        }
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false);
  },
});

// Sample output
//{
//  "region_metadata": [
//    {
//      "name": "west",
//      "label_location": {
//        "latitude": 1.35735,
//        "longitude": 103.7
//      }
//    },
//    {
//      "name": "east",
//      "label_location": {
//        "latitude": 1.35735,
//        "longitude": 103.94
//      }
//    },
//    {
//      "name": "central",
//      "label_location": {
//        "latitude": 1.35735,
//        "longitude": 103.82
//      }
//    },
//    {
//      "name": "south",
//      "label_location": {
//        "latitude": 1.29587,
//        "longitude": 103.82
//      }
//    },
//    {
//      "name": "north",
//      "label_location": {
//        "latitude": 1.41803,
//        "longitude": 103.82
//      }
//    }
//  ],
//  "items": [
//    {
//      "timestamp": "2019-09-27T15:00:00+08:00",
//      "update_timestamp": "2019-09-27T15:08:53+08:00",
//      "readings": {
//        "pm25_one_hourly": {
//          "west": 31,
//          "east": 24,
//          "central": 28,
//          "south": 31,
//          "north": 28
//        }
//      }
//    }
//  ],
//  "api_info": {
//    "status": "healthy"
//  }
//}
