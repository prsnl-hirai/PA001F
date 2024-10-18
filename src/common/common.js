// 勤務時間・残業時間計算
export const calcTime = (startTime, endTime, breakTime) => {
  let result = { workSec: 0, overSec: 0, isMinus: false };
  if (startTime !== "" && endTime !== "") {
    let startDate = new Date("1990/01/01");
    startDate.setHours(parseInt(startTime.slice(0, 2)));
    startDate.setMinutes(parseInt(startTime.slice(-2)));

    let endDate = new Date("1990/01/01");
    endDate.setHours(parseInt(endTime.slice(0, 2)));
    endDate.setMinutes(parseInt(endTime.slice(-2)));

    let workSec = (endDate.getTime() - startDate.getTime()) / 1000;

    // 終了時間が日をまたぐ場合
    if (workSec <= 0) {
      let endDate2 = new Date("1990/01/02");
      endDate2.setHours(parseInt(endTime.slice(0, 2)));
      endDate2.setMinutes(parseInt(endTime.slice(-2)));
      workSec = (endDate2.getTime() - startDate.getTime()) / 1000;
    }

    let breakSec = 0;
    if (breakTime !== "") {
      breakSec = transSec(breakTime);
      workSec -= breakSec;
    }

    // 所定労働時間
    const defaultWorkSec = 60 * 60 * 8;
    // 残業時間計算
    const overSec = workSec > defaultWorkSec ? workSec - defaultWorkSec : 0;

    result.workSec = workSec;
    result.overSec = overSec;
    result.isMinus = 0 > workSec && true;
  }
  return result;
};

export const transTime = (sec, hoursDigit = 2) => {
  let isMinus = false;
  if (0 > sec) {
    sec = Math.abs(sec);
    isMinus = true;
  } else if (sec === 0) {
    return "";
  }
  const hours = Math.floor(sec / 3600);
  const min = Math.floor((sec % 3600) / 60);
  let time = isMinus ? "-" : "";
  time +=
    hours.toString().padStart(hoursDigit, "0") +
    ":" +
    min.toString().padStart(2, "0");

  return time;
};

export const transSec = (time) => {
  let times = [];
  if (time.includes(":")) {
    times = time.split(":");
  } else {
    if (time === "") {
      times[0] = "00";
    } else {
      times[0] = time;
    }
    times[1] = "00";
  }
  let sec = parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60;
  return sec;
};
