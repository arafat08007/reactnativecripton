import axios from 'axios';

export default axios.create({
  baseURL: 'http://ba.pakizatvl.com:8070/CRAPI.asmx',
  transformResponse: [
    function(data: string) {
      const strData = data.match(/>([\[{].*[}\]])</);
      if (strData) return JSON.parse(strData[1]);
      else {
        console.log(data);
        throw Error("Couldn't parse json from response");
      }
    },
  ],
});
