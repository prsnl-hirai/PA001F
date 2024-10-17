// ユーザーID
export let userId = "";
// ユーザー名
export let userName = "";

// 勤怠登録権限
export let atndRegist = "";
// 勤怠承認権限
export let atndApproval = "";
// 管理者権限
export let adminAnth = "";

// システム利用開始年
export let sysUseStartYear= "";
// システム利用開始月
export let sysUseStartMonth= "";

export const setEmpInfo = (json) => {
    userId = json.userId
    atndRegist = json.atndRegist
    atndApproval = json.atndApproval
    adminAnth = json.adminAnth
    sysUseStartYear = json.year
    sysUseStartMonth = json.month
    userName = json.lastName + " " +json.firstName

}

