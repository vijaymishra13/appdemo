/**
 * Created by VIJAYMI on 1/16/2017.
 */


function getActivityInformation(activityName) {
  return activityList[0];
};


var activityList = [
  {
    activityName : 'Waiting for Provisioning',
    owner : "CAN-OPIII",
    duration : {
      average : '3 days',
      fastest : '1 day',
      slowest : '25 days'
    },
    description : 'This Activity provisions the circuit in XYZ system. It involves network elements.',
    commonFailures : [
      {
        name: 'Provisioning failed',
        notes : 'Something going really wrong in provisioning space. Needs manual intervention.'
      },
      {
        name: 'System unavailable',
        notes : 'Some sort of System failure. Engage System support abc@support.com.'
      }
    ]
  }
];


module.exports = {
  getActivityInformation : getActivityInformation
};
