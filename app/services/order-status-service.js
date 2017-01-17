/**
 * Created by VIJAYMI on 1/16/2017.
 */


function getOrderStatus(orderNumber) {
  return orderList[0];
}


var orderList = [
  {
    orderNumber : '3000011230',
    customerName : "Jon Joe Inc.",
    orderStart : '30-Sept-2016',
    currentActivity : 'Waiting for Provisioning',
    timeOnCurrentActivity : '4 Days',
  }
]


module.exports = {
  getOrderStatus : getOrderStatus
}


