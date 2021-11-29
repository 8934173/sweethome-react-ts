enum UrlDict{
    login = '/sys/login',
    epidemic = '/third/epidemic',
    epidemicByTencent = '/third/epidemicByTencent',
    vaccines = '/third/VaccineSituationData/',
    addUser = '/sys/addUser',
    getAllRole = '/sys/getAllRole',
    lockOrUnlockAccount = '/sys/lockOrUnlockAccount',
    clockReceive = "/clockIn/receive/",
    deleteUserByAdmin = '/sys/deleteUserByAdmin',
    saveOrUpdateClockInById = '/clockIn/',  // 后面还需要接上一个路径 save / update
    getAddress = '/user/getAddress',
    getClockInListByStudent = '/clockIn/getClockInListByStudent/',
    getClockInByTeacher = '/clockIn/getClockInByTeacher',
    getUsersByAdmin = '/sys/getUsersByAdmin',
    saveCollege = '/college/save',
    deleteCollege = '/college/delete',
    getCollegeList = '/college/getCollegeList',
    deleteCollegeById = 'college/delete/',
    saveMajor = '/major/save',
    deleteMajor = '/major/delete',
    getAllTeachers = '/teacher/getAll',
    saveSchoolClass = '/schoolClass/save',
    deleteSchoolClass= '/schoolClass/delete',
    getClassByTeacher = '/schoolClass/getClassByTeacher',
    send = '/clockInMessage/send/',
    applyForLeaving = '/leave/applyForLeaving',
    getLeaveEntitiesByStuId = '/leave/getLeaveEntitiesByStuId',
    leaveDeleteOne = '/leave/deleteOne/',
    getLeaveEntitiesByClassId = '/leave/getLeaveEntitiesByClassId/',
    updateLeave = '/leave/updateLeave',
    applyForRevert = '/revert/applyForRevert',
    getRevertEntitiesByStuId = '/revert/getRevertEntitiesByStuId',
    revertDeleteOne = '/revert/deleteOne/',
    getRevertEntitiesByClassId = '/revert/getRevertEntitiesByClassId/',
    updateRevert = '/revert/updateRevert'

}

export default UrlDict
