const generateCertificateData = (template, dataArr) => {
  const certs = [];

  dataArr.forEach((certificate) => {
    const certHardCopy = JSON.parse(JSON.stringify(template)); // Deep copy to prevent mutation of original template
    const { _id, ...certTemplate } = certHardCopy; // Destructure _id from certHardCopy
    certTemplate.texts.forEach((textObj) => {
      textObj.text = textObj.text.replace(/{(.*?)}/g, (_, key) => {
        // Use bracket notation to access properties with spaces
        return certificate[key.trim()] || `{${key}}`;
      });
    });

    certs.push(certTemplate); // Push the modified certTemplate for this certificate
  });

  return certs;
};

const dataArr = [
  {
    "Participant Name": "Mushan Khan",
    Date: "26th November 2024",
    Status: "Secured 1st Position",
    "Event Name": "FizzBuzz 2.0",
  },
  {
    "Participant Name": "Netal Sarda",
    Date: "26th November 2024",
    Status: "Secured 2nd Position",
    "Event Name": "FizzBuzz 2.0",
  },
  {
    "Participant Name": "Tushar Pamnani",
    Date: "26th November 2024",
    Status: "Secured 3rd Position",
    "Event Name": "FizzBuzz 2.0",
  },
  {
    "Participant Name": "Lavanya Chawla",
    Date: "26th November 2024",
    Status: "Participated",
    "Event Name": "FizzBuzz 2.0",
  },
];

const template = {
  _id: {
    $oid: "67221307f25ae11aa0770082",
  },
  image: "http://localhost:4000/uploads/67221307f25ae11aa0770082.png",
  texts: [
    {
      id: 1730286386639,
      text: "Date :- {Date}",
      color: "#000000",
      fontSize: 24,
      align: "left",
      fontFamily: "Arial",
      fontWeight: "normal",
      verticalAlign: "middle",
      width: 200,
      height: 50,
      x: 175.83659374047397,
      y: 542.8446031746031,
    },
    {
      id: 1730286386775,
      align: "left",
      text: "Has {Status} in {Event Name}. His Problem solving skills and hard work truly impressed us and we wish him all the best in his future endeavors",
      verticalAlign: "top",
      color: "#000000",
      fontSize: "27",
      fontFamily: "Times New Roman",
      fontWeight: "normal",
      width: 765.024397785443,
      height: 112.20594071620222,
      x: 172.83604662545375,
      y: 393.74999999999955,
      scaleX: 1,
      scaleY: 1,
    },
    {
      id: 1730286386919,
      align: "center",
      text: "{Participant Name}",
      verticalAlign: "middle",
      color: "#30b7af",
      fontSize: "57",
      fontFamily: "Comic Sans MS",
      fontWeight: "normal",
      width: 561.0658361741231,
      height: 74.01523809523795,
      x: 264.85282481941323,
      y: 319.70301587301475,
      scaleX: 1,
      scaleY: 1,
    },
  ],
  __v: 0,
  generatedID: "67221307f25ae11aa0770082",
};

module.exports = { generateCertificateData };

const x = {
  dataArr: [
    {
      "Participant Name": "Mushan Khan",
      Date: "26th November 2024",
      Status: "Secured 1st Position",
      "Event Name": "FizzBuzz 2.0",
    },
    {
      "Participant Name": "Netal Sarda",
      Date: "26th November 2024",
      Status: "Secured 2nd Position",
      "Event Name": "FizzBuzz 2.0",
    },
    {
      "Participant Name": "Tushar Pamnani",
      Date: "26th November 2024",
      Status: "Secured 3rd Position",
      "Event Name": "FizzBuzz 2.0",
    },
    {
      "Participant Name": "Lavanya Chawla",
      Date: "26th November 2024",
      Status: "Participated",
      "Event Name": "FizzBuzz 2.0",
    },
  ],
  template: {
    _id: {
      $oid: "67221307f25ae11aa0770082",
    },
    image: "http://localhost:4000/uploads/67221307f25ae11aa0770082.png",
    texts: [
      {
        id: 1730286386639,
        text: "Date :- {Date}",
        color: "#000000",
        fontSize: 24,
        align: "left",
        fontFamily: "Arial",
        fontWeight: "normal",
        verticalAlign: "middle",
        width: 200,
        height: 50,
        x: 175.83659374047397,
        y: 542.8446031746031,
      },
      {
        id: 1730286386775,
        align: "left",
        text: "Has {Status} in {Event Name}. His Problem solving skills and hard work truly impressed us and we wish him all the best in his future endeavors",
        verticalAlign: "top",
        color: "#000000",
        fontSize: "27",
        fontFamily: "Times New Roman",
        fontWeight: "normal",
        width: 765.024397785443,
        height: 112.20594071620222,
        x: 172.83604662545375,
        y: 393.74999999999955,
        scaleX: 1,
        scaleY: 1,
      },
      {
        id: 1730286386919,
        align: "center",
        text: "{Participant Name}",
        verticalAlign: "middle",
        color: "#30b7af",
        fontSize: "57",
        fontFamily: "Comic Sans MS",
        fontWeight: "normal",
        width: 561.0658361741231,
        height: 74.01523809523795,
        x: 264.85282481941323,
        y: 319.70301587301475,
        scaleX: 1,
        scaleY: 1,
      },
    ],
    __v: 0,
    generatedID: "67221307f25ae11aa0770082",
  },
};
