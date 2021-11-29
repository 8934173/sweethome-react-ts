import {Student, User} from "../../utils/sysInterface";

export type CollegeType = {
    coId: string
    collegeName: string
    createTime?: string
    status?: number,
    majors?: Major[]
}
export type Major = {
    maId: string,
    collegeId: string,
    collegeName: string,
    majorName: string,
    createTime: string,
    status: number | string,
    classEntities: ClassEntity[]
}
export type College = {
    coId?: string,
    collegeName: string
}

export type StudentClockIn = {
    ClockInToday: boolean
    avatar: string
    clockPercentage: number
    stuId: string
    stuName: string
    uid: string,
    count: number,
    target: number
}

export type ClassEntity = {
    caId: string,
    claName: string,
    collegeId: string,
    collegeName: string,
    majorId: string,
    majorName: string,
    teacherId: string,
    teacherName: string,
    createTime: string,
    status: number,
    studentList?: User[] | Student[] | StudentClockIn[]
}

export type baseInstance<T> = {
    init: (visible: boolean, data?: T, isUnder?: boolean) => void
}

export type InitProps = {
    classEntity: ClassEntity,
    majors?: Major[]
}
export const Avatar: string[] = [
    'http://kivens.oss-cn-hangzhou.aliyuncs.com/sweet_avatar/user.png',
    'http://kivens.oss-cn-hangzhou.aliyuncs.com/sweet_avatar/teacher.png',
    'http://kivens.oss-cn-hangzhou.aliyuncs.com/sweet_avatar/student.png',
    'http://kivens.oss-cn-hangzhou.aliyuncs.com/sweet_avatar/user.png'
]


