import {ClassEntity} from "../component/sys/sys";

export type User<T = Student | Teacher | string> = {
    uid: string,
    username: string,
    password?: string | null,
    phone: string,
    createTime: string,
    accountNonExpired: boolean,
    accountNonLocked: boolean,
    credentialsNonExpired: boolean,
    enabled: boolean,
    role: string,
    authority: string,
    roles: Role[],
    captcha?: string,
    uname?: string,
    avatar?: string,
    classId?: string,
    school?: T
}

export type Role = {
    rid: string,
    rname: string,
    rdesc: string
}

export type Teacher = {
    teaId: string,
    teaName: string,
    collegeId: string,
    uid: string,
    createTime: string,
    status: number,
    classEntities?:ClassEntity[]
}

export type Student = {
    stuId: string,
    stuName: string,
    caId?: string,
    claName?: string,
    uid: string,
    createTime: string,
    status: number,
    avatar?: string
}

export type R<T> = {
    code: number,
    msg: string,
    data?: T,
    list?: T
}

export type Pages<T> = {
    currPage: number | undefined,
    list?: T[],
    pageSize: number,
    totalCount: number,
    totalPage?: number,
}
export type QueryType = {
    page: number,
    limit: number,
    order?: string,
    orderField?: string,
    start?: string,
    end?: string,
    keyWords?: string,
    status?: number
}
