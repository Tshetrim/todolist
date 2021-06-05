//console.log(module);
// module.exports.getDate = getDate;
// module.exports.getDay = getDay;

// module.exports = {
//   getDay: getDay,
//   getMonth: getMonth,
// }

exports.getDate = function() {
  const today = new Date();

  let options = {
    weekday: "long",
    day: "numeric",
    month: "long"
  }
  /*const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  let day = days[today.getDay()];*/
  /*switch(today.getDay()){
    case 0:
      day = "Sunday";
      break;
    case 1:
      day = "Monday";
      break;
    case 2:
      day = "Tuesday";
      break;
    case 3:
      day = "Wednesday";
      break;
    case 4:
      day = "Thursday";
      break;
    case 5:
      day = "Friday";
      break;
    case 6:
      day = "Saturday";
      break;
    default:
      console.log("Error: current day is equal to: " + today.getDay());
  }*/

  return day = today.toLocaleDateString("en-us",options);
}

exports.getDay = function(){
  const today = new Date();

  let options = {
    weekday: "long",
  }

  return day = today.toLocaleDateString("en-us",options);
}

exports.getMonth = function getMonth(){
  const today = new Date();

  let options = {
    month: "long"
  }

  return month = today.toLocaleDateString("en-us",options);
}
