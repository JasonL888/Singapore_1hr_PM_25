new Vue({
  el: '#app',
  data () {
    return {
      info: null,
      loading: true,
      errored: false
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
    formatPsiFromPm25(pm25Value)
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
      return psiValue.toFixed(2);
    },
  },
  mounted () {
    axios
      .get('https://api.data.gov.sg/v1/environment/pm25')
      .then(response => {
        this.info = response.data.items[0]
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => this.loading = false)
  }
})
