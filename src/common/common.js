  // 勤務時間・残業時間計算
  export const calcTime = (
    startTime,
    endTime,
    breakTime
  ) => {
    let result = { workSec: 0, overSec: 0 };
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

      if (breakTime !== "") {
        let breakSec = transSec(breakTime);
        workSec -= breakSec;
      }

      // 残業時間計算
      const overSec = workSec - 60 * 60 * 8;
      
      result.workSec = workSec;
      result.overSec = overSec;
    }
    return result;
  };

  export const transTime = (sec,hoursDigit = 2)=>{
    const hours = Math.floor(sec / 3600);
    const min = Math.floor((sec % 3600) / 60);
    let time = "";
    if(sec !== 0) {
      time =
      hours.toString().padStart(hoursDigit, "0") +
      ":" +
      min.toString().padStart(2, "0");
    }

    return time;
  }

  export const transSec = (time)=>{
    let times=[]
    if(time.includes(":")) {
        times = time.split(":");
    } else {
      if(time ==="") {
        times[0] =  "00";
      }else {
        times[0] = time;
      }
        times[1] = "00";
    }
    let sec =  parseInt(times[0]) * 60 * 60 + parseInt(times[1]) * 60;
    return sec
  } 